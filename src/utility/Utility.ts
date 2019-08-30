import { mat4, vec3, vec4 } from 'gl-matrix';
import { IResource } from '../resource/IResource';
import { Gl } from '../webgl/Gl';

export class Utility {

    private constructor() { }

    public static isParallel(a: vec3, b: vec3): boolean {
        const dot = vec3.dot(a, b);
        return dot === 1 || dot === -1;
    }

    public static computeModelMatrix(position: vec3, rotation: vec3, scale: vec3): mat4 {
        let model = mat4.create();
        mat4.translate(model, model, position);
        mat4.rotateZ(model, model, Utility.toRadians(rotation[2]));
        mat4.rotateY(model, model, Utility.toRadians(rotation[1]));
        mat4.rotateX(model, model, Utility.toRadians(rotation[0]));
        mat4.scale(model, model, scale);
        return model;
    }

    public static computeModelMatrixFromDirectionVectorsAndPosition(forward: vec3, up: vec3, right: vec3, position: vec3): mat4 {
        return mat4.fromValues(
            right[0], right[1], right[2], 0,
            up[0], up[1], up[2], 0,
            forward[0], forward[1], forward[2], 0,
            position[0], position[1], position[2], 1
        );
    }

    public static computeInverseModelMatrix(position: vec3, rotation: vec3, scale: vec3): mat4 {
        let model = mat4.create();
        mat4.scale(model, model, vec3.div(vec3.create(), vec3.fromValues(1, 1, 1), scale));
        mat4.rotateX(model, model, Utility.toRadians(-rotation[0]));
        mat4.rotateY(model, model, Utility.toRadians(-rotation[1]));
        mat4.rotateZ(model, model, Utility.toRadians(-rotation[2]));
        mat4.translate(model, model, vec3.negate(vec3.create(), position));
        return model;
    }

    public static computeViewMatrix(position: vec3, rotation: vec3): mat4 {
        return Utility.computeInverseModelMatrix(position, rotation, vec3.fromValues(1, 1, 1));
    }

    public static computeInverseViewMatrix(position: vec3, rotation: vec3): mat4 {
        return Utility.computeModelMatrix(position, rotation, vec3.fromValues(1, 1, 1));
    }

    public static computePerspectiveProjectionMatrix(fov: number, aspectRatio: number, nearPlane: number, farPlane: number): mat4 {
        if (fov <= 0 || fov >= 180 || nearPlane <= 0 || farPlane <= nearPlane || aspectRatio <= 0) {
            throw new Error();
        }
        return mat4.perspective(mat4.create(), this.toRadians(fov), aspectRatio, nearPlane, farPlane);
    }

    public static getCanvasAspectRatio(): number {
        return Gl.getCanvas().clientWidth / Gl.getCanvas().clientHeight;
    }

    public static toRadians(angle: number): number {
        return angle / 180 * Math.PI;
    }

    public static toDegrees(angle: number): number {
        return angle * 180 / Math.PI;
    }

    public static removeElement<T>(array: Array<T>, index: number): void {
        array.splice(index, 1);
    }

    public static isUsable(resource: IResource): boolean {
        return resource && resource.isUsable();
    }

    public static isColor(data: vec3): boolean {
        return data[0] >= 0 && data[1] >= 0 && data[2] >= 0;
    }

    public static getMaxCoordinate(vector: vec3): number {
        let max = Number.NEGATIVE_INFINITY;
        for (const coordinate of vector) {
            if (coordinate > max) {
                max = coordinate;
            }
        }
        return max;
    }

    public static cloneVec3(vectors: IterableIterator<vec3>): Array<vec3> {
        const newArray = new Array<vec3>();
        for (const vector of vectors) {
            const newVector = vec3.clone(vector);
            newArray.push(newVector);
        }
        return newArray;
    }

    public static cloneVec4(vectors: IterableIterator<vec4>): Array<vec4> {
        const newArray = new Array<vec4>();
        for (const vector of vectors) {
            const newVector = vec4.clone(vector);
            newArray.push(newVector);
        }
        return newArray;
    }

}
