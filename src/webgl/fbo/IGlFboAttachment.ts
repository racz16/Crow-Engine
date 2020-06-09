import { vec2 } from 'gl-matrix';
import { GlInternalFormat } from '../enum/GlInternalFormat';

export interface IGlFboAttachment {

    getSize(): vec2;

    getInternalFormat(): GlInternalFormat;

    isAllocated(): boolean;

    isMultisampled(): boolean;

    getSampleCount(): number;

    isUsable(): boolean;

    getDataSize(): number;

    getAllDataSize(): number;

}
