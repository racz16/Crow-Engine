import { GameObject } from "../core/GameObject";
import { GltfNode } from "./interface/GltfNode";
import { ICameraComponent } from "../component/camera/ICameraComponent";
import { GltfCamera } from "./interface/GltfCamera";
import { PbrLightComponent } from "../component/light/pbr/PbrLightComponent";
import { GltfLight } from "./interface/GltfLight";
import { IRenderableComponent } from "../component/renderable/IRenderableComponent";
import { GltfPrimitive } from "./interface/GltfPrimitive";
import { IMesh } from "../resource/mesh/IMesh";
import { Material } from "../material/Material";
import { GltfMaterial } from "./interface/GltfMaterial";
import { PbrRenderer } from "../rendering/renderer/PbrRenderer";
import { GltfMesh } from "./interface/GltfMesh";
import { Texture2D } from "../resource/texture/Texture2D";
import { GltfTextureInfo } from "./interface/GltfTextureInfo";
import { Vao } from "../webgl/Vao";

export class GltfResult {
    private readonly gameObjects = new Array<[GameObject, GltfNode]>();
    private readonly cameraComponents = new Array<[ICameraComponent, GltfCamera]>();
    private readonly lightComponents = new Array<[PbrLightComponent, GltfLight]>();
    private readonly meshComponents = new Array<[IRenderableComponent<IMesh>, GltfMesh, GltfPrimitive]>();
    private readonly meshes = new Array<[IMesh, GltfMesh, GltfPrimitive]>();
    private readonly materials = new Array<[Material<PbrRenderer>, GltfMaterial]>();
    private readonly textures = new Array<[Texture2D, GltfTextureInfo]>();
    private readonly vaos = new Array<[Vao, GltfPrimitive]>();

    public addGameObject(gameObject: GameObject, gltfNode: GltfNode): void {
        this.gameObjects.push([gameObject, gltfNode]);
    }

    public addCameraComponent(camera: ICameraComponent, gltfCamera: GltfCamera): void {
        this.cameraComponents.push([camera, gltfCamera]);
    }

    public addLightComponent(light: PbrLightComponent, gltfLight: GltfLight): void {
        this.lightComponents.push([light, gltfLight]);
    }

    public addMeshComponent(mesh: IRenderableComponent<IMesh>, gltfMesh: GltfMesh, gltfPrimitive: GltfPrimitive): void {
        this.meshComponents.push([mesh, gltfMesh, gltfPrimitive]);
    }

    public addMesh(mesh: IMesh, gltfMesh: GltfMesh, gltfPrimitive: GltfPrimitive): void {
        this.meshes.push([mesh, gltfMesh, gltfPrimitive]);
    }

    public addMaterial(material: Material<PbrRenderer>, gltfMaterial: GltfMaterial): void {
        this.materials.push([material, gltfMaterial]);
    }

    public addTexture(texture: Texture2D, gltfTextureinfo: GltfTextureInfo): void {
        this.textures.push([texture, gltfTextureinfo]);
    }

    public addVao(vao: Vao, gltfPrimitive: GltfPrimitive): void {
        this.vaos.push([vao, gltfPrimitive]);
    }

    //
    //getters
    //
    public getGameObjects(): IterableIterator<[GameObject, GltfNode]> {
        return this.gameObjects.values();
    }

    public getCameraComponents(): IterableIterator<[ICameraComponent, GltfCamera]> {
        return this.cameraComponents.values();
    }

    public getLightComponents(): IterableIterator<[PbrLightComponent, GltfLight]> {
        return this.lightComponents.values();
    }

    public getMesheComponents(): IterableIterator<[IRenderableComponent<IMesh>, GltfMesh, GltfPrimitive]> {
        return this.meshComponents.values();
    }

    public getMeshes(): IterableIterator<[IMesh, GltfMesh, GltfPrimitive]> {
        return this.meshes.values();
    }

    public getMaterials(): IterableIterator<[Material<PbrRenderer>, GltfMaterial]> {
        return this.materials.values();
    }

    public getTextures(): IterableIterator<[Texture2D, GltfTextureInfo]> {
        return this.textures.values();
    }

    public getVaos(): IterableIterator<[Vao, GltfPrimitive]> {
        return this.vaos.values();
    }

}