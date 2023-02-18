class Log {
    static OFF = -1;
    static TRACE = 0;
    static DEBUG = 1;
    static INFO = 2;
    static WARN = 3;
    static ERROR = 4;
    static CRITICAL = 5;
    static WITH_STACKTRACE = true;

    static LEVEL = Log.INFO;

    static loglevels = [];

    /**
     *
     * @param {Number} level
     * @param {String} tag
     * @param txt
     * @private
     */
    static _output = function output(level, tag, ...txt){
        let tmpLevel = Log.LEVEL;

        if(Log.loglevels[tag]) tmpLevel = Log.loglevels[tag];

        if(tmpLevel === Log.OFF) return;
        if(tmpLevel > level) return;

        const callstack = Log.getStackTrace();



        // debug aufruf entfernen
        callstack.shift();
        callstack.shift();

        let color = "color: silver";

        switch(level) {
            case Log.TRACE:	// TRACE
                color = "background-color: gray";
                break;

            case Log.DEBUG:	// DEBUG

                break;

            case Log.INFO:	// INFO
                color = "color: green";
                break;

            case Log.WARN:	// WARN
                color = "color: orange; background-color: #EAA80035";
                break;

            case Log.ERROR:	// ERROR
                color = "color: red; background-color: #FF000020";
                break;

            case Log.CRITICAL:	// CRITICAL
                color = "color: red";
                break;
        }

        Log._print(callstack, color, tag, ...txt);
    };

    static _print(callstack, color, tag, ...txt){
        if(Log.WITH_STACKTRACE){
            if(Log.LEVEL === Log.ERROR){
                console.group("%c[" + tag + "]", color, ...txt);
            } else {
                console.groupCollapsed("%c[" + tag + "]", color, ...txt);
            }

            for(let i = 0; i < callstack.length; i++) {
                console.log("%c" + callstack[i], color);
            }

            console.groupEnd();

        } else {
            console.log("%c[" + tag + "]", color, ...txt)
        }
    }

    static getStackTrace = function() {
        let callstack = [];

        try {
            i.dont.exist+=0; //doesn't exist- that's the point

        } catch(e) {
            if (e.stack) { //Firefox
                let lines = e.stack.split('\n');

                for (let i=0; i < lines.length; i++) {
                    callstack.push(lines[i]);
                }

                //Ersten Eintrag entfernen
                callstack.shift();
                callstack.shift();
            }
        }

        return(callstack);
    };

    static c(tag, ...msg) {
        Log._output(Log.CRITICAL, tag, ...msg);
    }

    static e(tag, ...msg) {
        Log._output(Log.ERROR, tag, ...msg);
    }

    static i(tag, ...msg) {
        Log._output(Log.INFO, tag, ...msg);
    }

    static w(tag, ...msg) {
        Log._output(Log.WARN, tag, ...msg);
    }

    static d(tag, ...msg) {
        Log._output(Log.DEBUG, tag, ...msg);
    }

    static v(tag, ...msg) {
        Log._output(Log.DEBUG, tag, ...msg);
    }

    static t(tag, ...msg) {
        Log._output(Log.TRACE, tag, ...msg);
    }
}

export default Log;