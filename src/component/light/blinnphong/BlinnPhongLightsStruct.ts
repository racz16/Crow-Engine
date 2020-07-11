import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { GlBufferObjectUsage } from '../../../webgl/enum/GlBufferObjectUsage';
import { BlinnPhongDirectionalLightComponent } from './BlinnPhongDirectionalLightComponent';
import { vec3 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';
import { LogLevel } from '../../../utility/log/LogLevel';
import { BlinnPhongLightComponent } from './BlinnPhongLightComponent';
import { Engine } from '../../../core/Engine';
import { ICameraComponent } from '../../camera/ICameraComponent';
import { Conventions } from '../../../resource/Conventions';
import { BlinnPhongLightStructConstants } from './BlinnPhongLightStructConstants';

export class BlinnPhongLightsStruct {

    private static instance: BlinnPhongLightsStruct;

    private ubo: GlUbo;
    private lights = new Array<BlinnPhongLightComponent>();
    private addedLightCount = 0;
    private shadowLightIndex = -1;

    private constructor() { }

    public static getInstance(): BlinnPhongLightsStruct {
        if (!this.instance) {
            this.instance = new BlinnPhongLightsStruct();
        }
        return this.instance;
    }

    public useUbo(): void {
        this.refreshUbo();
        this.ubo.bindToBindingPoint(Conventions.BP_LIGHTS);
    }

    private createUboIfNotUsable(): void {
        if (!this.isUsable()) {
            this.ubo = new GlUbo();
            this.ubo.allocate(BlinnPhongLightStructConstants.LIGHT_DATASIZE * (BlinnPhongLightStructConstants.LIGHT_COUNT), GlBufferObjectUsage.STATIC_DRAW);
            Engine.getLog().logString(LogLevel.INFO_1, 'Blinn-Phong Lights ubo created');
        }
    }

    public releaseUbo(): void {
        if (this.isUsable()) {
            this.ubo.release();
            this.ubo = null;
            Engine.getLog().logString(LogLevel.INFO_1, 'Blinn-Phong Lights ubo released');
        }
    }

    public refreshUbo(): void {
        this.createUboIfNotUsable();
        this.sortLights();
        this.refreshLightsInUbo();
        this.refreshRemainingSlotsInUbo();
        Engine.getLog().logString(LogLevel.INFO_2, `Blinn-Phong Lights ubo refreshed (${this.addedLightCount} light sources)`);
    }

    private refreshLightsInUbo(): void {
        this.addedLightCount = 0;
        for (const light of this.lights) {
            if (this.addedLightCount === BlinnPhongLightStructConstants.LIGHT_COUNT) {
                return;
            }
            if (light.isActive()) {
                light._refresh(this.ubo, this.addedLightCount);
                this.addedLightCount++;
            }
        }
    }

    private refreshRemainingSlotsInUbo(): void {
        for (let i = this.addedLightCount; i < BlinnPhongLightStructConstants.LIGHT_COUNT; i++) {
            this.ubo.store(new Int32Array([0]), i * BlinnPhongLightStructConstants.LIGHT_DATASIZE + BlinnPhongLightStructConstants.ACTIVE_OFFSET);
        }
    }

    private sortLights(): void {
        const camera = Engine.getMainCamera();
        this.lights.sort((a, b) => {
            const ad = this.computeLightDistanceFromCamera(a, camera);
            const bd = this.computeLightDistanceFromCamera(b, camera);
            return ad - bd;
        });
    }

    private computeLightDistanceFromCamera(light: BlinnPhongLightComponent, camera: ICameraComponent): number {
        if (!light.isActive()) {
            return Number.POSITIVE_INFINITY;
        } else if (light instanceof BlinnPhongDirectionalLightComponent) {
            return 0;
        }
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const lightPosition = light.getGameObject().getTransform().getAbsolutePosition();
        return vec3.distance(cameraPosition, lightPosition);
    }

    public addLight(light: BlinnPhongLightComponent): void {
        if (!light || !light.getGameObject()) {
            throw new Error();
        }
        if (!this.lights.includes(light)) {
            this.lights.push(light);
        }
    }

    public removeLight(light: BlinnPhongLightComponent): void {
        if (!light || light.getGameObject()) {
            throw new Error();
        }
        Utility.removeElement(this.lights, light);
    }

    public setShadowLightSource(light: BlinnPhongDirectionalLightComponent): void {
        this.shadowLightIndex = this.lights.indexOf(light);
    }

    public getShadowLightSource(): BlinnPhongDirectionalLightComponent {
        return this.shadowLightIndex !== -1 ? this.lights[this.shadowLightIndex] as BlinnPhongDirectionalLightComponent : null;
    }

    public getShadowLightIndex(): number {
        return this.shadowLightIndex;
    }

    public getLightCount(): number {
        return BlinnPhongLightStructConstants.LIGHT_COUNT;
    }

    public getLight(index: number): BlinnPhongLightComponent {
        return this.lights[index];
    }

    public getLightsIterator(): IterableIterator<BlinnPhongLightComponent> {
        return this.lights.values();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.ubo);
    }

}