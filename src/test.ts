import { Engine } from './core/Engine';
import { GameObject } from './core/GameObject';
import { MeshComponent } from './component/renderable/MeshComponent';
import { Material } from './material/Material';
import { CameraComponent } from './component/camera/CameraComponent';
import { vec3, vec4, vec2, quat, ReadonlyQuat } from 'gl-matrix';
import { InfoComponent } from './test/InfoComponent';
import { RotateComponent } from './test/RotateComponent';
import { BlinnPhongDirectionalLightComponent } from './component/light/blinnphong/BlinnPhongDirectionalLightComponent';
import { AudioSourceComponent } from './component/audio/AudioSourceComponent';
import { AudioListenerComponent } from './component/audio/AudioListenerComponent';
import { SplineComponent } from './component/renderable/SplineComponent';
import { BezierSpline } from './resource/spline/BezierSpline';
import { Texture2D } from './resource/texture/Texture2D';
import { CubeMapTexture } from './resource/texture/CubeMapTexture';
import { MaterialSlot } from './material/MaterialSlot';
import { PlayerComponent } from './test/PlayerComponent';
import { BlinnPhongRenderer } from './rendering/renderer/BlinnPhongRenderer';
import { ObbBoundingShape } from './component/renderable/boundingshape/ObbBoundingShape';
import { RotationBuilder } from './utility/RotationBuilder';
import { Axis } from './utility/Axis';
import { CubeMesh } from './resource/mesh/CubeMesh';
import { SkyboxRenderer } from './rendering/renderer/SkyboxRenderer';
import { PbrRenderer } from './rendering/renderer/PbrRenderer';
import { PbrDirectionalLightComponent } from './component/light/pbr/PbrDirectionalLightComponent';
import { GlWrap } from './webgl/enum/GlWrap';
import { RenderingPipeline } from './rendering/RenderingPipeline';
import { Utility } from './utility/Utility';
import { BlinnPhongLightsStruct } from './component/light/blinnphong/BlinnPhongLightsStruct';
import { PbrLightsStruct } from './component/light/pbr/PbrLightsStruct';
import { GltfLoader } from './gltf/GltfLoader';
import { ObjLoader } from './resource/ObjLoader';
import { StaticMesh } from './resource/mesh/StaticMesh';
import { CameraType } from './component/camera/CameraType';
import { TextureFiltering } from './resource/texture/enum/TextureFiltering';
import { Conventions } from './resource/Conventions';
import { RenderableComponent } from './component/renderable/RenderableComponent';
import { IMesh } from './resource/mesh/IMesh';
import { Texture2DConfig } from './resource/texture/config/Texture2DConfig';
import { CubeMapTextureConfig } from './resource/texture/config/CubeMapTextureConfig';
import { CubeMapTextureConfigElement } from './resource/texture/config/CubeMapTextureConfigElement';
import { CubeMapTextureSideResolver, CubeMapTextureSide } from './resource/texture/enum/CubeMapTextureSide';

window.onload = async () => {
    const tsb = new TestSceneBuilder();
    tsb.initialize();
    await tsb.loadResources();
    tsb.setUpScene();
    tsb.createUi();
    tsb.createGround();
    //await tsb.createDamagedHelmet();
    //tsb.createGoldSphere();

    //tsb.createDiffuseBox();
    //tsb.createNormalBox();
    //tsb.createNormalPomBox();
    //tsb.createReflectionBox();
    //tsb.createDragon();
    //tsb.createBezierSpline();

    await tsb.loadGltfSampleModel('MetalRoughSpheres', 'glTF-Binary', 1, true);
    //await tsb.loadSketchfabModel('toyota_land_cruiser', 0.01, RotationBuilder.createRotation(Axis.X_NEGATE, 90).getQuaternion(), vec3.fromValues(0, -0.01, 0));
    //await tsb.loadSketchfabModel('akm_47', 0.1, RotationBuilder.createRotation(Axis.X_NEGATE, 90).getQuaternion(), vec3.fromValues(0, 2, 0));
    //await tsb.loadSketchfabModel('gold_pharaoh', 1, RotationBuilder.createRotation(Axis.X_NEGATE, 90).getQuaternion(), vec3.fromValues(0, -0.1, 0));
    //await tsb.loadSketchfabModel('soviet_t-34_tank', 0.02, RotationBuilder.createRotation(Axis.X_NEGATE, 90).getQuaternion(), vec3.fromValues(0, -2.55, 0));
    //await tsb.loadSketchfabModel('crash_of_a_b-17', 0.01, RotationBuilder.createRotation(Axis.X_NEGATE, 90).getQuaternion(), vec3.fromValues(0, 5, 0));

    //await tsb.loadSketchfabModel('aegis_idris_frigate_-_new', 0.1, RotationBuilder.createRotation(Axis.X_NEGATE, 90).getQuaternion());
    /*const loader = await GltfLoader.createLoader('res/meshes/metro.glb');
    const result = loader.loadDefaultScene();
    for (const [camera, _] of result.getCameraComponents()) {
        Engine.setMainCamera(camera);
    }*/

    /*const loader = await GltfLoader.createLoader('res/meshes/room2.glb');
    const result = loader.loadDefaultScene();
    for (const [camera, _] of result.getCameraComponents()) {
        //Engine.setMainCamera(camera);
        (camera as CameraComponent).setFarPlaneDistance(160);
    }*/

    //tsb.createAudioSource();

    Engine.start();
}

