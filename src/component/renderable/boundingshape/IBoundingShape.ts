import { IRenderable } from '../../../resource/IRenderable';
import { IInvalidatable } from '../../../utility/invalidatable/IInvalidatable';
import { IRenderableComponent } from '../IRenderableComponent';

export interface IBoundingShape extends IInvalidatable {

    getRenderableComponent(): IRenderableComponent<IRenderable>;

    isInsideMainCameraFrustum(): boolean;

    private_setRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void;

}