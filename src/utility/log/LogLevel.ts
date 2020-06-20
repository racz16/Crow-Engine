export enum LogLevel {
    NONE = 1,
    ERROR = 2,
    WARNING = 3,
    INFO_1 = 4,
    INFO_2 = 5,
    INFO_3 = 6,
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