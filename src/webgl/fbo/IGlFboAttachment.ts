import { ReadonlyVec2 } from 'gl-matrix';
import { GlInternalFormat } from '../enum/GlInternalFormat';

export interface IGlFboAttachment {

    getSize(): ReadonlyVec2;

    getInternalFormat(): GlInternalFormat;

    isAllocated(): boolean;

    isMultisampled(): boolean;

    getSampleCount(): number;

    isUsable(): boolean;

    getDataSize(): number;

    getAllDataSize(): number;

}
