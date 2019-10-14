import { Engine } from './core/Engine';
import { StaticMesh } from './resource/mesh/StaticMesh';
import { GameObject } from './core/GameObject';
import { MeshComponent } from './component/renderable/MeshComponent';
import { Material } from './material/Material';
import { CameraComponent } from './component/camera/CameraComponent';
import { vec3, vec4, vec2 } from 'gl-matrix';
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
import { TextureType } from './resource/texture/enum/TextureType';
import { CubeMesh } from './resource/mesh/CubeMesh';
import { SkyboxRenderer } from './rendering/renderer/SkyboxRenderer';
import { PbrRenderer } from './rendering/renderer/PbrRenderer';
import { PbrDirectionalLightComponent } from './component/light/pbr/PbrDirectionalLightComponent';
import { TextureFiltering } from './resource/texture/enum/TextureFiltering';
import { TextureWrap } from './webgl/enum/TextureWrap';
import { RenderingPipeline } from './rendering/RenderingPipeline';
import { Utility } from './utility/Utility';

window.onload = () => {
    const tsb = new TestSceneBuilder();
    tsb.initialize();
    tsb.loadResources();
    tsb.setUpScene();
    tsb.createUi();
    tsb.createDamagedHelmet();
    tsb.createGoldSphere();
    tsb.createFlightHelmet();
    tsb.createDiffuseBox();
    tsb.createNormalBox();
    tsb.createNormalPomBox();
    tsb.createReflectionBox();
    tsb.createDragon();
    tsb.createBezierSpline();
    tsb.createAudioSource();
    Engine.start();
}

export class TestSceneBuilder {

    private box: StaticMesh;

    public initialize(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        Engine.initialize(canvas);
    }

    public loadResources(): void {
        this.box = new StaticMesh('res/meshes/box.obj');
    }

    public setUpScene(): void {
        //skybox
        this.createSkybox();

        //camera
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(0, 0, 10));
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
        const pbrdlc = new PbrDirectionalLightComponent();
        pbrdlc.setColor(vec3.fromValues(1, 1, 1));
        dlgo.getComponents().add(pbrdlc);

