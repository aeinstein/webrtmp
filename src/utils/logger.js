export class Log {
    static v(...params){
        console.log(...params);
    }

    static e(...params){
        console.error(...params);
    }

    static w(...params){
        console.warn(...params);
    }

    static t(...params){
        console.trace(...params);
    }

    static i(...params){
        console.info(...params);
    }
}
