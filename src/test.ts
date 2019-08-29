import { Engine } from './core/Engine';
import { StaticMesh } from './resource/mesh/StaticMesh';
import { GameObject } from './core/GameObject';
import { MeshComponent } from './component/renderable/MeshComponent';
import { Material } from './material/Material';
import { CameraComponent } from './component/camera/CameraComponent';
import { vec3, vec4, vec2 } from 'gl-matrix';
import { Scene } from './core/Scene';
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
import { AabbBoundingShape } from './component/renderable/boundingshape/AabbBoundingShape';
import { AxisAlignedCylindricalBillboard } from './component/renderable/billboard/AxisAlignedCylindricalBillboard';
import { BillboardAxis } from './component/renderable/billboard/BillboardAxis';


window.onload = () => {
    const tsb = new TestSceneBuilder();
    tsb.initialize();
    tsb.loadResources();
    tsb.setUpScene();
    tsb.createUi();
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
    private normal9Path = 'res/textures/normal9.jpg';
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
        this.diffuse = new Texture2D(this.diffusePath);
        this.specular = new Texture2D(this.specularPath);
        this.normal9 = new Texture2D(this.normal9Path);
        this.normal6 = new Texture2D(this.normal6Path);
        this.elyHills = new CubeMapTexture(this.elyHillsPaths);
    }

    public setUpScene(): void {
        //skybox
        Scene.getParameters().set(Scene.MAIN_SKYBOX, this.elyHills);

        //camera
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(0, 0, 10));
        const cc = new CameraComponent();
        go.getComponents().add(cc);
        Scene.getParameters().set(Scene.MAIN_CAMERA, cc);

        //input
        const pc = new PlayerComponent();
        go.getComponents().add(pc);

        //audio listener
        const alc = new AudioListenerComponent();
        go.getComponents().add(alc);
        Scene.getParameters().set(Scene.MAIN_AUDIO_LISTENER, alc);

        //directional light
        const dlgo = new GameObject();
        const dlc = new BlinnPhongDirectionalLightComponent();
        dlgo.getComponents().add(dlc);
        dlgo.getTransform().setRelativeRotation(vec3.fromValues(-45, 45, 0));
        Scene.getParameters().set(BlinnPhongRenderer.MAIN_DIRECTIONAL_LIGHT, dlc);
    }

    public createUi(): void {
        const go = new GameObject();
        const ic = new InfoComponent();
        go.getComponents().add(ic);
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

        const rc = new MeshComponent(this.box, ma);
        rc.setBillboard(new AxisAlignedCylindricalBillboard(BillboardAxis.Y_AXIS));
        //go.getTransform().setRelativeScale(vec3.fromValues(2, 2, 2));
        go.getComponents().add(rc);
    }

    public createNormalBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(2.5, 0, 0));
        const ma = new Material(BlinnPhongRenderer);

        const ns = new MaterialSlot();
        ns.setTexture2D(this.normal9);
        ma.setSlot(Material.NORMAL, ns);

        const rc = new MeshComponent(this.box, ma);
        go.getComponents().add(rc);
    }

    public createNormalPomBox(): void {
        const go = new GameObject();
        go.getTransform().setRelativePosition(vec3.fromValues(5, 0, 0));

        const ma = new Material(BlinnPhongRenderer);
        ma.getParameters().set(MaterialSlot.USE_POM, 1);
        ma.getParameters().set(MaterialSlot.POM_SCALE, 0.2);
        ma.getParameters().set(MaterialSlot.POM_MIN_LAYERS, 50);
        ma.getParameters().set(MaterialSlot.POM_MAX_LAYERS, 100);

        const ns = new MaterialSlot();
        ns.setTexture2D(this.normal6);
        ma.setSlot(Material.NORMAL, ns);

        const rc = new MeshComponent(this.box, ma);
        rc.setVisibilityInterval(vec2.fromValues(0, 1));
        go.getComponents().add(rc);

        const ma2 = new Material(BlinnPhongRenderer);
        ma2.setSlot(Material.NORMAL, ns);

        const rc2 = new MeshComponent(this.box, ma2);
        rc2.setVisibilityInterval(vec2.fromValues(1, 100));
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
            const x = i % 2 == 0 ? 5 : -5;
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