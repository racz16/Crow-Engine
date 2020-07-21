import { GltfFile } from './interface/GltfFile';
import { LogLevel } from '../utility/log/LogLevel';
import { CameraComponent } from '../component/camera/CameraComponent';
import { GltfCameraMode } from './enum/GltfCameraType';
import { Utility } from '../utility/Utility';
import { GameObject } from '../core/GameObject';
import { GltfNode } from './interface/GltfNode';
import { mat4, vec3, quat, vec4, vec2 } from 'gl-matrix';
import { GltfLightType } from './enum/GltfLightType';
import { PbrDirectionalLightComponent } from '../component/light/pbr/PbrDirectionalLightComponent';
import { PbrPointLightComponent } from '../component/light/pbr/PbrPointLightComponent';
import { PbrSpotLightComponent } from '../component/light/pbr/PbrSpotLightComponent';
import { GltfResult } from './GltfResult';
import { CameraType } from '../component/camera/CameraType';
import { GlVao } from '../webgl/GlVao';
import { GlVbo } from '../webgl/buffer/GlVbo';
import { GlBufferObjectUsage } from '../webgl/enum/GlBufferObjectUsage';
import { Conventions } from '../resource/Conventions';
import { GlVertexAttribPointer } from '../webgl/GlVertexAttribPointer';
import { GlEbo } from '../webgl/buffer/GlEbo';
import { StaticMesh } from '../resource/mesh/StaticMesh';
import { MeshComponent } from '../component/renderable/MeshComponent';
import { Material } from '../material/Material';
import { PbrRenderer } from '../rendering/renderer/PbrRenderer';
import { IResource } from '../resource/IResource';
import { GltfMesh } from './interface/GltfMesh';
import { IMesh } from '../resource/mesh/IMesh';
import { GltfPrimitive } from './interface/GltfPrimitive';
import { MaterialSlot } from '../material/MaterialSlot';
import { Texture2D } from '../resource/texture/Texture2D';
import { GltfMaterial } from './interface/GltfMaterial';
import { GlTexture2D } from '../webgl/texture/GlTexture2D';
import { GltfBuffer } from './interface/GltfBuffer';
import { GltfImage } from './interface/GltfImage';
import { GlInternalFormat } from '../webgl/enum/GlInternalFormat';
import { GlSampler } from '../webgl/GlSampler';
import { GlMinificationFilter } from '../webgl/enum/GlMinificationFilter';
import { GlMagnificationFilter } from '../webgl/enum/GlMagnificationFIlter';
import { GlWrap } from '../webgl/enum/GlWrap';
import { GltfResolver } from './GltfResolver';
import { Engine } from '../core/Engine';
import { GltfTextureInfo } from './interface/GltfTextureInfo';
import { GltfAccessor } from './interface/GltfAccessor';
import { GlFormat } from '../webgl/enum/GlFormat';
import { Transform } from '../core/Transform';
import { GltfCamera } from './interface/GltfCamera';
import { GltfLight } from './interface/GltfLight';

export class GltfLoader implements IResource {

    //TODO
    //saját PBR implementáció vs GLTF spec

    //blinn-phongra átvezetni
    //  uniformok pl. normalScale, isThereNormal, isThereTangent
    //  ha nincs normal vagy tangent, akkor számoljuk ki (meg ugye TBN-es baszakodás)
    //  tangent 4 koordinátás
    //  multi uv

    //animációk
    //  keyframe
    //  skeletal (skin, weights, joints)
    //  morph (sparse accessor)

    private static readonly SUPPORTED_MAJOR_VERSION = 2;
    private static readonly SUPPORTED_MINOR_VERSION = 0;
    private static readonly SUPPORTED_EXTENSIONS = ['KHR_lights_punctual'];

    private static readonly GLB_MAGIC_HEADER = 0x46546C67;
    private static readonly GLB_HEADER_COUNT = 3;
    private static readonly GLB_CHUNK_HEADER_COUNT = 2;
    private static readonly GLB_JSON_TYPE = 0x4E4F534A;
    private static readonly GLB_BIN_TYPE = 0x004E4942;
    private static readonly BYTE = 4;

    private static glbBinaryStart: number;

    private gltf: GltfFile;

    private createGameObjects: boolean;

    private binaries: Array<ArrayBuffer>;
    private images: Map<number, GlTexture2D>;

