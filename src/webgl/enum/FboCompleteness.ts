import { Gl } from '../Gl';

export enum FboCompleteness {
    COMPLETE,
    INCOMPLETE_ATTACHMENT,
    INCOMPLETE_MISSING_ATTACHMENT,
    INCOMPLETE_DIMENSIONS,
    SAMPLES,
    UNSUPPORTED,
    INCOMPLETE_MULTISAMPLE,
}

export class FboCompletenessResolver {

    public static enumToGl(fboCompleteness: FboCompleteness): number {
        const gl = Gl.gl;
        switch (fboCompleteness) {
            case FboCompleteness.COMPLETE: return gl.FRAMEBUFFER_COMPLETE;
            case FboCompleteness.INCOMPLETE_ATTACHMENT: return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
            case FboCompleteness.INCOMPLETE_MISSING_ATTACHMENT: return gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
            case FboCompleteness.INCOMPLETE_DIMENSIONS: return gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
            case FboCompleteness.SAMPLES: return gl.RENDERBUFFER_SAMPLES;
            case FboCompleteness.UNSUPPORTED: return gl.FRAMEBUFFER_UNSUPPORTED;
            case FboCompleteness.INCOMPLETE_MULTISAMPLE: return gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE;
            default: throw new Error('Invalid enum FboCompleteness');
        }
    }

    public static glToEnum(fboCompleteness: number): FboCompleteness {
        const gl = Gl.gl;
        switch (fboCompleteness) {
            case gl.FRAMEBUFFER_COMPLETE: return FboCompleteness.COMPLETE;
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: return FboCompleteness.INCOMPLETE_ATTACHMENT;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: return FboCompleteness.INCOMPLETE_MISSING_ATTACHMENT;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: return FboCompleteness.INCOMPLETE_DIMENSIONS;
            case gl.RENDERBUFFER_SAMPLES: return FboCompleteness.SAMPLES;
            case gl.FRAMEBUFFER_UNSUPPORTED: return FboCompleteness.UNSUPPORTED;
            case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: return FboCompleteness.INCOMPLETE_MULTISAMPLE;
            default: throw new Error('Invalid WebGL FBO completeness');
        }
    }

}