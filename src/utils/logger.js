class Log {
    static OFF = -1;
    static TRACE = 0;
    static DEBUG = 1;
    static INFO = 1;
    static WARN = 3;
    static ERROR = 4;
    static CRITICAL = 5;
    static WITH_STACKTRACE = false;

    static LEVEL = Log.DEBUG;

    /**
     *
     * @param {Number} level
     * @param {String} tag
     * @param txt
     * @private
     */
    static _output = function output(level, tag, ...txt){
        if(Log.LEVEL === Log.OFF) return;
        if(level < Log.LEVEL) return;

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
        if(Log.WITH_STACKTRACE || Log.LEVEL === Log.TRACE || Log.LEVEL === Log.ERROR){
            console.groupCollapsed("%c " + tag, "%o", color, ...txt);

            for(let i = 0; i < callstack.length; i++) {
                console.log("%c" + callstack[i], color);
            }
            console.groupEnd();

        } else {
            console.log("%c" + tag, "%o", color, ...txt)
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
                //this.isCallstackPopulated = true;
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
