export interface IResource {

    getDataSize(): number;

    getAllDataSize(): number;

    isUsable(): boolean;

    release(): void;

}