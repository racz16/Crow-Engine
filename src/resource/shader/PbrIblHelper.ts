import { GlShaderProgram } from '../../webgl/shader/GlShaderProgram';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { Utility } from '../../utility/Utility';
import { CubeMapTexture } from '../texture/CubeMapTexture';

export class PbrIblHelper {

    private readonly DIFFUSE_IBL_TEXTURE_UNIT = 6;
    private readonly SPECULAR_IBL_TEXTURE_UNIT = 7;
    private readonly BRDF_LUT_TEXTURE_UNIT = 8;
    private readonly DIFFUSE_IBL_MAP_NAME = 'diffuseIblMap';
    private readonly SPECULAR_IBL_MAP_NAME = 'specularIblMap';
    private readonly BRDF_LUT_MAP_NAME = 'brdfLutMap';
    private readonly ARE_THERE_IBL_MAPS = 'areThereIblMaps';
    private readonly SPECULAR_IBL_LOD_COUNT = 10;

    private shaderProgram: GlShaderProgram;
    private brdfLut: GlTexture2D;

    public constructor(sp: GlShaderProgram, brdfLut: GlTexture2D) {
        this.shaderProgram = sp;
        this.brdfLut = brdfLut;
    }

    public loadIblMaps(): void {
        const renderingPipeline = Engine.getRenderingPipeline();
        const diffuseIblMap = renderingPipeline.getParameters().get(RenderingPipeline.PBR_DIFFUSE_IBL_MAP);
        const specularIblMap = renderingPipeline.getParameters().get(RenderingPipeline.PBR_SPECULAR_IBL_MAP);
        if (this.areIblMapsUsable(diffuseIblMap, specularIblMap)) {
            this.loadTextures(diffuseIblMap, specularIblMap);
        } else {
            this.loadDefaultTextures();
        }
    }

    private areIblMapsUsable(diffuseIblMap: CubeMapTexture, specularIblMap: CubeMapTexture): boolean {
        return Utility.isUsable(diffuseIblMap) && Utility.isUsable(specularIblMap) && Utility.isUsable(this.brdfLut);
    }

    private loadTextures(diffuseIblMap: CubeMapTexture, specularIblMap: CubeMapTexture): void {
        this.shaderProgram.connectTextureUnit(this.DIFFUSE_IBL_MAP_NAME, this.DIFFUSE_IBL_TEXTURE_UNIT);
        diffuseIblMap.bindToTextureUnit(this.DIFFUSE_IBL_TEXTURE_UNIT);
        this.shaderProgram.connectTextureUnit(this.SPECULAR_IBL_MAP_NAME, this.SPECULAR_IBL_TEXTURE_UNIT);
        specularIblMap.bindToTextureUnit(this.SPECULAR_IBL_TEXTURE_UNIT);
        this.shaderProgram.connectTextureUnit(this.BRDF_LUT_MAP_NAME, this.BRDF_LUT_TEXTURE_UNIT);
        this.brdfLut.bindToTextureUnit(this.BRDF_LUT_TEXTURE_UNIT);
        this.shaderProgram.loadBoolean(this.ARE_THERE_IBL_MAPS, true);
        this.shaderProgram.loadFloat('specularIblLodCount', this.SPECULAR_IBL_LOD_COUNT);
    }

    private loadDefaultTextures(): void {
        this.loadDefaultCubeMapTexture(this.DIFFUSE_IBL_MAP_NAME, this.DIFFUSE_IBL_TEXTURE_UNIT);
        this.loadDefaultCubeMapTexture(this.SPECULAR_IBL_MAP_NAME, this.SPECULAR_IBL_TEXTURE_UNIT);
        this.loadDefaultTexture2D(this.BRDF_LUT_MAP_NAME, this.BRDF_LUT_TEXTURE_UNIT);
        this.shaderProgram.loadBoolean(this.ARE_THERE_IBL_MAPS, false);
    }

    private loadDefaultTexture2D(mapName: string, textureUnit: number): void {
        const texture = Engine.getParameters().get(Engine.BLACK_TEXTURE_2D);
        this.shaderProgram.connectTextureUnit(mapName, textureUnit);
        texture.bindToTextureUnit(textureUnit);
    }

    private loadDefaultCubeMapTexture(mapName: string, textureUnit: number): void {
        const texture = Engine.getParameters().get(Engine.DEFAULT_CUBE_MAP_TEXTURE);
        this.shaderProgram.connectTextureUnit(mapName, textureUnit);
        texture.bindToTextureUnit(textureUnit);
    }

}