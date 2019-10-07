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
import { PbrSpotLightComponent } from './component/light/pbr/PbrSpotLightComponent';
import { PbrPointLightComponent } from './component/light/pbr/PbrPointLightComponent';

window.onload = () => {
    const tsb = new TestSceneBuilder();
    tsb.initialize();
    tsb.loadResources();
    tsb.setUpScene();
    tsb.createUi();
    tsb.createFlightHelmet();
    tsb.createDiffuseBox();
    tsb.createNormalBox();
    tsb.createNormalPomBox();
    tsb.createReflectionBox();
    tsb.createDragon();
    tsb.createBezierSpline();
    tsb.createAudioSource();

    /*
        const rc = new RotateComponent();
        mgo.getComponents().add(rc);

    const plgo = new GameObject();
    const plc = new BlinnPhongPointLightComponent();
    plgo.getComponents().add(plc);
    plc.setDiffuseColor(vec3.fromValues(1, 0, 0));

    const slgo = new GameObject();
    const slc = new BlinnPhongSpotLightComponent();
    slgo.getComponents().add(slc);
    slc.setDiffuseColor(vec3.fromValues(0, 0, 1));
    slc.setCutoff(5);
    slc.setOuterCutoff(7);
    slgo.getTransform().setRelativePosition(vec3.fromValues(0, 0, 5));
*/

    Engine.start();
}

export class TestSceneBuilder {

    private dragon: StaticMesh;
    private box: StaticMesh;
    private diffuse: Texture2D;
    private specular: Texture2D;
    private normal9: Texture2D;
    private normal6: Texture2D;
    private elyHills: CubeMapTexture;

    private dragonPath = 'res/meshes/dragon.obj';
    private boxPath = 'res/meshes/box.obj';
    private diffusePath = 'res/textures/diffuse1.png';
    private specularPath = 'res/textures/specular1.png';
    private normal9Path = 'res/textures/7259d9158be0b7e8c62c887fac57ed81.png';
    private normal6Path = 'res/textures/normal6.png';
    private musicPath = 'res/sounds/music.ogg';
    private elyHillsPaths = [
        'res/textures/ely_hills/hills_rt.png',
        'res/textures/ely_hills/hills_lf.png',
        'res/textures/ely_hills/hills_up.png',
        'res/textures/ely_hills/hills_dn.png',
        'res/textures/ely_hills/hills_bk.png',
        'res/textures/ely_hills/hills_ft.png',
    ];

    public initialize(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        Engine.initialize(canvas);
    }

    public loadResources(): void {
        this.dragon = new StaticMesh(this.dragonPath);
        this.box = new StaticMesh(this.boxPath);
        this.diffuse = new Texture2D(this.diffusePath, false, TextureType.IMAGE);
        this.specular = new Texture2D(this.specularPath, false, TextureType.DATA);
        this.normal9 = new Texture2D(this.normal9Path, false, TextureType.DATA);
        this.normal6 = new Texture2D(this.normal6Path, true, TextureType.DATA);
        this.elyHills = new CubeMapTexture(this.elyHillsPaths, false, TextureType.IMAGE);
    }

    public setUpScene(): void {
        //skybox
        const sky = new GameObject();
        const skyMaterial = new Material(SkyboxRenderer);
        const slot = new MaterialSlot();
        slot.setCubeMapTexture(this.elyHills);
        skyMaterial.setSlot(Material.SKYBOX, slot);
        const skyRenderable = new MeshComponent(CubeMesh.getInstance(), skyMaterial);
        sky.getComponents().add(skyRenderable);

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

        /*const slgo = new GameObject();
        slgo.getTransform().setRelativePosition(vec3.fromValues(-10, 0, 5));
        const slc = new PbrSpotLightComponent();
        slc.setCutoff(3);
        slc.setOuterCutoff(3);
        slc.setColor(vec3.fromValues(1, 0, 0));
        slgo.getComponents().add(slc);

        const plc = new PbrPointLightComponent();
        plc.setColor(vec3.fromValues(0, 1, 0));
        plc.setIntensity(100);
        slgo.getComponents().add(plc);*/
    }

    public createUi(): void {
        const go = new GameObject();
        const ic = new InfoComponent();
        go.getComponents().add(ic);
    }

    public createFlightHelmet(): void {
        const flightHelmet = new GameObject();
        flightHelmet.getTransform().setRelativePosition(vec3.fromValues(-10, 0, 0));
        flightHelmet.getTransform().setRelativeScale(vec3.fromValues(3, 3, 3));

        const leatherMesh = new StaticMesh('res/meshes/flight-helmet/leather.obj');
        const leatherMaterial = new Material(PbrRenderer);

        const leatherBaseColor = new MaterialSlot();
        leatherBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor1.png', false, TextureType.IMAGE, TextureFiltering.Anisotropic_16));
        leatherMaterial.setSlot(Material.BASE_COLOR, leatherBaseColor);

        const leatherNormal = new MaterialSlot();
        leatherNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal1.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        leatherMaterial.setSlot(Material.NORMAL, leatherNormal);

        const leatherORM = new MaterialSlot();
        leatherORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic1.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        leatherMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, leatherORM);

