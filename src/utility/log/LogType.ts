export enum LogType {
    APPLICATION = 1,
    ENGINE = 2,
    RESOURCES = 4,
    RENDERING = 8,
    OTHER = 1024,
}

export class LogTypeResolver {

    public static toString(logType: LogType): string {
        switch (logType) {
            case LogType.APPLICATION: return 'APP';
            case LogType.ENGINE: return 'ENG';
            case LogType.RESOURCES: return 'RES';
            case LogType.RENDERING: return 'REN';
            case LogType.OTHER: return 'OTH';
            default: return '???';
        }
    }

}