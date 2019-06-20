import { ParameterKey } from "./ParameterKey";
import { Parameter } from "./Parameter";

export class ParameterContainer {

    private parameters = new Map<Object, ParameterContainerMap<Object>>();

    public get<T>(key: ParameterKey<T>): Parameter<T> {
        const pcm = this.getParameterContainerMap(key);
        if (pcm == null) {
            return null;
        } else {
            return pcm.get(key.getKey());
        }
    }

    public getValue<T>(key: ParameterKey<T>): T {
        const param = this.get(key);
        return param == null ? null : param.getValue();
    }

    public getValueOrDefault<T>(key: ParameterKey<T>, defaultValue: T): T {
        const value = this.getValue(key);
        return value == null ? defaultValue : value;
    }

    public set<T>(key: ParameterKey<T>, parameter: Parameter<T>): void {
        if (key == null) {
            throw new Error();
        }
        this.setUnsafe(key, parameter);
    }

    private setUnsafe<T>(key: ParameterKey<T>, parameter: Parameter<T>): void {
        let pcm = this.getParameterContainerMap(key);
        if (pcm == null) {
            pcm = new ParameterContainerMap<T>();
            this.parameters.set(key.getReturnType(), pcm);
        }
        pcm.set(key.getKey(), parameter);
    }

    private getParameterContainerMap<T>(key: ParameterKey<T>): ParameterContainerMap<T> {
        return this.parameters.get(key.getReturnType()) as ParameterContainerMap<T>;
    }
}

class ParameterContainerMap<S>{

    private parameters = new Map<string, Parameter<S>>();

    public get(key: string): Parameter<S> {
        return this.parameters.get(key);
    }

    public set(key: string, parameter: Parameter<S>): void {
        if (key == null) {
            throw new Error();
        }
        const oldValue = this.get(key);
        this.parameters.set(key, parameter);
        this.addAndRemoveCallbacks(oldValue, parameter);
    }

    private addAndRemoveCallbacks(removed: Parameter<S>, added: Parameter<S>): void {
        if (removed != null) {
            removed.private_removedFromParameters(added);
        }
        if (added != null) {
            added.private_addedToParameters(removed);
        }
    }

}