        const rotation = RotationBuilder
            .createRotation(Axis.X, -45)
            .thenRotate(Axis.Y, 45)
            .getQuaternion();
        dlgo.getTransform().setRelativeRotation(rotation);
    }

    private async createSkybox(): Promise<void> {
        const pisa = [
            'res/textures/pisa/diffuse/diffuse_right_0.hdr',
            'res/textures/pisa/diffuse/diffuse_left_0.hdr',
            'res/textures/pisa/diffuse/diffuse_top_0.hdr',
            'res/textures/pisa/diffuse/diffuse_bottom_0.hdr',
            'res/textures/pisa/diffuse/diffuse_front_0.hdr',
            'res/textures/pisa/diffuse/diffuse_back_0.hdr',
        ];
        const sides = ['right', 'left', 'top', 'bottom', 'front', 'back'];
        const paths = Utility.getCubemapSideNames('res/textures/pisa/specular', 'specular', sides, 10, 'hdr');

        const renderingPipeline = Engine.getRenderingPipeline();
        const diffuseIblMap = new CubeMapTexture();
        renderingPipeline.getParameters().set(RenderingPipeline.PBR_DIFFUSE_IBL_MAP, diffuseIblMap);
        const specularIblMap = new CubeMapTexture();
        renderingPipeline.getParameters().set(RenderingPipeline.PBR_SPECULAR_IBL_MAP, specularIblMap);
        await diffuseIblMap.createHdrTexture(pisa, true, TextureFiltering.None);
        await specularIblMap.createHdrTextureWithMipmaps(/*'specular', 11,*/paths, true, TextureFiltering.Trilinear);
        specularIblMap.getNativeTexture().setWrapU(TextureWrap.CLAMP_TO_EDGE);
        specularIblMap.getNativeTexture().setWrapV(TextureWrap.CLAMP_TO_EDGE);
        specularIblMap.getNativeTexture().setWrapW(TextureWrap.CLAMP_TO_EDGE);

        const sky = new GameObject();
        const skyMaterial = new Material(SkyboxRenderer);
        const slot = new MaterialSlot();
        slot.setCubeMapTexture(diffuseIblMap);
        skyMaterial.setSlot(Material.SKYBOX, slot);
        const skyRenderable = new MeshComponent(CubeMesh.getInstance(), skyMaterial);
        sky.getComponents().add(skyRenderable);
    }

    public createUi(): void {
        const go = new GameObject();
        const ic = new InfoComponent();
        go.getComponents().add(ic);
    }

    public createDamagedHelmet(): void {
        const helmet = new GameObject();
        helmet.getTransform().setRelativePosition(vec3.fromValues(-15, 0, 0))
        const material = new Material(PbrRenderer);

        const bcs = new MaterialSlot();
        bcs.setTexture2D(new Texture2D('res/textures/damaged-helmet/albedo.jpg', false, TextureType.IMAGE, TextureFiltering.Trilinear));
        material.setSlot(Material.BASE_COLOR, bcs);

        const ns = new MaterialSlot();
        ns.setTexture2D(new Texture2D('res/textures/damaged-helmet/normal.jpg', false, TextureType.DATA, TextureFiltering.Trilinear));
        material.setSlot(Material.NORMAL, ns);

        const es = new MaterialSlot();
        es.setTexture2D(new Texture2D('res/textures/damaged-helmet/emissive.jpg', false, TextureType.IMAGE, TextureFiltering.Trilinear));
        material.setSlot(Material.EMISSIVE, es);

        const rms = new MaterialSlot();
        rms.setTexture2D(new Texture2D('res/textures/damaged-helmet/metalRoughness.jpg', false, TextureType.DATA, TextureFiltering.Trilinear));
        material.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, rms);

        const mc = new MeshComponent(new StaticMesh('res/meshes/damaged-helmet.obj'), material);
        helmet.getComponents().add(mc);
    }

    public createGoldSphere(): void {
        const sphere = new GameObject();
        const sm = new Material(PbrRenderer);
        const sbcms = new MaterialSlot();
        sbcms.setColor(vec4.fromValues(1, 0.86, 0.57, 1));
        sm.setSlot(Material.BASE_COLOR, sbcms);
        const sormms = new MaterialSlot();
        sormms.setColor(vec4.fromValues(1, 0.2, 1, 1));
        sm.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, sormms);
        const smc = new MeshComponent(new StaticMesh('res/meshes/sphere.obj'), sm);
        sphere.getComponents().add(smc);
        sphere.getTransform().setRelativePosition(vec3.fromValues(-5, 0, 0));
    }

    public createFlightHelmet(): void {
        const flightHelmet = new GameObject();
        flightHelmet.getTransform().setRelativePosition(vec3.fromValues(-10, 0, 0));
        flightHelmet.getTransform().setRelativeScale(vec3.fromValues(3, 3, 3));

        const leatherMesh = new StaticMesh('res/meshes/flight-helmet/leather.obj');
        const leatherMaterial = new Material(PbrRenderer);

        const leatherBaseColor = new MaterialSlot();
        leatherBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor1.png', false, TextureType.IMAGE, TextureFiltering.Trilinear));
        leatherMaterial.setSlot(Material.BASE_COLOR, leatherBaseColor);

        const leatherNormal = new MaterialSlot();
        leatherNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal1.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        leatherMaterial.setSlot(Material.NORMAL, leatherNormal);

        const leatherORM = new MaterialSlot();
        leatherORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic1.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        leatherMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, leatherORM);

        const leather = new MeshComponent(leatherMesh, leatherMaterial);
        flightHelmet.getComponents().add(leather);

        //

        const glassPlasticMesh = new StaticMesh('res/meshes/flight-helmet/glassPlastic.obj');
        const glassPlasticMaterial = new Material(PbrRenderer);

        const glassPlasticBaseColor = new MaterialSlot();
        glassPlasticBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor.png', false, TextureType.IMAGE, TextureFiltering.Trilinear));
        glassPlasticMaterial.setSlot(Material.BASE_COLOR, glassPlasticBaseColor);

        const glassPlasticNormal = new MaterialSlot();
        glassPlasticNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        glassPlasticMaterial.setSlot(Material.NORMAL, glassPlasticNormal);

        const glassPlasticORM = new MaterialSlot();
        glassPlasticORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        glassPlasticMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, glassPlasticORM);

        const glassPlastic = new MeshComponent(glassPlasticMesh, glassPlasticMaterial);
        flightHelmet.getComponents().add(glassPlastic);

        //

        const metalMesh = new StaticMesh('res/meshes/flight-helmet/metal.obj');
        const metalMaterial = new Material(PbrRenderer);

        const metalBaseColor = new MaterialSlot();
        metalBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor3.png', false, TextureType.IMAGE, TextureFiltering.Trilinear));
        metalMaterial.setSlot(Material.BASE_COLOR, metalBaseColor);

        const metalNormal = new MaterialSlot();
        metalNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal3.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        metalMaterial.setSlot(Material.NORMAL, metalNormal);

        const metalORM = new MaterialSlot();
        metalORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic3.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        metalMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, metalORM);

        const metal = new MeshComponent(metalMesh, metalMaterial);
        flightHelmet.getComponents().add(metal);

        //

        const lensesMesh = new StaticMesh('res/meshes/flight-helmet/lenses.obj');
        const lensesMaterial = new Material(PbrRenderer);

        const lensesBaseColor = new MaterialSlot();
        lensesBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor2.png', true, TextureType.IMAGE, TextureFiltering.Trilinear));
        lensesMaterial.setSlot(Material.BASE_COLOR, lensesBaseColor);

        const lensesNormal = new MaterialSlot();
        lensesNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal2.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        lensesMaterial.setSlot(Material.NORMAL, lensesNormal);

        const lensesORM = new MaterialSlot();
        lensesORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic2.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        lensesMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, lensesORM);

        const lenses = new MeshComponent(lensesMesh, lensesMaterial);
        flightHelmet.getComponents().add(lenses);

        //

        const rubberWoodMesh = new StaticMesh('res/meshes/flight-helmet/rubberWood.obj');
        const headMaterial = new Material(PbrRenderer);

        const rubberWoodBaseColor = new MaterialSlot();
        rubberWoodBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor4.png', true, TextureType.IMAGE, TextureFiltering.Trilinear));
        headMaterial.setSlot(Material.BASE_COLOR, rubberWoodBaseColor);

        const rubberWoodNormal = new MaterialSlot();
        rubberWoodNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal4.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        headMaterial.setSlot(Material.NORMAL, rubberWoodNormal);

        const rubberWoodORM = new MaterialSlot();
        rubberWoodORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic4.png', false, TextureType.DATA, TextureFiltering.Trilinear));
        headMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, rubberWoodORM);

        const rubberWood = new MeshComponent(rubberWoodMesh, headMaterial);
        flightHelmet.getComponents().add(rubberWood);
    }

    public createDiffuseBox(): void {
        const go = new GameObject();
        const ma = new Material(BlinnPhongRenderer);

        const ds = new MaterialSlot();
        ds.setTexture2D(new Texture2D('res/textures/diffuse1.png', false, TextureType.IMAGE));
        ma.setSlot(Material.DIFFUSE, ds);

        const ss = new MaterialSlot();
        ss.setTexture2D(new Texture2D('res/textures/specular1.png', false, TextureType.DATA));
        ma.setSlot(Material.SPECULAR, ss);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public createNormalBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(2.5, 0, 0));
        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(new Texture2D('res/textures/7259d9158be0b7e8c62c887fac57ed81.png', false, TextureType.DATA));
        ma.setSlot(Material.NORMAL, ns);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public createNormalPomBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(5, 0, 0));

        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(new Texture2D('res/textures/normal6.png', true, TextureType.DATA));
        ma.setSlot(Material.NORMAL, ns);
        ns.getParameters().set(MaterialSlot.USE_POM, true);

        const rc = new MeshComponent(this.box, ma);
        rc.setVisibilityInterval(vec2.fromValues(0, 5));
        go.getComponents().add(rc);

        const ma2 = new Material(BlinnPhongRenderer);
        ma2.setSlot(Material.NORMAL, ns);

        const rc2 = new MeshComponent(this.box, ma2);
        rc2.setVisibilityInterval(vec2.fromValues(5, 100));
        go.getComponents().add(rc2);
    }

    public createReflectionBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(7.5, 0, 0));
        const ma = new Material(BlinnPhongRenderer);

        const rs = new MaterialSlot();
        rs.setCubeMapTexture(Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.PBR_SPECULAR_IBL_MAP));
        ma.setSlot(Material.REFLECTION, rs);

        const is = new MaterialSlot();
        is.setColor(vec4.fromValues(0, 1, 0, 0));
        ma.setSlot(Material.ENVIRONMENT_INTENSITY, is);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public createDragon(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(10, -0.5, 0));
        go.getTransform().setRelativeScale(vec3.fromValues(0.1, 0.1, 0.1));

        const dragonMesh = new StaticMesh('res/meshes/dragon.obj');
        const mc = new MeshComponent(dragonMesh, new Material(BlinnPhongRenderer), new ObbBoundingShape());
        go.getComponents().add(mc);

        const rc = new RotateComponent();
        go.getComponents().add(rc);
    }

    public createBezierSpline(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(12.5, 0, 0));
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
        const sc = new SplineComponent(bs, new Material(BlinnPhongRenderer));
        go.getComponents().add(sc);
    }

    public createAudioSource(): void {
        const go = new GameObject();

        const as = new AudioSourceComponent('res/sounds/music.ogg');
        go.getComponents().add(as);
        as.start();
    }

}