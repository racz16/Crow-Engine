import { IMesh } from "../../resource/mesh/IMesh";
import { RenderableComponent } from "./RenderableComponent";
import { Gl } from "../../webgl/Gl";
import { Material } from "../../material/Material";


export class MeshComponent extends RenderableComponent<IMesh>{

    private twoSided: boolean;

    public constructor(mesh: IMesh, material: Material) {
        super(mesh, material);
    }

    public isTwoSided(): boolean {
        return this.twoSided;
    }

    public setTwoSided(twoSided: boolean): void {
        this.twoSided = twoSided;
    }

    public getFaceCount(): number {
        return this.getRenderable().getFaceCount();
    }

    public draw(): void {
        if (!this.isTwoSided()) {
            Gl.setEnableCullFace(false);
        } else {
            Gl.setEnableCullFace(true);
        }
        super.draw();
    }


}