export class TestSceneBuilder {

    private box: StaticMesh;

    public initialize(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        Engine.initialize(canvas);
    }

    public async loadResources(): Promise<void> {
        const objLoader = await ObjLoader.createLoader('res/meshes/box.obj');
        this.box = objLoader.loadMesh();
    }

    public setUpScene(): void {
        //skybox
        this.createSkybox();

        //camera
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(0, 2, 10));
        const cc = new CameraComponent();

        go.getComponents().add(cc);
        Engine.setMainCamera(cc);

        //input
        const pc = new PlayerComponent();
        go.getComponents().add(pc);

        //audio listener
        const alc = new AudioListenerComponent();
        go.getComponents().add(alc);
        Engine.setMainAudioListener(alc);

        //directional light
        const dlgo = new GameObject();
        const bpdlc = new BlinnPhongDirectionalLightComponent();
        dlgo.getComponents().add(bpdlc);
        BlinnPhongLightsStruct.getInstance().setShadowLightSource(bpdlc);
        const pbrdlc = new PbrDirectionalLightComponent();
        pbrdlc.setColor(vec3.fromValues(1, 1, 1));
        pbrdlc.setIntensity(10);
        dlgo.getComponents().add(pbrdlc);
        PbrLightsStruct.getInstance().setShadowLightSource(pbrdlc);

