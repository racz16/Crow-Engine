import { ILogHandler } from './ILogHandler';
import { LogLevel, LogLevelResolver } from './LogLevel';
import { ReadonlyMat3, ReadonlyMat4, ReadonlyVec4, ReadonlyVec3 } from 'gl-matrix';

export class ConsoleLogHandler implements ILogHandler {

    private startedGroups = new Array<string>();
    private reallyStartedGroupCount = 0;

    public startGroup(title: string): void {
        this.startedGroups.push(title);
    }

    public endGroup(): void {
        if (this.reallyStartedGroupCount === 0) {
            this.startedGroups.pop();
        } else {
            console.groupEnd();
            this.reallyStartedGroupCount--;
        }
    }

    public endFrame(): void {
        this.startedGroups = [];
        while (this.reallyStartedGroupCount > 0) {
            console.groupEnd();
            this.reallyStartedGroupCount--;
        }
    }

    public logString(logLevel: LogLevel, message: string): void {
        this.openGroups();
        if (logLevel === LogLevel.ERROR) {
            console.error(this.toString(logLevel, message));
        } else if (logLevel === LogLevel.WARNING) {
            console.warn(this.toString(logLevel, message));
        } else {
            console.log(this.toString(logLevel, message));
        }
    }

    public logObject(logLevel: LogLevel, object: any): void {
        this.openGroups();
        if (logLevel === LogLevel.ERROR) {
            console.error(object);
        } else if (logLevel === LogLevel.WARNING) {
            console.warn(object);
        } else {
            console.log(object);
        }
    }

    public logStackTrace(logLevel: LogLevel, message: any): void {
        this.openGroups();
        console.trace(message);
    }

    public logVec3(logLevel: LogLevel, vec: ReadonlyVec3): void {
        this.openGroups();
        console.table(vec);
    }

    public logVec4(logLevel: LogLevel, vec: ReadonlyVec4): void {
        this.openGroups();
        console.table(vec);
    }

    public logMat3(logLevel: LogLevel, mat: ReadonlyMat3): void {
        this.openGroups();
        console.table([
            [mat[0], mat[3], mat[6]],
            [mat[1], mat[4], mat[7]],
            [mat[2], mat[5], mat[8]],
        ]);
    }

    public logMat4(logLevel: LogLevel, mat: ReadonlyMat4): void {
        this.openGroups();
        console.table([
            [mat[0], mat[4], mat[8], mat[12]],
            [mat[1], mat[5], mat[9], mat[13]],
            [mat[2], mat[6], mat[10], mat[14]],
            [mat[3], mat[7], mat[11], mat[15]]
        ]);
    }

    private openGroups(): void {
        for (const group of this.startedGroups) {
            console.group(group);
            this.reallyStartedGroupCount++;
        }
        this.startedGroups = [];
    }

    protected toString(logLevel: LogLevel, message: string): string {
        const logLevelString = LogLevelResolver.toString(logLevel);
        return `${logLevelString} ${message}`;
    }

}