import { BlinnPhongLightComponent } from "./BlinnPhongLightComponent";
import { BlinnPhongLightContainer } from "./BlinnPhongLightContainer";

export abstract class BlinnPhongPositionalLightComponent extends BlinnPhongLightComponent {

    private constant = 1.0;
    private linear = 0.022;
    private quadratic = 0.0019;

    public constructor() {
        super();
        BlinnPhongLightContainer.getInstance().private_addLight(this);
    }

    public getConstant(): number {
        return this.constant;
    }

    public setConstant(constant: number) {
        this.constant = constant;
        this.invalidate();
    }

    public getLinear(): number {
        return this.linear;
    }

    public setLinear(linear: number) {
        this.linear = linear;
        this.invalidate();
    }

    public getQuadratic(): number {
        return this.quadratic;
    }

    public setQuadratic(quadratic: number): void {
        this.quadratic = quadratic;
        this.invalidate();
    }

}
