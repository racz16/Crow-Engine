import { vec2 } from "gl-matrix";
import { InternalFormat } from "../enum/InternalFormat";

export interface IFboAttachment {

    getSize(): vec2;

    getInternalFormat(): InternalFormat;

    isAllocated(): boolean;

    isMultisampled(): boolean;

    getSampleCount(): number;

    isUsable(): boolean;

}
