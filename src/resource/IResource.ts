export interface IResource {

    getDataSize(): number;

    getAllDataSize(): number;

    release(): void;

    isUsable(): boolean;

}