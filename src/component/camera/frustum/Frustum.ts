import { vec3 } from 'gl-matrix';
import { FrustumCornerPoint } from './FrustumCornerPoint';
import { FrustumPlane } from './FrustumPlane';
import { FrustumSide } from './FrustumSide';
import { IInvalidatable } from '../../../utility/invalidatable/IInvalidatable';
import { ICameraComponent } from '../ICameraComponent';

export abstract class Frustum implements IInvalidatable {

    protected cameraComponent: ICameraComponent;

    public abstract getCenterPoint(): vec3;

    public abstract getCornerPointsIterator(): IterableIterator<vec3>;

    public abstract getCornerPoint(cornerPoint: FrustumCornerPoint): vec3;

    public abstract getPlanesIterator(): IterableIterator<FrustumPlane>;

    public abstract getPlane(side: FrustumSide): FrustumPlane;

    public abstract invalidate(sender?: any): void;

    public getCameraComponent(): ICameraComponent {
        return this.cameraComponent;
    }

    protected setCameraComponent(cameraComponent: ICameraComponent): void {
        if (this.cameraComponent) {
            this.cameraComponent.getInvalidatables().remove(this);
        }
        this.cameraComponent = cameraComponent;
        if (this.cameraComponent) {
            this.cameraComponent.getInvalidatables().add(this);
        }
        this.invalidate();
    }

}