        const leather = new MeshComponent(leatherMesh, leatherMaterial);
        flightHelmet.getComponents().add(leather);

        //

        const glassPlasticMesh = new StaticMesh('res/meshes/flight-helmet/glassPlastic.obj');
        const glassPlasticMaterial = new Material(PbrRenderer);

        const glassPlasticBaseColor = new MaterialSlot();
        glassPlasticBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor.png', false, TextureType.IMAGE, TextureFiltering.Anisotropic_16));
        glassPlasticMaterial.setSlot(Material.BASE_COLOR, glassPlasticBaseColor);

        const glassPlasticNormal = new MaterialSlot();
        glassPlasticNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        glassPlasticMaterial.setSlot(Material.NORMAL, glassPlasticNormal);

        const glassPlasticORM = new MaterialSlot();
        glassPlasticORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        glassPlasticMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, glassPlasticORM);

        const glassPlastic = new MeshComponent(glassPlasticMesh, glassPlasticMaterial);
        flightHelmet.getComponents().add(glassPlastic);

        //

        const metalMesh = new StaticMesh('res/meshes/flight-helmet/metal.obj');
        const metalMaterial = new Material(PbrRenderer);

        const metalBaseColor = new MaterialSlot();
        metalBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor3.png', false, TextureType.IMAGE, TextureFiltering.Anisotropic_16));
        metalMaterial.setSlot(Material.BASE_COLOR, metalBaseColor);

        const metalNormal = new MaterialSlot();
        metalNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal3.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        metalMaterial.setSlot(Material.NORMAL, metalNormal);

        const metalORM = new MaterialSlot();
        metalORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic3.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        metalMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, metalORM);

        const metal = new MeshComponent(metalMesh, metalMaterial);
        flightHelmet.getComponents().add(metal);

        //

        const lensesMesh = new StaticMesh('res/meshes/flight-helmet/lenses.obj');
        const lensesMaterial = new Material(PbrRenderer);

        const lensesBaseColor = new MaterialSlot();
        lensesBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor2.png', true, TextureType.IMAGE, TextureFiltering.Anisotropic_16));
        lensesMaterial.setSlot(Material.BASE_COLOR, lensesBaseColor);

        const lensesNormal = new MaterialSlot();
        lensesNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal2.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        lensesMaterial.setSlot(Material.NORMAL, lensesNormal);

        const lensesORM = new MaterialSlot();
        lensesORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic2.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        lensesMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, lensesORM);

        const lenses = new MeshComponent(lensesMesh, lensesMaterial);
        flightHelmet.getComponents().add(lenses);

        //

        const rubberWoodMesh = new StaticMesh('res/meshes/flight-helmet/rubberWood.obj');
        const headMaterial = new Material(PbrRenderer);

        const rubberWoodBaseColor = new MaterialSlot();
        rubberWoodBaseColor.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_baseColor4.png', true, TextureType.IMAGE, TextureFiltering.Anisotropic_16));
        headMaterial.setSlot(Material.BASE_COLOR, rubberWoodBaseColor);

        const rubberWoodNormal = new MaterialSlot();
        rubberWoodNormal.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_normal4.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        headMaterial.setSlot(Material.NORMAL, rubberWoodNormal);

        const rubberWoodORM = new MaterialSlot();
        rubberWoodORM.setTexture2D(new Texture2D('res/textures/flight-helmet/FlightHelmet_occlusionRoughnessMetallic4.png', false, TextureType.DATA, TextureFiltering.Anisotropic_16));
        headMaterial.setSlot(Material.OCCLUSION_ROUGHNESS_METALNESS, rubberWoodORM);

        const rubberWood = new MeshComponent(rubberWoodMesh, headMaterial);
        flightHelmet.getComponents().add(rubberWood);
    }

    public createDiffuseBox(): void {
        const go = new GameObject();
        const ma = new Material(BlinnPhongRenderer);

        const ds = new MaterialSlot();
        ds.setTexture2D(this.diffuse);
        ma.setSlot(Material.DIFFUSE, ds);

        const ss = new MaterialSlot();
        ss.setTexture2D(this.specular);
        ma.setSlot(Material.SPECULAR, ss);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public createNormalBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(2.5, 0, 0));
        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(this.normal9);
        ma.setSlot(Material.NORMAL, ns);

        const mc = new MeshComponent(this.box, ma);
        go.getComponents().add(mc);
    }

    public createNormalPomBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(5, 0, 0));

        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(this.normal6);
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
        rs.setCubeMapTexture(this.elyHills);
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

        const mc = new MeshComponent(this.dragon, new Material(BlinnPhongRenderer), new ObbBoundingShape());
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

        const as = new AudioSourceComponent(this.musicPath);
        go.getComponents().add(as);
        as.start();
    }

}