    private meshes = new Map<number, Array<[IMesh, Material<PbrRenderer>]>>();
    private vbos = new Map<number, GlVbo>();
    private ebos = new Map<number, GlEbo>();
    private textures = new Map<number, Texture2D>();
    private materials = new Map<number, Material<PbrRenderer>>();

    private gltfResult: GltfResult;

    private constructor(gltf: GltfFile, binaries: Array<ArrayBuffer>, images: Map<number, GlTexture2D>) {
        this.gltf = gltf;
        this.binaries = binaries;
        this.images = images;
    }

    public static async createLoader(path: string): Promise<GltfLoader> {
        if (path.toLocaleLowerCase().endsWith('.gltf')) {
            return await this.createLoaderFromGltf(path);
        } else if (path.toLowerCase().endsWith('.glb')) {
            return await this.createLoaderFromGlb(path);
        } else {
            throw new Error('Only .gltf and .glb files are supported.');
        }
    }

    private static async createLoaderFromGltf(path: string): Promise<GltfLoader> {
        const basePath = this.computeBasePath(path);
        const gltf = await this.loadGltf(path);
        const images = new Map<number, GlTexture2D>();
        this.loadNonBinaryImages(gltf, basePath, images);
        const binaries = await this.loadBinaries(gltf, basePath);
        this.loadBinaryImages(gltf, binaries, images);
        return new GltfLoader(gltf, binaries, images);
    }

    private static async createLoaderFromGlb(path: string): Promise<GltfLoader> {
        const basePath = this.computeBasePath(path);
        const glb = await this.loadGlb(path);
        this.checkGlb(glb);
        const gltf = this.getGltf(glb);
        const images = new Map<number, GlTexture2D>();
        this.loadNonBinaryImages(gltf, basePath, images);
        const binaries = this.loadBinariesFromGlb(glb);
        this.loadBinaryImages(gltf, binaries, images);
        return new GltfLoader(gltf, binaries, images);
    }

    private static async loadGltf(path: string): Promise<GltfFile> {
        const response = await fetch(path);
        return await response.json();
    }

    private static async loadGlb(path: string): Promise<ArrayBuffer> {
        const response = await fetch(path);
        return await response.arrayBuffer();
    }

    private static checkGlb(glb: ArrayBuffer): void {
        const glb32 = new Uint32Array(glb);
        const magic = glb32[0];
        const version = glb32[1];
        if (magic !== this.GLB_MAGIC_HEADER) {
            throw new Error('This is not a valid GLB file.');
        } else if (version !== this.SUPPORTED_MAJOR_VERSION) {
            throw new Error(`GLB version '${version}' is not supported.`);
        }
    }

    private static getGltf(glb: ArrayBuffer): GltfFile {
        const glb32 = new Uint32Array(glb);
        const length = glb32[this.GLB_HEADER_COUNT];
        const type = glb32[this.GLB_HEADER_COUNT + 1];
        if (type !== this.GLB_JSON_TYPE) {
            throw new Error('Chunk 0\'s type is not JSON.');
        }
        const startOffset = (this.GLB_HEADER_COUNT + this.GLB_CHUNK_HEADER_COUNT) * this.BYTE;
        this.glbBinaryStart = (startOffset + length) / this.BYTE;
        const chunkData = new Uint8Array(glb, startOffset, length);
        const jsonString = new TextDecoder('utf-8').decode(chunkData);
        return JSON.parse(jsonString);
    }

    private static async loadBinaries(gltf: GltfFile, basePath: string): Promise<Array<ArrayBuffer>> {
        return await Promise.all(
            gltf.buffers?.map(async buffer => {
                return this.loadBinary(buffer, basePath);
            }) ?? []
        );
    }

    private static loadBinariesFromGlb(glb: ArrayBuffer): Array<ArrayBuffer> {
        const glb32 = new Uint32Array(glb);
        const length = glb32[this.glbBinaryStart];
        const type = glb32[this.glbBinaryStart + 1];
        if (type !== this.GLB_BIN_TYPE) {
            throw new Error('Chunk 1\'s type is not BIN.');
        }
        const startOffset = (this.glbBinaryStart + this.GLB_CHUNK_HEADER_COUNT) * this.BYTE;
        return [glb.slice(startOffset, startOffset + length)];
    }

