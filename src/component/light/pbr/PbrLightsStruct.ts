import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { GlBufferObjectUsage } from '../../../webgl/enum/GlBufferObjectUsage';
import { vec3 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';
import { LogLevel } from '../../../utility/log/LogLevel';
import { Engine } from '../../../core/Engine';
import { ICameraComponent } from '../../camera/ICameraComponent';
import { Conventions } from '../../../resource/Conventions';
import { PbrLightComponent } from './PbrLightComponent';
import { PbrDirectionalLightComponent } from './PbrDirectionalLightComponent';
import { PbrLightStructConstants } from './PbrLightStructConstants';

export class PbrLightsStruct {

    private static instance: PbrLightsStruct;

    private ubo: GlUbo;
    private lights = new Array<PbrLightComponent>();
    private addedLightCount = 0;
    private shadowLightIndex = -1;

    private constructor() { }

    public static getInstance(): PbrLightsStruct {
        if (!this.instance) {
            this.instance = new PbrLightsStruct();
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
            this.ubo.allocate(PbrLightStructConstants.LIGHT_DATASIZE * (PbrLightStructConstants.LIGHT_COUNT), GlBufferObjectUsage.STATIC_DRAW);
            Engine.getLog().logString(LogLevel.INFO_1, 'PBR Lights ubo created');
        }
    }

    public releaseUbo(): void {
        if (this.isUsable()) {
            this.ubo.release();
            this.ubo = null;
            Engine.getLog().logString(LogLevel.INFO_1, 'PBR Lights ubo released');
        }
    }

    public refreshUbo(): void {
        this.createUboIfNotUsable();
        this.sortLights();
        this.refreshLightsInUbo();
        this.refreshRemainingSlotsInUbo();
        Engine.getLog().logString(LogLevel.INFO_2, `PBR Lights ubo refreshed (${this.addedLightCount} light sources)`);
    }

    private refreshLightsInUbo(): void {
        this.addedLightCount = 0;
        for (const light of this.lights) {
            if (this.addedLightCount === PbrLightStructConstants.LIGHT_COUNT) {
                return;
            }
            if (light.isActive()) {
                light._refresh(this.ubo, this.addedLightCount);
                this.addedLightCount++;
            }
        }
    }

    private refreshRemainingSlotsInUbo(): void {
        for (let i = this.addedLightCount; i < PbrLightStructConstants.LIGHT_COUNT; i++) {
            this.ubo.store(new Int32Array([0]), i * PbrLightStructConstants.LIGHT_DATASIZE + PbrLightStructConstants.ACTIVE_OFFSET);
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

    private computeLightDistanceFromCamera(light: PbrLightComponent, camera: ICameraComponent): number {
        if (!light.isActive()) {
            return Number.POSITIVE_INFINITY;
        } else if (light instanceof PbrDirectionalLightComponent) {
            return 0;
        }
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const lightPosition = light.getGameObject().getTransform().getAbsolutePosition();
        return vec3.distance(cameraPosition, lightPosition);
    }

    public addLight(light: PbrLightComponent): void {
        if (!light || !light.getGameObject()) {
            throw new Error();
        }
        if (!this.lights.includes(light)) {
            this.lights.push(light);
        }
    }

    public removeLight(light: PbrLightComponent): void {
        if (!light || light.getGameObject()) {
            throw new Error();
        }
        Utility.removeElement(this.lights, light);
    }

    public setShadowLightSource(light: PbrDirectionalLightComponent): void {
        this.shadowLightIndex = this.lights.indexOf(light);
    }

    public getShadowLightSource(): PbrDirectionalLightComponent {
        return this.shadowLightIndex !== -1 ? this.lights[this.shadowLightIndex] as PbrDirectionalLightComponent : null;
    }

    public getShadowLightIndex(): number {
        return this.shadowLightIndex;
    }

    public getLightCount(): number {
        return PbrLightStructConstants.LIGHT_COUNT;
    }

    public getLight(index: number): PbrLightComponent {
        return this.lights[index];
    }

    public getLightsIterator(): IterableIterator<PbrLightComponent> {
        return this.lights.values();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.ubo);
    }

}