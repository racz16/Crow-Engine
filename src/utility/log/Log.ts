import { LogLevel } from "./LogLevel";
import { LogType } from "./LogType";
import { mat4, mat3, vec3, vec4 } from "gl-matrix";

export class Log {

    private static logLevel: LogLevel;

    private static infoLogTypes = new Map<LogType, boolean>();

    public static initialize(logLevel: LogLevel): void {
        this.setLogLevel(logLevel);
    }

    public static getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public static setLogLevel(logLevel: LogLevel): void {
        this.logLevel = logLevel;

        this.logInfo = logLevel < LogLevel.INFO ? () => { } : (message: any) => { console.info(message) };
        this.logWarning = logLevel < LogLevel.WARNING ? () => { } : (message: any) => { console.warn(message) };
        this.logError = logLevel < LogLevel.ERROR ? () => { } : (message: any) => { console.error(message) };
    }

    public static isInfoLog(logType: LogType): boolean {
        return this.infoLogTypes.get(logType);
    }

    public static setInfoLog(logType: LogType, log: boolean): void {
        this.infoLogTypes.set(logType, log);
        switch (logType) {
            case LogType.LIFE_CYCLE:
                this.logLifeCycleInfo = !log ? () => { } : (message: any) => { this.logInfo(message) };
                break;
            case LogType.GL:
                this.logGlInfo = !log ? () => { } : (message: any) => { this.logInfo(message) };
                break;
            case LogType.RESOURCES:
                this.logResourceInfo = !log ? () => { } : (message: any) => { this.logInfo(message) };
                break;
            case LogType.RENDERING:
                this.logRenderingInfo = !log ? () => { } : (message: any) => { this.logInfo(message) };
                break;
        }
    }

    public static printStackTrace(message: any = 'stack trace'): void {
        console.trace(message);
    }

    public static printVector3(v: vec3): void {
        console.table([v]);
    }

    public static logVector4(v: vec4): void {
        console.table([v]);
    }

    public static printMatrix3x3(m: mat3): void {
        console.table([
            [m[0], m[3], m[6]],
            [m[1], m[4], m[7]],
            [m[2], m[5], m[8]],
        ]);
    }

    public static printMatrix4x4(m: mat4): void {
        console.table([
            [m[0], m[4], m[8], m[12]],
            [m[1], m[5], m[9], m[13]],
            [m[2], m[6], m[10], m[14]],
            [m[3], m[7], m[11], m[15]]
        ]);
    }

    public static logLifeCycleInfo(message: any): void { }

    public static logGlInfo(message: any): void { }

    public static logResourceInfo(message: any): void { }

    public static logRenderingInfo(message: any): void { }


    public static logInfo(message: any): void { }

    public static logWarning(message: any): void { }

    public static logError(message: any): void { }

}