        const rotation = RotationBuilder
            .createRotation(Axis.X, -20)
            .thenRotate(Axis.Y, 45)
            //.thenRotate(Axis.Z, -45)
            .getQuaternion();
        dlgo.getTransform().setRelativeRotation(rotation);
    }

    private async createSkybox(): Promise<void> {
        const renderingPipeline = Engine.getRenderingPipeline();
        const diffuseIblMap = await this.createIblMap('res/textures/pisa/diffuse', 'diffuse', 1);
        renderingPipeline.getParameters().set(RenderingPipeline.PBR_DIFFUSE_IBL_MAP, diffuseIblMap);

        const specularIblMap = await this.createIblMap('res/textures/pisa/specular', 'specular', 11);
        renderingPipeline.getParameters().set(RenderingPipeline.PBR_SPECULAR_IBL_MAP, specularIblMap);
        specularIblMap.getNativeTexture().setWrapU(GlWrap.CLAMP_TO_EDGE);
        specularIblMap.getNativeTexture().setWrapV(GlWrap.CLAMP_TO_EDGE);
        specularIblMap.getNativeTexture().setWrapW(GlWrap.CLAMP_TO_EDGE);
        specularIblMap.setTextureFiltering(TextureFiltering.Trilinear);

        const sky = new GameObject();
        const skyMaterial = new Material(SkyboxRenderer);
        const slot = new MaterialSlot();
        slot.setCubeMapTexture(diffuseIblMap);
        skyMaterial.setSlot(Conventions.MS_SKYBOX, slot);
        const skyRenderable = new MeshComponent(CubeMesh.getInstance(), skyMaterial);
        skyRenderable.setCastShadow(false);
        sky.getComponents().add(skyRenderable);
    }

    private async createIblMap(basePath: string, namePrefix: string, mipmapCount: number): Promise<CubeMapTexture> {
        const connections: Array<[string, CubeMapTextureSide]> = [
            ['right', CubeMapTextureSide.RIGHT],
            ['left', CubeMapTextureSide.LEFT],
            ['top', CubeMapTextureSide.UP],
            ['bottom', CubeMapTextureSide.DOWN],
            ['front', CubeMapTextureSide.FRONT],
            ['back', CubeMapTextureSide.BACK]
        ];
        const elements = new Array<CubeMapTextureConfigElement>();
        for (const connection of connections) {
            const sideSrting = connection[0];
            const side = connection[1];
            for (let i = 0; i < mipmapCount; i++) {
                const element = new CubeMapTextureConfigElement(`${basePath}/${namePrefix}_${sideSrting}_${i}.hdr`, side, false, i);
                elements.push(element);
            }
        }
        return await CubeMapTexture.createHdrTextureFromConfig(new CubeMapTextureConfig(elements, true, false));
    }

    public createUi(): void {
        const go = new GameObject();
        const ic = new InfoComponent();
        go.getComponents().add(ic);
    }

    public async createGround(): Promise<void> {
        const go = new GameObject();
        const material = new Material(PbrRenderer);
        const orm = new MaterialSlot();
        orm.setColor(vec4.fromValues(-1, 1, 0, -1));
        material.setSlot(Conventions.MS_ROUGHNESS_METALNESS, orm);
        material.getParameters().set(Conventions.MP_DOUBLE_SIDED, true);
        const objLoader = await ObjLoader.createLoader('res/meshes/plane.obj');
        const meshComponent = new MeshComponent(objLoader.loadMesh(), material);
        go.getComponents().add(meshComponent);
        go.getTransform().setRelativeScale(vec3.fromValues(200, 1, 100));
        go.getTransform().setRelativePosition(vec3.fromValues(0, .02, 0));
    }

    public async createDamagedHelmet(): Promise<void> {
        const helmet = new GameObject();
        helmet.getTransform().setRelativePosition(vec3.fromValues(0, 1, 0))
        const material = new Material(PbrRenderer);

        const objLoader = await ObjLoader.createLoader('res/meshes/damaged-helmet.obj');
        const mc = new MeshComponent(objLoader.loadMesh(), material);
        helmet.getComponents().add(mc);

        const bcs = new MaterialSlot();
        bcs.setTexture2D(await Texture2D.createTexture('res/textures/damaged-helmet/albedo.jpg', false));
        material.setSlot(Conventions.MS_BASE_COLOR, bcs);

        const ns = new MaterialSlot();
        ns.setTexture2D(await Texture2D.createTexture('res/textures/damaged-helmet/normal.jpg', false));
        material.setSlot(Conventions.MS_NORMAL, ns);

        const es = new MaterialSlot();
        es.setTexture2D(await Texture2D.createTexture('res/textures/damaged-helmet/emissive.jpg', false));
        material.setSlot(Conventions.MS_EMISSIVE, es);

        const rms = new MaterialSlot();
        rms.setTexture2D(await Texture2D.createTexture('res/textures/damaged-helmet/metalRoughness.jpg', false));
        material.setSlot(Conventions.MS_ROUGHNESS_METALNESS, rms);
    }

    public async createGoldSphere(): Promise<void> {
        const sphere = new GameObject();
        const sm = new Material(PbrRenderer);
        const sbcms = new MaterialSlot();
        sbcms.setColor(vec4.fromValues(1, 0.86, 0.57, 1));
        sm.setSlot(Conventions.MS_BASE_COLOR, sbcms);
        const sormms = new MaterialSlot();
        sormms.setColor(vec4.fromValues(1, 0.2, 1, 1));
        sm.setSlot(Conventions.MS_ROUGHNESS_METALNESS, sormms);
        const objLoader = await ObjLoader.createLoader('res/meshes/sphere.obj');
        const smc = new MeshComponent(objLoader.loadMesh(), sm);
        sphere.getComponents().add(smc);
        sphere.getTransform().setRelativePosition(vec3.fromValues(-5, 1, 0));
    }

    public async createDiffuseBox(): Promise<void> {
        const go = new GameObject();
        const ma = new Material(BlinnPhongRenderer);

        const ds = new MaterialSlot();
        ds.setTexture2D(await Texture2D.createTexture('res/textures/diffuse1.png', false));
        ma.setSlot(Conventions.MS_DIFFUSE, ds);

        const ss = new MaterialSlot();
        ss.setTexture2D(await Texture2D.createTexture('res/textures/specular1.png', false));
        ma.setSlot(Conventions.MS_SPECULAR, ss);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
        go.getTransform().setRelativePosition(vec3.fromValues(0, 0.5, 0));
    }

    public async createNormalBox(): Promise<void> {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(2.5, 0.5, 0));
        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(await Texture2D.createTexture('res/textures/7259d9158be0b7e8c62c887fac57ed81.png', false));
        ma.setSlot(Conventions.MS_NORMAL, ns);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public async createNormalPomBox(): Promise<void> {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(3, 0.5, 1));

        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(await Texture2D.createTexture('res/textures/normal6.png', true));
        ma.setSlot(Conventions.MS_NORMAL, ns);
        ns.getParameters().set(Conventions.MSP_USE_POM, true);

        const rc = new MeshComponent(this.box, ma);
        rc.setVisibilityInterval(vec2.fromValues(0, 5));
        go.getComponents().add(rc);

        const ma2 = new Material(BlinnPhongRenderer);
        ma2.setSlot(Conventions.MS_NORMAL, ns);

        const rc2 = new MeshComponent(this.box, ma2);
        rc2.setVisibilityInterval(vec2.fromValues(5, 100));
        go.getComponents().add(rc2);
    }

    public createReflectionBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(7.5, 0.5, 0));
        const ma = new Material(BlinnPhongRenderer);

        const rs = new MaterialSlot();
        rs.setCubeMapTexture(Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.PBR_SPECULAR_IBL_MAP));
        ma.setSlot(Conventions.MS_REFLECTION, rs);

        const is = new MaterialSlot();
        is.setColor(vec4.fromValues(0, 1, 0, 0));
        ma.setSlot(Conventions.MS_ENVIRONMENT_INTENSITY, is);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public async createDragon(): Promise<void> {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(10, 0, 0));
        go.getTransform().setRelativeScale(vec3.fromValues(0.1, 0.1, 0.1));

        const dragonMesh = (await ObjLoader.createLoader('res/meshes/dragon.obj')).loadMesh();
        const mc = new MeshComponent(dragonMesh, new Material(BlinnPhongRenderer), new ObbBoundingShape());
        go.getComponents().add(mc);

        const rc = new RotateComponent();
        go.getComponents().add(rc);

        const go2 = new GameObject();
        go2.getTransform().setRelativePosition(vec3.fromValues(12, 0, 0));
        go2.getComponents().add(new MeshComponent(this.box));
        go2.setParent(go);
    }

    public createBezierSpline(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(12.5, 1, 0));
        go.getTransform().setRelativeScale(vec3.fromValues(0.075, 0.075, 0.075));

        const bs = new BezierSpline();
        bs.setStep(0.01);
        for (let i = 0; i < 6; i++) {
            const x = i % 2 === 0 ? 5 : -5;
            const y = 3 * i - 10;
            bs.addControlPointToTheEnd(vec3.fromValues(x, y, 0));
        }
        bs.normalizeHelperPoints(5);
        bs.setLoop(true);
        const material = new Material(BlinnPhongRenderer);
        const diffuseSlot = new MaterialSlot();
        diffuseSlot.setColor(vec4.fromValues(0, 0, 0, 1));
        material.setSlot(Conventions.MS_DIFFUSE, diffuseSlot);
        const sc = new SplineComponent(bs, material);
        go.getComponents().add(sc);
    }

    public createAudioSource(): void {
        const go = new GameObject();

        const as = new AudioSourceComponent('res/sounds/music.ogg');
        go.getComponents().add(as);
        as.start();
    }

    public async loadGltfSampleModel(name: string, type: 'glTF' | 'glTF-Embedded' | 'glTF-Binary', scaleFactor: number, setMainCamera: boolean): Promise<void> {
        const extension = type === 'glTF-Binary' ? 'glb' : 'gltf';
        const loader = await GltfLoader.createLoader(`res/meshes/gltf-samples/${name}/${type}/${name}.${extension}`);
        const result = loader.loadDefaultScene();
        if (setMainCamera) {
            for (const [camera, _] of result.getCameraComponents()) {
                if (camera.getType() === CameraType.PERSPECTIVE)
                    Engine.setMainCamera(camera);
            }
        }
        for (const [go, _] of result.getGameObjects()) {
            if (!go.getParent())
                go.getTransform().setRelativeScale(vec3.fromValues(scaleFactor, scaleFactor, scaleFactor));
        }
    }

    public async loadSketchfabModel(name: string, scale = 1, rotation: ReadonlyQuat = quat.create(), translation = vec3.create()): Promise<void> {
        const loader = await GltfLoader.createLoader(`res/meshes/sketchfab/${name}/scene.gltf`);
        const result = loader.loadDefaultScene();
        for (const [go, _] of result.getGameObjects()) {
            if (!go.getParent()) {
                go.getTransform().setRelativePosition(translation);
                go.getTransform().setRelativeRotation(rotation);
                go.getTransform().setRelativeScale(vec3.fromValues(scale, scale, scale));
            }
        }
    }

}