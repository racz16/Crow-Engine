import { Gl } from '../Gl';

export enum ErrorType {
    NO_ERROR,
    INVALID_ENUM,
    INVALID_VALUE,
    INVALID_OPERATION,
    INVALID_FRAMEBUFFER_OPERATION,
    OUT_OF_MEMORY,
}

export class ErrorTypeResolver {

    public static enumToGl(errorType: ErrorType): number {
        const gl = Gl.gl;
        switch (errorType) {
            case ErrorType.NO_ERROR: return gl.NO_ERROR;
            case ErrorType.INVALID_ENUM: return gl.INVALID_ENUM;
            case ErrorType.INVALID_VALUE: return gl.INVALID_VALUE;
            case ErrorType.INVALID_OPERATION: return gl.INVALID_OPERATION;
            case ErrorType.INVALID_FRAMEBUFFER_OPERATION: return gl.INVALID_FRAMEBUFFER_OPERATION;
            case ErrorType.OUT_OF_MEMORY: return gl.OUT_OF_MEMORY;
            default: throw new Error('Invalid enum ErrorType');
        }
    }

    public static glToEnum(errorType: number): ErrorType {
        const gl = Gl.gl;
        switch (errorType) {
            case gl.NO_ERROR: return ErrorType.NO_ERROR;
            case gl.INVALID_ENUM: return ErrorType.INVALID_ENUM;
            case gl.INVALID_VALUE: return ErrorType.INVALID_VALUE;
            case gl.INVALID_OPERATION: return ErrorType.INVALID_OPERATION;
            case gl.INVALID_FRAMEBUFFER_OPERATION: return ErrorType.INVALID_FRAMEBUFFER_OPERATION;
            case gl.OUT_OF_MEMORY: return ErrorType.OUT_OF_MEMORY;
            default: throw new Error('Invalid WebGL error type');
        }
    }

}