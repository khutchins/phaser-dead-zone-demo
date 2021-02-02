class KHEvent {
    name: string;
    callbacks: { (data: any): void; }[];

    constructor(name)  {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(cb: (data: any) => void) {
        this.callbacks.push(cb);
    }

    unregisterCallback(cb: (data: any) => void) { 
        let idx = this.callbacks.indexOf(cb);
        if (idx < 0) return;
        this.callbacks.splice(idx, 1);
    }

    emitEvent(data: {}) {
        this.callbacks.forEach(function(callback){
            callback(data);
        });
    }
}

export class KHEventHandler {
    events: { [name: string]: KHEvent };

    constructor(defaultEvents: string[] = []) {
        this.events = {};
        for (let i = 0, n = defaultEvents.length; i < n; i++) {
            this.addEvent(defaultEvents[i]);
        }
    }

    addEvent(name: string) {
        this.events[name] = new KHEvent(name);
    }

    emitEvent(name: string, args: any = null) {
        if (!(name in this.events)) { 
            console.trace("Unregistered event name: " + name);
            return;
        }
        this.events[name].emitEvent(args);
    }

    registerCallback(name: string, cb: (data: any) => void) {
        if (!(name in this.events)) { 
            console.trace("Unregistered event name: " + name);
            return;
        }
        this.events[name].registerCallback(cb);
    }

    unregisterCallback(name: string, cb: (data: any) => void) {
        if (!(name in this.events)) { 
            console.log("Unregistered event name: " + name);
        }
        this.events[name].unregisterCallback(cb);
    }
}