    private static async loadBinary(buffer: GltfBuffer, basePath: string): Promise<ArrayBuffer> {
        const uri = buffer.uri.startsWith('data:') ? buffer.uri : `${basePath}/${buffer.uri}`;
        const response = await fetch(uri);
        return await response.arrayBuffer();
    }

    private static async loadNonBinaryImages(gltf: GltfFile, basePath: string, images: Map<number, GlTexture2D>): Promise<void> {
        for (let i = 0; i < gltf.images?.length; i++) {
            const image = gltf.images[i];
            if (image.uri != null) {
                const texture = new GlTexture2D();
                images.set(i, texture);
                this.loadNonBinaryImage(texture, image, basePath);
            }
        }
    }

    private static async loadBinaryImages(gltf: GltfFile, binaries: Array<ArrayBuffer>, images: Map<number, GlTexture2D>): Promise<void> {
        for (let i = 0; i < gltf.images?.length; i++) {
            const image = gltf.images[i];
            if (image.bufferView != null) {
                const texture = new GlTexture2D();
                images.set(i, texture);
                this.loadBinaryImage(texture, image, gltf, binaries);
            }
        }
    }

    private static async loadNonBinaryImage(texture: GlTexture2D, image: GltfImage, basePath: string): Promise<void> {
        let imageElement: TexImageSource;
        if (image.uri.startsWith('data:')) {
            imageElement = await Utility.loadImage(image.uri);
        } else {
            imageElement = await Utility.loadImage(`${basePath}/${image.uri}`);
        }
        this.storeImage(texture, imageElement);
    }

    private static async loadBinaryImage(texture: GlTexture2D, image: GltfImage, gltf: GltfFile, binaries: Array<ArrayBuffer>): Promise<void> {
        const bufferView = gltf.bufferViews[image.bufferView];
        const binary = binaries[bufferView.buffer];
        const array = new Uint8Array(binary, bufferView.byteOffset, bufferView.byteLength);
        const blob = new Blob([array], { type: image.mimeType });
        const imageElement = await Utility.loadImage(URL.createObjectURL(blob));
        this.storeImage(texture, imageElement);
    }

    private static storeImage(texture: GlTexture2D, imageElement: TexImageSource): void {
        texture.allocate(GlInternalFormat.RGBA8, vec2.fromValues(imageElement.width, imageElement.height), true);
        texture.store(imageElement, GlFormat.RGBA, false);
        texture.generateMipmaps();
    }

    private static computeBasePath(path: string): string {
        const index = path.lastIndexOf('/');
        return path.substring(0, index);
    }

    //load scene
    public loadDefaultScene(createGameObjects = true): GltfResult {
        return this.loadScene(this.gltf.scene, createGameObjects);
    }

    public loadScene(sceneIndex = 0, createGameObjects = true): GltfResult {
        this.gltfResult = new GltfResult();
        this.checkVersionCompatibility();
        this.checkExtensionsCompatibility();
        if (this.gltf.animations) {
            throw new Error('Animations are currently not supported.');
        }
        this.createGameObjects = createGameObjects;
        return this.loadSceneUnsafe(sceneIndex);
    }

    private loadSceneUnsafe(sceneIndex: number): GltfResult {
        const scene = this.gltf.scenes[sceneIndex];
        scene.nodes?.forEach(async nodeIndex => {
            this.loadNode(nodeIndex);
        });
        return this.gltfResult;
    }

    //checks
    private checkVersionCompatibility(): void {
        const asset = this.gltf.asset;
        if (asset.minVersion) {
            const [majorVersion, minorVersion] = this.computeVersion(asset.minVersion);
            if (majorVersion !== GltfLoader.SUPPORTED_MAJOR_VERSION || minorVersion > GltfLoader.SUPPORTED_MINOR_VERSION) {
                throw new Error(`GLTF version '${asset.minVersion}' is not supported.`);
            }
        }
        const [majorVersion, minorVersion] = this.computeVersion(asset.version);
        if (majorVersion !== GltfLoader.SUPPORTED_MAJOR_VERSION) {
            throw new Error(`GLTF version '${asset.version}' is not supported.`);
        }
        if (minorVersion > GltfLoader.SUPPORTED_MINOR_VERSION) {
            Engine.getLog().logString(LogLevel.WARNING, `GLTF version '${asset.version}' is not supported. New structures since version ${GltfLoader.SUPPORTED_MAJOR_VERSION}.${GltfLoader.SUPPORTED_MINOR_VERSION} will be ignored.`);
        }
    }

