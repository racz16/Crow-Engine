export class Time {

    private static readonly ONE_SECOND = 1000;
    private static readonly START_MOMENT = performance.now();
    private static currentFps = 0;
    private static lastFps = 0;
    private static frameTimeSum = 0;
    private static lastFrameTime = 0;
    private static lastFrameMoment = Time.START_MOMENT;
    private static frameCount = 0;

    private constructor() { }

    private static update(): void {
        this.refreshDeltaTimeFactor();
        this.refreshFps();
    }

    private static refreshDeltaTimeFactor(): void {
        const currentMoment = performance.now();
        this.lastFrameTime = currentMoment - this.lastFrameMoment;
        this.frameTimeSum += this.lastFrameTime;
        this.lastFrameMoment = currentMoment;
    }

    private static refreshFps(): void {
        this.frameCount++;
        this.currentFps++;
        if (this.frameTimeSum >= this.ONE_SECOND) {
            this.lastFps = Math.round(this.currentFps / this.frameTimeSum * this.ONE_SECOND);
            this.frameTimeSum = 0;
            this.currentFps = 0;
        }
    }

    public static getDeltaTimeFactor(): number {
        return this.lastFrameTime;
    }

    public static getFps(): number {
        return this.lastFps;
    }

    public static getTimeInMillisecs(): number {
        const currentMoment = performance.now();
        return currentMoment - this.START_MOMENT;
    }

    public static getTimeInSecs(): number {
        return this.getTimeInMillisecs() / this.ONE_SECOND;
    }

    public static getFrameCount(): number {
        return this.frameCount;
    }

}