import { ITimeManager } from './ITimeManager';

export class TimeManager implements ITimeManager {

    private readonly ONE_SECOND = 1000;
    private readonly START_MOMENT = performance.now();
    private currentFps = 0;
    private lastFps = 0;
    private frameTimeSum = 0;
    private lastFrameTime = 0;
    private lastFrameMoment = this.START_MOMENT;
    private frameCount = 0;

    public endFrame(): void {
        this.refreshDeltaTimeFactor();
        this.refreshFps();
    }

    private refreshDeltaTimeFactor(): void {
        const currentMoment = performance.now();
        this.lastFrameTime = currentMoment - this.lastFrameMoment;
        this.frameTimeSum += this.lastFrameTime;
        this.lastFrameMoment = currentMoment;
    }

    private refreshFps(): void {
        this.frameCount++;
        this.currentFps++;
        if (this.frameTimeSum >= this.ONE_SECOND) {
            this.lastFps = Math.round(this.currentFps / this.frameTimeSum * this.ONE_SECOND);
            this.frameTimeSum = 0;
            this.currentFps = 0;
        }
    }

    public getDeltaTimeFactor(): number {
        return this.lastFrameTime;
    }

    public getFps(): number {
        return this.lastFps;
    }

    public getTimeInMillisecs(): number {
        const currentMoment = performance.now();
        return currentMoment - this.START_MOMENT;
    }

    public getTimeInSecs(): number {
        return this.getTimeInMillisecs() / this.ONE_SECOND;
    }

    public getFrameCount(): number {
        return this.frameCount;
    }

}