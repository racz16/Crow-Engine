import { FrustumCornerPoint, FrustumCornerPointResolver } from "./FrustumCornerPoint";
import { vec3, mat4, vec4 } from "gl-matrix";
import { ICameraComponent } from "../ICameraComponent";
import { FrustumPlane } from "./FrustumPlane";
import { FrustumSide, FrustumSideResolver } from "./FrustumSide";
import { IFrustum } from "./IFrustum";

export class Frustum implements IFrustum {

    private readonly planes = new Map<FrustumSide, FrustumPlane>();
    private readonly cornerPoints = new Map<FrustumCornerPoint, vec3>();
    private centerPoint: vec3;
    private readonly camera: ICameraComponent;
    private IP: mat4;
    private IV: mat4;

    public constructor(camera: ICameraComponent) {
        this.camera = camera;
    }

    public getCenterPoint(): vec3 {
        return vec3.clone(this.centerPoint);
    }

    public getCornerPointsIterator(): IterableIterator<vec3> {
        return this.cornerPoints.values();
    }

    public getCornerPoint(cornerPoint: FrustumCornerPoint): vec3 {
        return vec3.clone(this.cornerPoints.get(cornerPoint));
    }

    public getPlanesIterator(): IterableIterator<FrustumPlane> {
        return this.planes.values();
    }

    public getPlane(side: FrustumSide): FrustumPlane {
        return this.planes.get(side);
    }

    public refresh(): void {
        this.IP = mat4.invert(mat4.create(), this.camera.getProjectionMatrix());
        this.IV = mat4.invert(mat4.create(), this.camera.getViewMatrix());
        this.refreshCornerPoints();
        this.refreshCenterPoint();
        this.refreshPlanes();
    }

    private refreshCornerPoints(): void {
        for (let i = 0; i < 8; i++) {
            const cp = FrustumCornerPointResolver.get(i);
            this.cornerPoints.set(cp, this.computeWorldSpaceCornerPoint(cp));
        }
    }

    private computeWorldSpaceCornerPoint(cp: FrustumCornerPoint): vec3 {
        const ndcPosition = FrustumCornerPointResolver.getNDCPosition(cp);
        const viewSpacePosition = vec4.transformMat4(vec4.create(), ndcPosition, this.IP);
        vec4.scale(viewSpacePosition, viewSpacePosition, 1 / viewSpacePosition[3]);
        const worldSpacePosition = vec4.transformMat4(vec4.create(), viewSpacePosition, this.IV);
        return vec3.fromValues(worldSpacePosition[0], worldSpacePosition[1], worldSpacePosition[2]);
    }

    private refreshCenterPoint(): void {
        const ftl = this.cornerPoints.get(FrustumCornerPoint.FAR_TOP_LEFT);
        const nbr = this.cornerPoints.get(FrustumCornerPoint.NEAR_BOTTOM_RIGHT);
        this.centerPoint = vec3.fromValues((ftl[0] + nbr[0]) / 2, (ftl[1] + nbr[1]) / 2, (ftl[2] + nbr[2]) / 2);
    }

    private refreshPlanes(): void {
        for (let i = 0; i < 6; i++) {
            const fs = FrustumSideResolver.get(i);
            const cps = FrustumSideResolver.getCornerPoints(fs);
            this.planes.set(fs, this.transformCornerPointsToPlane(
                this.cornerPoints.get(cps[0]),
                this.cornerPoints.get(cps[1]),
                this.cornerPoints.get(cps[2])
            ));
        }
    }

    private transformCornerPointsToPlane(p0: vec3, p1: vec3, p2: vec3): FrustumPlane {
        const v1 = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), p1, p0));
        const v2 = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), p2, p0));
        const normalVector = vec3.cross(vec3.create(), v1, v2);
        return new FrustumPlane(normalVector, p0);
    }

    public isUsable(): boolean {
        return this.camera != null;
    }

}