    private checkExtensionsCompatibility(): void {
        this.gltf.extensionsRequired?.forEach((extension) => {
            if (!GltfLoader.SUPPORTED_EXTENSIONS.includes(extension)) {
                throw new Error(`Extension '${extension}' is not supported.`);
            }
        });
        this.gltf.extensionsUsed?.forEach((extension) => {
            if (!GltfLoader.SUPPORTED_EXTENSIONS.includes(extension)) {
                Engine.getLog().logString(LogLevel.WARNING, `Extension '${extension}' is not supported. It will be ignored.`);
            }
        });
    }

    private computeVersion(version: string): Array<number> {
        const versions = version.split('.');
        return [+versions[0], +versions[1]];
    }

    //nodes
    private loadNode(nodeIndex: number, parent: GameObject = null): void {
        const node = this.gltf.nodes[nodeIndex];

        if (node.skin) {
            throw new Error('Skins are currently not supported.')
        }
        if (node.weights) {
            throw new Error('Weights are currently not supported.')
        }

        const gameObject = this.createGameObject(parent, node);
        this.addComponents(gameObject, node);
        node.children?.forEach(childNodeIndex => {
            this.loadNode(childNodeIndex, gameObject);
        });
    }

    private createGameObject(parent: GameObject, node: GltfNode): GameObject {
        if (this.createGameObjects) {
            const gameObject = new GameObject();
            gameObject.setParent(parent);
            this.gltfResult.addGameObject(gameObject, node);
            this.setTransform(gameObject, node);
            return gameObject;
        } else {
            return null;
        }
    }

    private setTransform(gameObject: GameObject, node: GltfNode): void {
        const transform = gameObject.getTransform();
        if (node.matrix) {
            this.setTransformMatrix(transform, node);
        } else {
            this.setTransformVectors(transform, node);
        }
    }

    private setTransformMatrix(transform: Transform, node: GltfNode): void {
        const scale = mat4.getScaling(vec3.create(), node.matrix);
        const rotation = mat4.getRotation(quat.create(), node.matrix);
        const translation = mat4.getTranslation(vec3.create(), node.matrix);
        transform.setRelativeScale(scale);
        transform.setRelativeRotation(rotation);
        transform.setRelativePosition(translation);
    }

    private setTransformVectors(transform: Transform, node: GltfNode): void {
        if (node.scale) {
            transform.setRelativeScale(node.scale);
        }
        if (node.rotation) {
            transform.setRelativeRotation(node.rotation);
        }
        if (node.translation) {
            transform.setRelativePosition(node.translation);
        }
    }

    private addComponents(gameObject: GameObject, node: GltfNode): void {
        this.addCameraComponent(gameObject, node);
        this.addLightComponent(gameObject, node);
        this.addMeshComponents(gameObject, node);
    }

    private addCameraComponent(gameObject: GameObject, node: GltfNode): void {
        if (node.camera == null) {
            return;
        }
        const camera = this.gltf.cameras[node.camera];
        if (camera.type === GltfCameraMode.ORTHOGRAPHIC) {
            this.addOrthographicCamera(gameObject, camera);
        } else {
            this.addPerspectiveCamera(gameObject, camera);
        }
    }

    private addOrthographicCamera(gameObject: GameObject, camera: GltfCamera): void {
        const horizontalScale = camera.orthographic.xmag / 2;
        const vertivalScale = camera.orthographic.ymag / 2;
        const nearPlane = camera.orthographic.znear;
        const farPlane = camera.orthographic.zfar;
        const cameraComponent = new CameraComponent(CameraType.ORTHOGRAPHIC);
        cameraComponent.setHorizontalScale(horizontalScale);
        cameraComponent.setVerticalScale(vertivalScale);
        cameraComponent.setNearPlaneDistance(nearPlane);
        cameraComponent.setFarPlaneDistance(farPlane);
        this.gltfResult.addCameraComponent(cameraComponent, camera);
        gameObject?.getComponents().add(cameraComponent);
    }

