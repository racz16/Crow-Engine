import { LogLevel, LogLevelResolver } from "./LogLevel";
import { LogType, LogTypeResolver } from "./LogType";
import { mat4, mat3, vec3, vec4 } from "gl-matrix";

export class Log {

    private static logLevel: LogLevel;
    private static logTypes: number;
    private static groups = new Array<string>();
    private static opened = 0;

    private Log() { }

    public static initialize(logLevel = LogLevel.WARNING, logTypes = LogType.ENGINE | LogType.OTHER | LogType.RENDERING | LogType.RESOURCES): void {
        this.setLogLevel(logLevel);
        this.setLogTypes(logTypes);
        this.logString(LogLevel.INFO_2, LogType.ENGINE, 'Logging initialized');
    }

    public static getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public static setLogLevel(logLevel: LogLevel): void {
        this.logLevel = logLevel;
    }

    public static getLogTypes(): number {
        return this.logTypes;
    }

    public static setLogTypes(logTypes: number): void {
        this.logTypes = logTypes;
    }

    public static startGroup(title = 'group'): void {
        this.groups.push(title);
    }

    public static endGroup(): void {
        if (this.opened === 0) {
            this.groups.pop();
        } else {
            console.groupEnd();
            this.opened--;
        }
    }

    public static logString(logLevel: LogLevel, logType: LogType, message: string): void {
        if (this.canLog(logLevel, logType)) {
            this.openGroups();
            if (logLevel === LogLevel.ERROR) {
                console.error(this.toString(logLevel, logType, message));
            } else if (logLevel === LogLevel.WARNING) {
                console.warn(this.toString(logLevel, logType, message));
            } else {
                console.log(this.toString(logLevel, logType, message));
            }
        }
    }

    public static logObject(logLevel: LogLevel, logType: LogType, object: any): void {
        if (this.canLog(logLevel, logType)) {
            this.openGroups();
            if (logLevel === LogLevel.ERROR) {
                console.error(object);
            } else if (logLevel === LogLevel.WARNING) {
                console.warn(object);
            } else {
                console.log(object);
            }
        }
    }

    public static logStackTrace(logLevel: LogLevel, logType: LogType, message: any = 'stack trace'): void {
        if (this.canLog(logLevel, logType)) {
            this.openGroups();
            console.trace(message);
        }
    }

    public static logVec3(logLevel: LogLevel, logType: LogType, vec: vec3): void {
        this.logVec(logLevel, logType, vec);
    }

    public static logVec4(logLevel: LogLevel, logType: LogType, vec: vec4): void {
        this.logVec(logLevel, logType, vec);
    }

    private static logVec(logLevel: LogLevel, logType: LogType, vec: Float32Array): void {
        if (this.canLog(logLevel, logType)) {
            this.openGroups();
            console.table([vec]);
        }
    }

    public static logMat3(logLevel: LogLevel, logType: LogType, mat: mat3): void {
        if (this.canLog(logLevel, logType)) {
            this.openGroups();
            console.table([
                [mat[0], mat[3], mat[6]],
                [mat[1], mat[4], mat[7]],
                [mat[2], mat[5], mat[8]],
            ]);
        }
    }

    public static logMat4(logLevel: LogLevel, logType: LogType, mat: mat4): void {
        if (this.canLog(logLevel, logType)) {
            this.openGroups();
            console.table([
                [mat[0], mat[4], mat[8], mat[12]],
                [mat[1], mat[5], mat[9], mat[13]],
                [mat[2], mat[6], mat[10], mat[14]],
                [mat[3], mat[7], mat[11], mat[15]]
            ]);
        }
    }

    private static canLog(logLevel: LogLevel, logType: LogType): boolean {
        return logLevel <= this.logLevel && !!(this.logTypes & logType);
    }

    private static openGroups(): void {
        for (const group of this.groups) {
            console.group(group);
            this.opened++;
        }
        this.groups = [];
    }

    protected static toString(logLevel: LogLevel, logType: LogType, message: string): string {
        const logLevelString = LogLevelResolver.toString(logLevel);
        const logTypeString = LogTypeResolver.toString(logType);
        return `${logLevelString} ${logTypeString} ${message}`;
    }

}