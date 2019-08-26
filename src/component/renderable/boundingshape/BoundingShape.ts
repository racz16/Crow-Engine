import { IBoundingShape } from './IBoundingShape';
import { IRenderable } from '../../../resource/IRenderable';
import { vec4, vec3 } from 'gl-matrix';
import { IRenderableComponent } from '../IRenderableComponent';

export abstract class BoundingShape implements IBoundingShape {

    private renderableComponent: IRenderableComponent<IRenderable>;
    private valid = false;

    public getRenderableComponent(): IRenderableComponent<IRenderable> {
        return this.renderableComponent;
    }

    protected isValid(): boolean {
        return this.valid;
    }

    protected setValid(valid: boolean): void {
        this.valid = valid;
    }

    protected computeObjectSpaceAabbCornerPoints(): Array<vec4> {
        const osAabbMin = this.getObjectSpaceAabbMin();
        const osAabbMax = this.getObjectSpaceAabbMax();
        return this.getObjectSpaceAabbCornerPoints(osAabbMin, osAabbMax);
    }

    private getObjectSpaceAabbCornerPoints(osAabbMin: vec3, osAabbMax: vec3): Array<vec4> {
        const cornerPoints = new Array<vec4>(8);
        cornerPoints[0] = vec4.fromValues(osAabbMax[0], osAabbMax[1], osAabbMax[2], 1);//right-top-front
        cornerPoints[1] = vec4.fromValues(osAabbMax[0], osAabbMin[1], osAabbMax[2], 1);//right-bottom-front
        cornerPoints[2] = vec4.fromValues(osAabbMax[0], osAabbMax[1], osAabbMin[2], 1);//right-top-back
        cornerPoints[3] = vec4.fromValues(osAabbMax[0], osAabbMin[1], osAabbMin[2], 1);//right-bottom-back
        cornerPoints[4] = vec4.fromValues(osAabbMin[0], osAabbMax[1], osAabbMax[2], 1);//left-top-front
        cornerPoints[5] = vec4.fromValues(osAabbMin[0], osAabbMin[1], osAabbMax[2], 1);//left-bottom-front
        cornerPoints[6] = vec4.fromValues(osAabbMin[0], osAabbMax[1], osAabbMin[2], 1);//left-top-back
        cornerPoints[7] = vec4.fromValues(osAabbMin[0], osAabbMin[1], osAabbMin[2], 1);//left-bottom-back
        return cornerPoints;
    }

    protected getObjectSpaceAabbMin(): vec3 {
        if (this.renderableComponent) {
            return this.getRenderableComponent().getRenderable().getObjectSpaceAabbMin();
        } else {
            return null;
        }
    }

    protected getObjectSpaceAabbMax(): vec3 {
        if (this.renderableComponent) {
            return this.getRenderableComponent().getRenderable().getObjectSpaceAabbMax();
        } else {
            return null;
        }
    }

    public private_setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().removeInvalidatable(this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.getInvalidatables().addInvalidatable(this);
        }
        this.invalidate();
    }

    public invalidate(): void {
        this.valid = false;
    }

    protected isUsable(): boolean {
        return this.renderableComponent && this.renderableComponent.getGameObject() != null;
    }

    public abstract isInsideMainCameraFrustum(): boolean;

}