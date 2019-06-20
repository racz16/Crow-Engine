export class Time {

    private static readonly ONE_SECOND = 1000;
    private static readonly TARGET_FPS = 60;
    private static readonly TARGET_FRAME_TIME = Time.ONE_SECOND / Time.TARGET_FPS;
    private static readonly START_MOMENT = performance.now();
    private static currentFps = 0;
    private static lastFps = 0;
    private static frameTimeSum = 0;
    private static lastFrameMoment = Time.START_MOMENT;
    private static deltaTimeFactor = 0;
    private static frameCount = 0;

    private constructor() { }

    public static private_update(): void {
        Time.refreshDeltaTimeFactor();
        Time.refreshFps();
    }

    private static refreshDeltaTimeFactor(): void {
        const currentMoment = performance.now();
        const lastFrameTime = currentMoment - Time.lastFrameMoment;
        Time.frameTimeSum += lastFrameTime;
        Time.deltaTimeFactor = lastFrameTime / Time.TARGET_FRAME_TIME;
        Time.lastFrameMoment = currentMoment;
    }

    private static refreshFps(): void {
        Time.frameCount++;
        Time.currentFps++;
        if (Time.frameTimeSum >= Time.ONE_SECOND) {
            Time.frameTimeSum = 0;
            Time.lastFps = Time.currentFps;
            Time.currentFps = 0;
        }
    }

    public static getDeltaTimeFactor(): number {
        return Time.deltaTimeFactor;
    }

    public static getFps(): number {
        return Time.lastFps;
    }

    public static getTimeInMillisecs(): number {
        const currentMoment = performance.now();
        return currentMoment - Time.START_MOMENT;
    }

    public static getTimeInSecs(): number {
        return Time.getTimeInMillisecs() / Time.ONE_SECOND;
    }

    public static getFrameCount(): number {
        return Time.frameCount;
    }

}