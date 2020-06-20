import { GlUbo } from '../../webgl/buffer/GlUbo';
import { Utility } from '../../utility/Utility';
import { GlBufferObjectUsage } from '../../webgl/enum/GlBufferObjectUsage';
import { LogLevel } from '../../utility/log/LogLevel';
import { ICameraComponent } from './ICameraComponent';
import { IInvalidatable } from '../../utility/invalidatable/IInvalidatable';
import { Engine } from '../../core/Engine';
import { Conventions } from '../../resource/Conventions';

export class CameraStruct implements IInvalidatable {

    private ubo: GlUbo;
    private valid = false;

    private static instance: CameraStruct;
    private static CAMERA_UBO_SIZE = 2 * GlUbo.MAT4_SIZE + GlUbo.VEC4_SIZE;

    private constructor() {
        Engine.getParameters().addInvalidatable(Engine.MAIN_CAMERA, this);
    }

    public static getInstance(): CameraStruct {
        if (!this.instance) {
            this.instance = new CameraStruct();
        }
        return this.instance;
    }

    public useUbo(): void {
        this.ubo.bindToBindingPoint(Conventions.BP_CAMERA);
    }

    private createUboIfNotUsable(): void {
        if (!this.isUsable()) {
            this.ubo = new GlUbo();
            this.ubo.allocate(CameraStruct.CAMERA_UBO_SIZE, GlBufferObjectUsage.STATIC_DRAW);
            Engine.getLog().logString(LogLevel.INFO_1, 'Camera Matrices ubo created');
        }
    }

    public refreshUbo(): void {
        this.createUboIfNotUsable();
        const camera = Engine.getMainCamera();
        if (!this.valid && camera && camera.getGameObject()) {
            this.refreshUboUnsafe(camera);
        }
    }

    private refreshUboUnsafe(camera: ICameraComponent): void {
        this.ubo.store(new Float32Array(camera.getViewMatrix()));
        this.ubo.store(new Float32Array(camera.getProjectionMatrix()), GlUbo.MAT4_SIZE);
        this.ubo.store(new Float32Array(camera.getGameObject().getTransform().getAbsolutePosition()), 2 * GlUbo.MAT4_SIZE);
        this.valid = true;
        Engine.getLog().logString(LogLevel.INFO_2, 'Camera Matrices ubo refreshed');
    }

    public releaseUbo(): void {
        if (this.isUsable()) {
            this.ubo.release();
            this.ubo = null;
            this.valid = false;
            Engine.getLog().logString(LogLevel.INFO_1, 'Camera Matrices ubo released');
        }
    }

    public invalidate(sender?: any): void {
        this.valid = false;
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.ubo);
    }

}