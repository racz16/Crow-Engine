import { GameObject } from '../core/GameObject';
import { GltfNode } from './interface/GltfNode';
import { ICameraComponent } from '../component/camera/ICameraComponent';
import { GltfCamera } from './interface/GltfCamera';
import { PbrLightComponent } from '../component/light/pbr/PbrLightComponent';
import { GltfLight } from './interface/GltfLight';
import { GltfPrimitive } from './interface/GltfPrimitive';
import { IMesh } from '../resource/mesh/IMesh';
import { Material } from '../material/Material';
import { GltfMaterial } from './interface/GltfMaterial';
import { PbrRenderer } from '../rendering/renderer/PbrRenderer';
import { GltfMesh } from './interface/GltfMesh';
import { Texture2D } from '../resource/texture/Texture2D';
import { GltfTextureInfo } from './interface/GltfTextureInfo';
import { GlVao } from '../webgl/GlVao';
import { GltfTexture } from './interface/GltfTexture';
import { GltfImage } from './interface/GltfImage';
import { GltfSampler } from './interface/GltfSampler';
import { RenderableComponent } from '../component/renderable/RenderableComponent';

export class GltfResult {
    private readonly gameObjects = new Array<[GameObject, GltfNode]>();
    private readonly cameraComponents = new Array<[ICameraComponent, GltfCamera]>();
    private readonly lightComponents = new Array<[PbrLightComponent, GltfLight]>();
    private readonly meshComponents = new Array<[RenderableComponent<IMesh>, GltfMesh, GltfPrimitive]>();
    private readonly meshes = new Array<[IMesh, GltfMesh, GltfPrimitive]>();
    private readonly materials = new Array<[Material<PbrRenderer>, GltfMaterial]>();
    private readonly textures = new Array<[Texture2D, GltfTextureInfo, GltfTexture, GltfImage, GltfSampler]>();
    private readonly vaos = new Array<[GlVao, GltfPrimitive]>();

    public addGameObject(gameObject: GameObject, gltfNode: GltfNode): void {
        this.gameObjects.push([gameObject, gltfNode]);
    }

    public addCameraComponent(camera: ICameraComponent, gltfCamera: GltfCamera): void {
        this.cameraComponents.push([camera, gltfCamera]);
    }

    public addLightComponent(light: PbrLightComponent, gltfLight: GltfLight): void {
        this.lightComponents.push([light, gltfLight]);
    }

    public addMeshComponent(mesh: RenderableComponent<IMesh>, gltfMesh: GltfMesh, gltfPrimitive: GltfPrimitive): void {
        this.meshComponents.push([mesh, gltfMesh, gltfPrimitive]);
    }

    public addMesh(mesh: IMesh, gltfMesh: GltfMesh, gltfPrimitive: GltfPrimitive): void {
        this.meshes.push([mesh, gltfMesh, gltfPrimitive]);
    }

    public addMaterial(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): void {
        this.materials.push([material, gltfMaterial]);
    }

    public addTexture(texture: Texture2D, gltfTextureinfo: GltfTextureInfo, gltfTexture: GltfTexture, gltfImage: GltfImage, gltfSampler: GltfSampler): void {
        this.textures.push([texture, gltfTextureinfo, gltfTexture, gltfImage, gltfSampler]);
    }

    public addVao(vao: GlVao, gltfPrimitive: GltfPrimitive): void {
        this.vaos.push([vao, gltfPrimitive]);
    }

    //getters
    public getGameObjects(): IterableIterator<[GameObject, GltfNode]> {
        return this.gameObjects.values();
    }

    public getCameraComponents(): IterableIterator<[ICameraComponent, GltfCamera]> {
        return this.cameraComponents.values();
    }

    public getLightComponents(): IterableIterator<[PbrLightComponent, GltfLight]> {
        return this.lightComponents.values();
    }

    public getMesheComponents(): IterableIterator<[RenderableComponent<IMesh>, GltfMesh, GltfPrimitive]> {
        return this.meshComponents.values();
    }

    public getMeshes(): IterableIterator<[IMesh, GltfMesh, GltfPrimitive]> {
        return this.meshes.values();
    }

    public getMaterials(): IterableIterator<[Material<PbrRenderer>, GltfMaterial]> {
        return this.materials.values();
    }

    public getTextures(): IterableIterator<[Texture2D, GltfTextureInfo, GltfTexture, GltfImage, GltfSampler]> {
        return this.textures.values();
    }

    public getVaos(): IterableIterator<[GlVao, GltfPrimitive]> {
        return this.vaos.values();
    }

}