import { RendererContainer } from './RendererContainer';
import { GeometryRenderer } from './GeometryRenderer';
import { PostProcessRenderer } from './PostProcessRenderer';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { vec2 } from 'gl-matrix';
import { IRenderableContainer } from '../core/IRenderableContainer';

export interface IRenderingPipeline {

    getGeometryRendererContainer(): RendererContainer<GeometryRenderer>;

    getPostProcessRendererContainer(): RendererContainer<PostProcessRenderer>;

    getRenderableContainer(): IRenderableContainer;

    getParameters(): ParameterContainer;

    getRenderingScale(): number;

    setRenderingScale(renderingScale: number): void;

    getRenderingSize(): vec2;

    getRenderedFaceCount(): number;

    getRenderedElementCount(): number;

    bindFbo(): void;

    render(): void;

}