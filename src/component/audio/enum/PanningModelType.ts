export enum PanningModelType {
    EQUAL_POWER,
    HRTF,
}

export class PanningModelTypeResolver {

    public static enumToWa(panningModelType: PanningModelType): 'equalpower' | 'HRTF' {
        switch (panningModelType) {
            case PanningModelType.EQUAL_POWER: return 'equalpower';
            case PanningModelType.HRTF: return 'HRTF';
            default: throw new Error('Invalid enum PanningModelType');
        }
    }

    public static waToenum(panningModelType: 'equalpower' | 'HRTF'): PanningModelType {
        switch (panningModelType) {
            case 'equalpower': return PanningModelType.EQUAL_POWER;
            case 'HRTF': return PanningModelType.HRTF;
            default: throw new Error('Invalid PanningModelType');
        }
    }

}