import { GltfAccessorType } from "./enum/GltfAccessorType";
import { GltfAccessorComponentType } from "./enum/GltfAccessorComponentType";
import { VertexAttribPointerType } from "../webgl/enum/VertexAttribPointerType";
import { GltfPrimitiveMode } from "./enum/GltfPrimitiveMode";
import { RenderingMode } from "../resource/RenderingMode";
import { IndicesType } from "../resource/IndicesType";
import { vec3 } from "gl-matrix";
import { GltfMinificationFilter } from "./enum/GltfMinificationFIlter";
import { MinificationFilter } from "../webgl/enum/MinificationFilter";
import { GltfMagnificationFilter } from "./enum/GltfMagnificationFilter";
import { MagnificationFilter } from "../webgl/enum/MagnificationFIlter";
import { GltfWrap } from "./enum/GltfWrap";
import { TextureWrap } from "../webgl/enum/TextureWrap";
import { GltfAlphaMode } from "./enum/GltfAlphaMode";
import { AlphaMode } from "../material/AlphaMode";

export class GltfResolver {

    public static computeSize(type: GltfAccessorType): number {
        switch (type) {
            case GltfAccessorType.SCALAR: return 1;
            case GltfAccessorType.VEC2: return 2;
            case GltfAccessorType.VEC3: return 3;
            case GltfAccessorType.VEC4: return 4;
            case GltfAccessorType.MAT2: return 4;
            case GltfAccessorType.MAT3: return 9;
            case GltfAccessorType.MAT4: return 16;
        }
    }

    public static computeType(componentType: GltfAccessorComponentType): VertexAttribPointerType {
        switch (componentType) {
            case GltfAccessorComponentType.BYTE: return VertexAttribPointerType.BYTE;
            case GltfAccessorComponentType.UNSIGNED_BYTE: return VertexAttribPointerType.UNSIGNED_BYTE;
            case GltfAccessorComponentType.SHORT: return VertexAttribPointerType.SHORT;
            case GltfAccessorComponentType.UNSIGNED_SHORT: return VertexAttribPointerType.UNSIGNED_SHORT;
            case GltfAccessorComponentType.UNSIGNED_INT: return VertexAttribPointerType.UNSIGNED_INT;
            case GltfAccessorComponentType.FLOAT: return VertexAttribPointerType.FLOAT;
        }
    }

    public static computeRadius(aabbMin: vec3, aabbMax: vec3): number {
        const position = vec3.fromValues(
            Math.max(Math.abs(aabbMin[0]), Math.abs(aabbMax[0])),
            Math.max(Math.abs(aabbMin[1]), Math.abs(aabbMax[1])),
            Math.max(Math.abs(aabbMin[2]), Math.abs(aabbMax[2])),
        );
        return vec3.length(position);
    }

    public static computeRenderingMode(mode: GltfPrimitiveMode): RenderingMode {
        switch (mode) {
            case GltfPrimitiveMode.POINTS: return RenderingMode.POINTS;
            case GltfPrimitiveMode.LINES: return RenderingMode.LINES;
            case GltfPrimitiveMode.LINE_LOOP: return RenderingMode.LINE_LOOP;
            case GltfPrimitiveMode.LINE_STRIP: return RenderingMode.LINE_STRIP;
            case GltfPrimitiveMode.TRIANGLES: return RenderingMode.TRIANGLES;
            case GltfPrimitiveMode.TRIANGLE_STRIP: return RenderingMode.TRIANGLE_STRIP;
            case GltfPrimitiveMode.TRIANGLE_FAN: return RenderingMode.TRIANGLE_FAN;
            default: return RenderingMode.TRIANGLES;
        }
    }

    public static computeIndicesType(type: GltfAccessorComponentType): IndicesType {
        switch (type) {
            case GltfAccessorComponentType.UNSIGNED_BYTE: return IndicesType.UNSIGNED_BYTE;
            case GltfAccessorComponentType.UNSIGNED_SHORT: return IndicesType.UNSIGNED_SHORT;
            case GltfAccessorComponentType.UNSIGNED_INT: return IndicesType.UNSIGNED_INT;
        }
    }

    public static computeFaceCount(vertexCount: number, mode: GltfPrimitiveMode): number {
        switch (mode) {
            case GltfPrimitiveMode.POINTS:
            case GltfPrimitiveMode.LINES:
            case GltfPrimitiveMode.LINE_LOOP:
            case GltfPrimitiveMode.LINE_STRIP: return 0;
            case GltfPrimitiveMode.TRIANGLES: return vertexCount / 3;
            case GltfPrimitiveMode.TRIANGLE_STRIP:
            case GltfPrimitiveMode.TRIANGLE_FAN: return vertexCount - 2;
            default: return vertexCount / 3
        }
    }

    public static computeBoundingBox(values: Array<number>, componentType: GltfAccessorComponentType): vec3 {
        if (componentType === GltfAccessorComponentType.FLOAT) {
            return vec3.fromValues(Math.fround(values[0]), Math.fround(values[1]), Math.fround(values[2]));
        } else {
            return vec3.fromValues(values[0], values[1], values[2]);
        }
    }

    public static computeMinificationFilter(minFilter: GltfMinificationFilter): MinificationFilter {
        switch (minFilter) {
            case GltfMinificationFilter.NEAREST: return MinificationFilter.NEAREST;
            case GltfMinificationFilter.LINEAR: return MinificationFilter.LINEAR;
            case GltfMinificationFilter.NEAREST_MIPMAP_NEAREST: return MinificationFilter.NEAREST_MIPMAP_NEAREST;
            case GltfMinificationFilter.NEAREST_MIPMAP_LINEAR: return MinificationFilter.NEAREST_MIPMAP_LINEAR;
            case GltfMinificationFilter.LINEAR_MIPMAP_NEAREST: return MinificationFilter.LINEAR_MIPMAP_NEAREST;
            case GltfMinificationFilter.LINEAR_MIPMAP_LINEAR: return MinificationFilter.LINEAR_MIPMAP_LINEAR;
            default: return MinificationFilter.LINEAR_MIPMAP_LINEAR;
        }
    }

    public static computeMagnificationFilter(magFilter: GltfMagnificationFilter): MagnificationFilter {
        switch (magFilter) {
            case GltfMagnificationFilter.NEAREST: return MagnificationFilter.NEAREST;
            case GltfMagnificationFilter.LINEAR: return MagnificationFilter.LINEAR;
            default: return MagnificationFilter.LINEAR;
        }
    }

    public static computeWrap(wrap: GltfWrap): TextureWrap {
        switch (wrap) {
            case GltfWrap.CLAMP_TO_EDGE: return TextureWrap.CLAMP_TO_EDGE;
            case GltfWrap.MIRRORED_REPEAT: return TextureWrap.MIRRORED_REPEAT;
            case GltfWrap.REPEAT: return TextureWrap.REPEAT;
            default: return TextureWrap.REPEAT;
        }
    }

    public static computeAlphaMode(alphaMode: GltfAlphaMode): AlphaMode {
        switch (alphaMode) {
            case GltfAlphaMode.OPAQUE: return AlphaMode.OPAQUE;
            case GltfAlphaMode.MASK: return AlphaMode.MASK;
            case GltfAlphaMode.BLEND: return AlphaMode.BLEND;
            default: return AlphaMode.OPAQUE;
        }
    }

}