import { LogLevel } from "./LogLevel";
import { LogType } from "./LogType";

export class Log {

    private static logLevel: LogLevel;

    private static infoLogTypes = new Map<LogType, boolean>();

    public static lifeCycleLog = false;
    public static glLog = false;
    public static resourceLog = false;

    public static initialize(logLevel: LogLevel): void {
        this.setLogLevel(logLevel);
    }

    public static getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public static setLogLevel(logLevel: LogLevel): void {
        this.logLevel = logLevel;

        this.info = logLevel < LogLevel.INFO ? () => { } : (message: any) => { console.info(message) };
        this.warning = logLevel < LogLevel.WARNING ? () => { } : (message: any) => { console.warn(message) };
        this.error = logLevel < LogLevel.ERROR ? () => { } : (message: any) => { console.error(message) };
    }

    public static isInfoLog(logType: LogType): boolean {
        return this.infoLogTypes.get(logType);
    }

    public static setInfoLog(logType: LogType, log: boolean): void {
        this.infoLogTypes.set(logType, log);
        switch (logType) {
            case LogType.LIFE_CYCLE:
                this.lifeCycleInfo = !log ? () => { } : (message: any) => { this.info(message) };
                break;
            case LogType.GL:
                this.glInfo = !log ? () => { } : (message: any) => { this.info(message) };
                break;
            case LogType.RESOURCES:
                this.resourceInfo = !log ? () => { } : (message: any) => { this.info(message) };
                break;
            case LogType.RENDERING:
                this.renderingInfo = !log ? () => { } : (message: any) => { this.info(message) };
                break;
        }
    }

    public static printStackTrace(message: any = 'stack trace'): void {
        console.trace(message);
    }

    public static lifeCycleInfo(message: any): void { }

    public static glInfo(message: any): void { }

    public static resourceInfo(message: any): void { }

    public static renderingInfo(message: any): void { }


    public static info(message: any): void { }

    public static warning(message: any): void { }

    public static error(message: any): void { }

}