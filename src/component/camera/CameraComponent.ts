import { Component } from "../../core/Component";
import { ICamera } from "./ICamera";
import { Ubo } from "../../webgl/buffer/Ubo";
import { mat4 } from "gl-matrix";
import { Scene } from "../../core/Scene";
import { BufferObjectUsage } from "../../webgl/enum/BufferObjectUsage";
import { Utility } from "../../utility/Utility";
import { GameObject } from "../../core/GameObject";
import { Log } from "../../utility/log/Log";

export class CameraComponent extends Component implements ICamera {

    private static ubo: Ubo;
    private static camera: CameraComponent;
    private viewMatrix: mat4;
    private projectionMatrix: mat4;
    //private final HashMap<CornerPoint, Vector3f> cornerPoints = new HashMap<>();
    //private final Vector3f center = new Vector3f();
    protected valid: boolean;
    private nearPlaneDistance: number;
    private farPlaneDistance: number;
    private fov: number;
    //private boolean frustumCulling = true;
    private uboInitialized = false;

    public constructor(fov = 45, nearPlane = 0.1, farPlane = 200) {
        super();
        if (!this.uboInitialized) {
            CameraComponent.createUbo();
            this.uboInitialized = true;
        }
        this.setFov(fov);
        this.setNearPlaneDistance(nearPlane);
        this.setFarPlaneDistance(farPlane);
        /*for(CornerPoint cp : CornerPoint.values()){
            cornerPoints.put(cp, new Vector3f());
        }*/
    }

    public static refreshMatricesUbo(): void {
        if (CameraComponent.camera != null) {
            CameraComponent.createUbo();
            CameraComponent.refreshUboUnsafe();
        }
    }

    private static createUbo(): void {
        if (!CameraComponent.isCameraUboUsable()) {
            CameraComponent.createUboUnsafe();
        }
    }

    private static refreshUboUnsafe(): void {
        CameraComponent.ubo.store(new Float32Array(CameraComponent.camera.getViewMatrix()));
        CameraComponent.ubo.storewithOffset(new Float32Array(CameraComponent.camera.getProjectionMatrix()), Ubo.MAT4_SIZE);
        CameraComponent.ubo.storewithOffset(new Float32Array(CameraComponent.camera.getGameObject().getTransform().getAbsolutePosition()), 2 * Ubo.MAT4_SIZE);
        CameraComponent.camera = null;
        Log.resourceInfo('matrices ubo refreshed');
    }

    public static makeCameraUboUsable(): void {
        CameraComponent.createUbo();
        CameraComponent.refreshMatricesUbo();
    }

    private static createUboUnsafe(): void {
        CameraComponent.ubo = new Ubo();
        CameraComponent.ubo.allocate(140, BufferObjectUsage.STATIC_DRAW);
        CameraComponent.ubo.bindToBindingPoint(Scene.CAMERA_BINDING_POINT);
        Log.resourceInfo('matrices ubo created');
    }

    public static releaseCameraUbo(): void {
        CameraComponent.invalidateMainCamera();
        if (CameraComponent.isCameraUboUsable()) {
            CameraComponent.ubo.release();
            CameraComponent.ubo = null;
            Log.resourceInfo('matrices ubo released');
        }
    }

    public static isCameraUboUsable(): boolean {
        return !Utility.isReleased(CameraComponent.ubo);
    }

    private static invalidateMainCamera(): void {
        const cam = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
        if (cam != null) {
            cam.invalidate();
        }
    }

    public getFov(): number {
        return this.fov;
    }

    public setFov(fov: number): void {
        if (fov <= 0 || fov >= 180) {
            throw new Error();
        }
        this.fov = fov;
        this.invalidate();
    }

    public getNearPlaneDistance(): number {
        return this.nearPlaneDistance;
    }

    public setNearPlaneDistance(nearPlaneDistance: number): void {
        if (nearPlaneDistance <= 0 || nearPlaneDistance >= this.farPlaneDistance) {
            throw new Error();
        }
        this.nearPlaneDistance = nearPlaneDistance;
        this.invalidate();
    }

    public getFarPlaneDistance(): number {
        return this.farPlaneDistance;
    }

    public setFarPlaneDistance(farPlaneDistance: number): void {
        if (this.nearPlaneDistance >= farPlaneDistance) {
            throw new Error();
        }
        this.farPlaneDistance = farPlaneDistance;
        this.invalidate();
    }

    public invalidate(): void {
        this.valid = false;
        super.invalidate();
        if (this.isTheMainCamera()) {
            CameraComponent.camera = this;
        }
    }

    protected refresh(): void {
        if (!this.valid) {
            this.refreshProjectionMatrix();
            this.refreshViewMatrixAndFrustum();
            this.valid = true;
        }
    }

