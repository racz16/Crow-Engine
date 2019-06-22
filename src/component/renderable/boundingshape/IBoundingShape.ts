import { RenderableComponent } from "../RenderableComponent";
import { IRenderable } from "../../../resource/IRenderable";
import { IInvalidatable } from "../../../utility/invalidatable/IInvalidatable";

export interface IBoundingShape extends IInvalidatable {

    private_setRenderableComponent(renderableComponent: RenderableComponent<IRenderable>): void;

    getRenderableComponent(): RenderableComponent<IRenderable>;

    isInsideMainCameraFrustum(): boolean;

    isUsable(): boolean;
}