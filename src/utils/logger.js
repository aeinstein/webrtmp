/*
 * Copyright (C) 2016 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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

    /**
     * Array with [ClassName, Loglevel]
     * @type {[]}
     */
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

        const callstack = Log._getStackTrace();

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

    /**
     * Internal for console dump
     * @param {String[]} callstack
     * @param {String} color
     * @param {String} tag
     * @param txt
     * @private
     */
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

    /**
     * Get Callstack
     * @returns {String[]}
     * @private
     */
    static _getStackTrace = function() {
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

    /**
     * Log Critical
     * @param {String} tag
     * @param msg
     */
    static c(tag, ...msg) {
        Log._output(Log.CRITICAL, tag, ...msg);
    }

    /**
     * Log Error
     * @param {String} tag
     * @param msg
     */
    static e(tag, ...msg) {
        Log._output(Log.ERROR, tag, ...msg);
    }

    /**
     * Log Info
     * @param {String} tag
     * @param msg
     */
    static i(tag, ...msg) {
        Log._output(Log.INFO, tag, ...msg);
    }

    /**
     * Log Warning
     * @param {String} tag
     * @param msg
     */
    static w(tag, ...msg) {
        Log._output(Log.WARN, tag, ...msg);
    }

    /**
     * Log Debug
     * @param {String} tag
     * @param msg
     */
    static d(tag, ...msg) {
        Log._output(Log.DEBUG, tag, ...msg);
    }

    /**
     * Log Debug
     * @param {String} tag
     * @param msg
     */
    static v(tag, ...msg) {
        Log._output(Log.DEBUG, tag, ...msg);
    }

    /**
     * Log Trace
     * @param {String} tag
     * @param msg
     */
    static t(tag, ...msg) {
        Log._output(Log.TRACE, tag, ...msg);
    }
}

export default Log;
