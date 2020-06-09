import { Shader } from './Shader';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';
import { Material } from '../../material/Material';
import { MaterialSlot } from '../../material/MaterialSlot';
import { Engine } from '../../core/Engine';
import { Utility } from '../../utility/Utility';
import { Conventions } from '../Conventions';

export class SkyBoxShader extends Shader {

    public setUniforms(renderableComponent: IRenderableComponent<IRenderable>) {
        const slot = renderableComponent.getMaterial().getSlot(Material.SKYBOX);
        const usable = this.isCubeMapUsable(renderableComponent, slot);
        if (usable) {
            slot.getCubeMapTexture().getNativeTexture().bindToTextureUnit(Conventions.ZERO_TEXTURE_UNIT);
        } else {
            Engine.getParameters().get(Engine.BLACK_CUBE_MAP_TEXTURE).getNativeTexture().bindToTextureUnit(Conventions.ZERO_TEXTURE_UNIT);
        }

        this.getShaderProgram().loadBoolean('isThereCubeMap', usable);
    }

    private isCubeMapUsable(renderableComponent: IRenderableComponent<IRenderable>, slot: MaterialSlot): boolean {
        return renderableComponent.getMaterial() &&
            slot &&
            slot.isActive() &&
            slot.getCubeMapTexture() &&
            Utility.isUsable(slot.getCubeMapTexture());
    }

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('cubeMap', Conventions.ZERO_TEXTURE_UNIT);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/skybox/skybox.vs';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/skybox/skybox.fs';
    }

}