    private addPerspectiveCamera(gameObject: GameObject, camera: GltfCamera): void {
        const fov = Utility.toDegrees(camera.perspective.yfov);
        const aspectRatio = camera.perspective.aspectRatio ?? Utility.getCanvasAspectRatio();
        const nearPlane = camera.perspective.znear;
        const farPlane = camera.perspective.zfar ?? Number.POSITIVE_INFINITY;
        const cameraComponent = new CameraComponent(CameraType.PERSPECTIVE);
        cameraComponent.setFov(fov);
        cameraComponent.setAspectRatio(aspectRatio);
        cameraComponent.setNearPlaneDistance(nearPlane);
        cameraComponent.setFarPlaneDistance(farPlane);
        this.gltfResult.addCameraComponent(cameraComponent, camera);
        gameObject?.getComponents().add(cameraComponent);
    }

    private addLightComponent(gameObject: GameObject, node: GltfNode): void {
        if (node.extensions?.KHR_lights_punctual == null) {
            return;
        }
        const lightIndex = node.extensions.KHR_lights_punctual.light;
        const light = this.gltf.extensions.KHR_lights_punctual.lights[lightIndex];
        if (light.type === GltfLightType.DIRECTIONAL) {
            this.addDirectionalLight(gameObject, light);
        } else if (light.type === GltfLightType.POINT) {
            this.addPointLight(gameObject, light);
        } else if (light.type === GltfLightType.SPOT) {
            this.addSpotLight(gameObject, light);
        }
    }

    private addDirectionalLight(gameObject: GameObject, light: GltfLight): void {
        const dlc = new PbrDirectionalLightComponent();
        if (light.color) {
            dlc.setColor(light.color);
        }
        if (light.intensity != null) {
            dlc.setIntensity(light.intensity);
        }
        this.gltfResult.addLightComponent(dlc, light);
        gameObject?.getComponents().add(dlc);
    }

    private addPointLight(gameObject: GameObject, light: GltfLight): void {
        const plc = new PbrPointLightComponent();
        const range = light.range ?? Number.POSITIVE_INFINITY;
        plc.setRange(range);
        if (light.color) {
            plc.setColor(light.color);
        }
        if (light.intensity != null) {
            plc.setIntensity(light.intensity);
        }
        this.gltfResult.addLightComponent(plc, light);
        gameObject?.getComponents().add(plc);
    }

    private addSpotLight(gameObject: GameObject, light: GltfLight): void {
        const slc = new PbrSpotLightComponent();
        const range = light.range ?? Number.POSITIVE_INFINITY;
        const cutOff = Utility.toDegrees(light.spot.innerConeAngle ?? 0);
        const outerCutoff = Utility.toDegrees(light.spot.outerConeAngle ?? Math.PI / 4);
        slc.setCutoff(cutOff);
        slc.setOuterCutoff(outerCutoff);
        slc.setRange(range);
        if (light.color) {
            slc.setColor(light.color);
        }
        if (light.intensity != null) {
            slc.setIntensity(light.intensity);
        }
        this.gltfResult.addLightComponent(slc, light);
        gameObject?.getComponents().add(slc);
    }

    private addMeshComponents(gameObject: GameObject, node: GltfNode): void {
        if (node.mesh == null) {
            return;
        }
        const mesh = this.gltf.meshes[node.mesh];
        if (mesh.weights) {
            throw new Error('Weights are currently not supported.');
        }
        const meshArray = this.meshes.get(node.mesh);
        if (meshArray) {
            meshArray.forEach(([staticMesh, material], primitiveIndex) => {
                const meshComponent = new MeshComponent(staticMesh, material);
                gameObject?.getComponents().add(meshComponent);
                this.gltfResult.addMeshComponent(meshComponent, mesh, mesh.primitives[primitiveIndex]);
            });
        } else {
            mesh.primitives?.forEach(primitive => {
                this.addMeshComponent(gameObject, node.mesh, mesh, primitive);
            });
        }
    }

