export enum DistanceModelType {
    LINEAR,
    INVERSE,
    EXPONENTIAL,
}

export class DistanceModelTypeResolver {

    public static enumToWa(distanceModelType: DistanceModelType): 'linear' | 'inverse' | 'exponential' {
        switch (distanceModelType) {
            case DistanceModelType.LINEAR: return 'linear';
            case DistanceModelType.INVERSE: return 'inverse';
            case DistanceModelType.EXPONENTIAL: return 'exponential';
            default: throw new Error('Invalid enum DistanceModelType');
        }
    }

    public static waToEnum(distanceModelType: 'linear' | 'inverse' | 'exponential'): DistanceModelType {
        switch (distanceModelType) {
            case 'linear': return DistanceModelType.LINEAR;
            case 'inverse': return DistanceModelType.INVERSE;
            case 'exponential': return DistanceModelType.EXPONENTIAL;
            default: throw new Error('Invalid DistanceModelType');
        }
    }

}