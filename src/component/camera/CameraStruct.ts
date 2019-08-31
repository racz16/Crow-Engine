import { Ubo } from '../../webgl/buffer/Ubo';
import { Utility } from '../../utility/Utility';
import { BufferObjectUsage } from '../../webgl/enum/BufferObjectUsage';
import { Log } from '../../utility/log/Log';
import { LogLevel } from '../../utility/log/LogLevel';
import { ICameraComponent } from './ICameraComponent';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { IInvalidatable } from '../../utility/invalidatable/IInvalidatable';
import { Engine } from '../../core/Engine';

export class CameraStruct implements IInvalidatable {

    private ubo: Ubo;
    private valid = false;

    private static instance: CameraStruct;

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
        this.ubo.bindToBindingPoint(RenderingPipeline.CAMERA_BINDING_POINT.bindingPoint);
    }

    private createUboIfNotUsable(): void {
        if (!this.isUsable()) {
            this.ubo = new Ubo();
            this.ubo.allocate(140, BufferObjectUsage.STATIC_DRAW);
            Log.logString(LogLevel.INFO_1, 'Camera Matrices ubo created');
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
        this.ubo.storewithOffset(new Float32Array(camera.getProjectionMatrix()), Ubo.MAT4_SIZE);
        this.ubo.storewithOffset(new Float32Array(camera.getGameObject().getTransform().getAbsolutePosition()), 2 * Ubo.MAT4_SIZE);
        this.valid = true;
        Log.logString(LogLevel.INFO_2, 'Camera Matrices ubo refreshed');
    }

    public releaseUbo(): void {
        if (this.isUsable()) {
            this.ubo.release();
            this.ubo = null;
            this.valid = false;
            Log.logString(LogLevel.INFO_1, 'Camera Matrices ubo released');
        }
    }

    public invalidate(sender?: any): void {
        this.valid = false;
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.ubo);
    }

}