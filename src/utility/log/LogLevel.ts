export enum LogLevel {
    NONE = 0,
    ERROR = 1,
    WARNING = 2,
    INFO_1 = 3,
    INFO_2 = 4,
    INFO_3 = 5,
}

export class LogLevelResolver {

    public static toString(logLevel: LogLevel): string {
        switch (logLevel) {
            case LogLevel.NONE: return 'NO';
            case LogLevel.ERROR: return 'ER';
            case LogLevel.WARNING: return 'WA';
            case LogLevel.INFO_1: return 'I1';
            case LogLevel.INFO_2: return 'I2';
            case LogLevel.INFO_3: return 'I3';
            default: return '??';
        }
    }

}