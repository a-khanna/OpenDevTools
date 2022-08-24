import { Store } from 'tauri-plugin-store-api';
import get from 'lodash.get';
import set from 'lodash.set';

export class StoreManager {
    private store: Store;
    private component: string;
    
    constructor(component: string) {
        this.store = new Store('.settings.dat');
        this.component = component;
    }

    async Get(path: string): Promise<any> {
        let componentStore = await this.store.get(this.component);
        return get(componentStore, path, undefined);
    }

    async Set(path: string, value: any): Promise<any> {
        let componentStore = await this.store.get(this.component);
        if (!componentStore)
            componentStore = {};
            
        set(componentStore, path, value);
        this.store.set(this.component, componentStore);
        this.store.save();
        this.store.load();
    }
}