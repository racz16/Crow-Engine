import { Ubo } from '../../../webgl/buffer/Ubo';
import { BufferObjectUsage } from '../../../webgl/enum/BufferObjectUsage';
import { vec3 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';
import { Log } from '../../../utility/log/Log';
import { LogLevel } from '../../../utility/log/LogLevel';
import { Engine } from '../../../core/Engine';
import { ICameraComponent } from '../../camera/ICameraComponent';
import { Conventions } from '../../../resource/Conventions';
import { PbrLightComponent } from './PbrLightComponent';
import { PbrDirectionalLightComponent } from './PbrDirectionalLightComponent';

export class PbrLightsStruct {

    private static instance: PbrLightsStruct;
    private static readonly ACTIVE_OFFSET = 68;
    private static readonly LIGHT_DATASIZE = 80;
    private static readonly LIGHT_COUNT = 16;

    private ubo: Ubo;
    private lights = new Array<PbrLightComponent>();
    private addedLightCount = 0;

    private constructor() { }

    public static getInstance(): PbrLightsStruct {
        if (!this.instance) {
            this.instance = new PbrLightsStruct();
        }
        return this.instance;
    }

    public useUbo(): void {
        this.ubo.bindToBindingPoint(Conventions.LIGHTS_BINDING_POINT);
    }

    private createUboIfNotUsable(): void {
        if (!this.isUsable()) {
            this.ubo = new Ubo();
            this.ubo.allocate(PbrLightsStruct.LIGHT_DATASIZE * (PbrLightsStruct.LIGHT_COUNT), BufferObjectUsage.STATIC_DRAW);
            Log.logString(LogLevel.INFO_1, 'PBR Lights ubo created');
        }
    }

    public releaseUbo(): void {
        if (this.isUsable()) {
            this.ubo.release();
            this.ubo = null;
            Log.logString(LogLevel.INFO_1, 'PBR Lights ubo released');
        }
    }

    public refreshUbo(): void {
        this.createUboIfNotUsable();
        this.sortLights();
        this.refreshLightsInUbo();
        this.refreshRemainingSlotsInUbo();
        Log.logString(LogLevel.INFO_2, `PBR Lights ubo refreshed (${this.addedLightCount} light sources)`);
    }

    private refreshLightsInUbo(): void {
        this.addedLightCount = 0;
        for (const light of this.lights) {
            if (this.addedLightCount === PbrLightsStruct.LIGHT_COUNT) {
                return;
            }
            if (light.isActive() && light.getGameObject()) {
                (light as any).refresh(this.ubo, this.addedLightCount);
                this.addedLightCount++;
            }
        }
    }

    private refreshRemainingSlotsInUbo(): void {
        for (let i = this.addedLightCount; i < PbrLightsStruct.LIGHT_COUNT; i++) {
            this.ubo.store(new Int32Array([0]), i * PbrLightsStruct.LIGHT_DATASIZE + PbrLightsStruct.ACTIVE_OFFSET);
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
        if (!light.isActive() || !light.getGameObject()) {
            return Number.POSITIVE_INFINITY;
        } else if (light instanceof PbrDirectionalLightComponent) {
            return 0;
        }
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const lightPosition = light.getGameObject().getTransform().getAbsolutePosition();
        return vec3.distance(cameraPosition, lightPosition);
    }

    public addLight(light: PbrLightComponent): void {
        if (!light) {
            throw new Error();
        }
        if (!this.lights.includes(light)) {
            this.lights.push(light);
        }
    }

    public getLightCount(): number {
        return PbrLightsStruct.LIGHT_COUNT;
    }

    public getLightsIterator(): IterableIterator<PbrLightComponent> {
        return this.lights.values();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.ubo);
    }

}