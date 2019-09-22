import { Shader } from '../Shader';
import { mat3 } from 'gl-matrix';
import { IRenderable } from '../../IRenderable';
import { BlinnPhongDiffuseHelper } from './BlinnPhongDiffuseHelper';
import { BlinnPhongSpecularHelper } from './BlinnPhongSpecularHelper';
import { BlinnPhongNormalHelper } from './BlinnPhongNormalHelper';
import { BlinnPhongHelper } from './BlinnPhongHelper';
import { BlinnPhongReflectionHelper } from './BlinnPhongReflectionHelper';
import { BlinnPhongRefractionHelper } from './BlinnPhongRefractionHelper';
import { BlinnPhongEnvironmentHelper } from './BlinnPhongEnvironmentHelper';
import { IRenderableComponent } from '../../../component/renderable/IRenderableComponent';

export class BlinnPhongShader extends Shader {

    private slotHelpers: Array<BlinnPhongHelper>;

    public constructor() {
        super();
        this.slotHelpers = [
            new BlinnPhongDiffuseHelper(),
            new BlinnPhongSpecularHelper(),
            new BlinnPhongNormalHelper(),
            new BlinnPhongReflectionHelper(),
            new BlinnPhongRefractionHelper(),
            new BlinnPhongEnvironmentHelper(),
        ];
    }

    public setUniforms(renderableComponent: IRenderableComponent<IRenderable>): void {
        this.setMatrixUniforms(renderableComponent);
        const material = renderableComponent.getMaterial();
        for (const helper of this.slotHelpers) {
            helper.loadSlot(material, this.getShaderProgram());
        }
    }

    private setMatrixUniforms(renderableComponent: IRenderableComponent<IRenderable>): void {
        const model = renderableComponent.getModelMatrix();
        const inverseModel3x3 = mat3.fromMat4(mat3.create(), renderableComponent.getInverseModelMatrix());
        this.getShaderProgram().loadMatrix3('inverseTransposedModelMatrix3x3', inverseModel3x3, true);
        this.getShaderProgram().loadMatrix4('modelMatrix', model, false);
    }

    public connectTextureUnits(): void {
        //this.getShaderProgram().connectTextureUnit('shadowMap', 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/blinnPhong/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/blinnPhong/fragment.glsl';
    }

}