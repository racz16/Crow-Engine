import { GlCubeMapTexture } from "../../webgl/texture/GlCubeMapTexture";
import { IResource } from "../IResource";

export interface ICubeMapTexture extends IResource {

    getNativeTexture(): GlCubeMapTexture;

    bindToTextureUnit(textureUnit: number): void;

}