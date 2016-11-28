import { Eventer } from './eventer';
import { Mix } from './minicast';
import http from 'axios';

/*
 * Tool to manage a single list provider used by multiple objects (to avoid multiple call to a same path)
 * Usage :
 * let provider = new Provider<T>(path, MyClass);
 * function a(){
 *    //get data from provider
 *    let data = await provider.data();
 * }
 *
 * function b(){
 *    let data = await provider.data();
 *    //get data when a refresh happens
 *    provider.on('refresh', (newData) => data = newData));
 * }
 *
 * //force provider refresh (after data invalidation)
 * setTimeout(() => provider.refresh(), 50000);
 * 
 * a();
 * b();
*/

export class Provider<T> {
    private _data: T[];
    eventer: Eventer;
    isSynced: boolean;
    syncing: boolean;

    constructor(public path: string, private className: Function) {
        this._data = [];
        this.eventer = new Eventer();
    }

    async data(): Promise<T[]> {
        if (!this.isSynced && !this.syncing){
            await this.sync();
        }
        if (this.syncing) {
            await this.syncDone();
        }
        return this._data;
    }

    private async syncDone(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.eventer.once('sync', () => resolve());
        });
    }

    private async sync(): Promise<void> {
        this.syncing = true;
        let response = await http.get(this.path);
        this._data = Mix.castArrayAs(this.className, response.data);
        this.isSynced = true;
        this.eventer.trigger('sync');
        this.syncing = false;
    }

    async refresh() {
        this.isSynced = false;
        await this.sync();
        this.eventer.trigger('refresh');
    }
}