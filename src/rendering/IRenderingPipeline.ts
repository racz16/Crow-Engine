import { RendererContainer } from './RendererContainer';
import { GeometryRenderer } from './GeometryRenderer';
import { PostProcessRenderer } from './PostProcessRenderer';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ReadonlyVec2 } from 'gl-matrix';
import { IRenderableContainer } from '../core/IRenderableContainer';
import { GlFbo } from '../webgl/fbo/GlFbo';

export interface IRenderingPipeline {

    getGeometryRendererContainer(): RendererContainer<GeometryRenderer>;

    getPostProcessRendererContainer(): RendererContainer<PostProcessRenderer>;

    getRenderableContainer(): IRenderableContainer;

    getParameters(): ParameterContainer;

    getRenderingScale(): number;

    setRenderingScale(renderingScale: number): void;

    getRenderingSize(): ReadonlyVec2;

    getRenderedFaceCount(): number;

    getRenderedElementCount(): number;

    bindGeometryFbo(): void;

    getGeometryFbo(): GlFbo;

    bindPostProcessFbo(): void;

    getPostProcessFbo(): GlFbo;

    render(): void;

}