    private addMeshComponent(gameObject: GameObject, meshIndex: number, mesh: GltfMesh, primitive: GltfPrimitive): void {
        if (primitive.attributes.POSITION == null) {
            return;
        }
        this.throwPrimitiveErrors(primitive);

        const vao = this.createVao(primitive);
        const staticMesh = this.createStaticMesh(primitive, vao);
        const material = this.createMaterial(primitive.material);
        const meshComponent = new MeshComponent(staticMesh, material);
        gameObject?.getComponents().add(meshComponent);

        const gltfMaterial = primitive.material == null ? null : this.gltf.materials[primitive.material];
        this.gltfResult.addMaterial(material, gltfMaterial);
        this.gltfResult.addMeshComponent(meshComponent, mesh, primitive);
        this.gltfResult.addMesh(staticMesh, mesh, primitive);
        this.gltfResult.addVao(vao, primitive);

        let meshArray = this.meshes.get(meshIndex);
        if (!meshArray) {
            meshArray = new Array<[IMesh, Material<PbrRenderer>]>();
            this.meshes.set(meshIndex, meshArray);
        }
        this.meshes.get(meshIndex).push([staticMesh, material]);
    }

    private createMaterial(materialIndex: number): Material<PbrRenderer> {
        if (materialIndex == null) {
            return new Material(PbrRenderer);
        }
        let material = this.materials.get(materialIndex);
        if (!material) {
            const gltfMaterial = this.gltf.materials[materialIndex];
            material = new Material(PbrRenderer);
            material.getParameters().set(Conventions.MP_DOUBLE_SIDED, gltfMaterial.doubleSided ?? false);
            const alphaMode = GltfResolver.computeAlphaMode(gltfMaterial.alphaMode);
            material.getParameters().set(Conventions.MP_ALPHA_MODE, alphaMode);
            material.getParameters().set(Conventions.MP_ALPHA_CUTOFF, gltfMaterial.alphaCutoff);
            if (gltfMaterial.pbrMetallicRoughness) {
                this.addBaseColorSlot(material, gltfMaterial);
                this.addRoughnessMetalnessSlot(material, gltfMaterial);
                this.addOcclusionSlot(material, gltfMaterial);
            }
            this.addNormalSlot(material, gltfMaterial);
            this.addEmissiveSlot(material, gltfMaterial);
            this.materials.set(materialIndex, material);
        }
        return material;
    }

    private addBaseColorSlot(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): Promise<void> {
        const textureInfo = gltfMaterial.pbrMetallicRoughness.baseColorTexture;
        const color = gltfMaterial.pbrMetallicRoughness.baseColorFactor;
        if (!textureInfo && !color) {
            return;
        }
        const slot = new MaterialSlot();
        if (textureInfo) {
            const texture = this.createTexture(textureInfo);
            slot.setTexture2D(texture);
            if (textureInfo.texCoord != null) {
                slot.setTextureCoordinate(textureInfo.texCoord);
            }
        }
        if (color) {
            slot.setColor(color);
        }
        material.setSlot(Conventions.MS_BASE_COLOR, slot);
    }

    private addRoughnessMetalnessSlot(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): Promise<void> {
        const textureInfo = gltfMaterial.pbrMetallicRoughness.metallicRoughnessTexture;
        const metalnessColor = gltfMaterial.pbrMetallicRoughness.metallicFactor;
        const roughnessColor = gltfMaterial.pbrMetallicRoughness.roughnessFactor;
        if (!textureInfo && metalnessColor == null && roughnessColor == null) {
            return;
        }
        const slot = new MaterialSlot();
        if (textureInfo) {
            const texture = this.createTexture(textureInfo);
            slot.setTexture2D(texture);
            if (textureInfo.texCoord != null) {
                slot.setTextureCoordinate(textureInfo.texCoord);
            }
        }
        if (metalnessColor != null || roughnessColor != null) {
            const defaultValue = textureInfo ? 1.0 : 0.5;
            const roughness = roughnessColor ?? defaultValue;
            const metalness = metalnessColor ?? defaultValue;
            const roughnessMetalnessColor = vec4.fromValues(1, roughness, metalness, 1);
            slot.setColor(roughnessMetalnessColor);
        }
        material.setSlot(Conventions.MS_ROUGHNESS_METALNESS, slot);
    }

    private addOcclusionSlot(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): Promise<void> {
        const textureInfo = gltfMaterial.occlusionTexture;
        if (!textureInfo) {
            return;
        }
        const slot = new MaterialSlot();
        const texture = this.createTexture(textureInfo);
        slot.setTexture2D(texture);
        if (textureInfo.texCoord != null) {
            slot.setTextureCoordinate(textureInfo.texCoord);
        }
        const occlusionStrength = textureInfo.strength;
        if (occlusionStrength != null) {
            slot.getParameters().set(Conventions.MSP_OCCLUSION_STRENGTH, occlusionStrength);
        }
        material.setSlot(Conventions.MS_OCCLUSION, slot);
    }

