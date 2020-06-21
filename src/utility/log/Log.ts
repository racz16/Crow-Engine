import { LogLevel } from './LogLevel';
import { ReadonlyMat3, ReadonlyMat4, ReadonlyVec4, ReadonlyVec3 } from 'gl-matrix';
import { ILogHandler } from './ILogHandler';
import { Utility } from '../Utility';
import { ILog } from './ILog';

export class Log implements ILog {

    private logHandlers = new Array<ILogHandler>();
    private logLevel: LogLevel;

    public constructor(logLevel = LogLevel.WARNING) {
        this.setLogLevel(logLevel);
    }

    public getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public setLogLevel(logLevel: LogLevel): void {
        if (!logLevel) {
            throw new Error();
        }
        this.logLevel = logLevel;
        this.logString(LogLevel.INFO_1, 'Log level changed');
    }

    public addHandler(handler: ILogHandler): void {
        if (!handler) {
            throw new Error();
        }
        if (!this.containsHandler(handler)) {
            this.logHandlers.push(handler);
        }
    }

    public removeHandler(handler: ILogHandler): void {
        const index = this.logHandlers.indexOf(handler);
        if (index !== -1) {
            Utility.removeElement(this.logHandlers, index);
        }
    }

    public containsHandler(handler: ILogHandler): boolean {
        return this.logHandlers.includes(handler);
    }

    public getHandlersIterator(): IterableIterator<ILogHandler> {
        return this.logHandlers.values();
    }

    public getHandlerCount(): number {
        return this.logHandlers.length;
    }

    public getHandler(index: number): ILogHandler {
        return this.logHandlers[index];
    }

    public startGroup(title: string): void {
        for (const handler of this.logHandlers) {
            handler.startGroup(title);
        }
    }

    public endGroup(): void {
        for (const handler of this.logHandlers) {
            handler.endGroup();
        }
    }

    public endFrame(): void {
        for (const handler of this.logHandlers) {
            handler.endFrame();
        }
    }

    public logString(logLevel: LogLevel, message: string): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logString(logLevel, message);
            }
        }
    }

    public logObject(logLevel: LogLevel, object: any): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logObject(logLevel, object);
            }
        }
    }

    public logStackTrace(logLevel: LogLevel, message: any = 'stack trace'): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logStackTrace(logLevel, message);
            }
        }
    }

    public logVec3(logLevel: LogLevel, vec: ReadonlyVec3): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logVec3(logLevel, vec);
            }
        }
    }

    public logVec4(logLevel: LogLevel, vec: ReadonlyVec4): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logVec4(logLevel, vec);
            }
        }
    }

    public logMat3(logLevel: LogLevel, mat: ReadonlyMat3): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logMat3(logLevel, mat);
            }
        }
    }

    public logMat4(logLevel: LogLevel, mat: ReadonlyMat4): void {
        if (this.canLog(logLevel)) {
            for (const handler of this.logHandlers) {
                handler.logMat4(logLevel, mat);
            }
        }
    }

    private canLog(logLevel: LogLevel): boolean {
        return logLevel <= this.logLevel;
    }

}