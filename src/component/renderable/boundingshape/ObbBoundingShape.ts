import { BoundingShape } from './BoundingShape';
import { vec4, mat4 } from 'gl-matrix';
import { Scene } from '../../../core/Scene';
import { Log } from '../../../utility/log/Log';
import { LogLevel } from '../../../utility/log/LogLevel';
import { Utility } from '../../../utility/Utility';
import { IRenderableComponent } from '../IRenderableComponent';
import { IRenderable } from '../../../resource/IRenderable';

export class ObbBoundingShape extends BoundingShape {

    protected clipSpaceObbCornerPoints: Array<vec4>;

    public isInsideMainCameraFrustum(): boolean {
        if (this.isUsable()) {
            this.refresh();
            return this.isInsideMainCameraFrustumUnsafe();
        } else {
            return true;
        }
    }

    protected isInsideMainCameraFrustumUnsafe(): boolean {
        for (let i = 0; i < 3; i++) {
            if (this.isOutsidePositivePlane(i) || this.isOutsideNegativePlane(i)) {
                return false;
            }
        }
        return true;
    }

    protected isOutsidePositivePlane(coordinate: number) {
        for (const cp of this.clipSpaceObbCornerPoints) {
            if (cp[coordinate] <= cp[3]) {
                return false;
            }
        }
        return true;
    }

    protected isOutsideNegativePlane(coordinate: number) {
        for (const cp of this.clipSpaceObbCornerPoints) {
            if (cp[coordinate] >= -cp[3]) {
                return false;
            }
        }
        return true;
    }

    private refresh(): void {
        if (!this.isValid()) {
            this.refreshUnsafe();
            this.setValid(true);
            Log.logString(LogLevel.INFO_3, 'OBB bounding shape refreshed');
        }
    }

    protected refreshUnsafe(): void {
        const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        const cornerPoints = this.computeObjectSpaceAabbCornerPoints();
        const MVP = mat4.create();
        mat4.mul(MVP, camera.getProjectionMatrix(), mat4.mul(MVP, camera.getViewMatrix(), this.renderableComponent.getModelMatrix()));
        for (const cornerPoint of cornerPoints) {
            vec4.transformMat4(cornerPoint, cornerPoint, MVP);
        }
        this.clipSpaceObbCornerPoints = cornerPoints;
    }

    protected setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().removeInvalidatable(this);
            Scene.getParameters().removeInvalidatable(Scene.MAIN_CAMERA, this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().addInvalidatable(this);
            Scene.getParameters().addInvalidatable(Scene.MAIN_CAMERA, this);
        }
        this.invalidate();
    }

    protected isUsable(): boolean {
        const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        return !this.renderableComponent.getBillboard() && camera && camera.getGameObject() && super.isUsable();
    }

    public getClipSpaceObbCornerPoints(): IterableIterator<vec4> {
        if (this.isUsable()) {
            this.refresh();
            return Utility.clone(this.clipSpaceObbCornerPoints).values();
        } else {
            return null;
        }
    }

}