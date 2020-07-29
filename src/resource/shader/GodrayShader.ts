import { Shader } from './Shader';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { Conventions } from '../Conventions';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { vec4, vec2 } from 'gl-matrix';

export class GodrayShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/godray/godray.vs';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/godray/godray.fs';
    }

    public setUniforms(data?: any): void {
        const image = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.GODRAY_OCCLUSION);
        this.loadTexture2D(image, Conventions.TU_ONE);
        this.getNativeShaderProgram().connectTextureUnit('godrayOcclusion', Conventions.TU_ONE);

        const camera = Engine.getMainCamera();
        const light = PbrLightsStruct.getInstance().getShadowLightSource();
        const lightForward = light.getGameObject().getTransform().getForwardVector();
        const lightDirection = vec4.fromValues(lightForward[0], lightForward[1], lightForward[2], 0);

        const result = vec4.create();
        vec4.transformMat4(result, lightDirection, camera.getViewMatrix());
        vec4.transformMat4(result, result, camera.getProjectionMatrix());
        vec4.div(result, result, vec4.fromValues(result[3], result[3], result[3], result[3]));
        vec4.add(result, result, vec4.fromValues(1, 1, 1, 1));
        vec4.div(result, result, vec4.fromValues(2, 2, 2, 2));
        this.getNativeShaderProgram().loadVector2('u_lightPosition', vec2.fromValues(result[0], result[1]));
    }

}