export class TextureConfigElement {

    private path: string;
    private flipY: boolean;
    private mipmapLevel: number;

    public constructor(path: string, flipY = true, mipmapLevel = 0) {
        this.setPath(path);
        this.setFlipY(flipY);
        this.setMipmapLevel(mipmapLevel);
    }

    public getPath(): string {
        return this.path;
    }

    public setPath(path: string): void {
        this.path = path;
    }

    public isFlipY(): boolean {
        return this.flipY;
    }

    public setFlipY(flipY: boolean): void {
        this.flipY = flipY;
    }

    public getMipmapLevel(): number {
        return this.mipmapLevel;
    }

    public setMipmapLevel(mipmapLevel: number): void {
        this.mipmapLevel = mipmapLevel;
    }

}