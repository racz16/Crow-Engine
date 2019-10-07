import { Shader } from './Shader';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';
import { mat3 } from 'gl-matrix';
import { ShaderSlotHelper } from './slotHelper/ShaderSlotHelper';
import { NormalSlotHelper } from './slotHelper/NormalSlotHelper';
import { BaseColorSlotHelper } from './slotHelper/BaseColorSlotHelper';
import { OcclusionRoughnessMetalnessSlotHelper } from './slotHelper/OcclusionRoughnessMetalnessSlotHelper';
import { EmissiveSlotHelper } from './slotHelper/EmissiveSlotHelper';

export class PbrShader extends Shader {

    private slotHelpers: Array<ShaderSlotHelper>;

    public constructor() {
        super();
        this.slotHelpers = [
            new BaseColorSlotHelper(),
            new NormalSlotHelper(),
            new OcclusionRoughnessMetalnessSlotHelper(),
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

    protected getVertexShaderPath(): string {
        return 'res/shaders/pbr/vertex.glsl';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/pbr/fragment.glsl';
    }

}