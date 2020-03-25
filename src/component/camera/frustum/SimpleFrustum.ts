import { FrustumCornerPoint, FrustumCornerPointResolver } from './FrustumCornerPoint';
import { vec3, mat4, vec4 } from 'gl-matrix';
import { FrustumPlane } from './FrustumPlane';
import { FrustumSide, FrustumSideResolver } from './FrustumSide';
import { Utility } from '../../../utility/Utility';
import { Frustum } from './Frustum';
import { Log } from '../../../utility/log/Log';
import { LogLevel } from '../../../utility/log/LogLevel';

export class SimpleFrustum extends Frustum {

    private readonly planes = new Map<FrustumSide, FrustumPlane>();
    private readonly cornerPoints = new Map<FrustumCornerPoint, vec3>();
    private centerPoint: vec3;
    private IP: mat4;
    private IV: mat4;
    private valid = false;

    public getCenterPoint(): vec3 {
        if (this.isUsable()) {
            this.refresh();
            return vec3.clone(this.centerPoint);
        } else {
            return null;
        }
    }

    public getCornerPointsIterator(): IterableIterator<vec3> {
        if (this.isUsable()) {
            this.refresh();
            return Utility.cloneVec3(this.cornerPoints.values()).values();
        } else {
            return null;
        }
    }

    public getCornerPoint(cornerPoint: FrustumCornerPoint): vec3 {
        if (!cornerPoint) {
            throw new Error();
        }
        if (this.isUsable()) {
            this.refresh();
            return vec3.clone(this.cornerPoints.get(cornerPoint));
        } else {
            return null;
        }
    }

    public getPlanesIterator(): IterableIterator<FrustumPlane> {
        if (this.isUsable()) {
            this.refresh();
            return this.planes.values();
        } else {
            return null;
        }
    }

    public getPlane(side: FrustumSide): FrustumPlane {
        if (!side) {
            throw new Error();
        }
        if (this.isUsable()) {
            this.refresh();
            return this.planes.get(side);
        } else {
            return null;
        }
    }

    private refresh(): void {
        if (!this.valid) {
            this.IP = mat4.invert(mat4.create(), this.cameraComponent.getProjectionMatrix());
            this.IV = this.computeInverseViewMatrix();
            this.refreshCornerPoints();
            this.refreshCenterPoint();
            this.refreshPlanes();
            this.valid = true;
            Log.logString(LogLevel.INFO_3, 'Camera frustum refreshed');
        }
    }

    private computeInverseViewMatrix(): mat4 {
        const transform = this.cameraComponent.getGameObject().getTransform();
        const position = transform.getAbsolutePosition();
        const rotation = transform.getAbsoluteRotation();
        return Utility.computeInverseViewMatrix(position, rotation);
    }

    private refreshCornerPoints(): void {
        for (let i = 0; i < 8; i++) {
            const cp = FrustumCornerPointResolver.get(i);
            const ndcPosition = FrustumCornerPointResolver.getNdcPosition(cp);
            const worldSpacePosition = Utility.computeoWorldSpacePosition(ndcPosition, this.IP, this.IV);
            this.cornerPoints.set(cp, vec3.fromValues(worldSpacePosition[0], worldSpacePosition[1], worldSpacePosition[2]));
        }
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

    public invalidate(sender?: any): void {
        this.valid = false;
    }

    private isUsable(): boolean {
        return this.cameraComponent && this.cameraComponent.getGameObject() != null;
    }

}