import { Shader } from './Shader';
import { Conventions } from '../Conventions';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';
import { Material } from '../../material/Material';
import { MaterialSlot } from '../../material/MaterialSlot';

export class SkyBoxShader extends Shader {

    public setUniforms(renderableComponent: IRenderableComponent<IRenderable>) {
        this.getShaderProgram().bindUniformBlockToBindingPoint(Conventions.CAMERA_BINDING_POINT);
        const slot = renderableComponent.getMaterial().getSlot(Material.SKYBOX);
        const usable = this.isCubeMapUsable(renderableComponent, slot);
        if (usable) {
            slot.getCubeMapTexture().getNativeTexture().bindToTextureUnit(0);
        }
        this.getShaderProgram().loadBoolean('isThereCubeMap', usable);
    }

    private isCubeMapUsable(renderableComponent: IRenderableComponent<IRenderable>, slot: MaterialSlot): boolean {
        return renderableComponent.getMaterial() &&
            slot &&
            slot.getCubeMapTexture() &&
            slot.getCubeMapTexture().isUsable();
    }

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('cubeMap', 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/skybox/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/skybox/fragment.glsl';
    }

}