    private addNormalSlot(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): Promise<void> {
        const textureInfo = gltfMaterial.normalTexture;
        if (!textureInfo) {
            return;
        }
        const slot = new MaterialSlot();
        const texture = this.createTexture(textureInfo);
        slot.setTexture2D(texture);
        if (textureInfo.texCoord != null) {
            slot.setTextureCoordinate(textureInfo.texCoord);
        }
        material.setSlot(Conventions.MS_NORMAL, slot);
    }

    private addEmissiveSlot(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): Promise<void> {
        const textureInfo = gltfMaterial.emissiveTexture;
        const color = gltfMaterial.emissiveFactor;
        if (!textureInfo && !color) {
            return;
        }
        const slot = new MaterialSlot();
        if (textureInfo) {
            const texture = this.createTexture(textureInfo);
            slot.setTexture2D(texture);
            if (textureInfo.texCoord != null) {
                slot.setTextureCoordinate(textureInfo.texCoord);
            }
        }
        if (color) {
            slot.setColor(vec4.fromValues(color[0], color[1], color[2], 1));
        }
        material.setSlot(Conventions.MS_EMISSIVE, slot);
    }

    private createTexture(textureInfo: GltfTextureInfo): Texture2D {
        const textureIndex = textureInfo.index;
        let texture = this.textures.get(textureIndex);
        const gltfTexture = this.gltf.textures[textureIndex];
        const imageIndex = gltfTexture.source;
        const gltfIamge = this.gltf.images[imageIndex];
        const gltfSampler = gltfTexture.sampler == null ? null : this.gltf.samplers[gltfTexture.sampler];
        if (!texture) {
            const image = this.images.get(imageIndex);
            const sampler = this.createSampler(gltfTexture.sampler);
            texture = new Texture2D(image, sampler);
            this.textures.set(textureIndex, texture);
        }
        this.gltfResult.addTexture(texture, textureInfo, gltfTexture, gltfIamge, gltfSampler);
        return texture;
    }

    private createSampler(samplerIndex: number): GlSampler {
        if (samplerIndex == null) {
            const sampler = new GlSampler();
            sampler.setMinificationFilter(GlMinificationFilter.LINEAR_MIPMAP_LINEAR);
            sampler.setMagnificationFilter(GlMagnificationFilter.LINEAR);
            sampler.setWrapU(GlWrap.REPEAT);
            sampler.setWrapV(GlWrap.REPEAT);
            return sampler;
        } else {
            const gltfSampler = this.gltf.samplers[samplerIndex];
            const sampler = new GlSampler();
            sampler.setMinificationFilter(GltfResolver.computeMinificationFilter(gltfSampler.minFilter));
            sampler.setMagnificationFilter(GltfResolver.computeMagnificationFilter(gltfSampler.magFilter));
            sampler.setWrapU(GltfResolver.computeWrap(gltfSampler.wrapS));
            sampler.setWrapV(GltfResolver.computeWrap(gltfSampler.wrapT));
            return sampler;
        }
    }

    private throwPrimitiveErrors(primitive: GltfPrimitive): void {
        if (primitive.attributes.JOINTS_0 != null) {
            throw new Error('The attribute JOINTS_0 is currently not supported.');
        }
        if (primitive.attributes.WEIGHTS_0 != null) {
            throw new Error('The attribute WEIGHTS_0 is currently not supported.');
        }
        if (primitive.targets) {
            throw new Error('Targets are currently not supported.');
        }
    }

    private createVao(primitive: GltfPrimitive): GlVao {
        const vao = new GlVao();
        this.addVbo(vao, Conventions.VI_POSITIONS, primitive.attributes.POSITION);
        this.addVbo(vao, Conventions.VI_TEXTURE_COORDINATES_0, primitive.attributes.TEXCOORD_0);
        this.addVbo(vao, Conventions.VI_TEXTURE_COORDINATES_1, primitive.attributes.TEXCOORD_1);
        this.addVbo(vao, Conventions.VI_NORMALS, primitive.attributes.NORMAL);
        this.addVbo(vao, Conventions.VI_TANGENTS, primitive.attributes.TANGENT);
        this.addVbo(vao, Conventions.VI_VERTEX_COLORS, primitive.attributes.COLOR_0);
        this.addEbo(vao, primitive.indices);
        return vao;
    }

