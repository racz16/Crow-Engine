import { BoundingShape } from './BoundingShape';
import { vec4, mat4 } from 'gl-matrix';
import { Utility } from '../../../utility/Utility';
import { IRenderableComponent } from '../IRenderableComponent';
import { IRenderable } from '../../../resource/IRenderable';
import { Engine } from '../../../core/Engine';

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

    protected refreshUnsafe(): void {
        const camera = Engine.getMainCamera();
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
            Engine.getParameters().removeInvalidatable(Engine.MAIN_CAMERA, this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().addInvalidatable(this);
            Engine.getParameters().addInvalidatable(Engine.MAIN_CAMERA, this);
        }
        this.invalidate();
    }

    protected isUsable(): boolean {
        const camera = Engine.getMainCamera();
        return !this.renderableComponent.getBillboard() && camera && camera.getGameObject() && super.isUsable();
    }

    public getClipSpaceObbCornerPoints(): IterableIterator<vec4> {
        if (this.isUsable()) {
            this.refresh();
            return Utility.cloneVec4(this.clipSpaceObbCornerPoints.values()).values();
        } else {
            return null;
        }
    }

}