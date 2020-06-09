import { Gl } from '../Gl';

export enum GlFboCompleteness {
    COMPLETE,
    INCOMPLETE_ATTACHMENT,
    INCOMPLETE_MISSING_ATTACHMENT,
    INCOMPLETE_DIMENSIONS,
    SAMPLES,
    UNSUPPORTED,
    INCOMPLETE_MULTISAMPLE,
}

export class GlFboCompletenessResolver {

    public static enumToGl(fboCompleteness: GlFboCompleteness): number {
        const gl = Gl.gl;
        switch (fboCompleteness) {
            case GlFboCompleteness.COMPLETE: return gl.FRAMEBUFFER_COMPLETE;
            case GlFboCompleteness.INCOMPLETE_ATTACHMENT: return gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT;
            case GlFboCompleteness.INCOMPLETE_MISSING_ATTACHMENT: return gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
            case GlFboCompleteness.INCOMPLETE_DIMENSIONS: return gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS;
            case GlFboCompleteness.SAMPLES: return gl.RENDERBUFFER_SAMPLES;
            case GlFboCompleteness.UNSUPPORTED: return gl.FRAMEBUFFER_UNSUPPORTED;
            case GlFboCompleteness.INCOMPLETE_MULTISAMPLE: return gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE;
            default: throw new Error('Invalid enum GlFboCompleteness');
        }
    }

    public static glToEnum(fboCompleteness: number): GlFboCompleteness {
        const gl = Gl.gl;
        switch (fboCompleteness) {
            case gl.FRAMEBUFFER_COMPLETE: return GlFboCompleteness.COMPLETE;
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: return GlFboCompleteness.INCOMPLETE_ATTACHMENT;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: return GlFboCompleteness.INCOMPLETE_MISSING_ATTACHMENT;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: return GlFboCompleteness.INCOMPLETE_DIMENSIONS;
            case gl.RENDERBUFFER_SAMPLES: return GlFboCompleteness.SAMPLES;
            case gl.FRAMEBUFFER_UNSUPPORTED: return GlFboCompleteness.UNSUPPORTED;
            case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: return GlFboCompleteness.INCOMPLETE_MULTISAMPLE;
            default: throw new Error('Invalid WebGL FBO completeness');
        }
    }

}