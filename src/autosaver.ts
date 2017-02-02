import http from 'axios';

export interface AutosaveElement{
    model: any;
    path?: string;
    method?: string;
    _backup?: string;
    fn?: () => void
}

let autosaved: AutosaveElement[] = [];
let loopStarted = false;
let token;

let loop = () => {
    autosaved.forEach((item: AutosaveElement) => {
        if(item._backup !== JSON.stringify(item.model)){
            if(item.fn){
                item.fn();
            }
            else{
                http[item.method](item.path, item.model);
            }
            
            item._backup = JSON.stringify(item.model);
        }
    });
    loopStarted = true;
    token = setTimeout(loop, 3000);
};

export class Autosave{
    static watch(path: string | (() => void), model: any, method = 'put'){
        if(autosaved.findIndex((e) => e.model === model && e.path === path) !== -1){
            return;
        }
        let autosave;
        if(typeof path === 'string'){
            autosave = {
                model: model,
                path: path,
                method: method
            };
        }
        else{
            autosave = {
                model: model,
                fn: path,
                method: method
            };
        }
        
        autosaved.push(autosave);
        if(!loopStarted){
            loop();
        }
    }

    static unwatch(model: any){
        let index = autosaved.findIndex((e) => e.model === model);
        autosaved.splice(index, 1);
        if(autosaved.length === 0){
            this.unwatchAll();
        }
    }

    static unwatchAll(){
        autosaved = [];
        clearTimeout(token);
        loopStarted = false;
    }
}