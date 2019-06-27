import { ICameraComponent } from "../component/camera/ICameraComponent";
import { vec3, mat4, vec4 } from "gl-matrix";
import { GameObject } from "../core/GameObject";
import { Scene } from "../core/Scene";
import { Utility } from "./Utility";

export class ShadowMapMatrixSolver {

    private static camera: ICameraComponent;
    private static lightRight: vec3;
    private static lightUp: vec3;
    private static lightPosition: vec3;
    private static lightRotation: vec3;
    private static lightSpaceXMax: number;
    private static lightSpaceXMin: number;
    private static lightSpaceYMax: number;
    private static lightSpaceYMin: number;

    private ShadowMapMatrixSolver() {
    }

    public static computeMatrix(dirLight: GameObject, distance: number, nearDistance: number, farDistance: number): mat4 {
        this.initializeCamera();
        this.initializeLight(dirLight, distance);
        this.initializeMinMax();
        this.refreshMinMaxValues();
        this.refreshLightPosition();
        return this.computeResult(nearDistance, farDistance);
    }

    private static initializeCamera(): void {
        this.camera = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
    }

    private static initializeLight(lightGameObject: GameObject, distance: number): void {
        this.lightRight = lightGameObject.getTransform().getRightVector();
        this.lightUp = lightGameObject.getTransform().getUpVector();
        this.lightRotation = lightGameObject.getTransform().getAbsoluteRotation();
        //this.lightPosition = this.camera.getFrustumCenter().add(lightGameObject.getTransform().getForwardVector().negate().mul(distance));
    }

    private static initializeMinMax(): void {
        this.lightSpaceXMax = Number.NEGATIVE_INFINITY;
        this.lightSpaceXMin = Number.POSITIVE_INFINITY;
        this.lightSpaceYMax = Number.NEGATIVE_INFINITY;
        this.lightSpaceYMin = Number.POSITIVE_INFINITY;
    }

    private static refreshMinMaxValues(): void {
        const vec = vec4.create();
        /*const lightSpaceMatrix = this.computeViewMatrix(lightPosition, lightRotation);
        for (const cp of Camera.CornerPoint.values()) {
            vec.set(this.camera.getFrustumCornerPoint(cp), 1).mul(lightSpaceMatrix);
            this.refreshMinValues(vec[0], vec[1]);
            this.refreshMaxValues(vec[0], vec[1]);
        }*/
    }

    private static refreshMinValues(x: number, y: number): void {
        if (x < this.lightSpaceXMin) {
            this.lightSpaceXMin = x;
        }
        if (y < this.lightSpaceYMin) {
            this.lightSpaceYMin = y;
        }
    }

    private static refreshMaxValues(x: number, y: number): void {
        if (x > this.lightSpaceXMax) {
            this.lightSpaceXMax = x;
        }
        if (y > this.lightSpaceYMax) {
            this.lightSpaceYMax = y;
        }
    }

    private static refreshLightPosition(): void {
        let compensation = (this.lightSpaceXMax + this.lightSpaceXMin) / 2;
        //this.lightPosition.add(this.lightRight.mul(compensation));
        compensation = (this.lightSpaceYMax + this.lightSpaceYMin) / 2;
        //this.lightPosition.add(this.lightUp.mul(compensation));
    }

    private static computeResult(near: number, far: number): mat4 {
        const horizontalScale = (this.lightSpaceXMax - this.lightSpaceXMin) / 2;
        const verticalScale = (this.lightSpaceYMax - this.lightSpaceYMin) / 2;
        const lightProjectionMatrix = mat4.ortho(mat4.create(), -horizontalScale, horizontalScale, -verticalScale, verticalScale, near, far)
        const lightViewMatrix = Utility.computeViewMatrix(this.lightPosition, this.lightRotation);
        //return lightProjectionMatrix.mulOrthoAffine(lightViewMatrix);
        return null;
    }

}