import { IMesh } from "../../resource/mesh/IMesh";
import { RenderableComponent } from "./RenderableComponent";
import { Gl } from "../../webgl/Gl";

export class MeshComponent extends RenderableComponent<IMesh>{

    private twoSided = false;

    public isTwoSided(): boolean {
        return this.twoSided;
    }

    public setTwoSided(twoSided: boolean): void {
        this.twoSided = twoSided;
        this.invalidate();
    }

    public getFaceCount(): number {
        return this.getRenderable().getFaceCount();
    }

    public draw(): void {
        if (this.isTwoSided()) {
            Gl.setEnableCullFace(false);
        }
        super.draw();
        if (this.isTwoSided()) {
            Gl.setEnableCullFace(true);
        }
    }

}
