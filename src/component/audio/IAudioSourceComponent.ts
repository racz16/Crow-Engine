import { PanningModelType } from './enum/PanningModelType';
import { DistanceModelType } from './enum/DistanceModelType';
import { IComponent } from '../IComponent';

export interface IAudioSourceComponent extends IComponent {

    start(): void;

    stop(): void;

    getVolume(): number;

    isLoop(): boolean;

    getSpeed(): number;

    getPanningModel(): PanningModelType;

    getDistanceModel(): DistanceModelType;

    getMinVolumeDistance(): number;

    getMaxVolumeDistance(): number;

    getReductionSpeed(): number;

    getInnerAngle(): number;

    getOuterAngle(): number;

    getOuterAngleVolume(): number;

}