    private addVbo(vao: GlVao, vboIndex: number, accessorIndex: number): void {
        if (accessorIndex == null) {
            return;
        }
        //accessor
        const accessor = this.gltf.accessors[accessorIndex];
        if (accessor.sparse) {
            throw new Error('Sparse are currently not supported.');
        }
        const additionalOffset = accessor.byteOffset ?? 0;
        const normalized = accessor.normalized ?? false;
        const size = GltfResolver.computeSize(accessor.type);
        const type = GltfResolver.computeType(accessor.componentType);
        const bufferView = this.gltf.bufferViews[accessor.bufferView];
        const stride = bufferView.byteStride ?? 0;
        let vbo = this.vbos.get(accessor.bufferView);
        if (!vbo) {
            //buffer view
            const offset = bufferView.byteOffset ?? 0;
            const length = bufferView.byteLength;
            //buffer
            const binary = this.binaries[bufferView.buffer];
            //vbo
            vbo = new GlVbo();
            vbo.allocateAndStore(binary.slice(offset, offset + length), GlBufferObjectUsage.STATIC_DRAW);
            this.vbos.set(accessor.bufferView, vbo);
        }
        vao.getVertexAttribArray(vboIndex).setVbo(vbo, new GlVertexAttribPointer(size, type, normalized, additionalOffset, stride));
        vao.getVertexAttribArray(vboIndex).setEnabled(true);
    }

    private addEbo(vao: GlVao, accessorIndex: number): void {
        if (accessorIndex == null) {
            return;
        }
        //accessor
        const accessor = this.gltf.accessors[accessorIndex];
        if (accessor.sparse) {
            throw new Error('Sparse are currently not supported.');
        }
        if (this.ebos.has(accessor.bufferView)) {
            const ebo = this.ebos.get(accessor.bufferView);
            vao.setEbo(ebo);
        } else {
            this.addNewEbo(accessor, vao);
        }
    }

    private addNewEbo(accessor: GltfAccessor, vao: GlVao): void {
        //buffer view
        const bufferView = this.gltf.bufferViews[accessor.bufferView];
        const offset = bufferView.byteOffset ?? 0;
        const length = bufferView.byteLength;
        //buffer
        const binary = this.binaries[bufferView.buffer];
        //ebo
        const ebo = new GlEbo();
        ebo.allocateAndStore(binary.slice(offset, offset + length), GlBufferObjectUsage.STATIC_DRAW);
        vao.setEbo(ebo);
        this.ebos.set(accessor.bufferView, ebo);
    }

    private createStaticMesh(primitive: GltfPrimitive, vao: GlVao): StaticMesh {
        const positionsAccessor = this.gltf.accessors[primitive.attributes.POSITION];
        const vertexCount = primitive.indices != null ? this.gltf.accessors[primitive.indices].count : positionsAccessor.count;
        const faceCount = GltfResolver.computeFaceCount(vertexCount, primitive.mode);
        const aabbMin = GltfResolver.computeBoundingBox(positionsAccessor.min, positionsAccessor.componentType);
        const aabbMax = GltfResolver.computeBoundingBox(positionsAccessor.max, positionsAccessor.componentType);
        const radius = GltfResolver.computeRadius(aabbMin, aabbMax);
        const renderingMode = GltfResolver.computeRenderingMode(primitive.mode);
        const indicesType = primitive.indices != null ? GltfResolver.computeIndicesType(this.gltf.accessors[primitive.indices].componentType) : null;
        const indicesOffset = primitive.indices != null ? (this.gltf.accessors[primitive.indices].byteOffset ?? 0) : 0;
        return new StaticMesh(vao, vertexCount, faceCount, renderingMode, indicesType, indicesOffset, aabbMin, aabbMax, radius);
    }

    public getDataSize(): number {
        let size = 0;
        for (const binary of this.binaries) {
            size += binary.byteLength;
        }
        for (const image of this.images.values()) {
            size += image.getDataSize();
        }
        return size;
    }

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public release(): void {
        if (this.isUsable()) {
            this.binaries = null;
            this.images = null;
            this.gltf = null;
        }
    }

    public isUsable(): boolean {
        return !!this.gltf;
    }

}