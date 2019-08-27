import { LogLevel } from './LogLevel';
import { vec3, vec4, mat3, mat4 } from 'gl-matrix';

export interface ILogEventHandler {

    startGroup(title: string): void;

    endGroup(): void;

    endFrame(): void;

    logString(logLevel: LogLevel, message: string): void;

    logObject(logLevel: LogLevel, object: any): void;

    logStackTrace(logLevel: LogLevel, message: any): void;

    logVec3(logLevel: LogLevel, vec: vec3): void;

    logVec4(logLevel: LogLevel, vec: vec4): void;

    logMat3(logLevel: LogLevel, mat: mat3): void;

    logMat4(logLevel: LogLevel, mat: mat4): void;

}