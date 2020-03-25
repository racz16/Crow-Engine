export interface ITimeManager {

    endFrame(): void;

    getDeltaTimeFactor(): number;

    getFps(): number;

    getTimeInMillisecs(): number;

    getTimeInSecs(): number;

    getFrameCount(): number;

}