    private refreshProjectionMatrix(): void {
        this.projectionMatrix = Utility.computePerspectiveProjectionMatrix(this.fov, this.nearPlaneDistance, this.farPlaneDistance);
    }

    private refreshViewMatrixAndFrustum(): void {
        if (this.getGameObject() != null) {
            this.viewMatrix = Utility.computeViewMatrix(
                this.getGameObject().getTransform().getAbsolutePosition(),
                this.getGameObject().getTransform().getAbsoluteRotation());
            //frustum.set(new Matrix4f(projectionMatrix).mul(viewMatrix));
            //refreshFrustumVertices();
        }
    }

    public getViewMatrix(): mat4 {
        if (this.getGameObject() != null) {
            this.refresh();
            return mat4.clone(this.viewMatrix);
        } else {
            return null;
        }
    }

    public getProjectionMatrix(): mat4 {
        this.refresh();
        return mat4.clone(this.projectionMatrix);
    }

    public isTheMainCamera(): boolean {
        return Scene.getParameters().getValue(Scene.MAIN_CAMERA) == this;
    }

    public private_detachFromGameObject(): void {
        this.getGameObject().getTransform().removeInvalidatable(this);
        super.private_detachFromGameObject();
        this.invalidate();
    }

    public private_attachToGameObject(g: GameObject): void {
        super.private_attachToGameObject(g);
        this.getGameObject().getTransform().addInvalidatable(this);
        this.invalidate();
    }

    /*public boolean isFrustumCulling() {
        return frustumCulling;
    }

    public void setFrustumCulling(boolean frustumCulling) {
        this.frustumCulling = frustumCulling;
    }*/

    /*private void refreshFrustumVertices() {
        refreshFrustumCornerPoints();
        refreshFrustumCenterPoint();
    }

    private void refreshFrustumCornerPoints() {
        Matrix4f inverseViewProjectionMatrix = computeInverseViewProjectionMatrix();
        Vector4f vec = new Vector4f();
        for (CornerPoint cp : CornerPoint.values()) {
            vec.set(cp.getClipSpacePosition().mul(inverseViewProjectionMatrix));
            vec.div(vec.w);
            cornerPoints.get(cp).set(vec.x, vec.y, vec.z);
        }
    }

    private void refreshFrustumCenterPoint() {
        center.set(0, 0, 0);
        for (CornerPoint cp : CornerPoint.values()) {
            center.add(cornerPoints.get(cp));
        }
        center.div(8);
    }*/

    /*private computeInverseViewProjectionMatrix(): mat4 {
        if (projectionMode == ProjectionMode.PERSPECTIVE) {
        return projectionMatrix.invertPerspectiveView(viewMatrix, new Matrix4f());
        } else {
            return projectionMatrix.mulAffine(viewMatrix, new Matrix4f()).invertAffine();
        }
    }*/

    /*public boolean isInsideFrustum(@NotNull Vector3f position, float radius) {
        if (position == null) {
            throw new NullPointerException();
        }
        if (radius < 0) {
            throw new IllegalArgumentException("Radius can't be negative");
        }
        return isInsideFrustumUnsafe(position, radius);
    }

    private boolean isInsideFrustumUnsafe(@NotNull Vector3f position, float radius) {
        if (isFrustumCulling() && getGameObject() != null) {
            refresh();
            return frustum.testSphere(position, radius);
        } else {
            return true;
        }
    }

    public boolean isInsideFrustum(@NotNull Vector3f aabbMin, @NotNull Vector3f aabbMax) {
        if (aabbMin == null || aabbMax == null) {
            throw new NullPointerException();
        }
        return isInsideFrustumUnsafe(aabbMin, aabbMax);
    }

    private boolean isInsideFrustumUnsafe(@NotNull Vector3f aabbMin, @NotNull Vector3f aabbMax) {
        if (isFrustumCulling() && getGameObject() != null) {
            refresh();
            return frustum.testAab(aabbMin, aabbMax);
        } else {
            return true;
        }
    }

    public Map<CornerPoint, Vector3f> getFrustumCornerPoints() {
        Map < CornerPoint, Vector3f > ret = new HashMap<>(8);
        if (getGameObject() != null) {
            ret.putAll(cornerPoints);
        }
        return ret;
    }

    public Vector3f getFrustumCornerPoint(@NotNull CornerPoint cornerPoint) {
        if (cornerPoint == null) {
            throw new NullPointerException();
        }
        return getFrustumCornerPointUnsafe(cornerPoint);
    }

    private Vector3f getFrustumCornerPointUnsafe(@NotNull CornerPoint cornerPoint) {
        if (getGameObject() != null) {
            refresh();
            return new Vector3f(cornerPoints.get(cornerPoint));
        } else {
            return null;
        }
    }

    public Vector3f getFrustumCenter() {
        if (getGameObject() != null) {
            refresh();
            return new Vector3f(center);
        } else {
            return null;
        }
    }*/

}
