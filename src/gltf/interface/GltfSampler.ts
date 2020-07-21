import { GltfElement } from './GltfElement';
import { GltfMagnificationFilter } from '../enum/GltfMagnificationFilter';
import { GltfMinificationFilter } from '../enum/GltfMinificationFIlter';
import { GltfWrap } from '../enum/GltfWrap';

export interface GltfSampler extends GltfElement {
    magFilter?: GltfMagnificationFilter,
    minFilter?: GltfMinificationFilter;
    wrapS?: GltfWrap;
    wrapT?: GltfWrap;
    name?: string;
}