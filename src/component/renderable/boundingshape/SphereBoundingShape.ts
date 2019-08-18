import { BoundingShape } from "./BoundingShape";
import { Utility } from "../../../utility/Utility";
import { Scene } from "../../../core/Scene";

export class SphereBoundingShape extends BoundingShape {

    private radius: number;

    public isInsideMainCameraFrustum(): boolean {
        const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        if (camera && this.isUsable()) {
            const position = this.getRenderableComponent().getGameObject().getTransform().getAbsolutePosition();
            for (const plane of camera.getFrustum().getPlanesIterator()) {
                if (plane.computeDistanceFrom(position) + this.getWorldSpaceRadius() < 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private refresh(): void {
        if (!this.isValid() && this.isUsable()) {
            this.refreshUnsafe();
            this.setValid(true);
        }
    }

    private refreshUnsafe(): void {
        const renderableComponent = this.getRenderableComponent();
        const osRadius = renderableComponent.getRenderable().getObjectSpaceRadius();
        const absoluteScale = renderableComponent.getGameObject().getTransform().getAbsoluteScale();
        this.radius = osRadius * Utility.getMaxCoordinate(absoluteScale);
    }

    public getObjectSpaceRadius(): number {
        if (this.getRenderableComponent()) {
            return this.getRenderableComponent().getRenderable().getObjectSpaceRadius();
        } else {
            return null;
        }
    }

    public getWorldSpaceRadius(): number {
        if (this.isUsable()) {
            this.refresh();
            return this.radius;
        } else {
            return null;
        }
    }

}