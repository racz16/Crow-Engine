import { IResource } from './IResource';

export interface IResourceManager {

    add(resource: IResource): void;

    contains(resource: IResource): boolean;

    getIterator(): IterableIterator<IResource>;

    getTypedIterator<T extends IResource>(type: new (..._) => T): IterableIterator<T>;

    getCount(): number;

    release(): void;

}