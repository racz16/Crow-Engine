import { mat4, vec3 } from "gl-matrix";
import { IResource } from "../resource/IResource";
import { Gl } from "../webgl/Gl";

export class Utility {

    private constructor() { }

    public static computeModelMatrix(position: vec3, rotation: vec3, scale: vec3): mat4 {
        let model = mat4.create();
        mat4.translate(model, model, position);
        mat4.rotateZ(model, model, Utility.toRadians(rotation[2]));
        mat4.rotateY(model, model, Utility.toRadians(rotation[1]));
        mat4.rotateX(model, model, Utility.toRadians(rotation[0]));
        mat4.scale(model, model, scale);
        return model;
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

    public static computePerspectiveProjectionMatrix(fov: number, nearPlane: number, farPlane: number): mat4 {
        if (fov <= 0 || fov >= 180 || nearPlane <= 0 || farPlane <= nearPlane) {
            throw new Error();
        }
        const aspectRatio = Utility.getAspectRatio();
        return mat4.perspective(mat4.create(), this.toRadians(fov), aspectRatio, nearPlane, farPlane);
    }

    public static getAspectRatio(): number {
        return Gl.getCanvas().clientWidth / Gl.getCanvas().clientHeight;;
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

    public static contains<T>(array: Array<T>, element: T): boolean {
        return array.indexOf(element) !== -1;
    }

    public static copy<T>(array: Array<T>): Array<T> {
        let ret = new Array<T>();
        for (const element of array) {
            ret.push(element);
        }
        return ret;
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

    public static loadResource<T>(path: string, callback: (resource: T) => void, async?: boolean, responseType?: XMLHttpRequestResponseType): void {
        const xhttp = new XMLHttpRequest();
        if (responseType) {
            xhttp.responseType = responseType;
        }
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(xhttp.response);
            }
        }
        xhttp.open("GET", path, async);
        xhttp.send();
    }

}
