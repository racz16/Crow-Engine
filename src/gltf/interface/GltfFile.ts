import { GltfImage } from './GltfImage';
import { GltfMaterial } from './GltfMaterial';
import { GltfNode } from './GltfNode';
import { GltfElement } from './GltfElement';
import { GltfSampler } from './GltfSampler';
import { GltfScene } from './GltfScene';
import { GltfSkin } from './GltfSkin';
import { GltfTexture } from './GltfTexture';
import { GltfCamera } from './GltfCamera';
import { GltfAccessor } from './GltfAccessor';
import { GltfAnimation } from './GltfAnimation';
import { GltfAsset } from './GltfAsset';
import { GltfBuffer } from './GltfBuffer';
import { GltfBufferView } from './GltfBufferView';
import { GltfFileExtensions } from './GltfExtensions';
import { GltfMesh } from './GltfMesh';

export interface GltfFile extends GltfElement {
    extensionsUsed?: Array<string>;
    extensionsRequired?: Array<string>;
    accessors?: Array<GltfAccessor>;
    animations?: Array<GltfAnimation>;
    asset: GltfAsset;
    buffers?: Array<GltfBuffer>;
    bufferViews?: Array<GltfBufferView>;
    cameras?: Array<GltfCamera>;
    images?: Array<GltfImage>;
    materials?: Array<GltfMaterial>;
    meshes?: Array<GltfMesh>;
    nodes?: Array<GltfNode>;
    samplers?: Array<GltfSampler>;
    scene?: number;
    scenes?: Array<GltfScene>;
    skins?: Array<GltfSkin>;
    textures?: Array<GltfTexture>;
    extensions?: GltfFileExtensions;
}