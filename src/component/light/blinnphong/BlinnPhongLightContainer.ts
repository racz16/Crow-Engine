import { Ubo } from "../../../webgl/buffer/Ubo";
import { BufferObjectUsage } from "../../../webgl/enum/BufferObjectUsage";
import { BlinnPhongDirectionalLightComponent } from "./BlinnPhongDirectionalLightComponent";
import { BlinnPhongPositionalLightComponent } from "./BlinnPhongPositionalLightComponent";
import { Scene } from "../../../core/Scene";
import { vec3 } from "gl-matrix";
import { ICamera } from "../../camera/ICamera";
import { Utility } from "../../../utility/Utility";

export class BlinnPhongLightContainer {

    private static instance: BlinnPhongLightContainer;
    private static readonly ACTIVE_OFFSET = 108;
    private static readonly LIGHT_DATASIZE = 112;
    private static readonly LIGHT_COUNT = 16;

    private ubo: Ubo;
    private mainDirectionalLight: BlinnPhongDirectionalLightComponent;
    private refreshDirectional = false;
    private positionalLights: Array<BlinnPhongPositionalLightComponent>;

    private constructor() {
        this.ubo = new Ubo();
        this.ubo.allocate(BlinnPhongLightContainer.LIGHT_DATASIZE * (BlinnPhongLightContainer.LIGHT_COUNT + 1), BufferObjectUsage.STATIC_DRAW);
        this.ubo.bindToBindingPoint(2);
        this.positionalLights = [];
    }

    public static getInstance(): BlinnPhongLightContainer {
        if (BlinnPhongLightContainer.instance == null) {
            BlinnPhongLightContainer.instance = new BlinnPhongLightContainer();
        }
        return BlinnPhongLightContainer.instance;
    }

    public refreshUbo(): void {
        if (this.refreshDirectional) {
            if (this.mainDirectionalLight && this.mainDirectionalLight.isActive() && this.mainDirectionalLight.getGameObject != null) {
                this.mainDirectionalLight.private_refresh(this.ubo);
            } else {
                this.ubo.storewithOffset(new Int32Array([0]), BlinnPhongLightContainer.ACTIVE_OFFSET);
            }
            this.refreshDirectional = false;
        }
        this.sortPositionalLights();
        let addedLightCount = 0;
        for (const light of this.positionalLights) {
            if (addedLightCount == BlinnPhongLightContainer.LIGHT_COUNT) {
                return;
            }
            if (light.isActive() && light.getGameObject()) {
                light.private_refresh(this.ubo, addedLightCount + 1);
                addedLightCount++;
            }
        }
        for (let i = addedLightCount; i < BlinnPhongLightContainer.LIGHT_COUNT; i++) {
            this.ubo.storewithOffset(new Int32Array([0]), (i + 1) * BlinnPhongLightContainer.LIGHT_DATASIZE + BlinnPhongLightContainer.ACTIVE_OFFSET);
        }
    }

    private sortPositionalLights(): void {
        const camera = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
        this.positionalLights.sort((a, b) => {
            const ad = this.computePositionalLightDistanceFromCamera(a, camera);
            const bd = this.computePositionalLightDistanceFromCamera(b, camera);
            return ad - bd;
        });
    }

    private computePositionalLightDistanceFromCamera(light: BlinnPhongPositionalLightComponent, camera: ICamera): number {
        if (!light.isActive() || light.getGameObject() == null) {
            return Number.POSITIVE_INFINITY;
        }
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const lightPosition = light.getGameObject().getTransform().getAbsolutePosition();
        return vec3.distance(cameraPosition, lightPosition);
    }

    public private_addLight(light: BlinnPhongPositionalLightComponent): void {
        if (Utility.contains(this.positionalLights, light)) {
            return;
        }
        this.positionalLights.push(light);
    }

    public refreshDirectionalLight(): void {
        this.refreshDirectional = true;
    }

    public setDirectionalLight(dirLight: BlinnPhongDirectionalLightComponent): void {
        this.mainDirectionalLight = dirLight;
        this.refreshDirectional = true;
    }

    public getPositionalLight(index: number): BlinnPhongPositionalLightComponent {
        return this.positionalLights[index];
    }

    public getPositionalLightCount(): number {
        return BlinnPhongLightContainer.LIGHT_COUNT;
    }

    public getPositionalLightsIterator(): IterableIterator<BlinnPhongPositionalLightComponent> {
        return this.positionalLights.values();
    }

    public getDirectionalLight(): BlinnPhongDirectionalLightComponent {
        return this.mainDirectionalLight;
    }

}