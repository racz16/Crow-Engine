import { Ubo } from '../../../webgl/buffer/Ubo';
import { BufferObjectUsage } from '../../../webgl/enum/BufferObjectUsage';
import { BlinnPhongDirectionalLightComponent } from './BlinnPhongDirectionalLightComponent';
import { BlinnPhongPositionalLightComponent } from './BlinnPhongPositionalLightComponent';
import { Scene } from '../../../core/Scene';
import { vec3 } from 'gl-matrix';
import { ICameraComponent } from '../../camera/ICameraComponent';
import { Utility } from '../../../utility/Utility';
import { Log } from '../../../utility/log/Log';
import { RenderingPipeline } from '../../../rendering/RenderingPipeline';
import { LogLevel } from '../../../utility/log/LogLevel';
import { BlinnPhongLightComponent } from './BlinnPhongLightComponent';

export class BlinnPhongLightContainer {

    private static instance: BlinnPhongLightContainer;
    private static readonly ACTIVE_OFFSET = 108;
    private static readonly LIGHT_DATASIZE = 112;
    private static readonly LIGHT_COUNT = 16;

    private ubo: Ubo;
    private lights = new Array<BlinnPhongLightComponent>();
    private addedLightCount = 0;

    private constructor() { }

    public static getInstance(): BlinnPhongLightContainer {
        if (!this.instance) {
            this.instance = new BlinnPhongLightContainer();
        }
        return this.instance;
    }

    public useLightsUbo(): void {
        this.ubo.bindToBindingPoint(RenderingPipeline.LIGHTS_BINDING_POINT.bindingPoint);
    }

    private createUboIfNotUsable(): void {
        if (!this.isUsable()) {
            this.ubo = new Ubo();
            this.ubo.allocate(BlinnPhongLightContainer.LIGHT_DATASIZE * (BlinnPhongLightContainer.LIGHT_COUNT), BufferObjectUsage.STATIC_DRAW);
            Log.logString(LogLevel.INFO_1, 'Blinn-Phong Lights ubo created');
        }
    }

    public releaseUbo(): void {
        if (this.isUsable()) {
            this.ubo.release();
            this.ubo = null;
            Log.logString(LogLevel.INFO_1, 'Blinn-Phong Lights ubo released');
        }
    }

    public refreshUbo(): void {
        this.createUboIfNotUsable();
        this.sortLights();
        this.refreshLightsInUbo();
        this.refreshRemainingSlotsInUbo();
        Log.logString(LogLevel.INFO_2, `Blinn-Phong Lights ubo refreshed (${this.addedLightCount} light sources)`);
    }

    private refreshLightsInUbo(): void {
        this.addedLightCount = 0;
        for (const light of this.lights) {
            if (this.addedLightCount === BlinnPhongLightContainer.LIGHT_COUNT) {
                return;
            }
            if (light.isActive() && light.getGameObject()) {
                (light as any).refresh(this.ubo, this.addedLightCount);
                this.addedLightCount++;
            }
        }
    }

    private refreshRemainingSlotsInUbo(): void {
        for (let i = this.addedLightCount; i < BlinnPhongLightContainer.LIGHT_COUNT; i++) {
            this.ubo.storewithOffset(new Int32Array([0]), i * BlinnPhongLightContainer.LIGHT_DATASIZE + BlinnPhongLightContainer.ACTIVE_OFFSET);
        }
    }

    private sortLights(): void {
        const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        this.lights.sort((a, b) => {
            const ad = this.computeLightDistanceFromCamera(a, camera);
            const bd = this.computeLightDistanceFromCamera(b, camera);
            return ad - bd;
        });
    }

    private computeLightDistanceFromCamera(light: BlinnPhongLightComponent, camera: ICameraComponent): number {
        if (!light.isActive() || !light.getGameObject()) {
            return Number.POSITIVE_INFINITY;
        } else if (light instanceof BlinnPhongDirectionalLightComponent) {
            return 0;
        }
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const lightPosition = light.getGameObject().getTransform().getAbsolutePosition();
        return vec3.distance(cameraPosition, lightPosition);
    }

    public addLight(light: BlinnPhongLightComponent): void {
        if (!this.lights.includes(light)) {
            this.lights.push(light);
        }
    }

    public getLightCount(): number {
        return BlinnPhongLightContainer.LIGHT_COUNT;
    }

    public getLightsIterator(): IterableIterator<BlinnPhongLightComponent> {
        return this.lights.values();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.ubo);
    }

}