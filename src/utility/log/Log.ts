import { LogLevel } from './LogLevel';
import { mat4, mat3, vec3, vec4 } from 'gl-matrix';
import { ILogEventHandler as ILogHandler } from './ILogHandler';
import { Utility } from '../Utility';
import { ConsoleLogEventHandler as ConsoleLogHandler } from './ConsoleLogHandler';

export class Log {

    private static logHandlers = new Array<ILogHandler>();
    private static logLevel: LogLevel;

    private constructor() { }

    public static initialize(logLevel = LogLevel.WARNING): void {
        this.setLogLevel(logLevel);
        this.addHandler(new ConsoleLogHandler());
        this.logString(LogLevel.INFO_1, 'Logging initialized');
    }

    public static getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public static setLogLevel(logLevel: LogLevel): void {
        if (!logLevel) {
            throw new Error();
        }
        this.logLevel = logLevel;
        Log.logString(LogLevel.INFO_1, 'Log level changed');
    }

    public static addHandler(handler: ILogHandler): void {
        if (!handler) {
            throw new Error();
        }
        if (!this.containsHandler(handler)) {
            this.logHandlers.push(handler);
        }
    }

    public static removeHandler(handler: ILogHandler): void {
        const index = this.logHandlers.indexOf(handler);
        if (index !== -1) {
            Utility.removeElement(this.logHandlers, index);
        }
    }

    public static containsHandler(handler: ILogHandler): boolean {
        return this.logHandlers.includes(handler);
    }

    public static getHandlersIterator(): IterableIterator<ILogHandler> {
        return this.logHandlers.values();
    }

    public static getHandlerCount(): number {
        return this.logHandlers.length;
    }

    public static startGroup(title: string): void {
        for (const handler of this.logHandlers) {
            handler.startGroup(title);
        }
    }

    public static endGroup(): void {
        for (const handler of this.logHandlers) {
            handler.endGroup();
        }
    }

    public static endFrame(): void {
        for (const handler of this.logHandlers) {
            handler.endFrame();
        }
    }

    public static logString(logLevel: LogLevel, message: string): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logString(logLevel, message);
            }
        }
    }

    public static logObject(logLevel: LogLevel, object: any): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logObject(logLevel, object);
            }
        }
    }

    public static logStackTrace(logLevel: LogLevel, message: any = 'stack trace'): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logStackTrace(logLevel, message);
            }
        }
    }

    public static logVec3(logLevel: LogLevel, vec: vec3): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logVec3(logLevel, vec);
            }
        }
    }

    public static logVec4(logLevel: LogLevel, vec: vec4): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logVec4(logLevel, vec);
            }
        }
    }

    public static logMat3(logLevel: LogLevel, mat: mat3): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logMat3(logLevel, mat);
            }
        }
    }

    public static logMat4(logLevel: LogLevel, mat: mat4): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logMat4(logLevel, mat);
            }
        }
    }

    private static canLog(logLevel: LogLevel): boolean {
        return logLevel <= this.logLevel;
    }

}