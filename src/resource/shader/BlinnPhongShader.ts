import { Shader } from './Shader';
import { mat3 } from 'gl-matrix';
import { IRenderable } from '../IRenderable';
import { DiffuseSlotHelper } from './slotHelper/DiffuseSlotHelper';
import { SpecularSlotHelper } from './slotHelper/SpecularSlotHelper';
import { NormalSlotHelper } from './slotHelper/NormalSlotHelper';
import { ShaderSlotHelper } from './slotHelper/ShaderSlotHelper';
import { ReflectionSlotHelper } from './slotHelper/ReflectionSlotHelper';
import { RefractionSlotHelper } from './slotHelper/RefractionSlotHelper';
import { EnvironmentSlotHelper } from './slotHelper/EnvironmentSlotHelper';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { EmissiveSlotHelper } from './slotHelper/EmissiveSlotHelper';

export class BlinnPhongShader extends Shader {

    private slotHelpers: Array<ShaderSlotHelper>;

    public constructor() {
        super();
        this.slotHelpers = [
            new DiffuseSlotHelper(),
            new SpecularSlotHelper(),
            new NormalSlotHelper(),
            new ReflectionSlotHelper(),
            new RefractionSlotHelper(),
            new EnvironmentSlotHelper(),
            new EmissiveSlotHelper()
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