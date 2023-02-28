(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webrtmpjs"] = factory();
	else
		root["webrtmpjs"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/worker-loader/dist/runtime/inline.js":
/*!***********************************************************!*\
  !*** ./node_modules/worker-loader/dist/runtime/inline.js ***!
  \***********************************************************/
/***/ ((module) => {



/* eslint-env browser */

/* eslint-disable no-undef, no-use-before-define, new-cap */
module.exports = function (content, workerConstructor, workerOptions, url) {
  var globalScope = self || window;

  try {
    try {
      var blob;

      try {
        // New API
        blob = new globalScope.Blob([content]);
      } catch (e) {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = globalScope.BlobBuilder || globalScope.WebKitBlobBuilder || globalScope.MozBlobBuilder || globalScope.MSBlobBuilder;
        blob = new BlobBuilder();
        blob.append(content);
        blob = blob.getBlob();
      }

      var URL = globalScope.URL || globalScope.webkitURL;
      var objectURL = URL.createObjectURL(blob);
      var worker = new globalScope[workerConstructor](objectURL, workerOptions);
      URL.revokeObjectURL(objectURL);
      return worker;
    } catch (e) {
      return new globalScope[workerConstructor]("data:application/javascript,".concat(encodeURIComponent(content)), workerOptions);
    }
  } catch (e) {
    if (!url) {
      throw Error("Inline worker is not supported");
    }

    return new globalScope[workerConstructor](url, workerOptions);
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./src/index.js + 10 modules ***!
  \***********************************/
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "WebRTMP": () => (/* reexport */ WebRTMP),
  "createWebRTMP": () => (/* binding */ createWebRTMP)
});

;// CONCATENATED MODULE: ./src/utils/logger.js
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
     * Object with [ClassName, Loglevel]
     * @type {Object}
     */
    static loglevels = {};

    /**
     *
     * @param {Number} level
     * @param {String} tag
     * @param txt
     * @private
     */
    static _output = function output(level, tag, ...txt){
        let tmpLevel = Log.LEVEL;

        // Dirty fix because inline worker cant access static properties
        try{
            if(Log.loglevels[tag]) tmpLevel = Log.loglevels[tag];
        }catch (e) {
            return;
        }


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

/* harmony default export */ const logger = (Log);

;// CONCATENATED MODULE: ./src/utils/event_emitter.js
/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */



class EventEmitter{
	ListenerList = [];
	TAG = "EventEmitter";
	waiters = [];

	constructor() {
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 * @param {boolean} modal
	 */
	addEventListener(event, listener, modal = false){
		logger.d(this.TAG, "addEventListener: " + event);

		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event) {
				if (modal || entry[1] === listener) {
					logger.w(this.TAG, "Listener already registered, overriding");
					return;
				}
			}
		}
		this.ListenerList.push([event, listener]);
	}

	waitForEvent(event, callback){
		this.waiters.push([event, callback]);
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 * @param {boolean} modal
	 */
	addListener(event, listener, modal){
		this.addEventListener(event, listener, modal);
	}


	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	removeEventListener(event, listener){
		logger.d(this.TAG, "removeEventListener: " + event);

		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event && entry[1] === listener){
				this.ListenerList.splice(i,1);
				return;
			}
		}
	}

	removeListener(event, listener){
		this.removeEventListener(event, listener);
	}

	/**
	 * Remove all listener
	 */
	removeAllEventListener(event){
		logger.d(this.TAG, "removeAllEventListener: ", event);
		if(event) {
			for(let i = 0; i < this.ListenerList.length;i++) {
				let entry = this.ListenerList[i];
				if(entry[0] === event){
					this.ListenerList.splice(i,1);
					i--;
				}
			}
		} else
			this.ListenerList = [];
	}

	removeAllListener(event){
		this.removeAllEventListener(event);
	}

	/**
	 *
	 * @param {String} event
	 * @param data
	 */
	emit(event, ...data){
		logger.t(this.TAG, "emit EVENT: " + event, ...data);

		for(let i = 0; i < this.waiters.length;i++){
			let entry = this.waiters[i];

			if(entry[0] === event){
				logger.d(this.TAG, "hit waiting event: " + event);
				entry[1].call(this, ...data);
				this.waiters.splice(i,1);
				i--;
			}
		}

		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event){
				entry[1].call(this, ...data);
			}
		}
	}
}

/* harmony default export */ const event_emitter = (EventEmitter);


;// CONCATENATED MODULE: ./src/formats/media-segment-info.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Represents an media sample (audio / video)
class SampleInfo {

	constructor(dts, pts, duration, originalDts, isSync) {
		this.dts = dts;
		this.pts = pts;
		this.duration = duration;
		this.originalDts = originalDts;
		this.isSyncPoint = isSync;
		this.fileposition = null;
	}

}

// Media Segment concept is defined in Media Source Extensions spec.
// Particularly in ISO BMFF format, an Media Segment contains a moof box followed by a mdat box.
class MediaSegmentInfo {

	constructor() {
		this.beginDts = 0;
		this.endDts = 0;
		this.beginPts = 0;
		this.endPts = 0;
		this.originalBeginDts = 0;
		this.originalEndDts = 0;
		this.syncPoints = [];     // SampleInfo[n], for video IDR frames only
		this.firstSample = null;  // SampleInfo
		this.lastSample = null;   // SampleInfo
	}

	appendSyncPoint(sampleInfo) {  // also called Random Access Point
		sampleInfo.isSyncPoint = true;
		this.syncPoints.push(sampleInfo);
	}

}

// Ordered list for recording video IDR frames, sorted by originalDts
class IDRSampleList {

	constructor() {
		this._list = [];
	}

	clear() {
		this._list = [];
	}

	appendArray(syncPoints) {
		let list = this._list;

		if (syncPoints.length === 0) {
			return;
		}

		if (list.length > 0 && syncPoints[0].originalDts < list[list.length - 1].originalDts) {
			this.clear();
		}

		Array.prototype.push.apply(list, syncPoints);
	}

	getLastSyncPointBeforeDts(dts) {
		if (this._list.length === 0) {
			return null;
		}

		let list = this._list;
		let idx = 0;
		let last = list.length - 1;
		let mid = 0;
		let lbound = 0;
		let ubound = last;

		if (dts < list[0].dts) {
			idx = 0;
			lbound = ubound + 1;
		}

		while (lbound <= ubound) {
			mid = lbound + Math.floor((ubound - lbound) / 2);
			if (mid === last || (dts >= list[mid].dts && dts < list[mid + 1].dts)) {
				idx = mid;
				break;
			} else if (list[mid].dts < dts) {
				lbound = mid + 1;
			} else {
				ubound = mid - 1;
			}
		}
		return this._list[idx];
	}

}

// Data structure for recording information of media segments in single track.
class MediaSegmentInfoList {

	constructor(type) {
		this._type = type;
		this._list = [];
		this._lastAppendLocation = -1;  // cached last insert location
	}

	get type() {
		return this._type;
	}

	get length() {
		return this._list.length;
	}

	isEmpty() {
		return this._list.length === 0;
	}

	clear() {
		this._list = [];
		this._lastAppendLocation = -1;
	}

	_searchNearestSegmentBefore(originalBeginDts) {
		let list = this._list;
		if (list.length === 0) {
			return -2;
		}
		let last = list.length - 1;
		let mid = 0;
		let lbound = 0;
		let ubound = last;

		let idx = 0;

		if (originalBeginDts < list[0].originalBeginDts) {
			idx = -1;
			return idx;
		}

		while (lbound <= ubound) {
			mid = lbound + Math.floor((ubound - lbound) / 2);
			if (mid === last || (originalBeginDts > list[mid].lastSample.originalDts &&
				(originalBeginDts < list[mid + 1].originalBeginDts))) {
				idx = mid;
				break;
			} else if (list[mid].originalBeginDts < originalBeginDts) {
				lbound = mid + 1;
			} else {
				ubound = mid - 1;
			}
		}
		return idx;
	}

	_searchNearestSegmentAfter(originalBeginDts) {
		return this._searchNearestSegmentBefore(originalBeginDts) + 1;
	}

	append(mediaSegmentInfo) {
		let list = this._list;
		let msi = mediaSegmentInfo;
		let lastAppendIdx = this._lastAppendLocation;
		let insertIdx = 0;

		if (lastAppendIdx !== -1 && lastAppendIdx < list.length &&
			msi.originalBeginDts >= list[lastAppendIdx].lastSample.originalDts &&
			((lastAppendIdx === list.length - 1) ||
				(lastAppendIdx < list.length - 1 &&
					msi.originalBeginDts < list[lastAppendIdx + 1].originalBeginDts))) {
			insertIdx = lastAppendIdx + 1;  // use cached location idx
		} else {
			if (list.length > 0) {
				insertIdx = this._searchNearestSegmentBefore(msi.originalBeginDts) + 1;
			}
		}

		this._lastAppendLocation = insertIdx;
		this._list.splice(insertIdx, 0, msi);
	}

	getLastSegmentBefore(originalBeginDts) {
		let idx = this._searchNearestSegmentBefore(originalBeginDts);
		if (idx >= 0) {
			return this._list[idx];
		} else {  // -1
			return null;
		}
	}

	getLastSampleBefore(originalBeginDts) {
		let segment = this.getLastSegmentBefore(originalBeginDts);
		if (segment != null) {
			return segment.lastSample;
		} else {
			return null;
		}
	}

	getLastSyncPointBefore(originalBeginDts) {
		let segmentIdx = this._searchNearestSegmentBefore(originalBeginDts);
		let syncPoints = this._list[segmentIdx].syncPoints;
		while (syncPoints.length === 0 && segmentIdx > 0) {
			segmentIdx--;
			syncPoints = this._list[segmentIdx].syncPoints;
		}
		if (syncPoints.length > 0) {
			return syncPoints[syncPoints.length - 1];
		} else {
			return null;
		}
	}
}

;// CONCATENATED MODULE: ./src/utils/exception.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class RuntimeException {
    constructor(message) {
        this._message = message;
    }

    get name() {
        return 'RuntimeException';
    }

    get message() {
        return this._message;
    }

    toString() {
        return this.name + ': ' + this.message;
    }
}

class IllegalStateException extends RuntimeException {
    constructor(message) {
        super(message);
    }

    get name() {
        return 'IllegalStateException';
    }
}

class InvalidArgumentException extends RuntimeException {
    constructor(message) {
        super(message);
    }

    get name() {
        return 'InvalidArgumentException';
    }
}

class NotImplementedException extends RuntimeException {
    constructor(message) {
        super(message);
    }

    get name() {
        return 'NotImplementedException';
    }
}

;// CONCATENATED MODULE: ./src/utils/utils.js

/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 *
 * @param {Uint8Array} bufs
 * @returns {Uint8Array}
 */

function _concatArrayBuffers(...bufs){
    const result = new Uint8Array(bufs.reduce((totalSize, buf)=>totalSize+buf.byteLength,0));
    bufs.reduce((offset, buf)=>{
        result.set(buf,offset)
        return offset+buf.byteLength
    },0)

    return result;
}

/**
 *
 * @param {String} str
 * @returns {*[]}
 * @private
 */
function _stringToByteArray(str) {
    const bytes = [];

    for(let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        if(char > 0xFF) {
            bytes.push(char >>> 8);
        }

        bytes.push(char & 0xFF);
    }
    return bytes;
}

/**
 *
 * @param {Number} num
 * @returns {*[]}
 * @private
 */
function _numberToByteArray(num) {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, num, false);
    return [].slice.call(new Uint8Array(buffer));
}

/**
 *
 * @param {byte[]} ba
 * @returns {number}
 * @private
 */
function _byteArrayToNumber(ba){
    let buf = new ArrayBuffer(ba.length);
    let view = new DataView(buf);

    ba.forEach(function (b, i) {
        view.setUint8(i, b);
    });

    return view.getFloat64(0);
}

/**
 *
 * @param {byte[]} ba
 * @returns {string}
 * @private
 */
function _byteArrayToString(ba){
    let ret = "";

    for(let i = 0; i < ba.length; i++){
        ret += String.fromCharCode(ba[i]);
    }

    return ret;
}

const defaultConfig = {
    enableStashBuffer: true,
    stashInitialSize: undefined,

    isLive: true,

    autoCleanupSourceBuffer: true,
    autoCleanupMaxBackwardDuration: 3 * 60,
    autoCleanupMinBackwardDuration: 2 * 60,

    statisticsInfoReportInterval: 600,

    fixAudioTimestampGap: true,

    headers: undefined
};


const TransmuxingEvents = {
    IO_ERROR: 'io_error',
    DEMUX_ERROR: 'demux_error',
    INIT_SEGMENT: 'init_segment',
    MEDIA_SEGMENT: 'media_segment',
    LOADING_COMPLETE: 'loading_complete',
    RECOVERED_EARLY_EOF: 'recovered_early_eof',
    MEDIA_INFO: 'media_info',
    METADATA_ARRIVED: 'metadata_arrived',
    SCRIPTDATA_ARRIVED: 'scriptdata_arrived',
    STATISTICS_INFO: 'statistics_info',
    RECOMMEND_SEEKPOINT: 'recommend_seekpoint'
};

const DemuxErrors = {
    OK: 'OK',
    FORMAT_ERROR: 'FormatError',
    FORMAT_UNSUPPORTED: 'FormatUnsupported',
    CODEC_UNSUPPORTED: 'CodecUnsupported'
};

const MSEEvents = {
    ERROR: 'error',
    SOURCE_OPEN: 'source_open',
    UPDATE_END: 'update_end',
    BUFFER_FULL: 'buffer_full'
};

const PlayerEvents = {
    ERROR: 'error',
    LOADING_COMPLETE: 'loading_complete',
    RECOVERED_EARLY_EOF: 'recovered_early_eof',
    MEDIA_INFO: 'media_info',
    METADATA_ARRIVED: 'metadata_arrived',
    SCRIPTDATA_ARRIVED: 'scriptdata_arrived',
    STATISTICS_INFO: 'statistics_info'
};

const ErrorTypes = {
    NETWORK_ERROR: 'NetworkError',
    MEDIA_ERROR: 'MediaError',
    OTHER_ERROR: 'OtherError'
};

const LoaderErrors = {
    OK: 'OK',
    EXCEPTION: 'Exception',
    HTTP_STATUS_CODE_INVALID: 'HttpStatusCodeInvalid',
    CONNECTING_TIMEOUT: 'ConnectingTimeout',
    EARLY_EOF: 'EarlyEof',
    UNRECOVERABLE_EARLY_EOF: 'UnrecoverableEarlyEof'
};

const ErrorDetails = {
    NETWORK_EXCEPTION: LoaderErrors.EXCEPTION,
    NETWORK_STATUS_CODE_INVALID: LoaderErrors.HTTP_STATUS_CODE_INVALID,
    NETWORK_TIMEOUT: LoaderErrors.CONNECTING_TIMEOUT,
    NETWORK_UNRECOVERABLE_EARLY_EOF: LoaderErrors.UNRECOVERABLE_EARLY_EOF,

    MEDIA_MSE_ERROR: 'MediaMSEError',

    MEDIA_FORMAT_ERROR: DemuxErrors.FORMAT_ERROR,
    MEDIA_FORMAT_UNSUPPORTED: DemuxErrors.FORMAT_UNSUPPORTED,
    MEDIA_CODEC_UNSUPPORTED: DemuxErrors.CODEC_UNSUPPORTED
};

;// CONCATENATED MODULE: ./src/utils/browser.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let Browser = {};

function detect() {
	// modified from jquery-browser-plugin

	let ua = self.navigator.userAgent.toLowerCase();

	let match = /(edge)\/([\w.]+)/.exec(ua) ||
		/(opr)[\/]([\w.]+)/.exec(ua) ||
		/(chrome)[ \/]([\w.]+)/.exec(ua) ||
		/(iemobile)[\/]([\w.]+)/.exec(ua) ||
		/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		/(msie) ([\w.]+)/.exec(ua) ||
		ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
		ua.indexOf('compatible') < 0 && /(firefox)[ \/]([\w.]+)/.exec(ua) ||
		[];

	let platform_match = /(ipad)/.exec(ua) ||
		/(ipod)/.exec(ua) ||
		/(windows phone)/.exec(ua) ||
		/(iphone)/.exec(ua) ||
		/(kindle)/.exec(ua) ||
		/(android)/.exec(ua) ||
		/(windows)/.exec(ua) ||
		/(mac)/.exec(ua) ||
		/(linux)/.exec(ua) ||
		/(cros)/.exec(ua) ||
		[];

	let matched = {
		browser: match[5] || match[3] || match[1] || '',
		version: match[2] || match[4] || '0',
		majorVersion: match[4] || match[2] || '0',
		platform: platform_match[0] || ''
	};

	let browser = {};
	if (matched.browser) {
		browser[matched.browser] = true;

		let versionArray = matched.majorVersion.split('.');
		browser.version = {
			major: parseInt(matched.majorVersion, 10),
			string: matched.version
		};
		if (versionArray.length > 1) {
			browser.version.minor = parseInt(versionArray[1], 10);
		}
		if (versionArray.length > 2) {
			browser.version.build = parseInt(versionArray[2], 10);
		}
	}

	if (matched.platform) {
		browser[matched.platform] = true;
	}

	if (browser.chrome || browser.opr || browser.safari) {
		browser.webkit = true;
	}

	// MSIE. IE11 has 'rv' identifer
	if (browser.rv || browser.iemobile) {
		if (browser.rv) {
			delete browser.rv;
		}
		let msie = 'msie';
		matched.browser = msie;
		browser[msie] = true;
	}

	// Microsoft Edge
	if (browser.edge) {
		delete browser.edge;
		let msedge = 'msedge';
		matched.browser = msedge;
		browser[msedge] = true;
	}

	// Opera 15+
	if (browser.opr) {
		let opera = 'opera';
		matched.browser = opera;
		browser[opera] = true;
	}

	// Stock android browsers are marked as Safari
	if (browser.safari && browser.android) {
		let android = 'android';
		matched.browser = android;
		browser[android] = true;
	}

	browser.name = matched.browser;
	browser.platform = matched.platform;

	for (let key in Browser) {
		if (Browser.hasOwnProperty(key)) {
			delete Browser[key];
		}
	}
	Object.assign(Browser, browser);
}

detect();

/* harmony default export */ const browser = (Browser);

;// CONCATENATED MODULE: ./src/utils/mse-controller.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */








class MSEController {
	TAG = 'MSEController';

	constructor(config) {
		this._config = config;
		this._emitter = new event_emitter();

		if (this._config.isLive && this._config.autoCleanupSourceBuffer == undefined) {
			// For live stream, do auto cleanup by default
			this._config.autoCleanupSourceBuffer = true;
		}

		this.e = {
			onSourceOpen: this._onSourceOpen.bind(this),
			onSourceEnded: this._onSourceEnded.bind(this),
			onSourceClose: this._onSourceClose.bind(this),
			onSourceBufferError: this._onSourceBufferError.bind(this),
			onSourceBufferUpdateEnd: this._onSourceBufferUpdateEnd.bind(this)
		};

		this._mediaSource = null;
		this._mediaSourceObjectURL = null;
		this._mediaElement = null;

		this._isBufferFull = false;
		this._hasPendingEos = false;

		this._requireSetMediaDuration = false;
		this._pendingMediaDuration = 0;

		this._pendingSourceBufferInit = [];
		this._mimeTypes = {
			video: null,
			audio: null
		};
		this._sourceBuffers = {
			video: null,
			audio: null
		};
		this._lastInitSegments = {
			video: null,
			audio: null
		};
		this._pendingSegments = {
			video: [],
			audio: []
		};
		this._pendingRemoveRanges = {
			video: [],
			audio: []
		};
		this._idrList = new IDRSampleList();
	}

	destroy() {
		if (this._mediaElement || this._mediaSource) {
			this.detachMediaElement();
		}
		this.e = null;
		this._emitter.removeAllListener();
		this._emitter = null;
	}

	on(event, listener) {
		this._emitter.addListener(event, listener);
	}

	off(event, listener) {
		this._emitter.removeListener(event, listener);
	}

	attachMediaElement(mediaElement) {
		logger.i(this.TAG, "attach");
		if (this._mediaSource) {
			throw new IllegalStateException('MediaSource has been attached to an HTMLMediaElement!');
		}
		let ms = this._mediaSource = new window.MediaSource();
		ms.addEventListener('sourceopen', this.e.onSourceOpen);
		ms.addEventListener('sourceended', this.e.onSourceEnded);
		ms.addEventListener('sourceclose', this.e.onSourceClose);

		this._mediaElement = mediaElement;
		this._mediaSourceObjectURL = window.URL.createObjectURL(this._mediaSource);
		mediaElement.src = this._mediaSourceObjectURL;
	}

	detachMediaElement() {
		logger.i(this.TAG, "detach");

		if (this._mediaSource) {
			let ms = this._mediaSource;

			if (ms.readyState === 'open') {
				try {
					ms.endOfStream();
				} catch (error) {
					logger.e(this.TAG, error.message);
				}
			}


			for (let type in this._sourceBuffers) {
				// pending segments should be discard
				let ps = this._pendingSegments[type];
				ps.splice(0, ps.length);
				this._pendingSegments[type] = null;
				this._pendingRemoveRanges[type] = null;
				this._lastInitSegments[type] = null;

				// remove all sourcebuffers
				let sb = this._sourceBuffers[type];
				if (sb) {
					logger.i(this.TAG, "try to remove sourcebuffer: " + type);
					if (ms.readyState !== 'closed') {
						// ms edge can throw an error: Unexpected call to method or property access
						try {
							logger.i(this.TAG, "removing sourcebuffer: " + type);
							ms.removeSourceBuffer(sb);
						} catch (error) {
							logger.e(this.TAG, error.message);
						}
						sb.removeEventListener('error', this.e.onSourceBufferError);
						sb.removeEventListener('updateend', this.e.onSourceBufferUpdateEnd);
					}
					this._mimeTypes[type] = null;
					this._sourceBuffers[type] = null;
				}
			}



			// proprerly remove sourcebuffers
			/*
			for(let mimeType in this._sourceBuffers) {
				this._mediaSource.removeSourceBuffer(this._sourceBuffers[mimeType]);
			}*/

			ms.removeEventListener('sourceopen', this.e.onSourceOpen);
			ms.removeEventListener('sourceended', this.e.onSourceEnded);
			ms.removeEventListener('sourceclose', this.e.onSourceClose);
			this._pendingSourceBufferInit = [];
			this._isBufferFull = false;
			this._idrList.clear();
			this._mediaSource = null;

		} else {
			logger.w(this.TAG, "no mediasource attached");
		}

		if (this._mediaElement) {
			this._mediaElement.src = '';
			this._mediaElement.removeAttribute('src');
			this._mediaElement = null;
		}

		if (this._mediaSourceObjectURL) {
			window.URL.revokeObjectURL(this._mediaSourceObjectURL);
			this._mediaSourceObjectURL = null;
		}
	}

	appendInitSegment(initSegment, deferred) {
		logger.i(this.TAG, "appendInitSegment", initSegment);
		if (!this._mediaSource || this._mediaSource.readyState !== 'open') {
			// sourcebuffer creation requires mediaSource.readyState === 'open'
			// so we defer the sourcebuffer creation, until sourceopen event triggered
			this._pendingSourceBufferInit.push(initSegment);
			// make sure that this InitSegment is in the front of pending segments queue
			this._pendingSegments[initSegment.type].push(initSegment);
			return;
		}

		let is = initSegment;
		let mimeType = `${is.container}`;
		if (is.codec && is.codec.length > 0) {
			mimeType += `;codecs=${is.codec}`;
		}

		let firstInitSegment = false;

		logger.v(this.TAG, 'Received Initialization Segment, mimeType: ' + mimeType);
		this._lastInitSegments[is.type] = is;

		if (mimeType !== this._mimeTypes[is.type]) {
			if (!this._mimeTypes[is.type]) {  // empty, first chance create sourcebuffer
				firstInitSegment = true;
				try {
					let sb = this._sourceBuffers[is.type] = this._mediaSource.addSourceBuffer(mimeType);
					sb.addEventListener('error', this.e.onSourceBufferError);
					sb.addEventListener('updateend', this.e.onSourceBufferUpdateEnd);
				} catch (error) {
					logger.e(this.TAG, error.message);
					this._emitter.emit(MSEEvents.ERROR, {code: error.code, msg: error.message});
					return;
				}
			} else {
				logger.v(this.TAG, `Notice: ${is.type} mimeType changed, origin: ${this._mimeTypes[is.type]}, target: ${mimeType}`);
			}
			this._mimeTypes[is.type] = mimeType;
		}

		if (!deferred) {
			// deferred means this InitSegment has been pushed to pendingSegments queue
			this._pendingSegments[is.type].push(is);
		}
		if (!firstInitSegment) {  // append immediately only if init segment in subsequence
			if (this._sourceBuffers[is.type] && !this._sourceBuffers[is.type].updating) {
				this._doAppendSegments();
			}
		}
		if (browser.safari && is.container === 'audio/mpeg' && is.mediaDuration > 0) {
			// 'audio/mpeg' track under Safari may cause MediaElement's duration to be NaN
			// Manually correct MediaSource.duration to make progress bar seekable, and report right duration
			this._requireSetMediaDuration = true;
			this._pendingMediaDuration = is.mediaDuration / 1000;  // in seconds
			this._updateMediaSourceDuration();
		}
	}

	appendMediaSegment(mediaSegment) {
		logger.d(this.TAG, "appendMediaSegment", mediaSegment);
		let ms = mediaSegment;
		this._pendingSegments[ms.type].push(ms);

		if (this._config.autoCleanupSourceBuffer && this._needCleanupSourceBuffer()) {
			this._doCleanupSourceBuffer();
		}

		let sb = this._sourceBuffers[ms.type];
		if (sb && !sb.updating && !this._hasPendingRemoveRanges()) {
			this._doAppendSegments();
		}
	}

	endOfStream() {
		let ms = this._mediaSource;
		let sb = this._sourceBuffers;
		if (!ms || ms.readyState !== 'open') {
			if (ms && ms.readyState === 'closed' && this._hasPendingSegments()) {
				// If MediaSource hasn't turned into open state, and there're pending segments
				// Mark pending endOfStream, defer call until all pending segments appended complete
				this._hasPendingEos = true;
			}
			return;
		}
		if (sb.video && sb.video.updating || sb.audio && sb.audio.updating) {
			// If any sourcebuffer is updating, defer endOfStream operation
			// See _onSourceBufferUpdateEnd()
			this._hasPendingEos = true;
		} else {
			this._hasPendingEos = false;
			// Notify media data loading complete
			// This is helpful for correcting total duration to match last media segment
			// Otherwise MediaElement's ended event may not be triggered
			ms.endOfStream();
		}
	}

	_needCleanupSourceBuffer() {
		if (!this._config.autoCleanupSourceBuffer) {
			return false;
		}

		let currentTime = this._mediaElement.currentTime;

		for (let type in this._sourceBuffers) {
			let sb = this._sourceBuffers[type];
			if (sb) {
				let buffered = sb.buffered;
				if (buffered.length >= 1) {
					if (currentTime - buffered.start(0) >= this._config.autoCleanupMaxBackwardDuration) {
						return true;
					}
				}
			}
		}

		return false;
	}

	_doCleanupSourceBuffer() {
		let currentTime = this._mediaElement.currentTime;

		for (let type in this._sourceBuffers) {
			let sb = this._sourceBuffers[type];
			if (sb) {
				let buffered = sb.buffered;
				let doRemove = false;

				for (let i = 0; i < buffered.length; i++) {
					let start = buffered.start(i);
					let end = buffered.end(i);

					if (start <= currentTime && currentTime < end + 3) {  // padding 3 seconds
						if (currentTime - start >= this._config.autoCleanupMaxBackwardDuration) {
							doRemove = true;
							let removeEnd = currentTime - this._config.autoCleanupMinBackwardDuration;
							this._pendingRemoveRanges[type].push({start: start, end: removeEnd});
						}
					} else if (end < currentTime) {
						doRemove = true;
						this._pendingRemoveRanges[type].push({start: start, end: end});
					}
				}

				if (doRemove && !sb.updating) {
					this._doRemoveRanges();
				}
			}
		}
	}

	_updateMediaSourceDuration() {
		let sb = this._sourceBuffers;
		if (this._mediaElement.readyState === 0 || this._mediaSource.readyState !== 'open') {
			return;
		}
		if ((sb.video && sb.video.updating) || (sb.audio && sb.audio.updating)) {
			return;
		}

		let current = this._mediaSource.duration;
		let target = this._pendingMediaDuration;

		if (target > 0 && (isNaN(current) || target > current)) {
			logger.v(this.TAG, `Update MediaSource duration from ${current} to ${target}`);
			this._mediaSource.duration = target;
		}

		this._requireSetMediaDuration = false;
		this._pendingMediaDuration = 0;
	}

	_doRemoveRanges() {
		for (let type in this._pendingRemoveRanges) {
			if (!this._sourceBuffers[type] || this._sourceBuffers[type].updating) {
				continue;
			}
			let sb = this._sourceBuffers[type];
			let ranges = this._pendingRemoveRanges[type];
			while (ranges.length && !sb.updating) {
				let range = ranges.shift();
				sb.remove(range.start, range.end);
			}
		}
	}

	_doAppendSegments() {
		let pendingSegments = this._pendingSegments;

		for (let type in pendingSegments) {
			if (!this._sourceBuffers[type] || this._sourceBuffers[type].updating) {
				continue;
			}

			if (pendingSegments[type].length > 0) {
				let segment = pendingSegments[type].shift();

				if (segment.timestampOffset) {
					// For MPEG audio stream in MSE, if unbuffered-seeking occurred
					// We need explicitly set timestampOffset to the desired point in timeline for mpeg SourceBuffer.
					let currentOffset = this._sourceBuffers[type].timestampOffset;
					let targetOffset = segment.timestampOffset / 1000;  // in seconds

					let delta = Math.abs(currentOffset - targetOffset);
					if (delta > 0.1) {  // If time delta > 100ms
						logger.v(this.TAG, `Update MPEG audio timestampOffset from ${currentOffset} to ${targetOffset}`);
						this._sourceBuffers[type].timestampOffset = targetOffset;
					}
					delete segment.timestampOffset;
				}

				if (!segment.data || segment.data.byteLength === 0) {
					// Ignore empty buffer
					continue;
				}

				try {
					this._sourceBuffers[type].appendBuffer(segment.data);
					this._isBufferFull = false;
					if (type === 'video' && segment.hasOwnProperty('info')) {
						this._idrList.appendArray(segment.info.syncPoints);
					}
				} catch (error) {
					this._pendingSegments[type].unshift(segment);
					if (error.code === 22) {  // QuotaExceededError
						/* Notice that FireFox may not throw QuotaExceededError if SourceBuffer is full
						 * Currently we can only do lazy-load to avoid SourceBuffer become scattered.
						 * SourceBuffer eviction policy may be changed in future version of FireFox.
						 *
						 * Related issues:
						 * https://bugzilla.mozilla.org/show_bug.cgi?id=1279885
						 * https://bugzilla.mozilla.org/show_bug.cgi?id=1280023
						 */

						// report buffer full, abort network IO
						if (!this._isBufferFull) {
							this._emitter.emit(MSEEvents.BUFFER_FULL);
						}
						this._isBufferFull = true;
					} else {
						logger.e(this.TAG, error.message);
						this._emitter.emit(MSEEvents.ERROR, {code: error.code, msg: error.message});
					}
				}
			}
		}
	}

	_onSourceOpen() {
		logger.v(this.TAG, 'MediaSource onSourceOpen');
		this._mediaSource.removeEventListener('sourceopen', this.e.onSourceOpen);
		// deferred sourcebuffer creation / initialization
		if (this._pendingSourceBufferInit.length > 0) {
			let pendings = this._pendingSourceBufferInit;
			while (pendings.length) {
				let segment = pendings.shift();
				this.appendInitSegment(segment, true);
			}
		}
		// there may be some pending media segments, append them
		if (this._hasPendingSegments()) {
			this._doAppendSegments();
		}
		this._emitter.emit(MSEEvents.SOURCE_OPEN);
	}

	_onSourceEnded() {
		// fired on endOfStream
		logger.v(this.TAG, 'MediaSource onSourceEnded');
	}

	_onSourceClose() {
		// fired on detaching from media element
		logger.v(this.TAG, 'MediaSource onSourceClose');
		if (this._mediaSource && this.e != null) {
			this._mediaSource.removeEventListener('sourceopen', this.e.onSourceOpen);
			this._mediaSource.removeEventListener('sourceended', this.e.onSourceEnded);
			this._mediaSource.removeEventListener('sourceclose', this.e.onSourceClose);
		}
	}

	_hasPendingSegments() {
		let ps = this._pendingSegments;
		return ps.video.length > 0 || ps.audio.length > 0;
	}

	_hasPendingRemoveRanges() {
		let prr = this._pendingRemoveRanges;
		return prr.video.length > 0 || prr.audio.length > 0;
	}

	_onSourceBufferUpdateEnd() {
		if (this._requireSetMediaDuration) {
			this._updateMediaSourceDuration();
		} else if (this._hasPendingRemoveRanges()) {
			this._doRemoveRanges();
		} else if (this._hasPendingSegments()) {
			this._doAppendSegments();
		} else if (this._hasPendingEos) {
			this.endOfStream();
		}
		this._emitter.emit(MSEEvents.UPDATE_END);
	}

	_onSourceBufferError(e) {
		logger.e(this.TAG, `SourceBuffer Error: ${e}`);
		// this error might not always be fatal, just ignore it
	}

}

/* harmony default export */ const mse_controller = (MSEController);

// EXTERNAL MODULE: ./node_modules/worker-loader/dist/runtime/inline.js
var inline = __webpack_require__("./node_modules/worker-loader/dist/runtime/inline.js");
var inline_default = /*#__PURE__*/__webpack_require__.n(inline);
;// CONCATENATED MODULE: ./src/wss/connection.worker.js



function Worker_fn() {
  return inline_default()("/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\nvar __webpack_exports__ = {};\n/*!***************************************************!*\\\n  !*** ./src/wss/connection.worker.js + 26 modules ***!\n  \\***************************************************/\n\n;// CONCATENATED MODULE: ./src/utils/logger.js\n/*\n * Copyright (C) 2016 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\nclass Log {\n    static OFF = -1;\n    static TRACE = 0;\n    static DEBUG = 1;\n    static INFO = 2;\n    static WARN = 3;\n    static ERROR = 4;\n    static CRITICAL = 5;\n    static WITH_STACKTRACE = true;\n\n    static LEVEL = Log.INFO;\n\n    /**\n     * Object with [ClassName, Loglevel]\n     * @type {Object}\n     */\n    static loglevels = {};\n\n    /**\n     *\n     * @param {Number} level\n     * @param {String} tag\n     * @param txt\n     * @private\n     */\n    static _output = function output(level, tag, ...txt){\n        let tmpLevel = Log.LEVEL;\n\n        // Dirty fix because inline worker cant access static properties\n        try{\n            if(Log.loglevels[tag]) tmpLevel = Log.loglevels[tag];\n        }catch (e) {\n            return;\n        }\n\n\n        if(tmpLevel === Log.OFF) return;\n        if(tmpLevel > level) return;\n\n        const callstack = Log._getStackTrace();\n\n        // debug aufruf entfernen\n        callstack.shift();\n        callstack.shift();\n\n        let color = \"color: silver\";\n\n        switch(level) {\n            case Log.TRACE:\t// TRACE\n                color = \"background-color: gray\";\n                break;\n\n            case Log.DEBUG:\t// DEBUG\n                break;\n\n            case Log.INFO:\t// INFO\n                color = \"color: green\";\n                break;\n\n            case Log.WARN:\t// WARN\n                color = \"color: orange; background-color: #EAA80035\";\n                break;\n\n            case Log.ERROR:\t// ERROR\n                color = \"color: red; background-color: #FF000020\";\n                break;\n\n            case Log.CRITICAL:\t// CRITICAL\n                color = \"color: red\";\n                break;\n        }\n\n        Log._print(callstack, color, tag, ...txt);\n    };\n\n    /**\n     * Internal for console dump\n     * @param {String[]} callstack\n     * @param {String} color\n     * @param {String} tag\n     * @param txt\n     * @private\n     */\n    static _print(callstack, color, tag, ...txt){\n        if(Log.WITH_STACKTRACE){\n            if(Log.LEVEL === Log.ERROR){\n                console.group(\"%c[\" + tag + \"]\", color, ...txt);\n            } else {\n                console.groupCollapsed(\"%c[\" + tag + \"]\", color, ...txt);\n            }\n\n            for(let i = 0; i < callstack.length; i++) {\n                console.log(\"%c\" + callstack[i], color);\n            }\n\n            console.groupEnd();\n\n        } else {\n            console.log(\"%c[\" + tag + \"]\", color, ...txt)\n        }\n    }\n\n    /**\n     * Get Callstack\n     * @returns {String[]}\n     * @private\n     */\n    static _getStackTrace = function() {\n        let callstack = [];\n\n        try {\n            i.dont.exist+=0; //doesn't exist- that's the point\n\n        } catch(e) {\n            if (e.stack) { //Firefox\n                let lines = e.stack.split('\\n');\n\n                for (let i=0; i < lines.length; i++) {\n                    callstack.push(lines[i]);\n                }\n\n                //Ersten Eintrag entfernen\n                callstack.shift();\n                callstack.shift();\n            }\n        }\n\n        return(callstack);\n    };\n\n    /**\n     * Log Critical\n     * @param {String} tag\n     * @param msg\n     */\n    static c(tag, ...msg) {\n        Log._output(Log.CRITICAL, tag, ...msg);\n    }\n\n    /**\n     * Log Error\n     * @param {String} tag\n     * @param msg\n     */\n    static e(tag, ...msg) {\n        Log._output(Log.ERROR, tag, ...msg);\n    }\n\n    /**\n     * Log Info\n     * @param {String} tag\n     * @param msg\n     */\n    static i(tag, ...msg) {\n        Log._output(Log.INFO, tag, ...msg);\n    }\n\n    /**\n     * Log Warning\n     * @param {String} tag\n     * @param msg\n     */\n    static w(tag, ...msg) {\n        Log._output(Log.WARN, tag, ...msg);\n    }\n\n    /**\n     * Log Debug\n     * @param {String} tag\n     * @param msg\n     */\n    static d(tag, ...msg) {\n        Log._output(Log.DEBUG, tag, ...msg);\n    }\n\n    /**\n     * Log Debug\n     * @param {String} tag\n     * @param msg\n     */\n    static v(tag, ...msg) {\n        Log._output(Log.DEBUG, tag, ...msg);\n    }\n\n    /**\n     * Log Trace\n     * @param {String} tag\n     * @param msg\n     */\n    static t(tag, ...msg) {\n        Log._output(Log.TRACE, tag, ...msg);\n    }\n}\n\n/* harmony default export */ const logger = (Log);\n\n;// CONCATENATED MODULE: ./src/wss/WSSConnectionManager.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\nclass WSSConnectionManager{\n    TAG = \"WSSConnectionManager\";\n    host;\n    port;\n    wss;\n\n    /**\n     *\n     * @param {String} host\n     * @param {Number} port\n     * @param callback\n     */\n    open(host, port, callback){\n        this.host = host;\n        logger.v(this.TAG, \"connecting to: \" + host + \":\" + port);\n        this.wss = new WebSocket(\"wss://\" + host + \":\" + port + \"/\");\n\n        this.wss.binaryType = \"arraybuffer\";\n\n        this.wss.onopen = (e)=>{\n            logger.v(this.TAG, e);\n            callback(true);\n        }\n\n        this.wss.onclose = (e)=>{\n            logger.w(this.TAG, e);\n            postMessage([\"ConnectionLost\"]);\n        }\n\n        this.wss.onerror = (e)=>{\n            logger.e(this.TAG, e);\n            callback(false);\n        }\n    }\n\n    registerMessageHandler(cb){\n        this.wss.onmessage = cb;\n    }\n\n    getSocket(){\n        return this.wss;\n    }\n\n    getHost(){\n        return this.host;\n    }\n\n    /**\n     * close Websocket\n     */\n    close(){\n        this.wss.close();\n    }\n}\n\n/* harmony default export */ const wss_WSSConnectionManager = (WSSConnectionManager);\n\n;// CONCATENATED MODULE: ./src/rtmp/RTMPHandshake.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\nclass RTMPHandshake{\n    TAG = \"RTMPHandshake\";\n    state = 0;\n    onHandshakeDone = null;\n    c1;\n    c2;\n\n    /**\n     *\n     * @param {WebSocket} socket\n     */\n    constructor(socket) {\n        this.socket = socket;\n\n        this.socket.onmessage = (e)=>{\n            logger.v(this.TAG, e.data);\n            this.processServerInput(new Uint8Array(e.data));\n        }\n    }\n\n    /**\n     * Do RTMP Handshake\n     */\n    do(){\n        if(!this.onHandshakeDone) {\n            logger.e(this.TAG, \"onHandshakeDone not defined\");\n            return;\n        }\n\n        logger.v(this.TAG, \"send C0\");\n        this.socket.send(new Uint8Array([0x03]));\n        this.state = 1;\n\n        logger.v(this.TAG, \"send C1\");\n        this.socket.send(this._generateC1());\n        this.state = 2;\n    }\n\n    _generateC1(){\n        const c1 = new Uint8Array(1536);\n\n        for(let i = 0; i < c1.length; i++) {\n            c1[i] = Math.floor(Math.random() * 256);\n        }\n\n        let time = Math.round(Date.now() / 1000);\n\n        c1[0] = (time >>> 24);\n        c1[1] = (time >>> 16);\n        c1[2] = (time >>> 8);\n        c1[3] = (time);\n\n        c1[4] = 0;\n        c1[5] = 0;\n        c1[6] = 0;\n        c1[7] = 0;\n\n        this.c1 = c1;\n        return c1;\n    }\n\n    _generateC2(s1){\n        this.c2 = s1;\n        return this.c2;\n    }\n\n    /**\n     *\n     * @param {Uint8Array} data\n     * @private\n     */\n    _parseS0(data){\n        logger.v(this.TAG, \"S0: \", data);\n\n        if(data[0] !== 0x03) {\n            logger.e(this.TAG, \"S0 response not 0x03\");\n\n        } else {\n            logger.v(this.TAG, \"1st Byte OK\");\n        }\n\n        this.state = 3;\n\n        if(data.length > 1) {\n            logger.v(this.TAG, \"S1 included\");\n            this._parseS1(data.slice(1));\n        }\n    }\n\n    /**\n     *\n     * @param {Uint8Array} data\n     * @private\n     */\n    _parseS1(data){\n        logger.v(this.TAG, \"parse S1: \", data);\n        this.state = 4;\n\n        let s1 = data.slice(0, 1536);\n\n        logger.v(this.TAG, \"send C2\");\n        this.socket.send(this._generateC2(s1));\n\n        this.state = 5;\n\n        if(data.length > 1536) {\n            logger.v(this.TAG, \"S2 included: \" + data.length);\n            this._parseS2(data.slice(1536));\n        }\n    }\n\n    /**\n     *\n     * @param {Uint8Array} data\n     * @private\n     */\n    _parseS2(data) {\n        logger.v(this.TAG, \"parse S2: \", data);\n\n        if(!this._compare(this.c1, data)) {\n            logger.e(this.TAG, \"C1 S1 not equal\");\n            this.onHandshakeDone(false);\n            return;\n        }\n\n        this.state = 6;\n\n        logger.v(this.TAG, \"RTMP Connection established\");\n\n        this.onHandshakeDone(true);\n    }\n\n    _compare(ar1, ar2){\n        for(let i = 0; i < ar1.length; i++){\n            if(ar1[i] !== ar2[i]) return false;\n        }\n\n        return true;\n    }\n\n\n    /**\n     *\n     * @param {Uint8Array} data\n     */\n    processServerInput(data){\n        switch(this.state){\n            case 2:\t\t//\n                this._parseS0(data);\n                break;\n\n            case 3:\n                this._parseS1(data);\n                break;\n\n            case 5:\n                this._parseS2(data);\n                break;\n        }\n    }\n}\n\n/* harmony default export */ const rtmp_RTMPHandshake = (RTMPHandshake);\n\n;// CONCATENATED MODULE: ./src/utils/utils.js\n\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n/**\n *\n * @param {Uint8Array} bufs\n * @returns {Uint8Array}\n */\n\nfunction _concatArrayBuffers(...bufs){\n    const result = new Uint8Array(bufs.reduce((totalSize, buf)=>totalSize+buf.byteLength,0));\n    bufs.reduce((offset, buf)=>{\n        result.set(buf,offset)\n        return offset+buf.byteLength\n    },0)\n\n    return result;\n}\n\n/**\n *\n * @param {String} str\n * @returns {*[]}\n * @private\n */\nfunction _stringToByteArray(str) {\n    const bytes = [];\n\n    for(let i = 0; i < str.length; i++) {\n        const char = str.charCodeAt(i);\n        if(char > 0xFF) {\n            bytes.push(char >>> 8);\n        }\n\n        bytes.push(char & 0xFF);\n    }\n    return bytes;\n}\n\n/**\n *\n * @param {Number} num\n * @returns {*[]}\n * @private\n */\nfunction _numberToByteArray(num) {\n    const buffer = new ArrayBuffer(8);\n    new DataView(buffer).setFloat64(0, num, false);\n    return [].slice.call(new Uint8Array(buffer));\n}\n\n/**\n *\n * @param {byte[]} ba\n * @returns {number}\n * @private\n */\nfunction _byteArrayToNumber(ba){\n    let buf = new ArrayBuffer(ba.length);\n    let view = new DataView(buf);\n\n    ba.forEach(function (b, i) {\n        view.setUint8(i, b);\n    });\n\n    return view.getFloat64(0);\n}\n\n/**\n *\n * @param {byte[]} ba\n * @returns {string}\n * @private\n */\nfunction _byteArrayToString(ba){\n    let ret = \"\";\n\n    for(let i = 0; i < ba.length; i++){\n        ret += String.fromCharCode(ba[i]);\n    }\n\n    return ret;\n}\n\nconst defaultConfig = {\n    enableStashBuffer: true,\n    stashInitialSize: undefined,\n\n    isLive: true,\n\n    autoCleanupSourceBuffer: true,\n    autoCleanupMaxBackwardDuration: 3 * 60,\n    autoCleanupMinBackwardDuration: 2 * 60,\n\n    statisticsInfoReportInterval: 600,\n\n    fixAudioTimestampGap: true,\n\n    headers: undefined\n};\n\n\nconst TransmuxingEvents = {\n    IO_ERROR: 'io_error',\n    DEMUX_ERROR: 'demux_error',\n    INIT_SEGMENT: 'init_segment',\n    MEDIA_SEGMENT: 'media_segment',\n    LOADING_COMPLETE: 'loading_complete',\n    RECOVERED_EARLY_EOF: 'recovered_early_eof',\n    MEDIA_INFO: 'media_info',\n    METADATA_ARRIVED: 'metadata_arrived',\n    SCRIPTDATA_ARRIVED: 'scriptdata_arrived',\n    STATISTICS_INFO: 'statistics_info',\n    RECOMMEND_SEEKPOINT: 'recommend_seekpoint'\n};\n\nconst DemuxErrors = {\n    OK: 'OK',\n    FORMAT_ERROR: 'FormatError',\n    FORMAT_UNSUPPORTED: 'FormatUnsupported',\n    CODEC_UNSUPPORTED: 'CodecUnsupported'\n};\n\nconst MSEEvents = {\n    ERROR: 'error',\n    SOURCE_OPEN: 'source_open',\n    UPDATE_END: 'update_end',\n    BUFFER_FULL: 'buffer_full'\n};\n\nconst PlayerEvents = {\n    ERROR: 'error',\n    LOADING_COMPLETE: 'loading_complete',\n    RECOVERED_EARLY_EOF: 'recovered_early_eof',\n    MEDIA_INFO: 'media_info',\n    METADATA_ARRIVED: 'metadata_arrived',\n    SCRIPTDATA_ARRIVED: 'scriptdata_arrived',\n    STATISTICS_INFO: 'statistics_info'\n};\n\nconst ErrorTypes = {\n    NETWORK_ERROR: 'NetworkError',\n    MEDIA_ERROR: 'MediaError',\n    OTHER_ERROR: 'OtherError'\n};\n\nconst LoaderErrors = {\n    OK: 'OK',\n    EXCEPTION: 'Exception',\n    HTTP_STATUS_CODE_INVALID: 'HttpStatusCodeInvalid',\n    CONNECTING_TIMEOUT: 'ConnectingTimeout',\n    EARLY_EOF: 'EarlyEof',\n    UNRECOVERABLE_EARLY_EOF: 'UnrecoverableEarlyEof'\n};\n\nconst ErrorDetails = {\n    NETWORK_EXCEPTION: LoaderErrors.EXCEPTION,\n    NETWORK_STATUS_CODE_INVALID: LoaderErrors.HTTP_STATUS_CODE_INVALID,\n    NETWORK_TIMEOUT: LoaderErrors.CONNECTING_TIMEOUT,\n    NETWORK_UNRECOVERABLE_EARLY_EOF: LoaderErrors.UNRECOVERABLE_EARLY_EOF,\n\n    MEDIA_MSE_ERROR: 'MediaMSEError',\n\n    MEDIA_FORMAT_ERROR: DemuxErrors.FORMAT_ERROR,\n    MEDIA_FORMAT_UNSUPPORTED: DemuxErrors.FORMAT_UNSUPPORTED,\n    MEDIA_CODEC_UNSUPPORTED: DemuxErrors.CODEC_UNSUPPORTED\n};\n\n;// CONCATENATED MODULE: ./src/rtmp/RTMPMessage.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\nclass RTMPMessage{\n\tTAG = \"RTMPMessage\";\n\n    static MessageTypes = [\"dummy\", \"PCMSetChunkSize\", \"PCMAbortMessage\", \"PCMAcknolegement\", \"UserControlMessage\", \"WindowAcknowledgementSize\", \"PCMSetPeerBandwidth\",\n        \"dummy\", \"AudioMessage\", \"VideoMessage\", \"dummy\", \"dummy\", \"dummy\", \"dummy\", \"dummy\", \"DataMessageAMF3\", \"Shared Object Message AMF3\", \"CommandMessageAMF3\",\n        \"DataMessageAMF0\", \"SharedObjectMessageAMF0\", \"CommandMessageAMF0\", \"dummy\", \"Aggregate Message\"];\n\n    messageType;\n\tmessageLength = 0;\n    length = 0;\n\ttimestamp = 0;\n    extendedTimestamp = false;\n\tmessage_stream_id = 0;\n\tpayload = new Uint8Array(0);\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     */\n\tconstructor(payload) {\n        if(payload) {\n\t\t\tthis.setMessageLength(payload.length);\n            this.addPayload(payload);\n        }\n\t}\n\n\tclearPayload(){\n\t\tthis.payload = new Uint8Array(0);\n\t}\n\n    /**\n     *\n     * @returns {Uint8Array}\n     */\n\tgetBytes(){\n\t\tthis.header = new Uint8Array(11);\n\t\tthis.header[0] = this.messageType;\n\n\t\tthis.header[1] = (this.length >>> 16);\n\t\tthis.header[2] = (this.length >>> 8);\n\t\tthis.header[3] = (this.length);\n\n\t\tthis.header[4] = (this.timestamp >>> 24);\n\t\tthis.header[5] = (this.timestamp >>> 16);\n\t\tthis.header[6] = (this.timestamp >>> 8);\n\t\tthis.header[7] = (this.timestamp);\n\n\t\tthis.header[8] = (this.message_stream_id >>> 16);\n\t\tthis.header[9] = (this.message_stream_id >>> 8);\n\t\tthis.header[10] = (this.message_stream_id);\n\n\t\treturn _concatArrayBuffers(this.header, this.payload);\n\t}\n\n\t/**\n\t *\n\t * @param {Number} message_type\n\t */\n    setMessageType(message_type){\n        this.messageType = message_type;\n        switch(message_type){\n            case 1:\t\t// setBandwidth\n            case 2:\n            case 3:\n            case 4:     // UserControlMSG\n            case 5:\n            case 6:\n                this.message_stream_id = 0;\n                break;\n        }\n    }\n\n\tgetMessageType(){\n\t\treturn this.messageType;\n\t}\n\n    getMessageStreamID(){\n        return this.message_stream_id;\n    }\n\n\tsetMessageStreamID(messageStreamID) {\n\t\tthis.message_stream_id = messageStreamID;\n\t}\n\n\tgetPayloadlength(){\n\t\treturn this.payload.length;\n\t}\n\n    getTimestamp(){\n        return this.timestamp;\n    }\n\n\tsetMessageTimestamp(timestamp) {\n\t\tlogger.v(this.TAG, \"TS: \" + timestamp);\n\t\tthis.timestamp = timestamp;\n\t}\n\n    /**\n     *\n     * @param {boolean} yes\n     */\n    setExtendedTimestamp(yes){\n\t\tlogger.w(this.TAG, \"setExtendedTimestamp\");\n        this.extendedTimestamp = yes;\n    }\n\n    getExtendedTimestamp(){\n        return this.extendedTimestamp;\n    }\n\n\tsetTimestampDelta(timestamp_delta){\n\t\tlogger.v(this.TAG, \"TS: \" + this.timestamp + \" Delta: \" + timestamp_delta);\n\t\tthis.timestamp += timestamp_delta;\n\t}\n\n\t/**\n\t *\n\t * @param {Uint8Array} data\n\t */\n\taddPayload(data){\n\t\tif(data.length > this.bytesMissing()) {\n\t\t\tlogger.e(this.TAG, \"try to add too much data\");\n\t\t\treturn;\n\t\t}\n\n\t\tthis.payload = _concatArrayBuffers(this.payload, data);\n\t\tthis.length = this.payload.length;\n\t\tlogger.d(this.TAG, \"[ RTMPMessage ] payload size is now: \" + this.length);\n\t}\n\n\tgetPayload(){\n\t\treturn this.payload;\n\t}\n\n    setMessageLength(message_length) {\n        this.messageLength = message_length;\n    }\n\n\tgetMessageLength(){\n\t\treturn this.messageLength;\n\t}\n\n\tisComplete(){\n\t\tif(this.payload.length === this.messageLength) return true;\n\t\treturn false;\n\t}\n\n\tbytesMissing(){\n\t\treturn this.messageLength - this.payload.length;\n\t}\n}\n\n/* harmony default export */ const rtmp_RTMPMessage = (RTMPMessage);\n\n;// CONCATENATED MODULE: ./src/rtmp/Chunk.js\n\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\nclass Chunk{\n    TAG = \"Chunk\";\n    chunk_stream_id = 0;\n\n    length;\n\n    message_type;\n    message_stream_id = 0;\n\n    timestamp;\n    CHUNK_SIZE = 128;\n    payload;\n\n    /**\n     * @param {RTMPMessage} message\n     */\n    constructor(message) {  // RTMP Message\n        this.payload = message.getPayload();\n        this.length = this.payload.length;\n        this.message_type = message.getMessageType();\n        this.message_stream_id = message.getMessageStreamID();\n    }\n\n    /**\n     *\n     * @returns {Uint8Array}\n     */\n    getBytes(){\n        let p = new Uint8Array(this.payload);\n\n        let ret = new Uint8Array(0);\n        let fmt = 0;\n\n        do {\n            logger.d(this.TAG, \"create chunk: \" + p.length);\n            ret = _concatArrayBuffers(ret, this._getHeaderBytes(fmt), p.slice(0,this.CHUNK_SIZE));\n            p = p.slice(this.CHUNK_SIZE);\n            fmt = 0x3;\t// next chunk without header\n\n        } while(p.length > 0);\n\n        return ret;\n    }\n\n    /**\n     *\n     * @param {Number} fmt\n     * @returns {Uint8Array}\n     * @private\n     */\n    _getHeaderBytes(fmt){\n        let basic_header;\n        let header;\n\n        if(this.chunk_stream_id < 63) {\n            basic_header = new Uint8Array(1);\n            basic_header[0] = (fmt << 6) | this.chunk_stream_id;\n\n        } else if(this.chunk_stream_id < 65599) {\n            basic_header = new Uint8Array(2);\n            basic_header[0] = (fmt << 6);\n            basic_header[1] = (this.chunk_stream_id -64);\n\n        } else {\n            basic_header = new Uint8Array(3);\n            basic_header[0] = (fmt << 6) | 63;\n            basic_header[1] = ((this.chunk_stream_id -64) >>> 8);\n            basic_header[2] = ((this.chunk_stream_id -64));\n        }\n\n        switch(fmt){\n            case 0x0:\n                header = new Uint8Array(11);\n                header[0] = (this.timestamp >>> 16);\n                header[1] = (this.timestamp >>> 8);\n                header[2] = (this.timestamp);\n\n                header[3] = (this.length >>> 16);\n                header[4] = (this.length >>> 8);\n                header[5] = (this.length);\n\n                header[6] = (this.message_type);\n\n                header[7] = (this.message_stream_id >>> 24);\n                header[8] = (this.message_stream_id >>> 16);\n                header[9] = (this.message_stream_id >>> 8);\n                header[10] = (this.message_stream_id);\n                break;\n\n            case 0x1:\n                header = new Uint8Array(7);\n                header[0] = (this.timestamp >>> 16);\n                header[1] = (this.timestamp >>> 8);\n                header[2] = (this.timestamp);\n\n                header[3] = (this.length >>> 16);\n                header[4] = (this.length >>> 8);\n                header[5] = (this.length);\n\n                header[6] = (this.message_type);\n                break;\n\n\n            case 0x2:\n                header = new Uint8Array(3);\n                header[0] = (this.timestamp >>> 16);\n                header[1] = (this.timestamp >>> 8);\n                header[2] = (this.timestamp);\n                break;\n\n            case 0x3:\n                header = new Uint8Array(0);\n                break;\n        }\n\n        return _concatArrayBuffers(basic_header, header);\n    }\n\n    getPayload(){\n        return this.payload;\n    }\n\n    getMessageType(){\n        return this.message_type;\n    }\n\n    getMessageStreamID() {\n        return this.message_stream_id;\n    }\n\n    setChunkSize(size){\n        this.CHUNK_SIZE = size;\n    }\n\n    /**\n     *\n     * @param {Number} chunk_stream_id\n     */\n    setChunkStreamID(chunk_stream_id) {\n        logger.d(this.TAG, \"setChunkStreamID:\" + chunk_stream_id);\n        this.chunk_stream_id = chunk_stream_id;\n    }\n\n    /**\n     *\n     * @param {Number} message_stream_id\n     */\n    setMessageStreamID(message_stream_id) {\n        this.message_stream_id = message_stream_id;\n    }\n\n    /**\n     *\n     * @param {Number} timestamp\n     */\n    setTimestamp(timestamp){\n        this.timestamp = timestamp;\n    }\n}\n\n/* harmony default export */ const rtmp_Chunk = (Chunk);\n\n;// CONCATENATED MODULE: ./src/rtmp/UserControlMessage.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\nclass UserControlMessage{\n    event_type;\n    event_data1;\n    event_data2;\n\n    static events = [\"StreamBegin\", \"StreamEOF\", \"StreamDry\", \"SetBuffer\", \"StreamIsRecorded\", \"dummy\", \"PingRequest\", \"PingResponse\"];\n\n    /**\n     *\n     * @returns {Uint8Array}\n     */\n    getBytes(){\n        let ret;\n\n        if(this.event_data2) {\n            ret = new Uint8Array(10);\n            ret[0] = (this.event_type >>> 8);\n            ret[1] = (this.event_type);\n\n            ret[2] = (this.event_data1 >>> 24);\n            ret[3] = (this.event_data1 >>> 16);\n            ret[4] = (this.event_data1 >>> 8);\n            ret[5] = (this.event_data1);\n\n            ret[6] = (this.event_data2 >>> 24);\n            ret[7] = (this.event_data2 >>> 16);\n            ret[8] = (this.event_data2 >>> 8);\n            ret[9] = (this.event_data2);\n\n        } else {\n            ret = new Uint8Array(6);\n            ret[0] = (this.event_type >>> 8);\n            ret[1] = (this.event_type);\n\n            ret[2] = (this.event_data1 >>> 24);\n            ret[3] = (this.event_data1 >>> 16);\n            ret[4] = (this.event_data1 >>> 8);\n            ret[5] = (this.event_data1);\n        }\n\n        return ret;\n    }\n\n    getEventMessage(){\n        let o = {};\n\n        if(this.event_type === 3) {\n            o[UserControlMessage.events[this.event_type]] = [this.event_data1, this.event_data2];\n        } else {\n            o[UserControlMessage.events[this.event_type]] = this.event_data1;\n        }\n\n        return o;\n    }\n\n    setType(event_type){\n        this.event_type = event_type;\n    }\n\n    setEventData(event_data){\n        this.event_data1 = event_data;\n    }\n}\n\n/* harmony default export */ const rtmp_UserControlMessage = (UserControlMessage);\n\n;// CONCATENATED MODULE: ./src/rtmp/ProtocolControlMessage.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\nclass ProtocolControlMessage{\n    TAG = \"ProtocolControlMessage\";\n    pcm_type;\n    data;\n\n    static pcm_types = [\"dummy\", \"SetChunkSize\", \"AbortMessage\", \"Acknowledgement\", \"UserControlMessage\", \"WindowAcknowledgementSize\", \"SetPeerBandwidth\"];\n\n    constructor(pcm_type, data) {\n        switch(pcm_type){\n        case 1:\n        case 2:\n        case 3:\n        case 5:\n            this.pcm_type = pcm_type;\n            this.data = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n            break;\n\n        case 6:\n            logger.w(this.TAG, \"Protocol Control Message Type: \" + pcm_type + \" use SetPeerBandwidthMessage\");\n            break;\n\n        default:\n            logger.e(this.TAG, \"Protocol Control Message Type: \" + pcm_type + \" not supported\");\n            break;\n        }\n    }\n\n    setPayload(data){\n        this.data = data;\n    }\n\n    getEventMessage(){\n        let o = {};\n        o[ProtocolControlMessage.pcm_types[this.pcm_type]] = this.data;\n        return o;\n    }\n\n    getBytes(){\n        let ret = [];\n\n        ret[0] = (this.data >>> 24);\n        ret[1] = (this.data >>> 16);\n        ret[2] = (this.data >>> 8);\n        ret[3] = (this.data);\n\n        return new Uint8Array(ret);\n    }\n}\n/* harmony default export */ const rtmp_ProtocolControlMessage = (ProtocolControlMessage);\n\n;// CONCATENATED MODULE: ./src/rtmp/NetConnection.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\n\n\nclass NetConnection{\n    TAG = \"NetConnection\";\n    WindowAcknowledgementSize;\n    MessageStreamID;\n    CHUNK_SIZE = 128;\n    BandWidth;\n    socket;\n\n    /**\n     *\n     * @param {Number} message_stream_id\n     * @param {RTMPMessageHandler} handler\n     */\n    constructor(message_stream_id, handler) {\n        this.MessageStreamID = message_stream_id;\n\n        logger.d(this.TAG, handler);\n\n        this.handler = handler;\n        this.socket = handler.socket;\n    }\n\n    /**\n     *\n     * @param {RTMPMessage} message\n     */\n    parseMessage(message){      // RTMPMessage\n        let data = message.getPayload();\n\n        switch(message.getMessageType()){\n        case 1:         // PCM Set Chunk Size\n            this.CHUNK_SIZE = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n            this.handler.setChunkSize(this.CHUNK_SIZE)\n            break;\n\n        case 2:         // PCM Abort Message\n        case 3:         // PCM Acknowledgement\n        case 5:         // PCM Window Acknowledgement Size\n            this.WindowAcknowledgementSize = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n            logger.i(this.TAG, \"WindowAcknowledgementSize: \" + this.WindowAcknowledgementSize);\n            break;\n\n        case 6:         // PCM Set Peer Bandwidth\n            this.BandWidth = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n            logger.i(this.TAG, \"SetPeerBandwidth: \" + this.BandWidth);\n\n            // send Window Ack Size\n            let msg = new rtmp_ProtocolControlMessage(0x05, this.WindowAcknowledgementSize);\n\n            let m2 = new rtmp_RTMPMessage(msg.getBytes());\n            m2.setMessageType(0x05)     // WinACKSize\n\n            const chunk = new rtmp_Chunk(m2);\n            chunk.setChunkStreamID(2);  // Control Channel\n\n            logger.i(this.TAG, \"send WindowAcksize\");\n            this.socket.send(chunk.getBytes());\n\n            break;\n\n        default:\n            break;\n        }\n    }\n}\n\n/* harmony default export */ const rtmp_NetConnection = (NetConnection);\n\n;// CONCATENATED MODULE: ./src/rtmp/ChunkParser.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\n\nclass ChunkParser {\n    TAG = \"ChunkParser\";\n\n    /**\n     *\n     * @type {number}\n     */\n\tstatic CHUNK_SIZE = 128;\n    chunkstreams = [];\n\n    /**\n     * @type {Uint8Array}\n     */\n    buffer = new Uint8Array(0);\n\n    /**\n     *\n     * @param {RTMPMessageHandler} conn_worker\n     */\n\tconstructor(conn_worker) {\n        this.conn_worker = conn_worker;\n    }\n\n    /**\n     * @param {Uint8Array} newdata\n     */\n    parseChunk(newdata){\n        let msg;\n        let timestamp;\n        let fmt;\n\n        this.buffer = _concatArrayBuffers(this.buffer, newdata);      // Neues Packet an Buffer anfügen\n\n        do {\n            logger.d(this.TAG, \"buffer length: \" + this.buffer.length);\n\n            if(this.buffer.length < 100) logger.d(this.TAG, this.buffer);\n\n            /**\n             *\n             * @type {Uint8Array}\n             */\n            let data = this.buffer;\n            let header_length = 0;\n            let message_length = 0;\n            let payload_length = 0;\n\n            // Message Header Type\n            fmt = ((data[0] & 0xC0) >>> 6);  // upper 2 bit\n\n            // Basic Header ChunkID\n            let csid = data[header_length++] & 0x3f;\t// lower 6 bits\n\n            if(csid === 0) {\t\t\t\t\t// csid is 14bit\n                csid = data[header_length++] + 64;\n\n            } else if (csid === 1) {\t\t\t// csid is 22bit\n                csid = data[header_length++] * 256 + data[header_length++] + 64;\n            }\n\n            logger.d(this.TAG, \"chunk type: \", fmt, \" StreamID: \" + csid);\n\n            let payload;\n\n            // Message\n            switch(fmt) {\n                case 0:\t\t// 11 byte\n                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\t// 3 byte timestamp\n                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\t// 3 byte Message length\n\n                msg = new rtmp_RTMPMessage();\n                msg.setMessageType(data[header_length++]);                // 1 byte msg type\n                msg.setMessageStreamID((data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]));\t// 4 byte Message stream id\n                msg.setMessageLength(message_length);\n\n                if (timestamp === 0xFFFFFF) {\t// extended Timestamp\n                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\n                    msg.setExtendedTimestamp(true);\n                }\n\n                msg.setMessageTimestamp(timestamp);\n\n                logger.d(this.TAG, \"message_length: \" + message_length);\n\n                this.chunkstreams[csid] = msg;\n                break;\n\n            case 1:\t\t// 7 byte\n                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\t// 3 byte timestamp\n                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\t// 3 byte Message length\n\n                msg = this.chunkstreams[csid];\n                msg.setMessageType(data[header_length++]);\n                msg.setMessageLength(message_length);\n\n                if (timestamp === 0xFFFFFF) {\t// extended Timestamp\n                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\n                    msg.setExtendedTimestamp(true);\n                } else {\n                    msg.setExtendedTimestamp(false);\n                }\n\n                msg.setTimestampDelta(timestamp);\n\n                logger.d(this.TAG, \"message_length: \" + message_length);\n\n                this.chunkstreams[csid] = msg;\n                break;\n\n            case 2:\t\t// 3 byte\n                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\t// 3 byte timestamp delta\n\n                msg = this.chunkstreams[csid];\n\n                if (timestamp === 0xFFFFFF) {\t// extended Timestamp\n                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\n                    msg.setExtendedTimestamp(true);\n\n                } else {\n                    msg.setExtendedTimestamp(false);\n                }\n\n                msg.setTimestampDelta(timestamp);\n\n                break;\n\n            case 3:\t\t// 0 byte\n                msg = this.chunkstreams[csid];\n\n                // extended timestamp is present when setted in the chunk stream\n                if(msg.getExtendedTimestamp()) {\n                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);\n                    msg.setTimestampDelta(timestamp);\n                }\n\n                break;\n            }\n\n            if(!msg) {\n                logger.e(this.TAG, \"No suitable RTMPMessage found\");\n            }\n\n\n\n            payload_length = this.chunkstreams[csid].bytesMissing();\n\n            if(payload_length > this.CHUNK_SIZE) payload_length = this.CHUNK_SIZE;      // Max. CHUNK_SIZE erwarten\n\n            payload = data.slice(header_length, header_length +payload_length);\n\n            // sind genug bytes für das chunk da?\n            if(payload.length < payload_length){\n                logger.d(this.TAG, \"packet(\" + payload.length + \"/\" + payload_length + \") too small, wait for next\");\n                return;\n            }\n\n            this.chunkstreams[csid].addPayload(payload);\n\n            if(this.chunkstreams[csid].isComplete()) {     // Message complete\n                logger.d(this.TAG, \"RTMP: \", msg.getMessageType(), rtmp_RTMPMessage.MessageTypes[msg.getMessageType()], msg.getPayloadlength(), msg.getMessageStreamID());\n                this.conn_worker.onMessage(this.chunkstreams[csid]);\n                this.chunkstreams[csid].clearPayload();\n            }\n\n            let consumed = (header_length + payload_length);\n\n            if(consumed > this.buffer.length) {\n                logger.w(this.TAG, \"mehr abschneiden als da\");\n            }\n\n            this.buffer = this.buffer.slice(consumed);\n            logger.d(this.TAG, \"consumed: \" + consumed + \" bytes, rest: \" + this.buffer.length);\n\n        } while(this.buffer.length > 11);   // minimum size\n\n        logger.d(this.TAG, \"parseChunk complete\");\n    }\n\n\n\n    /**\n     *\n     * @param {Number} size\n     */\n    setChunkSize(size){\n        logger.d(this.TAG, \"SetChunkSize: \" + size);\n        this.CHUNK_SIZE = size;\n    }\n}\n\n/* harmony default export */ const rtmp_ChunkParser = (ChunkParser);\n\n;// CONCATENATED MODULE: ./src/utils/exception.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nclass RuntimeException {\n    constructor(message) {\n        this._message = message;\n    }\n\n    get name() {\n        return 'RuntimeException';\n    }\n\n    get message() {\n        return this._message;\n    }\n\n    toString() {\n        return this.name + ': ' + this.message;\n    }\n}\n\nclass IllegalStateException extends RuntimeException {\n    constructor(message) {\n        super(message);\n    }\n\n    get name() {\n        return 'IllegalStateException';\n    }\n}\n\nclass InvalidArgumentException extends RuntimeException {\n    constructor(message) {\n        super(message);\n    }\n\n    get name() {\n        return 'InvalidArgumentException';\n    }\n}\n\nclass NotImplementedException extends RuntimeException {\n    constructor(message) {\n        super(message);\n    }\n\n    get name() {\n        return 'NotImplementedException';\n    }\n}\n\n;// CONCATENATED MODULE: ./src/formats/media-info.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nclass MediaInfo {\n\n\tconstructor() {\n\t\tthis.mimeType = null;\n\t\tthis.duration = null;\n\n\t\tthis.hasAudio = null;\n\t\tthis.hasVideo = null;\n\t\tthis.audioCodec = null;\n\t\tthis.videoCodec = null;\n\t\tthis.audioDataRate = null;\n\t\tthis.videoDataRate = null;\n\n\t\tthis.audioSampleRate = null;\n\t\tthis.audioChannelCount = null;\n\n\t\tthis.width = null;\n\t\tthis.height = null;\n\t\tthis.fps = null;\n\t\tthis.profile = null;\n\t\tthis.level = null;\n\t\tthis.refFrames = null;\n\t\tthis.chromaFormat = null;\n\t\tthis.sarNum = null;\n\t\tthis.sarDen = null;\n\n\t\tthis.metadata = null;\n\t\tthis.segments = null;  // MediaInfo[]\n\t\tthis.segmentCount = null;\n\t\tthis.hasKeyframesIndex = null;\n\t\tthis.keyframesIndex = null;\n\t}\n\n\tisComplete() {\n\t\tlet audioInfoComplete = (this.hasAudio === false) ||\n\t\t\t(this.hasAudio === true &&\n\t\t\t\tthis.audioCodec != null &&\n\t\t\t\tthis.audioSampleRate != null &&\n\t\t\t\tthis.audioChannelCount != null);\n\n\t\tlet videoInfoComplete = (this.hasVideo === false) ||\n\t\t\t(this.hasVideo === true &&\n\t\t\t\tthis.videoCodec != null &&\n\t\t\t\tthis.width != null &&\n\t\t\t\tthis.height != null &&\n\t\t\t\tthis.fps != null &&\n\t\t\t\tthis.profile != null &&\n\t\t\t\tthis.level != null &&\n\t\t\t\tthis.refFrames != null &&\n\t\t\t\tthis.chromaFormat != null &&\n\t\t\t\tthis.sarNum != null &&\n\t\t\t\tthis.sarDen != null);\n\n\t\t// keyframesIndex may not be present\n\t\treturn this.mimeType != null &&\n\t\t\tthis.duration != null &&\n\t\t\tthis.metadata != null &&\n\t\t\tthis.hasKeyframesIndex != null &&\n\t\t\taudioInfoComplete &&\n\t\t\tvideoInfoComplete;\n\t}\n\n\tisSeekable() {\n\t\treturn this.hasKeyframesIndex === true;\n\t}\n\n\tgetNearestKeyframe(milliseconds) {\n\t\tif (this.keyframesIndex == null) {\n\t\t\treturn null;\n\t\t}\n\n\t\tlet table = this.keyframesIndex;\n\t\tlet keyframeIdx = this._search(table.times, milliseconds);\n\n\t\treturn {\n\t\t\tindex: keyframeIdx,\n\t\t\tmilliseconds: table.times[keyframeIdx],\n\t\t\tfileposition: table.filepositions[keyframeIdx]\n\t\t};\n\t}\n\n\t_search(list, value) {\n\t\tlet idx = 0;\n\n\t\tlet last = list.length - 1;\n\t\tlet mid = 0;\n\t\tlet lbound = 0;\n\t\tlet ubound = last;\n\n\t\tif (value < list[0]) {\n\t\t\tidx = 0;\n\t\t\tlbound = ubound + 1;  // skip search\n\t\t}\n\n\t\twhile (lbound <= ubound) {\n\t\t\tmid = lbound + Math.floor((ubound - lbound) / 2);\n\t\t\tif (mid === last || (value >= list[mid] && value < list[mid + 1])) {\n\t\t\t\tidx = mid;\n\t\t\t\tbreak;\n\t\t\t} else if (list[mid] < value) {\n\t\t\t\tlbound = mid + 1;\n\t\t\t} else {\n\t\t\t\tubound = mid - 1;\n\t\t\t}\n\t\t}\n\n\t\treturn idx;\n\t}\n\n}\n\n/* harmony default export */ const media_info = (MediaInfo);\n\n;// CONCATENATED MODULE: ./src/utils/utf8-conv.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * This file is derived from C++ project libWinTF8 (https://github.com/m13253/libWinTF8)\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nfunction checkContinuation(uint8array, start, checkLength) {\n    let array = uint8array;\n    if (start + checkLength < array.length) {\n        while (checkLength--) {\n            if ((array[++start] & 0xC0) !== 0x80)\n                return false;\n        }\n        return true;\n    } else {\n        return false;\n    }\n}\n\nfunction decodeUTF8(uint8array) {\n    let out = [];\n    let input = uint8array;\n    let i = 0;\n    let length = uint8array.length;\n\n    while (i < length) {\n        if (input[i] < 0x80) {\n            out.push(String.fromCharCode(input[i]));\n            ++i;\n            continue;\n        } else if (input[i] < 0xC0) {\n            // fallthrough\n        } else if (input[i] < 0xE0) {\n            if (checkContinuation(input, i, 1)) {\n                let ucs4 = (input[i] & 0x1F) << 6 | (input[i + 1] & 0x3F);\n                if (ucs4 >= 0x80) {\n                    out.push(String.fromCharCode(ucs4 & 0xFFFF));\n                    i += 2;\n                    continue;\n                }\n            }\n        } else if (input[i] < 0xF0) {\n            if (checkContinuation(input, i, 2)) {\n                let ucs4 = (input[i] & 0xF) << 12 | (input[i + 1] & 0x3F) << 6 | input[i + 2] & 0x3F;\n                if (ucs4 >= 0x800 && (ucs4 & 0xF800) !== 0xD800) {\n                    out.push(String.fromCharCode(ucs4 & 0xFFFF));\n                    i += 3;\n                    continue;\n                }\n            }\n        } else if (input[i] < 0xF8) {\n            if (checkContinuation(input, i, 3)) {\n                let ucs4 = (input[i] & 0x7) << 18 | (input[i + 1] & 0x3F) << 12\n                    | (input[i + 2] & 0x3F) << 6 | (input[i + 3] & 0x3F);\n                if (ucs4 > 0x10000 && ucs4 < 0x110000) {\n                    ucs4 -= 0x10000;\n                    out.push(String.fromCharCode((ucs4 >>> 10) | 0xD800));\n                    out.push(String.fromCharCode((ucs4 & 0x3FF) | 0xDC00));\n                    i += 4;\n                    continue;\n                }\n            }\n        }\n        out.push(String.fromCharCode(0xFFFD));\n        ++i;\n    }\n\n    return out.join('');\n}\n\n;// CONCATENATED MODULE: ./src/flv/amf-parser.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n\n\nlet le = (function () {\n    let buf = new ArrayBuffer(2);\n    (new DataView(buf)).setInt16(0, 256, true);  // little-endian write\n    return (new Int16Array(buf))[0] === 256;  // platform-spec read, if equal then LE\n})();\n\nclass AMF {\n    static TAG = \"AMF\";\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @returns {{}}\n     */\n    static parseScriptData(array) {\n        logger.d(this.TAG, array);\n\n        let data = {};\n\n        try {\n            let name = AMF.parseValue(array);\n            logger.d(this.TAG, name);\n\n            let value = AMF.parseValue(array.slice(name.size));\n            logger.d(this.TAG, value);\n\n            data[name.data] = value.data;\n\n        } catch (e) {\n            logger.w(this.TAG, e.toString());\n        }\n\n        return data;\n    }\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @returns {{data: {name: string, value: {}}, size: number, objectEnd: boolean}}\n     */\n    static parseObject(array) {\n        if (array.length < 3) {\n            throw new IllegalStateException('Data not enough when parse ScriptDataObject');\n        }\n        let name = AMF.parseString(array);\n        let value = AMF.parseValue(array.slice(name.size, array.length - name.size));\n        let isObjectEnd = value.objectEnd;\n\n        return {\n            data: {\n                name: name.data,\n                value: value.data\n            },\n            size: name.size + value.size,\n            objectEnd: isObjectEnd\n        };\n    }\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @returns {{data: {name: string, value: {}}, size: number, objectEnd: boolean}}\n     */\n    static parseVariable(array) {\n        return AMF.parseObject(array);\n    }\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @returns {{data: string, size: number}}\n     */\n    static parseString(array) {\n        if (array.length < 2) {\n            throw new IllegalStateException('Data not enough when parse String');\n        }\n        let v = new DataView(array.buffer);\n        let length = v.getUint16(0, !le);\n\n        let str;\n        if (length > 0) {\n            str = decodeUTF8(new Uint8Array(array.slice(2, 2 + length)));\n        } else {\n            str = '';\n        }\n\n        return {\n            data: str,\n            size: 2 + length\n        };\n    }\n\n    static parseLongString(array) {\n        if (array.length() < 4) {\n            throw new IllegalStateException('Data not enough when parse LongString');\n        }\n        let v = new DataView(array.buffer);\n        let length = v.getUint32(0, !le);\n\n        let str;\n        if (length > 0) {\n            str = decodeUTF8(new Uint8Array(array.slice(4, 4 +length)));\n        } else {\n            str = '';\n        }\n\n        return {\n            data: str,\n            size: 4 + length\n        };\n    }\n\n    static parseDate(array) {\n        if (array.length() < 10) {\n            throw new IllegalStateException('Data size invalid when parse Date');\n        }\n        let v = new DataView(array.buffer);\n        let timestamp = v.getFloat64(0, !le);\n        let localTimeOffset = v.getInt16(8, !le);\n        timestamp += localTimeOffset * 60 * 1000;  // get UTC time\n\n        return {\n            data: new Date(timestamp),\n            size: 8 + 2\n        };\n    }\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @returns {{data: {}, size: number, objectEnd: boolean}}\n     */\n    static parseValue(array) {\n        if (array.length < 1) {\n            throw new IllegalStateException('Data not enough when parse Value');\n        }\n\n        let v = new DataView(array.buffer);\n\n        let offset = 1;\n        let type = v.getUint8(0);\n        let value;\n        let objectEnd = false;\n\n        try {\n            switch (type) {\n                case 0:  // Number(Double) type\n                    value = v.getFloat64(1, !le);\n                    offset += 8;\n                    break;\n                case 1: {  // Boolean type\n                    let b = v.getUint8(1);\n                    value = b ? true : false;\n                    offset += 1;\n                    break;\n                }\n                case 2: {  // String type\n                    let amfstr = AMF.parseString(array.slice(1));\n                    value = amfstr.data;\n                    offset += amfstr.size;\n                    break;\n                }\n                case 3: { // Object(s) type\n                    value = {};\n                    let terminal = 0;  // workaround for malformed Objects which has missing ScriptDataObjectEnd\n                    if ((v.getUint32(array.length - 4, !le) & 0x00FFFFFF) === 9) {\n                        terminal = 3;\n                    }\n                    while (offset < array.length - 4) {  // 4 === type(UI8) + ScriptDataObjectEnd(UI24)\n                        let amfobj = AMF.parseObject(array.slice(offset, offset + array.length - terminal));\n                        if (amfobj.objectEnd)\n                            break;\n                        value[amfobj.data.name] = amfobj.data.value;\n                        offset += amfobj.size;\n                    }\n                    if (offset <= array.length - 3) {\n                        let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;\n                        if (marker === 9) {\n                            offset += 3;\n                        }\n                    }\n                    break;\n                }\n                case 8: { // ECMA array type (Mixed array)\n                    value = {};\n                    offset += 4;  // ECMAArrayLength(UI32)\n                    let terminal = 0;  // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd\n                    if ((v.getUint32(array.length - 4, !le) & 0x00FFFFFF) === 9) {\n                        terminal = 3;\n                    }\n                    while (offset < array.length - 8) {  // 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)\n                        let amfvar = AMF.parseVariable(array.slice(offset, offset + array.length - terminal));\n                        if (amfvar.objectEnd)\n                            break;\n                        value[amfvar.data.name] = amfvar.data.value;\n                        offset += amfvar.size;\n                    }\n                    if (offset <= array.length - 3) {\n                        let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;\n                        if (marker === 9) {\n                            offset += 3;\n                        }\n                    }\n                    break;\n                }\n                case 9:  // ScriptDataObjectEnd\n                    value = undefined;\n                    offset = 1;\n                    objectEnd = true;\n                    break;\n                case 10: {  // Strict array type\n                    // ScriptDataValue[n]. NOTE: according to video_file_format_spec_v10_1.pdf\n                    value = [];\n                    let strictArrayLength = v.getUint32(1, !le);\n                    offset += 4;\n                    for (let i = 0; i < strictArrayLength; i++) {\n                        let val = AMF.parseValue(array.slice(offset, array.length));\n                        value.push(val.data);\n                        offset += val.size;\n                    }\n                    break;\n                }\n                case 11: {  // Date type\n                    let date = AMF.parseDate(array.slice(1));\n                    value = date.data;\n                    offset += date.size;\n                    break;\n                }\n                case 12: {  // Long string type\n                    let amfLongStr = AMF.parseString(array.slice(1));\n                    value = amfLongStr.data;\n                    offset += amfLongStr.size;\n                    break;\n                }\n                default:\n                    // ignore and skip\n                    offset = array.length;\n                    logger.w(this.TAG, 'Unsupported AMF value type ' + type);\n            }\n        } catch (e) {\n            logger.e(this.TAG, e.toString());\n        }\n\n        return {\n            data: value,\n            size: offset,\n            objectEnd: objectEnd\n        };\n    }\n}\n\n/* harmony default export */ const amf_parser = (AMF);\n\n;// CONCATENATED MODULE: ./src/flv/exp-golomb.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n// Exponential-Golomb buffer decoder\n\n\nclass ExpGolomb {\n\n    constructor(uint8array) {\n        this.TAG = 'ExpGolomb';\n\n        this._buffer = uint8array;\n        this._buffer_index = 0;\n        this._total_bytes = uint8array.byteLength;\n        this._total_bits = uint8array.byteLength * 8;\n        this._current_word = 0;\n        this._current_word_bits_left = 0;\n    }\n\n    destroy() {\n        this._buffer = null;\n    }\n\n    _fillCurrentWord() {\n        let buffer_bytes_left = this._total_bytes - this._buffer_index;\n        if (buffer_bytes_left <= 0)\n            throw new IllegalStateException('ExpGolomb: _fillCurrentWord() but no bytes available');\n\n        let bytes_read = Math.min(4, buffer_bytes_left);\n        let word = new Uint8Array(4);\n        word.set(this._buffer.subarray(this._buffer_index, this._buffer_index + bytes_read));\n        this._current_word = new DataView(word.buffer).getUint32(0, false);\n\n        this._buffer_index += bytes_read;\n        this._current_word_bits_left = bytes_read * 8;\n    }\n\n    readBits(bits) {\n        if (bits > 32)\n            throw new InvalidArgumentException('ExpGolomb: readBits() bits exceeded max 32bits!');\n\n        if (bits <= this._current_word_bits_left) {\n            let result = this._current_word >>> (32 - bits);\n            this._current_word <<= bits;\n            this._current_word_bits_left -= bits;\n            return result;\n        }\n\n        let result = this._current_word_bits_left ? this._current_word : 0;\n        result = result >>> (32 - this._current_word_bits_left);\n        let bits_need_left = bits - this._current_word_bits_left;\n\n        this._fillCurrentWord();\n        let bits_read_next = Math.min(bits_need_left, this._current_word_bits_left);\n\n        let result2 = this._current_word >>> (32 - bits_read_next);\n        this._current_word <<= bits_read_next;\n        this._current_word_bits_left -= bits_read_next;\n\n        result = (result << bits_read_next) | result2;\n        return result;\n    }\n\n    readBool() {\n        return this.readBits(1) === 1;\n    }\n\n    readByte() {\n        return this.readBits(8);\n    }\n\n    _skipLeadingZero() {\n        let zero_count;\n        for (zero_count = 0; zero_count < this._current_word_bits_left; zero_count++) {\n            if (0 !== (this._current_word & (0x80000000 >>> zero_count))) {\n                this._current_word <<= zero_count;\n                this._current_word_bits_left -= zero_count;\n                return zero_count;\n            }\n        }\n        this._fillCurrentWord();\n        return zero_count + this._skipLeadingZero();\n    }\n\n    readUEG() {  // unsigned exponential golomb\n        let leading_zeros = this._skipLeadingZero();\n        return this.readBits(leading_zeros + 1) - 1;\n    }\n\n    readSEG() {  // signed exponential golomb\n        let value = this.readUEG();\n        if (value & 0x01) {\n            return (value + 1) >>> 1;\n        } else {\n            return -1 * (value >>> 1);\n        }\n    }\n\n}\n\n/* harmony default export */ const exp_golomb = (ExpGolomb);\n\n;// CONCATENATED MODULE: ./src/flv/sps-parser.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n\nclass SPSParser {\n    static _ebsp2rbsp(uint8array) {\n        let src = uint8array;\n        let src_length = src.byteLength;\n        let dst = new Uint8Array(src_length);\n        let dst_idx = 0;\n\n        for (let i = 0; i < src_length; i++) {\n            if (i >= 2) {\n                // Unescape: Skip 0x03 after 00 00\n                if (src[i] === 0x03 && src[i - 1] === 0x00 && src[i - 2] === 0x00) {\n                    continue;\n                }\n            }\n            dst[dst_idx] = src[i];\n            dst_idx++;\n        }\n\n        return new Uint8Array(dst.buffer, 0, dst_idx);\n    }\n\n    static parseSPS(uint8array) {\n        let rbsp = SPSParser._ebsp2rbsp(uint8array);\n        let gb = new exp_golomb(rbsp);\n\n        gb.readByte();\n        let profile_idc = gb.readByte();  // profile_idc\n        gb.readByte();  // constraint_set_flags[5] + reserved_zero[3]\n        let level_idc = gb.readByte();  // level_idc\n        gb.readUEG();  // seq_parameter_set_id\n\n        let profile_string = SPSParser.getProfileString(profile_idc);\n        let level_string = SPSParser.getLevelString(level_idc);\n        let chroma_format_idc = 1;\n        let chroma_format = 420;\n        let chroma_format_table = [0, 420, 422, 444];\n        let bit_depth = 8;\n\n        if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 ||\n            profile_idc === 244 || profile_idc === 44 || profile_idc === 83 ||\n            profile_idc === 86 || profile_idc === 118 || profile_idc === 128 ||\n            profile_idc === 138 || profile_idc === 144) {\n\n            chroma_format_idc = gb.readUEG();\n            if (chroma_format_idc === 3) {\n                gb.readBits(1);  // separate_colour_plane_flag\n            }\n            if (chroma_format_idc <= 3) {\n                chroma_format = chroma_format_table[chroma_format_idc];\n            }\n\n            bit_depth = gb.readUEG() + 8;  // bit_depth_luma_minus8\n            gb.readUEG();  // bit_depth_chroma_minus8\n            gb.readBits(1);  // qpprime_y_zero_transform_bypass_flag\n            if (gb.readBool()) {  // seq_scaling_matrix_present_flag\n                let scaling_list_count = (chroma_format_idc !== 3) ? 8 : 12;\n                for (let i = 0; i < scaling_list_count; i++) {\n                    if (gb.readBool()) {  // seq_scaling_list_present_flag\n                        if (i < 6) {\n                            SPSParser._skipScalingList(gb, 16);\n                        } else {\n                            SPSParser._skipScalingList(gb, 64);\n                        }\n                    }\n                }\n            }\n        }\n        gb.readUEG();  // log2_max_frame_num_minus4\n        let pic_order_cnt_type = gb.readUEG();\n        if (pic_order_cnt_type === 0) {\n            gb.readUEG();  // log2_max_pic_order_cnt_lsb_minus_4\n        } else if (pic_order_cnt_type === 1) {\n            gb.readBits(1);  // delta_pic_order_always_zero_flag\n            gb.readSEG();  // offset_for_non_ref_pic\n            gb.readSEG();  // offset_for_top_to_bottom_field\n            let num_ref_frames_in_pic_order_cnt_cycle = gb.readUEG();\n            for (let i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i++) {\n                gb.readSEG();  // offset_for_ref_frame\n            }\n        }\n        let ref_frames = gb.readUEG();  // max_num_ref_frames\n        gb.readBits(1);  // gaps_in_frame_num_value_allowed_flag\n\n        let pic_width_in_mbs_minus1 = gb.readUEG();\n        let pic_height_in_map_units_minus1 = gb.readUEG();\n\n        let frame_mbs_only_flag = gb.readBits(1);\n        if (frame_mbs_only_flag === 0) {\n            gb.readBits(1);  // mb_adaptive_frame_field_flag\n        }\n        gb.readBits(1);  // direct_8x8_inference_flag\n\n        let frame_crop_left_offset = 0;\n        let frame_crop_right_offset = 0;\n        let frame_crop_top_offset = 0;\n        let frame_crop_bottom_offset = 0;\n\n        let frame_cropping_flag = gb.readBool();\n        if (frame_cropping_flag) {\n            frame_crop_left_offset = gb.readUEG();\n            frame_crop_right_offset = gb.readUEG();\n            frame_crop_top_offset = gb.readUEG();\n            frame_crop_bottom_offset = gb.readUEG();\n        }\n\n        let sar_width = 1, sar_height = 1;\n        let fps = 0, fps_fixed = true, fps_num = 0, fps_den = 0;\n\n        let vui_parameters_present_flag = gb.readBool();\n        if (vui_parameters_present_flag) {\n            if (gb.readBool()) {  // aspect_ratio_info_present_flag\n                let aspect_ratio_idc = gb.readByte();\n                let sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];\n                let sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33,  99, 3, 2, 1];\n\n                if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {\n                    sar_width = sar_w_table[aspect_ratio_idc - 1];\n                    sar_height = sar_h_table[aspect_ratio_idc - 1];\n                } else if (aspect_ratio_idc === 255) {\n                    sar_width = gb.readByte() << 8 | gb.readByte();\n                    sar_height = gb.readByte() << 8 | gb.readByte();\n                }\n            }\n\n            if (gb.readBool()) {  // overscan_info_present_flag\n                gb.readBool();  // overscan_appropriate_flag\n            }\n            if (gb.readBool()) {  // video_signal_type_present_flag\n                gb.readBits(4);  // video_format & video_full_range_flag\n                if (gb.readBool()) {  // colour_description_present_flag\n                    gb.readBits(24);  // colour_primaries & transfer_characteristics & matrix_coefficients\n                }\n            }\n            if (gb.readBool()) {  // chroma_loc_info_present_flag\n                gb.readUEG();  // chroma_sample_loc_type_top_field\n                gb.readUEG();  // chroma_sample_loc_type_bottom_field\n            }\n            if (gb.readBool()) {  // timing_info_present_flag\n                let num_units_in_tick = gb.readBits(32);\n                let time_scale = gb.readBits(32);\n                fps_fixed = gb.readBool();  // fixed_frame_rate_flag\n\n                fps_num = time_scale;\n                fps_den = num_units_in_tick * 2;\n                fps = fps_num / fps_den;\n            }\n        }\n\n        let sarScale = 1;\n        if (sar_width !== 1 || sar_height !== 1) {\n            sarScale = sar_width / sar_height;\n        }\n\n        let crop_unit_x = 0, crop_unit_y = 0;\n        if (chroma_format_idc === 0) {\n            crop_unit_x = 1;\n            crop_unit_y = 2 - frame_mbs_only_flag;\n        } else {\n            let sub_wc = (chroma_format_idc === 3) ? 1 : 2;\n            let sub_hc = (chroma_format_idc === 1) ? 2 : 1;\n            crop_unit_x = sub_wc;\n            crop_unit_y = sub_hc * (2 - frame_mbs_only_flag);\n        }\n\n        let codec_width = (pic_width_in_mbs_minus1 + 1) * 16;\n        let codec_height = (2 - frame_mbs_only_flag) * ((pic_height_in_map_units_minus1 + 1) * 16);\n\n        codec_width -= (frame_crop_left_offset + frame_crop_right_offset) * crop_unit_x;\n        codec_height -= (frame_crop_top_offset + frame_crop_bottom_offset) * crop_unit_y;\n\n        let present_width = Math.ceil(codec_width * sarScale);\n\n        gb.destroy();\n        gb = null;\n\n        return {\n            profile_string: profile_string,  // baseline, high, high10, ...\n            level_string: level_string,  // 3, 3.1, 4, 4.1, 5, 5.1, ...\n            bit_depth: bit_depth,  // 8bit, 10bit, ...\n            ref_frames: ref_frames,\n            chroma_format: chroma_format,  // 4:2:0, 4:2:2, ...\n            chroma_format_string: SPSParser.getChromaFormatString(chroma_format),\n\n            frame_rate: {\n                fixed: fps_fixed,\n                fps: fps,\n                fps_den: fps_den,\n                fps_num: fps_num\n            },\n\n            sar_ratio: {\n                width: sar_width,\n                height: sar_height\n            },\n\n            codec_size: {\n                width: codec_width,\n                height: codec_height\n            },\n\n            present_size: {\n                width: present_width,\n                height: codec_height\n            }\n        };\n    }\n\n    static _skipScalingList(gb, count) {\n        let last_scale = 8, next_scale = 8;\n        let delta_scale = 0;\n        for (let i = 0; i < count; i++) {\n            if (next_scale !== 0) {\n                delta_scale = gb.readSEG();\n                next_scale = (last_scale + delta_scale + 256) % 256;\n            }\n            last_scale = (next_scale === 0) ? last_scale : next_scale;\n        }\n    }\n\n    static getProfileString(profile_idc) {\n        switch (profile_idc) {\n            case 66:\n                return 'Baseline';\n            case 77:\n                return 'Main';\n            case 88:\n                return 'Extended';\n            case 100:\n                return 'High';\n            case 110:\n                return 'High10';\n            case 122:\n                return 'High422';\n            case 244:\n                return 'High444';\n            default:\n                return 'Unknown';\n        }\n    }\n\n    static getLevelString(level_idc) {\n        return (level_idc / 10).toFixed(1);\n    }\n\n    static getChromaFormatString(chroma) {\n        switch (chroma) {\n            case 420:\n                return '4:2:0';\n            case 422:\n                return '4:2:2';\n            case 444:\n                return '4:4:4';\n            default:\n                return 'Unknown';\n        }\n    }\n\n}\n\n/* harmony default export */ const sps_parser = (SPSParser);\n\n;// CONCATENATED MODULE: ./src/utils/event_emitter.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\nclass EventEmitter{\n\tListenerList = [];\n\tTAG = \"EventEmitter\";\n\twaiters = [];\n\n\tconstructor() {\n\t}\n\n\t/**\n\t *\n\t * @param {String} event\n\t * @param {Function} listener\n\t * @param {boolean} modal\n\t */\n\taddEventListener(event, listener, modal = false){\n\t\tlogger.d(this.TAG, \"addEventListener: \" + event);\n\n\t\tfor(let i = 0; i < this.ListenerList.length;i++){\n\t\t\tlet entry = this.ListenerList[i];\n\t\t\tif(entry[0] === event) {\n\t\t\t\tif (modal || entry[1] === listener) {\n\t\t\t\t\tlogger.w(this.TAG, \"Listener already registered, overriding\");\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tthis.ListenerList.push([event, listener]);\n\t}\n\n\twaitForEvent(event, callback){\n\t\tthis.waiters.push([event, callback]);\n\t}\n\n\t/**\n\t *\n\t * @param {String} event\n\t * @param {Function} listener\n\t * @param {boolean} modal\n\t */\n\taddListener(event, listener, modal){\n\t\tthis.addEventListener(event, listener, modal);\n\t}\n\n\n\t/**\n\t *\n\t * @param {String} event\n\t * @param {Function} listener\n\t */\n\tremoveEventListener(event, listener){\n\t\tlogger.d(this.TAG, \"removeEventListener: \" + event);\n\n\t\tfor(let i = 0; i < this.ListenerList.length;i++){\n\t\t\tlet entry = this.ListenerList[i];\n\t\t\tif(entry[0] === event && entry[1] === listener){\n\t\t\t\tthis.ListenerList.splice(i,1);\n\t\t\t\treturn;\n\t\t\t}\n\t\t}\n\t}\n\n\tremoveListener(event, listener){\n\t\tthis.removeEventListener(event, listener);\n\t}\n\n\t/**\n\t * Remove all listener\n\t */\n\tremoveAllEventListener(event){\n\t\tlogger.d(this.TAG, \"removeAllEventListener: \", event);\n\t\tif(event) {\n\t\t\tfor(let i = 0; i < this.ListenerList.length;i++) {\n\t\t\t\tlet entry = this.ListenerList[i];\n\t\t\t\tif(entry[0] === event){\n\t\t\t\t\tthis.ListenerList.splice(i,1);\n\t\t\t\t\ti--;\n\t\t\t\t}\n\t\t\t}\n\t\t} else\n\t\t\tthis.ListenerList = [];\n\t}\n\n\tremoveAllListener(event){\n\t\tthis.removeAllEventListener(event);\n\t}\n\n\t/**\n\t *\n\t * @param {String} event\n\t * @param data\n\t */\n\temit(event, ...data){\n\t\tlogger.t(this.TAG, \"emit EVENT: \" + event, ...data);\n\n\t\tfor(let i = 0; i < this.waiters.length;i++){\n\t\t\tlet entry = this.waiters[i];\n\n\t\t\tif(entry[0] === event){\n\t\t\t\tlogger.d(this.TAG, \"hit waiting event: \" + event);\n\t\t\t\tentry[1].call(this, ...data);\n\t\t\t\tthis.waiters.splice(i,1);\n\t\t\t\ti--;\n\t\t\t}\n\t\t}\n\n\t\tfor(let i = 0; i < this.ListenerList.length;i++){\n\t\t\tlet entry = this.ListenerList[i];\n\t\t\tif(entry[0] === event){\n\t\t\t\tentry[1].call(this, ...data);\n\t\t\t}\n\t\t}\n\t}\n}\n\n/* harmony default export */ const event_emitter = (EventEmitter);\n\n\n;// CONCATENATED MODULE: ./src/formats/mp4.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * This file is derived from dailymotion's hls.js library (hls.js/src/remux/mp4-generator.js)\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n//  MP4 boxes generator for ISO BMFF (ISO Base Media File Format, defined in ISO/IEC 14496-12)\nclass MP4 {\n    static init() {\n        MP4.types = {\n            avc1: [], avcC: [], btrt: [], dinf: [],\n            dref: [], esds: [], ftyp: [], hdlr: [],\n            mdat: [], mdhd: [], mdia: [], mfhd: [],\n            minf: [], moof: [], moov: [], mp4a: [],\n            mvex: [], mvhd: [], sdtp: [], stbl: [],\n            stco: [], stsc: [], stsd: [], stsz: [],\n            stts: [], tfdt: [], tfhd: [], traf: [],\n            trak: [], trun: [], trex: [], tkhd: [],\n            vmhd: [], smhd: [], '.mp3': []\n        };\n\n        for (let name in MP4.types) {\n            if (MP4.types.hasOwnProperty(name)) {\n                MP4.types[name] = [\n                    name.charCodeAt(0),\n                    name.charCodeAt(1),\n                    name.charCodeAt(2),\n                    name.charCodeAt(3)\n                ];\n            }\n        }\n\n        let constants = MP4.constants = {};\n\n        constants.FTYP = new Uint8Array([\n            0x69, 0x73, 0x6F, 0x6D,  // major_brand: isom\n            0x0,  0x0,  0x0,  0x1,   // minor_version: 0x01\n            0x69, 0x73, 0x6F, 0x6D,  // isom\n            0x61, 0x76, 0x63, 0x31   // avc1\n        ]);\n\n        constants.STSD_PREFIX = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x01   // entry_count\n        ]);\n\n        constants.STTS = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00   // entry_count\n        ]);\n\n        constants.STSC = constants.STCO = constants.STTS;\n\n        constants.STSZ = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00,  // sample_size\n            0x00, 0x00, 0x00, 0x00   // sample_count\n        ]);\n\n        constants.HDLR_VIDEO = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00,  // pre_defined\n            0x76, 0x69, 0x64, 0x65,  // handler_type: 'vide'\n            0x00, 0x00, 0x00, 0x00,  // reserved: 3 * 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x56, 0x69, 0x64, 0x65,\n            0x6F, 0x48, 0x61, 0x6E,\n            0x64, 0x6C, 0x65, 0x72, 0x00  // name: VideoHandler\n        ]);\n\n        constants.HDLR_AUDIO = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00,  // pre_defined\n            0x73, 0x6F, 0x75, 0x6E,  // handler_type: 'soun'\n            0x00, 0x00, 0x00, 0x00,  // reserved: 3 * 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x53, 0x6F, 0x75, 0x6E,\n            0x64, 0x48, 0x61, 0x6E,\n            0x64, 0x6C, 0x65, 0x72, 0x00  // name: SoundHandler\n        ]);\n\n        constants.DREF = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x01,  // entry_count\n            0x00, 0x00, 0x00, 0x0C,  // entry_size\n            0x75, 0x72, 0x6C, 0x20,  // type 'url '\n            0x00, 0x00, 0x00, 0x01   // version(0) + flags\n        ]);\n\n        // Sound media header\n        constants.SMHD = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00   // balance(2) + reserved(2)\n        ]);\n\n        // video media header\n        constants.VMHD = new Uint8Array([\n            0x00, 0x00, 0x00, 0x01,  // version(0) + flags\n            0x00, 0x00,              // graphicsmode: 2 bytes\n            0x00, 0x00, 0x00, 0x00,  // opcolor: 3 * 2 bytes\n            0x00, 0x00\n        ]);\n    }\n\n    // Generate a box\n    static box(type) {\n        let size = 8;\n        let result;\n        let datas = Array.prototype.slice.call(arguments, 1);\n        let arrayCount = datas.length;\n\n        for (let i = 0; i < arrayCount; i++) {\n            size += datas[i].byteLength;\n        }\n\n        result = new Uint8Array(size);\n        result[0] = (size >>> 24) & 0xFF;  // size\n        result[1] = (size >>> 16) & 0xFF;\n        result[2] = (size >>>  8) & 0xFF;\n        result[3] = (size) & 0xFF;\n\n        result.set(type, 4);  // type\n\n        let offset = 8;\n        for (let i = 0; i < arrayCount; i++) {  // data body\n            result.set(datas[i], offset);\n            offset += datas[i].byteLength;\n        }\n\n        return result;\n    }\n\n    // emit ftyp & moov\n    static generateInitSegment(meta) {\n        let ftyp = MP4.box(MP4.types.ftyp, MP4.constants.FTYP);\n        let moov = MP4.moov(meta);\n\n        let result = new Uint8Array(ftyp.byteLength + moov.byteLength);\n        result.set(ftyp, 0);\n        result.set(moov, ftyp.byteLength);\n        return result;\n    }\n\n    // Movie metadata box\n    static moov(meta) {\n        let mvhd = MP4.mvhd(meta.timescale, meta.duration);\n        let trak = MP4.trak(meta);\n        let mvex = MP4.mvex(meta);\n        return MP4.box(MP4.types.moov, mvhd, trak, mvex);\n    }\n\n    // Movie header box\n    static mvhd(timescale, duration) {\n        return MP4.box(MP4.types.mvhd, new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00,  // creation_time\n            0x00, 0x00, 0x00, 0x00,  // modification_time\n            (timescale >>> 24) & 0xFF,  // timescale: 4 bytes\n            (timescale >>> 16) & 0xFF,\n            (timescale >>>  8) & 0xFF,\n            (timescale) & 0xFF,\n            (duration >>> 24) & 0xFF,   // duration: 4 bytes\n            (duration >>> 16) & 0xFF,\n            (duration >>>  8) & 0xFF,\n            (duration) & 0xFF,\n            0x00, 0x01, 0x00, 0x00,  // Preferred rate: 1.0\n            0x01, 0x00, 0x00, 0x00,  // PreferredVolume(1.0, 2bytes) + reserved(2bytes)\n            0x00, 0x00, 0x00, 0x00,  // reserved: 4 + 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x01, 0x00, 0x00,  // ----begin composition matrix----\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x01, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x40, 0x00, 0x00, 0x00,  // ----end composition matrix----\n            0x00, 0x00, 0x00, 0x00,  // ----begin pre_defined 6 * 4 bytes----\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,  // ----end pre_defined 6 * 4 bytes----\n            0xFF, 0xFF, 0xFF, 0xFF   // next_track_ID\n        ]));\n    }\n\n    // Track box\n    static trak(meta) {\n        return MP4.box(MP4.types.trak, MP4.tkhd(meta), MP4.mdia(meta));\n    }\n\n    // Track header box\n    static tkhd(meta) {\n        let trackId = meta.id, duration = meta.duration;\n        let width = meta.presentWidth, height = meta.presentHeight;\n\n        return MP4.box(MP4.types.tkhd, new Uint8Array([\n            0x00, 0x00, 0x00, 0x07,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00,  // creation_time\n            0x00, 0x00, 0x00, 0x00,  // modification_time\n            (trackId >>> 24) & 0xFF,  // track_ID: 4 bytes\n            (trackId >>> 16) & 0xFF,\n            (trackId >>>  8) & 0xFF,\n            (trackId) & 0xFF,\n            0x00, 0x00, 0x00, 0x00,  // reserved: 4 bytes\n            (duration >>> 24) & 0xFF, // duration: 4 bytes\n            (duration >>> 16) & 0xFF,\n            (duration >>>  8) & 0xFF,\n            (duration) & 0xFF,\n            0x00, 0x00, 0x00, 0x00,  // reserved: 2 * 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,  // layer(2bytes) + alternate_group(2bytes)\n            0x00, 0x00, 0x00, 0x00,  // volume(2bytes) + reserved(2bytes)\n            0x00, 0x01, 0x00, 0x00,  // ----begin composition matrix----\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x01, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x40, 0x00, 0x00, 0x00,  // ----end composition matrix----\n            (width >>> 8) & 0xFF,    // width and height\n            (width) & 0xFF,\n            0x00, 0x00,\n            (height >>> 8) & 0xFF,\n            (height) & 0xFF,\n            0x00, 0x00\n        ]));\n    }\n\n    // Media Box\n    static mdia(meta) {\n        return MP4.box(MP4.types.mdia, MP4.mdhd(meta), MP4.hdlr(meta), MP4.minf(meta));\n    }\n\n    // Media header box\n    static mdhd(meta) {\n        let timescale = meta.timescale;\n        let duration = meta.duration;\n        return MP4.box(MP4.types.mdhd, new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            0x00, 0x00, 0x00, 0x00,  // creation_time\n            0x00, 0x00, 0x00, 0x00,  // modification_time\n            (timescale >>> 24) & 0xFF,  // timescale: 4 bytes\n            (timescale >>> 16) & 0xFF,\n            (timescale >>>  8) & 0xFF,\n            (timescale) & 0xFF,\n            (duration >>> 24) & 0xFF,   // duration: 4 bytes\n            (duration >>> 16) & 0xFF,\n            (duration >>>  8) & 0xFF,\n            (duration) & 0xFF,\n            0x55, 0xC4,             // language: und (undetermined)\n            0x00, 0x00              // pre_defined = 0\n        ]));\n    }\n\n    // Media handler reference box\n    static hdlr(meta) {\n        let data;\n        if (meta.type === 'audio') {\n            data = MP4.constants.HDLR_AUDIO;\n        } else {\n            data = MP4.constants.HDLR_VIDEO;\n        }\n        return MP4.box(MP4.types.hdlr, data);\n    }\n\n    // Media infomation box\n    static minf(meta) {\n        let xmhd;\n        if (meta.type === 'audio') {\n            xmhd = MP4.box(MP4.types.smhd, MP4.constants.SMHD);\n        } else {\n            xmhd = MP4.box(MP4.types.vmhd, MP4.constants.VMHD);\n        }\n        return MP4.box(MP4.types.minf, xmhd, MP4.dinf(), MP4.stbl(meta));\n    }\n\n    // Data infomation box\n    static dinf() {\n        return MP4.box(MP4.types.dinf,\n            MP4.box(MP4.types.dref, MP4.constants.DREF)\n        );\n    }\n\n    // Sample table box\n    static stbl(meta) {\n        return MP4.box(MP4.types.stbl,  // type: stbl\n            MP4.stsd(meta),  // Sample Description Table\n            MP4.box(MP4.types.stts, MP4.constants.STTS),  // Time-To-Sample\n            MP4.box(MP4.types.stsc, MP4.constants.STSC),  // Sample-To-Chunk\n            MP4.box(MP4.types.stsz, MP4.constants.STSZ),  // Sample size\n            MP4.box(MP4.types.stco, MP4.constants.STCO)   // Chunk offset\n        );\n    }\n\n    // Sample description box\n    static stsd(meta) {\n        if (meta.type === 'audio') {\n            if (meta.codec === 'mp3') {\n                return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp3(meta));\n            }\n            // else: aac -> mp4a\n            return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp4a(meta));\n        } else {\n            return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.avc1(meta));\n        }\n    }\n\n    static mp3(meta) {\n        let channelCount = meta.channelCount;\n        let sampleRate = meta.audioSampleRate;\n\n        let data = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // reserved(4)\n            0x00, 0x00, 0x00, 0x01,  // reserved(2) + data_reference_index(2)\n            0x00, 0x00, 0x00, 0x00,  // reserved: 2 * 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, channelCount,      // channelCount(2)\n            0x00, 0x10,              // sampleSize(2)\n            0x00, 0x00, 0x00, 0x00,  // reserved(4)\n            (sampleRate >>> 8) & 0xFF,  // Audio sample rate\n            (sampleRate) & 0xFF,\n            0x00, 0x00\n        ]);\n\n        return MP4.box(MP4.types['.mp3'], data);\n    }\n\n    static mp4a(meta) {\n        let channelCount = meta.channelCount;\n        let sampleRate = meta.audioSampleRate;\n\n        let data = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // reserved(4)\n            0x00, 0x00, 0x00, 0x01,  // reserved(2) + data_reference_index(2)\n            0x00, 0x00, 0x00, 0x00,  // reserved: 2 * 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, channelCount,      // channelCount(2)\n            0x00, 0x10,              // sampleSize(2)\n            0x00, 0x00, 0x00, 0x00,  // reserved(4)\n            (sampleRate >>> 8) & 0xFF,  // Audio sample rate\n            (sampleRate) & 0xFF,\n            0x00, 0x00\n        ]);\n\n        return MP4.box(MP4.types.mp4a, data, MP4.esds(meta));\n    }\n\n    static esds(meta) {\n        let config = meta.config || [];\n        let configSize = config.length;\n        let data = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version 0 + flags\n\n            0x03,                    // descriptor_type\n            0x17 + configSize,       // length3\n            0x00, 0x01,              // es_id\n            0x00,                    // stream_priority\n\n            0x04,                    // descriptor_type\n            0x0F + configSize,       // length\n            0x40,                    // codec: mpeg4_audio\n            0x15,                    // stream_type: Audio\n            0x00, 0x00, 0x00,        // buffer_size\n            0x00, 0x00, 0x00, 0x00,  // maxBitrate\n            0x00, 0x00, 0x00, 0x00,  // avgBitrate\n\n            0x05                     // descriptor_type\n        ].concat([\n            configSize\n        ]).concat(\n            config\n        ).concat([\n            0x06, 0x01, 0x02         // GASpecificConfig\n        ]));\n        return MP4.box(MP4.types.esds, data);\n    }\n\n    static avc1(meta) {\n        let avcc = meta.avcc;\n        let width = meta.codecWidth, height = meta.codecHeight;\n\n        let data = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // reserved(4)\n            0x00, 0x00, 0x00, 0x01,  // reserved(2) + data_reference_index(2)\n            0x00, 0x00, 0x00, 0x00,  // pre_defined(2) + reserved(2)\n            0x00, 0x00, 0x00, 0x00,  // pre_defined: 3 * 4 bytes\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            (width >>> 8) & 0xFF,    // width: 2 bytes\n            (width) & 0xFF,\n            (height >>> 8) & 0xFF,   // height: 2 bytes\n            (height) & 0xFF,\n            0x00, 0x48, 0x00, 0x00,  // horizresolution: 4 bytes\n            0x00, 0x48, 0x00, 0x00,  // vertresolution: 4 bytes\n            0x00, 0x00, 0x00, 0x00,  // reserved: 4 bytes\n            0x00, 0x01,              // frame_count\n            0x0A,                    // strlen\n            0x78, 0x71, 0x71, 0x2F,  // compressorname: 32 bytes\n            0x66, 0x6C, 0x76, 0x2E,\n            0x6A, 0x73, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00, 0x00,\n            0x00, 0x00, 0x00,\n            0x00, 0x18,              // depth\n            0xFF, 0xFF               // pre_defined = -1\n        ]);\n        return MP4.box(MP4.types.avc1, data, MP4.box(MP4.types.avcC, avcc));\n    }\n\n    // Movie Extends box\n    static mvex(meta) {\n        return MP4.box(MP4.types.mvex, MP4.trex(meta));\n    }\n\n    // Track Extends box\n    static trex(meta) {\n        let trackId = meta.id;\n        let data = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) + flags\n            (trackId >>> 24) & 0xFF, // track_ID\n            (trackId >>> 16) & 0xFF,\n            (trackId >>>  8) & 0xFF,\n            (trackId) & 0xFF,\n            0x00, 0x00, 0x00, 0x01,  // default_sample_description_index\n            0x00, 0x00, 0x00, 0x00,  // default_sample_duration\n            0x00, 0x00, 0x00, 0x00,  // default_sample_size\n            0x00, 0x01, 0x00, 0x01   // default_sample_flags\n        ]);\n        return MP4.box(MP4.types.trex, data);\n    }\n\n    // Movie fragment box\n    static moof(track, baseMediaDecodeTime) {\n        return MP4.box(MP4.types.moof, MP4.mfhd(track.sequenceNumber), MP4.traf(track, baseMediaDecodeTime));\n    }\n\n    static mfhd(sequenceNumber) {\n        let data = new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,\n            (sequenceNumber >>> 24) & 0xFF,  // sequence_number: int32\n            (sequenceNumber >>> 16) & 0xFF,\n            (sequenceNumber >>>  8) & 0xFF,\n            (sequenceNumber) & 0xFF\n        ]);\n        return MP4.box(MP4.types.mfhd, data);\n    }\n\n    // Track fragment box\n    static traf(track, baseMediaDecodeTime) {\n        let trackId = track.id;\n\n        // Track fragment header box\n        let tfhd = MP4.box(MP4.types.tfhd, new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) & flags\n            (trackId >>> 24) & 0xFF, // track_ID\n            (trackId >>> 16) & 0xFF,\n            (trackId >>>  8) & 0xFF,\n            (trackId) & 0xFF\n        ]));\n        // Track Fragment Decode Time\n        let tfdt = MP4.box(MP4.types.tfdt, new Uint8Array([\n            0x00, 0x00, 0x00, 0x00,  // version(0) & flags\n            (baseMediaDecodeTime >>> 24) & 0xFF,  // baseMediaDecodeTime: int32\n            (baseMediaDecodeTime >>> 16) & 0xFF,\n            (baseMediaDecodeTime >>>  8) & 0xFF,\n            (baseMediaDecodeTime) & 0xFF\n        ]));\n        let sdtp = MP4.sdtp(track);\n        let trun = MP4.trun(track, sdtp.byteLength + 16 + 16 + 8 + 16 + 8 + 8);\n\n        return MP4.box(MP4.types.traf, tfhd, tfdt, trun, sdtp);\n    }\n\n    // Sample Dependency Type box\n    static sdtp(track) {\n        let samples = track.samples || [];\n        let sampleCount = samples.length;\n        let data = new Uint8Array(4 + sampleCount);\n        // 0~4 bytes: version(0) & flags\n        for (let i = 0; i < sampleCount; i++) {\n            let flags = samples[i].flags;\n            data[i + 4] = (flags.isLeading << 6)    // is_leading: 2 (bit)\n                | (flags.dependsOn << 4)    // sample_depends_on\n                | (flags.isDependedOn << 2) // sample_is_depended_on\n                | (flags.hasRedundancy);    // sample_has_redundancy\n        }\n        return MP4.box(MP4.types.sdtp, data);\n    }\n\n    // Track fragment run box\n    static trun(track, offset) {\n        let samples = track.samples || [];\n        let sampleCount = samples.length;\n        let dataSize = 12 + 16 * sampleCount;\n        let data = new Uint8Array(dataSize);\n        offset += 8 + dataSize;\n\n        data.set([\n            0x00, 0x00, 0x0F, 0x01,      // version(0) & flags\n            (sampleCount >>> 24) & 0xFF, // sample_count\n            (sampleCount >>> 16) & 0xFF,\n            (sampleCount >>>  8) & 0xFF,\n            (sampleCount) & 0xFF,\n            (offset >>> 24) & 0xFF,      // data_offset\n            (offset >>> 16) & 0xFF,\n            (offset >>>  8) & 0xFF,\n            (offset) & 0xFF\n        ], 0);\n\n        for (let i = 0; i < sampleCount; i++) {\n            let duration = samples[i].duration;\n            let size = samples[i].size;\n            let flags = samples[i].flags;\n            let cts = samples[i].cts;\n            data.set([\n                (duration >>> 24) & 0xFF,  // sample_duration\n                (duration >>> 16) & 0xFF,\n                (duration >>>  8) & 0xFF,\n                (duration) & 0xFF,\n                (size >>> 24) & 0xFF,      // sample_size\n                (size >>> 16) & 0xFF,\n                (size >>>  8) & 0xFF,\n                (size) & 0xFF,\n                (flags.isLeading << 2) | flags.dependsOn,  // sample_flags\n                (flags.isDependedOn << 6) | (flags.hasRedundancy << 4) | flags.isNonSync,\n                0x00, 0x00,                // sample_degradation_priority\n                (cts >>> 24) & 0xFF,       // sample_composition_time_offset\n                (cts >>> 16) & 0xFF,\n                (cts >>>  8) & 0xFF,\n                (cts) & 0xFF\n            ], 12 + 16 * i);\n        }\n        return MP4.box(MP4.types.trun, data);\n    }\n\n    static mdat(data) {\n        return MP4.box(MP4.types.mdat, data);\n    }\n\n}\n\nMP4.init();\n\n/* harmony default export */ const mp4 = (MP4);\n\n;// CONCATENATED MODULE: ./src/formats/media-segment-info.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n// Represents an media sample (audio / video)\nclass SampleInfo {\n\n\tconstructor(dts, pts, duration, originalDts, isSync) {\n\t\tthis.dts = dts;\n\t\tthis.pts = pts;\n\t\tthis.duration = duration;\n\t\tthis.originalDts = originalDts;\n\t\tthis.isSyncPoint = isSync;\n\t\tthis.fileposition = null;\n\t}\n\n}\n\n// Media Segment concept is defined in Media Source Extensions spec.\n// Particularly in ISO BMFF format, an Media Segment contains a moof box followed by a mdat box.\nclass MediaSegmentInfo {\n\n\tconstructor() {\n\t\tthis.beginDts = 0;\n\t\tthis.endDts = 0;\n\t\tthis.beginPts = 0;\n\t\tthis.endPts = 0;\n\t\tthis.originalBeginDts = 0;\n\t\tthis.originalEndDts = 0;\n\t\tthis.syncPoints = [];     // SampleInfo[n], for video IDR frames only\n\t\tthis.firstSample = null;  // SampleInfo\n\t\tthis.lastSample = null;   // SampleInfo\n\t}\n\n\tappendSyncPoint(sampleInfo) {  // also called Random Access Point\n\t\tsampleInfo.isSyncPoint = true;\n\t\tthis.syncPoints.push(sampleInfo);\n\t}\n\n}\n\n// Ordered list for recording video IDR frames, sorted by originalDts\nclass IDRSampleList {\n\n\tconstructor() {\n\t\tthis._list = [];\n\t}\n\n\tclear() {\n\t\tthis._list = [];\n\t}\n\n\tappendArray(syncPoints) {\n\t\tlet list = this._list;\n\n\t\tif (syncPoints.length === 0) {\n\t\t\treturn;\n\t\t}\n\n\t\tif (list.length > 0 && syncPoints[0].originalDts < list[list.length - 1].originalDts) {\n\t\t\tthis.clear();\n\t\t}\n\n\t\tArray.prototype.push.apply(list, syncPoints);\n\t}\n\n\tgetLastSyncPointBeforeDts(dts) {\n\t\tif (this._list.length === 0) {\n\t\t\treturn null;\n\t\t}\n\n\t\tlet list = this._list;\n\t\tlet idx = 0;\n\t\tlet last = list.length - 1;\n\t\tlet mid = 0;\n\t\tlet lbound = 0;\n\t\tlet ubound = last;\n\n\t\tif (dts < list[0].dts) {\n\t\t\tidx = 0;\n\t\t\tlbound = ubound + 1;\n\t\t}\n\n\t\twhile (lbound <= ubound) {\n\t\t\tmid = lbound + Math.floor((ubound - lbound) / 2);\n\t\t\tif (mid === last || (dts >= list[mid].dts && dts < list[mid + 1].dts)) {\n\t\t\t\tidx = mid;\n\t\t\t\tbreak;\n\t\t\t} else if (list[mid].dts < dts) {\n\t\t\t\tlbound = mid + 1;\n\t\t\t} else {\n\t\t\t\tubound = mid - 1;\n\t\t\t}\n\t\t}\n\t\treturn this._list[idx];\n\t}\n\n}\n\n// Data structure for recording information of media segments in single track.\nclass MediaSegmentInfoList {\n\n\tconstructor(type) {\n\t\tthis._type = type;\n\t\tthis._list = [];\n\t\tthis._lastAppendLocation = -1;  // cached last insert location\n\t}\n\n\tget type() {\n\t\treturn this._type;\n\t}\n\n\tget length() {\n\t\treturn this._list.length;\n\t}\n\n\tisEmpty() {\n\t\treturn this._list.length === 0;\n\t}\n\n\tclear() {\n\t\tthis._list = [];\n\t\tthis._lastAppendLocation = -1;\n\t}\n\n\t_searchNearestSegmentBefore(originalBeginDts) {\n\t\tlet list = this._list;\n\t\tif (list.length === 0) {\n\t\t\treturn -2;\n\t\t}\n\t\tlet last = list.length - 1;\n\t\tlet mid = 0;\n\t\tlet lbound = 0;\n\t\tlet ubound = last;\n\n\t\tlet idx = 0;\n\n\t\tif (originalBeginDts < list[0].originalBeginDts) {\n\t\t\tidx = -1;\n\t\t\treturn idx;\n\t\t}\n\n\t\twhile (lbound <= ubound) {\n\t\t\tmid = lbound + Math.floor((ubound - lbound) / 2);\n\t\t\tif (mid === last || (originalBeginDts > list[mid].lastSample.originalDts &&\n\t\t\t\t(originalBeginDts < list[mid + 1].originalBeginDts))) {\n\t\t\t\tidx = mid;\n\t\t\t\tbreak;\n\t\t\t} else if (list[mid].originalBeginDts < originalBeginDts) {\n\t\t\t\tlbound = mid + 1;\n\t\t\t} else {\n\t\t\t\tubound = mid - 1;\n\t\t\t}\n\t\t}\n\t\treturn idx;\n\t}\n\n\t_searchNearestSegmentAfter(originalBeginDts) {\n\t\treturn this._searchNearestSegmentBefore(originalBeginDts) + 1;\n\t}\n\n\tappend(mediaSegmentInfo) {\n\t\tlet list = this._list;\n\t\tlet msi = mediaSegmentInfo;\n\t\tlet lastAppendIdx = this._lastAppendLocation;\n\t\tlet insertIdx = 0;\n\n\t\tif (lastAppendIdx !== -1 && lastAppendIdx < list.length &&\n\t\t\tmsi.originalBeginDts >= list[lastAppendIdx].lastSample.originalDts &&\n\t\t\t((lastAppendIdx === list.length - 1) ||\n\t\t\t\t(lastAppendIdx < list.length - 1 &&\n\t\t\t\t\tmsi.originalBeginDts < list[lastAppendIdx + 1].originalBeginDts))) {\n\t\t\tinsertIdx = lastAppendIdx + 1;  // use cached location idx\n\t\t} else {\n\t\t\tif (list.length > 0) {\n\t\t\t\tinsertIdx = this._searchNearestSegmentBefore(msi.originalBeginDts) + 1;\n\t\t\t}\n\t\t}\n\n\t\tthis._lastAppendLocation = insertIdx;\n\t\tthis._list.splice(insertIdx, 0, msi);\n\t}\n\n\tgetLastSegmentBefore(originalBeginDts) {\n\t\tlet idx = this._searchNearestSegmentBefore(originalBeginDts);\n\t\tif (idx >= 0) {\n\t\t\treturn this._list[idx];\n\t\t} else {  // -1\n\t\t\treturn null;\n\t\t}\n\t}\n\n\tgetLastSampleBefore(originalBeginDts) {\n\t\tlet segment = this.getLastSegmentBefore(originalBeginDts);\n\t\tif (segment != null) {\n\t\t\treturn segment.lastSample;\n\t\t} else {\n\t\t\treturn null;\n\t\t}\n\t}\n\n\tgetLastSyncPointBefore(originalBeginDts) {\n\t\tlet segmentIdx = this._searchNearestSegmentBefore(originalBeginDts);\n\t\tlet syncPoints = this._list[segmentIdx].syncPoints;\n\t\twhile (syncPoints.length === 0 && segmentIdx > 0) {\n\t\t\tsegmentIdx--;\n\t\t\tsyncPoints = this._list[segmentIdx].syncPoints;\n\t\t}\n\t\tif (syncPoints.length > 0) {\n\t\t\treturn syncPoints[syncPoints.length - 1];\n\t\t} else {\n\t\t\treturn null;\n\t\t}\n\t}\n}\n\n;// CONCATENATED MODULE: ./src/formats/aac-silent.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * This file is modified from dailymotion's hls.js library (hls.js/src/helper/aac.js)\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nclass AAC {\n\tstatic getSilentFrame(codec, channelCount) {\n\t\tif (codec === 'mp4a.40.2') {\n\t\t\t// handle LC-AAC\n\t\t\tif (channelCount === 1) {\n\t\t\t\treturn new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x23, 0x80]);\n\t\t\t} else if (channelCount === 2) {\n\t\t\t\treturn new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);\n\t\t\t} else if (channelCount === 3) {\n\t\t\t\treturn new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x8e]);\n\t\t\t} else if (channelCount === 4) {\n\t\t\t\treturn new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x80, 0x2c, 0x80, 0x08, 0x02, 0x38]);\n\t\t\t} else if (channelCount === 5) {\n\t\t\t\treturn new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x38]);\n\t\t\t} else if (channelCount === 6) {\n\t\t\t\treturn new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x00, 0xb2, 0x00, 0x20, 0x08, 0xe0]);\n\t\t\t}\n\t\t} else {\n\t\t\t// handle HE-AAC (mp4a.40.5 / mp4a.40.29)\n\t\t\tif (channelCount === 1) {\n\t\t\t\t// ffmpeg -y -f lavfi -i \"aevalsrc=0:d=0.05\" -c:a libfdk_aac -profile:a aac_he -b:a 4k output.aac && hexdump -v -e '16/1 \"0x%x,\" \"\\n\"' -v output.aac\n\t\t\t\treturn new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x4e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x1c, 0x6, 0xf1, 0xc1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);\n\t\t\t} else if (channelCount === 2) {\n\t\t\t\t// ffmpeg -y -f lavfi -i \"aevalsrc=0|0:d=0.05\" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 \"0x%x,\" \"\\n\"' -v output.aac\n\t\t\t\treturn new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);\n\t\t\t} else if (channelCount === 3) {\n\t\t\t\t// ffmpeg -y -f lavfi -i \"aevalsrc=0|0|0:d=0.05\" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 \"0x%x,\" \"\\n\"' -v output.aac\n\t\t\t\treturn new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);\n\t\t\t}\n\t\t}\n\t\treturn null;\n\t}\n\n}\n\n/* harmony default export */ const aac_silent = (AAC);\n\n;// CONCATENATED MODULE: ./src/utils/browser.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nlet Browser = {};\n\nfunction detect() {\n\t// modified from jquery-browser-plugin\n\n\tlet ua = self.navigator.userAgent.toLowerCase();\n\n\tlet match = /(edge)\\/([\\w.]+)/.exec(ua) ||\n\t\t/(opr)[\\/]([\\w.]+)/.exec(ua) ||\n\t\t/(chrome)[ \\/]([\\w.]+)/.exec(ua) ||\n\t\t/(iemobile)[\\/]([\\w.]+)/.exec(ua) ||\n\t\t/(version)(applewebkit)[ \\/]([\\w.]+).*(safari)[ \\/]([\\w.]+)/.exec(ua) ||\n\t\t/(webkit)[ \\/]([\\w.]+).*(version)[ \\/]([\\w.]+).*(safari)[ \\/]([\\w.]+)/.exec(ua) ||\n\t\t/(webkit)[ \\/]([\\w.]+)/.exec(ua) ||\n\t\t/(opera)(?:.*version|)[ \\/]([\\w.]+)/.exec(ua) ||\n\t\t/(msie) ([\\w.]+)/.exec(ua) ||\n\t\tua.indexOf('trident') >= 0 && /(rv)(?::| )([\\w.]+)/.exec(ua) ||\n\t\tua.indexOf('compatible') < 0 && /(firefox)[ \\/]([\\w.]+)/.exec(ua) ||\n\t\t[];\n\n\tlet platform_match = /(ipad)/.exec(ua) ||\n\t\t/(ipod)/.exec(ua) ||\n\t\t/(windows phone)/.exec(ua) ||\n\t\t/(iphone)/.exec(ua) ||\n\t\t/(kindle)/.exec(ua) ||\n\t\t/(android)/.exec(ua) ||\n\t\t/(windows)/.exec(ua) ||\n\t\t/(mac)/.exec(ua) ||\n\t\t/(linux)/.exec(ua) ||\n\t\t/(cros)/.exec(ua) ||\n\t\t[];\n\n\tlet matched = {\n\t\tbrowser: match[5] || match[3] || match[1] || '',\n\t\tversion: match[2] || match[4] || '0',\n\t\tmajorVersion: match[4] || match[2] || '0',\n\t\tplatform: platform_match[0] || ''\n\t};\n\n\tlet browser = {};\n\tif (matched.browser) {\n\t\tbrowser[matched.browser] = true;\n\n\t\tlet versionArray = matched.majorVersion.split('.');\n\t\tbrowser.version = {\n\t\t\tmajor: parseInt(matched.majorVersion, 10),\n\t\t\tstring: matched.version\n\t\t};\n\t\tif (versionArray.length > 1) {\n\t\t\tbrowser.version.minor = parseInt(versionArray[1], 10);\n\t\t}\n\t\tif (versionArray.length > 2) {\n\t\t\tbrowser.version.build = parseInt(versionArray[2], 10);\n\t\t}\n\t}\n\n\tif (matched.platform) {\n\t\tbrowser[matched.platform] = true;\n\t}\n\n\tif (browser.chrome || browser.opr || browser.safari) {\n\t\tbrowser.webkit = true;\n\t}\n\n\t// MSIE. IE11 has 'rv' identifer\n\tif (browser.rv || browser.iemobile) {\n\t\tif (browser.rv) {\n\t\t\tdelete browser.rv;\n\t\t}\n\t\tlet msie = 'msie';\n\t\tmatched.browser = msie;\n\t\tbrowser[msie] = true;\n\t}\n\n\t// Microsoft Edge\n\tif (browser.edge) {\n\t\tdelete browser.edge;\n\t\tlet msedge = 'msedge';\n\t\tmatched.browser = msedge;\n\t\tbrowser[msedge] = true;\n\t}\n\n\t// Opera 15+\n\tif (browser.opr) {\n\t\tlet opera = 'opera';\n\t\tmatched.browser = opera;\n\t\tbrowser[opera] = true;\n\t}\n\n\t// Stock android browsers are marked as Safari\n\tif (browser.safari && browser.android) {\n\t\tlet android = 'android';\n\t\tmatched.browser = android;\n\t\tbrowser[android] = true;\n\t}\n\n\tbrowser.name = matched.browser;\n\tbrowser.platform = matched.platform;\n\n\tfor (let key in Browser) {\n\t\tif (Browser.hasOwnProperty(key)) {\n\t\t\tdelete Browser[key];\n\t\t}\n\t}\n\tObject.assign(Browser, browser);\n}\n\ndetect();\n\n/* harmony default export */ const browser = (Browser);\n\n;// CONCATENATED MODULE: ./src/formats/mp4-remuxer.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n// Fragmented mp4 remuxer\n\n\n\n\n\n\n\nclass MP4Remuxer {\n\tTAG = 'MP4Remuxer'\n\n\tconstructor(config) {\n\t\tthis._config = config;\n\t\tthis._isLive = (config.isLive === true);\n\n\t\tthis._dtsBase = -1;\n\t\tthis._dtsBaseInited = false;\n\t\tthis._audioDtsBase = Infinity;\n\t\tthis._videoDtsBase = Infinity;\n\t\tthis._audioNextDts = undefined;\n\t\tthis._videoNextDts = undefined;\n\t\tthis._audioStashedLastSample = null;\n\t\tthis._videoStashedLastSample = null;\n\n\t\tthis._audioMeta = null;\n\t\tthis._videoMeta = null;\n\n\t\tthis._audioSegmentInfoList = new MediaSegmentInfoList('audio');\n\t\tthis._videoSegmentInfoList = new MediaSegmentInfoList('video');\n\n\t\tthis._onInitSegment = null;\n\t\tthis._onMediaSegment = null;\n\n\t\t// Workaround for chrome < 50: Always force first sample as a Random Access Point in media segment\n\t\t// see https://bugs.chromium.org/p/chromium/issues/detail?id=229412\n\t\tthis._forceFirstIDR = (browser.chrome &&\n\t\t\t(browser.version.major < 50 ||\n\t\t\t\t(browser.version.major === 50 && browser.version.build < 2661))) ? true : false;\n\n\t\t// Workaround for IE11/Edge: Fill silent aac frame after keyframe-seeking\n\t\t// Make audio beginDts equals with video beginDts, in order to fix seek freeze\n\t\tthis._fillSilentAfterSeek = (browser.msedge || browser.msie);\n\n\t\t// While only FireFox supports 'audio/mp4, codecs=\"mp3\"', use 'audio/mpeg' for chrome, safari, ...\n\t\tthis._mp3UseMpegAudio = !browser.firefox;\n\n\t\tthis._fillAudioTimestampGap = this._config.fixAudioTimestampGap;\n\t}\n\n\tdestroy() {\n\t\tthis._dtsBase = -1;\n\t\tthis._dtsBaseInited = false;\n\t\tthis._audioMeta = null;\n\t\tthis._videoMeta = null;\n\t\tthis._audioSegmentInfoList.clear();\n\t\tthis._audioSegmentInfoList = null;\n\t\tthis._videoSegmentInfoList.clear();\n\t\tthis._videoSegmentInfoList = null;\n\t\tthis._onInitSegment = null;\n\t\tthis._onMediaSegment = null;\n\t}\n\n\tget onInitSegment() {\n\t\treturn this._onInitSegment;\n\t}\n\n\tset onInitSegment(callback) {\n\t\tthis._onInitSegment = callback;\n\t}\n\n\tget onMediaSegment() {\n\t\treturn this._onMediaSegment;\n\t}\n\n\tset onMediaSegment(callback) {\n\t\tthis._onMediaSegment = callback;\n\t}\n\n\tinsertDiscontinuity() {\n\t\tthis._audioNextDts = this._videoNextDts = undefined;\n\t}\n\n\tseek(originalDts) {\n\t\tthis._audioStashedLastSample = null;\n\t\tthis._videoStashedLastSample = null;\n\t\tthis._videoSegmentInfoList.clear();\n\t\tthis._audioSegmentInfoList.clear();\n\t}\n\n\tremux(audioTrack, videoTrack) {\n\t\tif (!this._onMediaSegment) {\n\t\t\tthrow new IllegalStateException('MP4Remuxer: onMediaSegment callback must be specificed!');\n\t\t}\n\t\tif (!this._dtsBaseInited) {\n\t\t\tthis._calculateDtsBase(audioTrack, videoTrack);\n\t\t}\n\t\tthis._remuxVideo(videoTrack);\n\t\tthis._remuxAudio(audioTrack);\n\t}\n\n\t_onTrackMetadataReceived(type, metadata) {\n\t\tlogger.i(this.TAG, \"_onTrackMetadataReceived\");\n\t\tlet metabox = null;\n\n\t\tlet container = 'mp4';\n\t\tlet codec = metadata.codec;\n\n\t\tif (type === 'audio') {\n\t\t\tthis._audioMeta = metadata;\n\t\t\tif (metadata.codec === 'mp3' && this._mp3UseMpegAudio) {\n\t\t\t\t// 'audio/mpeg' for MP3 audio track\n\t\t\t\tcontainer = 'mpeg';\n\t\t\t\tcodec = '';\n\t\t\t\tmetabox = new Uint8Array(0);\n\t\t\t} else {\n\t\t\t\t// 'audio/mp4, codecs=\"codec\"'\n\t\t\t\tmetabox = mp4.generateInitSegment(metadata);\n\t\t\t}\n\t\t} else if (type === 'video') {\n\t\t\tthis._videoMeta = metadata;\n\t\t\tmetabox = mp4.generateInitSegment(metadata);\n\t\t} else {\n\t\t\treturn;\n\t\t}\n\n\t\t// dispatch metabox (Initialization Segment)\n\t\tif (!this._onInitSegment) {\n\t\t\tthrow new IllegalStateException('MP4Remuxer: onInitSegment callback must be specified!');\n\t\t}\n\t\tthis._onInitSegment(type, {\n\t\t\ttype: type,\n\t\t\tdata: metabox.buffer,\n\t\t\tcodec: codec,\n\t\t\tcontainer: `${type}/${container}`,\n\t\t\tmediaDuration: metadata.duration  // in timescale 1000 (milliseconds)\n\t\t});\n\t}\n\n\t_calculateDtsBase(audioTrack, videoTrack) {\n\t\tif (this._dtsBaseInited) {\n\t\t\treturn;\n\t\t}\n\n\t\tif (audioTrack.samples && audioTrack.samples.length) {\n\t\t\tthis._audioDtsBase = audioTrack.samples[0].dts;\n\t\t}\n\t\tif (videoTrack.samples && videoTrack.samples.length) {\n\t\t\tthis._videoDtsBase = videoTrack.samples[0].dts;\n\t\t}\n\n\t\tthis._dtsBase = Math.min(this._audioDtsBase, this._videoDtsBase);\n\t\tthis._dtsBaseInited = true;\n\t}\n\n\tflushStashedSamples() {\n\t\tlet videoSample = this._videoStashedLastSample;\n\t\tlet audioSample = this._audioStashedLastSample;\n\n\t\tlet videoTrack = {\n\t\t\ttype: 'video',\n\t\t\tid: 1,\n\t\t\tsequenceNumber: 0,\n\t\t\tsamples: [],\n\t\t\tlength: 0\n\t\t};\n\n\t\tif (videoSample != null) {\n\t\t\tvideoTrack.samples.push(videoSample);\n\t\t\tvideoTrack.length = videoSample.length;\n\t\t}\n\n\t\tlet audioTrack = {\n\t\t\ttype: 'audio',\n\t\t\tid: 2,\n\t\t\tsequenceNumber: 0,\n\t\t\tsamples: [],\n\t\t\tlength: 0\n\t\t};\n\n\t\tif (audioSample != null) {\n\t\t\taudioTrack.samples.push(audioSample);\n\t\t\taudioTrack.length = audioSample.length;\n\t\t}\n\n\t\tthis._videoStashedLastSample = null;\n\t\tthis._audioStashedLastSample = null;\n\n\t\tthis._remuxVideo(videoTrack, true);\n\t\tthis._remuxAudio(audioTrack, true);\n\t}\n\n\t_remuxAudio(audioTrack, force) {\n\t\tlogger.i(this.TAG, \"_remuxAudio\");\n\t\tif (this._audioMeta == null) {\n\t\t\tlogger.w(this.TAG, \"no audioMeta\");\n\t\t\treturn;\n\t\t}\n\n\t\tlet track = audioTrack;\n\t\tlet samples = track.samples;\n\t\tlet dtsCorrection = undefined;\n\t\tlet firstDts = -1, lastDts = -1, lastPts = -1;\n\t\tlet refSampleDuration = this._audioMeta.refSampleDuration;\n\n\t\tlet mpegRawTrack = this._audioMeta.codec === 'mp3' && this._mp3UseMpegAudio;\n\t\tlet firstSegmentAfterSeek = this._dtsBaseInited && this._audioNextDts === undefined;\n\n\t\tlet insertPrefixSilentFrame = false;\n\n\t\tif (!samples || samples.length === 0) {\n\t\t\tlogger.w(this.TAG, \"no samples\");\n\t\t\treturn;\n\t\t}\n\t\tif (samples.length === 1 && !force) {\n\t\t\t// If [sample count in current batch] === 1 && (force != true)\n\t\t\t// Ignore and keep in demuxer's queue\n\t\t\tlogger.w(this.TAG, \"1 sample\");\n\t\t\treturn;\n\t\t}  // else if (force === true) do remux\n\n\t\tlet offset = 0;\n\t\tlet mdatbox = null;\n\t\tlet mdatBytes = 0;\n\n\t\t// calculate initial mdat size\n\t\tif (mpegRawTrack) {\n\t\t\t// for raw mpeg buffer\n\t\t\toffset = 0;\n\t\t\tmdatBytes = track.length;\n\t\t} else {\n\t\t\t// for fmp4 mdat box\n\t\t\toffset = 8;  // size + type\n\t\t\tmdatBytes = 8 + track.length;\n\t\t}\n\n\n\t\tlet lastSample = null;\n\n\t\t// Pop the lastSample and waiting for stash\n\t\tif (samples.length > 1) {\n\t\t\tlastSample = samples.pop();\n\t\t\tmdatBytes -= lastSample.length;\n\t\t}\n\n\t\t// Insert [stashed lastSample in the previous batch] to the front\n\t\tif (this._audioStashedLastSample != null) {\n\t\t\tlet sample = this._audioStashedLastSample;\n\t\t\tthis._audioStashedLastSample = null;\n\t\t\tsamples.unshift(sample);\n\t\t\tmdatBytes += sample.length;\n\t\t}\n\n\t\t// Stash the lastSample of current batch, waiting for next batch\n\t\tif (lastSample != null) {\n\t\t\tthis._audioStashedLastSample = lastSample;\n\t\t}\n\n\n\t\tlet firstSampleOriginalDts = samples[0].dts - this._dtsBase;\n\n\t\t// calculate dtsCorrection\n\t\tif (this._audioNextDts) {\n\t\t\tdtsCorrection = firstSampleOriginalDts - this._audioNextDts;\n\t\t} else {  // this._audioNextDts == undefined\n\t\t\tif (this._audioSegmentInfoList.isEmpty()) {\n\t\t\t\tdtsCorrection = 0;\n\t\t\t\tif (this._fillSilentAfterSeek && !this._videoSegmentInfoList.isEmpty()) {\n\t\t\t\t\tif (this._audioMeta.originalCodec !== 'mp3') {\n\t\t\t\t\t\tinsertPrefixSilentFrame = true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tlet lastSample = this._audioSegmentInfoList.getLastSampleBefore(firstSampleOriginalDts);\n\t\t\t\tif (lastSample != null) {\n\t\t\t\t\tlet distance = (firstSampleOriginalDts - (lastSample.originalDts + lastSample.duration));\n\t\t\t\t\tif (distance <= 3) {\n\t\t\t\t\t\tdistance = 0;\n\t\t\t\t\t}\n\t\t\t\t\tlet expectedDts = lastSample.dts + lastSample.duration + distance;\n\t\t\t\t\tdtsCorrection = firstSampleOriginalDts - expectedDts;\n\t\t\t\t} else { // lastSample == null, cannot found\n\t\t\t\t\tdtsCorrection = 0;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tif (insertPrefixSilentFrame) {\n\t\t\t// align audio segment beginDts to match with current video segment's beginDts\n\t\t\tlet firstSampleDts = firstSampleOriginalDts - dtsCorrection;\n\t\t\tlet videoSegment = this._videoSegmentInfoList.getLastSegmentBefore(firstSampleOriginalDts);\n\t\t\tif (videoSegment != null && videoSegment.beginDts < firstSampleDts) {\n\t\t\t\tlet silentUnit = aac_silent.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);\n\t\t\t\tif (silentUnit) {\n\t\t\t\t\tlet dts = videoSegment.beginDts;\n\t\t\t\t\tlet silentFrameDuration = firstSampleDts - videoSegment.beginDts;\n\t\t\t\t\tlogger.v(this.TAG, `InsertPrefixSilentAudio: dts: ${dts}, duration: ${silentFrameDuration}`);\n\t\t\t\t\tsamples.unshift({ unit: silentUnit, dts: dts, pts: dts });\n\t\t\t\t\tmdatBytes += silentUnit.byteLength;\n\t\t\t\t}  // silentUnit == null: Cannot generate, skip\n\t\t\t} else {\n\t\t\t\tinsertPrefixSilentFrame = false;\n\t\t\t}\n\t\t}\n\n\t\tlet mp4Samples = [];\n\n\t\t// Correct dts for each sample, and calculate sample duration. Then output to mp4Samples\n\t\tfor (let i = 0; i < samples.length; i++) {\n\t\t\tlet sample = samples[i];\n\t\t\tlet unit = sample.unit;\n\t\t\tlet originalDts = sample.dts - this._dtsBase;\n\t\t\tlet dts = originalDts;\n\t\t\tlet needFillSilentFrames = false;\n\t\t\tlet silentFrames = null;\n\t\t\tlet sampleDuration = 0;\n\n\t\t\tif (originalDts < -0.001) {\n\t\t\t\tcontinue; //pass the first sample with the invalid dts\n\t\t\t}\n\n\t\t\tif (this._audioMeta.codec !== 'mp3') {\n\t\t\t\t// for AAC codec, we need to keep dts increase based on refSampleDuration\n\t\t\t\tlet curRefDts = originalDts;\n\t\t\t\tconst maxAudioFramesDrift = 3;\n\t\t\t\tif (this._audioNextDts) {\n\t\t\t\t\tcurRefDts = this._audioNextDts;\n\t\t\t\t}\n\n\t\t\t\tdtsCorrection = originalDts - curRefDts;\n\t\t\t\tif (dtsCorrection <= -maxAudioFramesDrift * refSampleDuration) {\n\t\t\t\t\t// If we're overlapping by more than maxAudioFramesDrift number of frame, drop this sample\n\t\t\t\t\tlogger.w(this.TAG, `Dropping 1 audio frame (originalDts: ${originalDts} ms ,curRefDts: ${curRefDts} ms)  due to dtsCorrection: ${dtsCorrection} ms overlap.`);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\telse if (dtsCorrection >= maxAudioFramesDrift * refSampleDuration && this._fillAudioTimestampGap && !browser.safari) {\n\t\t\t\t\t// Silent frame generation, if large timestamp gap detected && config.fixAudioTimestampGap\n\t\t\t\t\tneedFillSilentFrames = true;\n\t\t\t\t\t// We need to insert silent frames to fill timestamp gap\n\t\t\t\t\tlet frameCount = Math.floor(dtsCorrection / refSampleDuration);\n\t\t\t\t\tlogger.w(this.TAG, 'Large audio timestamp gap detected, may cause AV sync to drift. ' +\n\t\t\t\t\t\t'Silent frames will be generated to avoid unsync.\\n' +\n\t\t\t\t\t\t`originalDts: ${originalDts} ms, curRefDts: ${curRefDts} ms, ` +\n\t\t\t\t\t\t`dtsCorrection: ${Math.round(dtsCorrection)} ms, generate: ${frameCount} frames`);\n\n\n\t\t\t\t\tdts = Math.floor(curRefDts);\n\t\t\t\t\tsampleDuration = Math.floor(curRefDts + refSampleDuration) - dts;\n\n\t\t\t\t\tlet silentUnit = aac_silent.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);\n\t\t\t\t\tif (silentUnit == null) {\n\t\t\t\t\t\tlogger.w(this.TAG, 'Unable to generate silent frame for ' +\n\t\t\t\t\t\t\t`${this._audioMeta.originalCodec} with ${this._audioMeta.channelCount} channels, repeat last frame`);\n\t\t\t\t\t\t// Repeat last frame\n\t\t\t\t\t\tsilentUnit = unit;\n\t\t\t\t\t}\n\t\t\t\t\tsilentFrames = [];\n\n\t\t\t\t\tfor (let j = 0; j < frameCount; j++) {\n\t\t\t\t\t\tcurRefDts = curRefDts + refSampleDuration;\n\t\t\t\t\t\tlet intDts = Math.floor(curRefDts);  // change to integer\n\t\t\t\t\t\tlet intDuration = Math.floor(curRefDts + refSampleDuration) - intDts;\n\t\t\t\t\t\tlet frame = {\n\t\t\t\t\t\t\tdts: intDts,\n\t\t\t\t\t\t\tpts: intDts,\n\t\t\t\t\t\t\tcts: 0,\n\t\t\t\t\t\t\tunit: silentUnit,\n\t\t\t\t\t\t\tsize: silentUnit.byteLength,\n\t\t\t\t\t\t\tduration: intDuration,  // wait for next sample\n\t\t\t\t\t\t\toriginalDts: originalDts,\n\t\t\t\t\t\t\tflags: {\n\t\t\t\t\t\t\t\tisLeading: 0,\n\t\t\t\t\t\t\t\tdependsOn: 1,\n\t\t\t\t\t\t\t\tisDependedOn: 0,\n\t\t\t\t\t\t\t\thasRedundancy: 0\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t};\n\t\t\t\t\t\tsilentFrames.push(frame);\n\t\t\t\t\t\tmdatBytes += frame.size;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tthis._audioNextDts = curRefDts + refSampleDuration;\n\n\t\t\t\t} else {\n\n\t\t\t\t\tdts = Math.floor(curRefDts);\n\t\t\t\t\tsampleDuration = Math.floor(curRefDts + refSampleDuration) - dts;\n\t\t\t\t\tthis._audioNextDts = curRefDts + refSampleDuration;\n\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\t// keep the original dts calculate algorithm for mp3\n\t\t\t\tdts = originalDts - dtsCorrection;\n\n\n\t\t\t\tif (i !== samples.length - 1) {\n\t\t\t\t\tlet nextDts = samples[i + 1].dts - this._dtsBase - dtsCorrection;\n\t\t\t\t\tsampleDuration = nextDts - dts;\n\t\t\t\t} else {  // the last sample\n\t\t\t\t\tif (lastSample != null) {  // use stashed sample's dts to calculate sample duration\n\t\t\t\t\t\tlet nextDts = lastSample.dts - this._dtsBase - dtsCorrection;\n\t\t\t\t\t\tsampleDuration = nextDts - dts;\n\t\t\t\t\t} else if (mp4Samples.length >= 1) {  // use second last sample duration\n\t\t\t\t\t\tsampleDuration = mp4Samples[mp4Samples.length - 1].duration;\n\t\t\t\t\t} else {  // the only one sample, use reference sample duration\n\t\t\t\t\t\tsampleDuration = Math.floor(refSampleDuration);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tthis._audioNextDts = dts + sampleDuration;\n\t\t\t}\n\n\t\t\tif (firstDts === -1) {\n\t\t\t\tfirstDts = dts;\n\t\t\t}\n\t\t\tmp4Samples.push({\n\t\t\t\tdts: dts,\n\t\t\t\tpts: dts,\n\t\t\t\tcts: 0,\n\t\t\t\tunit: sample.unit,\n\t\t\t\tsize: sample.unit.byteLength,\n\t\t\t\tduration: sampleDuration,\n\t\t\t\toriginalDts: originalDts,\n\t\t\t\tflags: {\n\t\t\t\t\tisLeading: 0,\n\t\t\t\t\tdependsOn: 1,\n\t\t\t\t\tisDependedOn: 0,\n\t\t\t\t\thasRedundancy: 0\n\t\t\t\t}\n\t\t\t});\n\n\t\t\tif (needFillSilentFrames) {\n\t\t\t\t// Silent frames should be inserted after wrong-duration frame\n\t\t\t\tmp4Samples.push.apply(mp4Samples, silentFrames);\n\t\t\t}\n\t\t}\n\n\t\tif (mp4Samples.length === 0) {\n\t\t\t//no samples need to remux\n\t\t\ttrack.samples = [];\n\t\t\ttrack.length = 0;\n\t\t\tlogger.w(this.TAG, \"no mp4Samples = 0\");\n\t\t\treturn;\n\t\t}\n\n\t\t// allocate mdatbox\n\t\tif (mpegRawTrack) {\n\t\t\t// allocate for raw mpeg buffer\n\t\t\tmdatbox = new Uint8Array(mdatBytes);\n\t\t} else {\n\t\t\t// allocate for fmp4 mdat box\n\t\t\tmdatbox = new Uint8Array(mdatBytes);\n\t\t\t// size field\n\t\t\tmdatbox[0] = (mdatBytes >>> 24) & 0xFF;\n\t\t\tmdatbox[1] = (mdatBytes >>> 16) & 0xFF;\n\t\t\tmdatbox[2] = (mdatBytes >>> 8) & 0xFF;\n\t\t\tmdatbox[3] = (mdatBytes) & 0xFF;\n\t\t\t// type field (fourCC)\n\t\t\tmdatbox.set(mp4.types.mdat, 4);\n\t\t}\n\n\t\t// Write samples into mdatbox\n\t\tfor (let i = 0; i < mp4Samples.length; i++) {\n\t\t\tlet unit = mp4Samples[i].unit;\n\t\t\tmdatbox.set(unit, offset);\n\t\t\toffset += unit.byteLength;\n\t\t}\n\n\t\tlet latest = mp4Samples[mp4Samples.length - 1];\n\t\tlastDts = latest.dts + latest.duration;\n\t\t//this._audioNextDts = lastDts;\n\n\t\t// fill media segment info & add to info list\n\t\tlet info = new MediaSegmentInfo();\n\t\tinfo.beginDts = firstDts;\n\t\tinfo.endDts = lastDts;\n\t\tinfo.beginPts = firstDts;\n\t\tinfo.endPts = lastDts;\n\t\tinfo.originalBeginDts = mp4Samples[0].originalDts;\n\t\tinfo.originalEndDts = latest.originalDts + latest.duration;\n\t\tinfo.firstSample = new SampleInfo(mp4Samples[0].dts,\n\t\t\tmp4Samples[0].pts,\n\t\t\tmp4Samples[0].duration,\n\t\t\tmp4Samples[0].originalDts,\n\t\t\tfalse);\n\t\tinfo.lastSample = new SampleInfo(latest.dts,\n\t\t\tlatest.pts,\n\t\t\tlatest.duration,\n\t\t\tlatest.originalDts,\n\t\t\tfalse);\n\t\tif (!this._isLive) {\n\t\t\tthis._audioSegmentInfoList.append(info);\n\t\t}\n\n\t\ttrack.samples = mp4Samples;\n\t\ttrack.sequenceNumber++;\n\n\t\tlet moofbox;\n\n\t\tif (mpegRawTrack) {\n\t\t\t// Generate empty buffer, because useless for raw mpeg\n\t\t\tmoofbox = new Uint8Array(0);\n\t\t} else {\n\t\t\t// Generate moof for fmp4 segment\n\t\t\tmoofbox = mp4.moof(track, firstDts);\n\t\t}\n\n\t\ttrack.samples = [];\n\t\ttrack.length = 0;\n\n\t\tlet segment = {\n\t\t\ttype: 'audio',\n\t\t\tdata: this._mergeBoxes(moofbox, mdatbox).buffer,\n\t\t\tsampleCount: mp4Samples.length,\n\t\t\tinfo: info\n\t\t};\n\n\t\tif (mpegRawTrack && firstSegmentAfterSeek) {\n\t\t\t// For MPEG audio stream in MSE, if seeking occurred, before appending new buffer\n\t\t\t// We need explicitly set timestampOffset to the desired point in timeline for mpeg SourceBuffer.\n\t\t\tsegment.timestampOffset = firstDts;\n\t\t}\n\n\t\tlogger.i(this.TAG, \"send onMediaSegment audio\");\n\t\tthis._onMediaSegment('audio', segment);\n\t}\n\n\t_remuxVideo(videoTrack, force) {\n\t\tlogger.i(this.TAG, \"_remuxVideo\");\n\t\tif (this._videoMeta == null) {\n\t\t\treturn;\n\t\t}\n\n\t\tlet track = videoTrack;\n\t\tlet samples = track.samples;\n\t\tlet dtsCorrection = undefined;\n\t\tlet firstDts = -1, lastDts = -1;\n\t\tlet firstPts = -1, lastPts = -1;\n\n\t\tif (!samples || samples.length === 0) {\n\t\t\tlogger.w(this.TAG, \"no samples\");\n\t\t\treturn;\n\t\t}\n\t\tif (samples.length === 1 && !force) {\n\t\t\t// If [sample count in current batch] === 1 && (force != true)\n\t\t\t// Ignore and keep in demuxer's queue\n\t\t\tlogger.w(this.TAG, \"no sampes = 1\");\n\t\t\treturn;\n\t\t}  // else if (force === true) do remux\n\n\t\tlet offset = 8;\n\t\tlet mdatbox = null;\n\t\tlet mdatBytes = 8 + videoTrack.length;\n\n\n\t\tlet lastSample = null;\n\n\t\t// Pop the lastSample and waiting for stash\n\t\tif (samples.length > 1) {\n\t\t\tlastSample = samples.pop();\n\t\t\tmdatBytes -= lastSample.length;\n\t\t}\n\n\t\t// Insert [stashed lastSample in the previous batch] to the front\n\t\tif (this._videoStashedLastSample != null) {\n\t\t\tlet sample = this._videoStashedLastSample;\n\t\t\tthis._videoStashedLastSample = null;\n\t\t\tsamples.unshift(sample);\n\t\t\tmdatBytes += sample.length;\n\t\t}\n\n\t\t// Stash the lastSample of current batch, waiting for next batch\n\t\tif (lastSample != null) {\n\t\t\tthis._videoStashedLastSample = lastSample;\n\t\t}\n\n\n\t\tlet firstSampleOriginalDts = samples[0].dts - this._dtsBase;\n\n\t\t// calculate dtsCorrection\n\t\tif (this._videoNextDts) {\n\t\t\tdtsCorrection = firstSampleOriginalDts - this._videoNextDts;\n\t\t} else {  // this._videoNextDts == undefined\n\t\t\tif (this._videoSegmentInfoList.isEmpty()) {\n\t\t\t\tdtsCorrection = 0;\n\t\t\t} else {\n\t\t\t\tlet lastSample = this._videoSegmentInfoList.getLastSampleBefore(firstSampleOriginalDts);\n\t\t\t\tif (lastSample != null) {\n\t\t\t\t\tlet distance = (firstSampleOriginalDts - (lastSample.originalDts + lastSample.duration));\n\t\t\t\t\tif (distance <= 3) {\n\t\t\t\t\t\tdistance = 0;\n\t\t\t\t\t}\n\t\t\t\t\tlet expectedDts = lastSample.dts + lastSample.duration + distance;\n\t\t\t\t\tdtsCorrection = firstSampleOriginalDts - expectedDts;\n\t\t\t\t} else { // lastSample == null, cannot found\n\t\t\t\t\tdtsCorrection = 0;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tlet info = new MediaSegmentInfo();\n\t\tlet mp4Samples = [];\n\n\t\t// Correct dts for each sample, and calculate sample duration. Then output to mp4Samples\n\t\tfor (let i = 0; i < samples.length; i++) {\n\t\t\tlet sample = samples[i];\n\t\t\tlet originalDts = sample.dts - this._dtsBase;\n\t\t\tlet isKeyframe = sample.isKeyframe;\n\t\t\tlet dts = originalDts - dtsCorrection;\n\t\t\tlet cts = sample.cts;\n\t\t\tlet pts = dts + cts;\n\n\t\t\tif (firstDts === -1) {\n\t\t\t\tfirstDts = dts;\n\t\t\t\tfirstPts = pts;\n\t\t\t}\n\n\t\t\tlet sampleDuration = 0;\n\n\t\t\tif (i !== samples.length - 1) {\n\t\t\t\tlet nextDts = samples[i + 1].dts - this._dtsBase - dtsCorrection;\n\t\t\t\tsampleDuration = nextDts - dts;\n\t\t\t} else {  // the last sample\n\t\t\t\tif (lastSample != null) {  // use stashed sample's dts to calculate sample duration\n\t\t\t\t\tlet nextDts = lastSample.dts - this._dtsBase - dtsCorrection;\n\t\t\t\t\tsampleDuration = nextDts - dts;\n\t\t\t\t} else if (mp4Samples.length >= 1) {  // use second last sample duration\n\t\t\t\t\tsampleDuration = mp4Samples[mp4Samples.length - 1].duration;\n\t\t\t\t} else {  // the only one sample, use reference sample duration\n\t\t\t\t\tsampleDuration = Math.floor(this._videoMeta.refSampleDuration);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (isKeyframe) {\n\t\t\t\tlet syncPoint = new SampleInfo(dts, pts, sampleDuration, sample.dts, true);\n\t\t\t\tsyncPoint.fileposition = sample.fileposition;\n\t\t\t\tinfo.appendSyncPoint(syncPoint);\n\t\t\t}\n\n\t\t\tmp4Samples.push({\n\t\t\t\tdts: dts,\n\t\t\t\tpts: pts,\n\t\t\t\tcts: cts,\n\t\t\t\tunits: sample.units,\n\t\t\t\tsize: sample.length,\n\t\t\t\tisKeyframe: isKeyframe,\n\t\t\t\tduration: sampleDuration,\n\t\t\t\toriginalDts: originalDts,\n\t\t\t\tflags: {\n\t\t\t\t\tisLeading: 0,\n\t\t\t\t\tdependsOn: isKeyframe ? 2 : 1,\n\t\t\t\t\tisDependedOn: isKeyframe ? 1 : 0,\n\t\t\t\t\thasRedundancy: 0,\n\t\t\t\t\tisNonSync: isKeyframe ? 0 : 1\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\n\t\t// allocate mdatbox\n\t\tmdatbox = new Uint8Array(mdatBytes);\n\t\tmdatbox[0] = (mdatBytes >>> 24) & 0xFF;\n\t\tmdatbox[1] = (mdatBytes >>> 16) & 0xFF;\n\t\tmdatbox[2] = (mdatBytes >>> 8) & 0xFF;\n\t\tmdatbox[3] = (mdatBytes) & 0xFF;\n\t\tmdatbox.set(mp4.types.mdat, 4);\n\n\t\t// Write samples into mdatbox\n\t\tfor (let i = 0; i < mp4Samples.length; i++) {\n\t\t\tlet units = mp4Samples[i].units;\n\t\t\twhile (units.length) {\n\t\t\t\tlet unit = units.shift();\n\t\t\t\tlet data = unit.data;\n\t\t\t\tmdatbox.set(data, offset);\n\t\t\t\toffset += data.byteLength;\n\t\t\t}\n\t\t}\n\n\t\tlet latest = mp4Samples[mp4Samples.length - 1];\n\t\tlastDts = latest.dts + latest.duration;\n\t\tlastPts = latest.pts + latest.duration;\n\t\tthis._videoNextDts = lastDts;\n\n\t\t// fill media segment info & add to info list\n\t\tinfo.beginDts = firstDts;\n\t\tinfo.endDts = lastDts;\n\t\tinfo.beginPts = firstPts;\n\t\tinfo.endPts = lastPts;\n\t\tinfo.originalBeginDts = mp4Samples[0].originalDts;\n\t\tinfo.originalEndDts = latest.originalDts + latest.duration;\n\t\tinfo.firstSample = new SampleInfo(mp4Samples[0].dts,\n\t\t\tmp4Samples[0].pts,\n\t\t\tmp4Samples[0].duration,\n\t\t\tmp4Samples[0].originalDts,\n\t\t\tmp4Samples[0].isKeyframe);\n\t\tinfo.lastSample = new SampleInfo(latest.dts,\n\t\t\tlatest.pts,\n\t\t\tlatest.duration,\n\t\t\tlatest.originalDts,\n\t\t\tlatest.isKeyframe);\n\t\tif (!this._isLive) {\n\t\t\tthis._videoSegmentInfoList.append(info);\n\t\t}\n\n\t\ttrack.samples = mp4Samples;\n\t\ttrack.sequenceNumber++;\n\n\t\t// workaround for chrome < 50: force first sample as a random access point\n\t\t// see https://bugs.chromium.org/p/chromium/issues/detail?id=229412\n\t\tif (this._forceFirstIDR) {\n\t\t\tlet flags = mp4Samples[0].flags;\n\t\t\tflags.dependsOn = 2;\n\t\t\tflags.isNonSync = 0;\n\t\t}\n\n\t\tlet moofbox = mp4.moof(track, firstDts);\n\t\ttrack.samples = [];\n\t\ttrack.length = 0;\n\n\t\tlogger.i(this.TAG, \"send onMediaSegment video\");\n\t\tthis._onMediaSegment('video', {\n\t\t\ttype: 'video',\n\t\t\tdata: this._mergeBoxes(moofbox, mdatbox).buffer,\n\t\t\tsampleCount: mp4Samples.length,\n\t\t\tinfo: info\n\t\t});\n\t}\n\n\t_mergeBoxes(moof, mdat) {\n\t\tlet result = new Uint8Array(moof.byteLength + mdat.byteLength);\n\t\tresult.set(moof, 0);\n\t\tresult.set(mdat, moof.byteLength);\n\t\treturn result;\n\t}\n\n}\n\n/* harmony default export */ const mp4_remuxer = (MP4Remuxer);\n\n;// CONCATENATED MODULE: ./src/flv/transmuxer.js\n/*\n * Copyright (C) 2016 Bilibili. All Rights Reserved.\n *\n * @author zheng qian <xqq@xqq.im>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n\n\n\n\n\n\n\nclass Transmuxer {\n    TAG = 'Transmuxer';\n\n    constructor(config) {\n        this._emitter = new event_emitter();\n\n        this._config = config;\n\n        this._pendingSeekTime = null;\n        this._pendingResolveSeekPoint = null;\n\n        this._remuxer = new mp4_remuxer(this._config);\n        this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival.bind(this);\n        this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival.bind(this);\n    }\n\n    destroy() {\n        if (this._remuxer) {\n            this._remuxer.destroy();\n            this._remuxer = null;\n        }\n\n        this._emitter.removeAllListener();\n        this._emitter = null;\n    }\n\n    on(event, listener) {\n        this._emitter.addListener(event, listener);\n    }\n\n    off(event, listener) {\n        this._emitter.removeListener(event, listener);\n    }\n\n    remux(audioTrack, videoTrack){\n        this._remuxer.remux(audioTrack, videoTrack);\n    }\n\n    _onTrackMetadataReceived(type, metadata) {\n        this._remuxer._onTrackMetadataReceived(type, metadata);\n    }\n\n    stop() {\n       // this._internalAbort();\n    }\n\n    _onRemuxerInitSegmentArrival(type, initSegment) {\n        this._emitter.emit(TransmuxingEvents.INIT_SEGMENT, type, initSegment);\n    }\n\n    _onRemuxerMediaSegmentArrival(type, mediaSegment) {\n        logger.d(this.TAG, \"_onRemuxerMediaSegmentArrival\");\n        if (this._pendingSeekTime != null) {\n            // Media segments after new-segment cross-seeking should be dropped.\n            return;\n        }\n        this._emitter.emit(TransmuxingEvents.MEDIA_SEGMENT, type, mediaSegment);\n\n        // Resolve pending seekPoint\n        if (this._pendingResolveSeekPoint != null && type === 'video') {\n            let syncPoints = mediaSegment.info.syncPoints;\n            let seekpoint = this._pendingResolveSeekPoint;\n            this._pendingResolveSeekPoint = null;\n\n            // Safari: Pass PTS for recommend_seekpoint\n            if (browser.safari && syncPoints.length > 0 && syncPoints[0].originalDts === seekpoint) {\n                seekpoint = syncPoints[0].pts;\n            }\n            // else: use original DTS (keyframe.milliseconds)\n\n            this._emitter.emit(TransmuxingEvents.RECOMMEND_SEEKPOINT, seekpoint);\n        }\n    }\n}\n\n/* harmony default export */ const transmuxer = (Transmuxer);\n\n;// CONCATENATED MODULE: ./src/rtmp/RTMPMediaMessageHandler.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * This was heavily inspired by bilibi FLVPlayer (flv.js/src/demux/flv-demuxer.js)\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\n\n\n\n\n\nclass RTMPMediaMessageHandler{\n    TAG = \"RTMPMediaMessageHandler\";\n\n    constructor(config) {\n        this._config = config;\n\n        this._onError = null;\n        this._onMediaInfo = null;\n        this._onMetaDataArrived = null;\n        this._onScriptDataArrived = null;\n        this._onDataAvailable = null;\n        this._onTrackMetadata = null;\n\n        this._dispatch = false;\n\n        this._hasAudio = true;\n        this._hasVideo = true;\n\n        this._hasAudioFlagOverrided = false;\n        this._hasVideoFlagOverrided = false;\n\n        this._audioInitialMetadataDispatched = false;\n        this._videoInitialMetadataDispatched = false;\n\n        this._mediaInfo = new media_info();\n        this._mediaInfo.hasAudio = this._hasAudio;\n        this._mediaInfo.hasVideo = this._hasVideo;\n        this._metadata = null;\n        this._audioMetadata = null;\n        this._videoMetadata = null;\n\n        this._naluLengthSize = 4;\n        this._timestampBase = 0;  // int32, in milliseconds\n        this._timescale = 1000;\n        this._duration = 0;  // int32, in milliseconds\n        this._durationOverrided = false;\n        this._referenceFrameRate = {\n            fixed: true,\n            fps: 23.976,\n            fps_num: 23976,\n            fps_den: 1000\n        };\n\n        this._flvSoundRateTable = [5500, 11025, 22050, 44100, 48000];\n\n        this._mpegSamplingRates = [\n            96000, 88200, 64000, 48000, 44100, 32000,\n            24000, 22050, 16000, 12000, 11025, 8000, 7350\n        ];\n\n        this._mpegAudioV10SampleRateTable = [44100, 48000, 32000, 0];\n        this._mpegAudioV20SampleRateTable = [22050, 24000, 16000, 0];\n        this._mpegAudioV25SampleRateTable = [11025, 12000, 8000,  0];\n\n        this._mpegAudioL1BitRateTable = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1];\n        this._mpegAudioL2BitRateTable = [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, -1];\n        this._mpegAudioL3BitRateTable = [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, -1];\n\n        this._videoTrack = {type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0};\n        this._audioTrack = {type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0};\n\n        this._littleEndian = (function () {\n            let buf = new ArrayBuffer(2);\n            (new DataView(buf)).setInt16(0, 256, true);  // little-endian write\n            return (new Int16Array(buf))[0] === 256;  // platform-spec read, if equal then LE\n        })();\n\n\n        this.bytePos = 0;\n\n        this._config = defaultConfig;\n        this._transmuxer = new transmuxer(this._config);\n\n        this._transmuxer.on(TransmuxingEvents.INIT_SEGMENT, (type, is) => {\n            postMessage([TransmuxingEvents.INIT_SEGMENT, type, is]);\n        });\n\n        this._transmuxer.on(TransmuxingEvents.MEDIA_SEGMENT, (type, ms) => {\n            postMessage([TransmuxingEvents.MEDIA_SEGMENT, type, ms]);\n        });\n\n        this._transmuxer.on(TransmuxingEvents.MEDIA_INFO, (mediaInfo) => {\n            this._mediaInfo = mediaInfo;\n            postMessage([TransmuxingEvents.MEDIA_INFO, mediaInfo]);\n        });\n\n        this._transmuxer.on(TransmuxingEvents.METADATA_ARRIVED, (metadata) => {\n            postMessage([TransmuxingEvents.METADATA_ARRIVED, metadata]);\n        });\n\n        this._transmuxer.on(TransmuxingEvents.SCRIPTDATA_ARRIVED, (data) => {\n            postMessage([TransmuxingEvents.SCRIPTDATA_ARRIVED, data]);\n        });\n\n        this._onDataAvailable = (audioTrack, videoTrack) =>{\n            logger.d(this.TAG, \"_onDataAvailable\");\n            this._transmuxer.remux(audioTrack, videoTrack);\n        }\n\n        this._onTrackMetadata = (type, metadata)=>{\n            logger.d(this.TAG, \"_onTrackMetadata\");\n            this._transmuxer._onTrackMetadataReceived(type, metadata);\n        }\n    }\n\n    destroy() {\n        this._transmuxer.destroy();\n        this._mediaInfo = null;\n        this._metadata = null;\n        this._audioMetadata = null;\n        this._videoMetadata = null;\n        this._videoTrack = null;\n        this._audioTrack = null;\n\n        this._onError = null;\n        this._onMediaInfo = null;\n        this._onMetaDataArrived = null;\n        this._onScriptDataArrived = null;\n        this._onTrackMetadata = null;\n        this._onDataAvailable = null;\n    }\n\n    // prototype: function(type: string, metadata: any): void\n    get onTrackMetadata() {\n        return this._onTrackMetadata;\n    }\n\n    set onTrackMetadata(callback) {\n        this._onTrackMetadata = callback;\n    }\n\n    // prototype: function(mediaInfo: MediaInfo): void\n    get onMediaInfo() {\n        return this._onMediaInfo;\n    }\n\n    set onMediaInfo(callback) {\n        this._onMediaInfo = callback;\n    }\n\n    get onMetaDataArrived() {\n        return this._onMetaDataArrived;\n    }\n\n    set onMetaDataArrived(callback) {\n        this._onMetaDataArrived = callback;\n    }\n\n    get onScriptDataArrived() {\n        return this._onScriptDataArrived;\n    }\n\n    set onScriptDataArrived(callback) {\n        this._onScriptDataArrived = callback;\n    }\n\n    // prototype: function(type: number, info: string): void\n    get onError() {\n        return this._onError;\n    }\n\n    set onError(callback) {\n        this._onError = callback;\n    }\n\n    // prototype: function(videoTrack: any, audioTrack: any): void\n    get onDataAvailable() {\n        return this._onDataAvailable;\n    }\n\n    set onDataAvailable(callback) {\n        this._onDataAvailable = callback;\n    }\n\n    // timestamp base for output samples, must be in milliseconds\n    get timestampBase() {\n        return this._timestampBase;\n    }\n\n    set timestampBase(base) {\n        this._timestampBase = base;\n    }\n\n    get overridedDuration() {\n        return this._duration;\n    }\n\n    // Force-override media duration. Must be in milliseconds, int32\n    set overridedDuration(duration) {\n        this._durationOverrided = true;\n        this._duration = duration;\n        this._mediaInfo.duration = duration;\n    }\n\n    // Force-override audio track present flag, boolean\n    set overridedHasAudio(hasAudio) {\n        this._hasAudioFlagOverrided = true;\n        this._hasAudio = hasAudio;\n        this._mediaInfo.hasAudio = hasAudio;\n    }\n\n    // Force-override video track present flag, boolean\n    set overridedHasVideo(hasVideo) {\n        this._hasVideoFlagOverrided = true;\n        this._hasVideo = hasVideo;\n        this._mediaInfo.hasVideo = hasVideo;\n    }\n\n    resetMediaInfo() {\n        this._mediaInfo = new media_info();\n    }\n\n    _isInitialMetadataDispatched() {\n        if (this._hasAudio && this._hasVideo) {  // both audio & video\n            return this._audioInitialMetadataDispatched && this._videoInitialMetadataDispatched;\n        }\n        if (this._hasAudio && !this._hasVideo) {  // audio only\n            return this._audioInitialMetadataDispatched;\n        }\n        if (!this._hasAudio && this._hasVideo) {  // video only\n            return this._videoInitialMetadataDispatched;\n        }\n        return false;\n    }\n\n    /**\n     *\n     * @param {RTMPMessage} msg\n     */\n    handleMediaMessage(msg) {\n        logger.d(this.TAG, \"handleMediaMessage\", msg.getMessageType());\n        if (!this._onError || !this._onMediaInfo || !this._onTrackMetadata || !this._onDataAvailable) {\n            throw new IllegalStateException('Flv: onError & onMediaInfo & onTrackMetadata & onDataAvailable callback must be specified');\n        }\n\n        this._dispatch = true;\n\n        let tagType = msg.getMessageType();\n        let timestamp = msg.getTimestamp();\n        let streamId = msg.getMessageStreamID()\n        if (streamId !== 0) {\n            logger.w(this.TAG, 'Meet tag which has StreamID != 0!');\n        }\n\n        logger.d(this.TAG, msg);\n\n        switch (tagType) {\n            case 8:  // Audio\n                this._parseAudioData(msg.getPayload(), timestamp);\n                break;\n            case 9:  // Video\n                this._parseVideoData(msg.getPayload(), timestamp, this.bytePos);\n                break;\n            case 18:  // ScriptDataObject\n                this._parseScriptData(msg.getPayload());\n                break;\n        }\n\n        this.bytePos += msg.getMessageLength() + 11 +1;\n\n        // dispatch parsed frames to consumer (typically, the remuxer)\n        if (this._isInitialMetadataDispatched()) {\n            if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {\n                logger.i(this.TAG, \"sedn2\");\n                this._onDataAvailable(this._audioTrack, this._videoTrack);\n            }\n        }\n\n        return;\n    }\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     * @private\n     */\n    _parseScriptData(payload) {\n        let scriptData = amf_parser.parseScriptData(payload);\n\n        if (scriptData.hasOwnProperty('onMetaData')) {\n            if (scriptData.onMetaData == null || typeof scriptData.onMetaData !== 'object') {\n                logger.w(this.TAG, 'Invalid onMetaData structure!');\n                return;\n            }\n            if (this._metadata) {\n                logger.w(this.TAG, 'Found another onMetaData tag!');\n            }\n            this._metadata = scriptData;\n            let onMetaData = this._metadata.onMetaData;\n\n            if (this._onMetaDataArrived) {\n                this._onMetaDataArrived(Object.assign({}, onMetaData));\n            }\n\n            if (typeof onMetaData.hasAudio === 'boolean') {  // hasAudio\n                if (this._hasAudioFlagOverrided === false) {\n                    this._hasAudio = onMetaData.hasAudio;\n                    this._mediaInfo.hasAudio = this._hasAudio;\n                }\n            }\n            if (typeof onMetaData.hasVideo === 'boolean') {  // hasVideo\n                if (this._hasVideoFlagOverrided === false) {\n                    this._hasVideo = onMetaData.hasVideo;\n                    this._mediaInfo.hasVideo = this._hasVideo;\n                }\n            }\n            if (typeof onMetaData.audiodatarate === 'number') {  // audiodatarate\n                this._mediaInfo.audioDataRate = onMetaData.audiodatarate;\n            }\n            if (typeof onMetaData.videodatarate === 'number') {  // videodatarate\n                this._mediaInfo.videoDataRate = onMetaData.videodatarate;\n            }\n            if (typeof onMetaData.width === 'number') {  // width\n                this._mediaInfo.width = onMetaData.width;\n            }\n            if (typeof onMetaData.height === 'number') {  // height\n                this._mediaInfo.height = onMetaData.height;\n            }\n            if (typeof onMetaData.duration === 'number') {  // duration\n                if (!this._durationOverrided) {\n                    let duration = Math.floor(onMetaData.duration * this._timescale);\n                    this._duration = duration;\n                    this._mediaInfo.duration = duration;\n                }\n            } else {\n                this._mediaInfo.duration = 0;\n            }\n            if (typeof onMetaData.framerate === 'number') {  // framerate\n                let fps_num = Math.floor(onMetaData.framerate * 1000);\n                if (fps_num > 0) {\n                    let fps = fps_num / 1000;\n                    this._referenceFrameRate.fixed = true;\n                    this._referenceFrameRate.fps = fps;\n                    this._referenceFrameRate.fps_num = fps_num;\n                    this._referenceFrameRate.fps_den = 1000;\n                    this._mediaInfo.fps = fps;\n                }\n            }\n            if (typeof onMetaData.keyframes === 'object') {  // keyframes\n                this._mediaInfo.hasKeyframesIndex = true;\n                let keyframes = onMetaData.keyframes;\n                this._mediaInfo.keyframesIndex = this._parseKeyframesIndex(keyframes);\n                onMetaData.keyframes = null;  // keyframes has been extracted, remove it\n            } else {\n                this._mediaInfo.hasKeyframesIndex = false;\n            }\n            this._dispatch = false;\n            this._mediaInfo.metadata = onMetaData;\n            logger.v(this.TAG, 'Parsed onMetaData');\n            if (this._mediaInfo.isComplete()) {\n                this._onMediaInfo(this._mediaInfo);\n            }\n        }\n\n        if (Object.keys(scriptData).length > 0) {\n            if (this._onScriptDataArrived) {\n                this._onScriptDataArrived(Object.assign({}, scriptData));\n            }\n        }\n    }\n\n    _parseKeyframesIndex(keyframes) {\n        let times = [];\n        let filepositions = [];\n\n        // ignore first keyframe which is actually AVC Sequence Header (AVCDecoderConfigurationRecord)\n        for (let i = 1; i < keyframes.times.length; i++) {\n            let time = this._timestampBase + Math.floor(keyframes.times[i] * 1000);\n            times.push(time);\n            filepositions.push(keyframes.filepositions[i]);\n        }\n\n        return {\n            times: times,\n            filepositions: filepositions\n        };\n    }\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     * @param tagTimestamp\n     * @private\n     */\n    _parseAudioData(payload, tagTimestamp) {\n        logger.d(this.TAG, \"_parseAudioData\", tagTimestamp);\n        if (payload.length <= 1) {\n            logger.w(this.TAG, 'Flv: Invalid audio packet, missing SoundData payload!');\n            return;\n        }\n\n        if (this._hasAudioFlagOverrided === true && this._hasAudio === false) {\n            // If hasAudio: false indicated explicitly in MediaDataSource,\n            // Ignore all the audio packets\n            return;\n        }\n\n        let le = this._littleEndian;\n        let v = new DataView(payload.buffer);\n\n        let soundSpec = v.getUint8(0);\n\n        let soundFormat = soundSpec >>> 4;\n        if (soundFormat !== 2 && soundFormat !== 10) {  // MP3 or AAC\n            this._onError(DemuxErrors.CODEC_UNSUPPORTED, 'Flv: Unsupported audio codec idx: ' + soundFormat);\n            return;\n        }\n\n        let soundRate = 0;\n        let soundRateIndex = (soundSpec & 12) >>> 2;\n        if (soundRateIndex >= 0 && soundRateIndex <= 4) {\n            soundRate = this._flvSoundRateTable[soundRateIndex];\n        } else {\n            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid audio sample rate idx: ' + soundRateIndex);\n            return;\n        }\n\n        let soundSize = (soundSpec & 2) >>> 1;  // unused\n        let soundType = (soundSpec & 1);\n\n\n        let meta = this._audioMetadata;\n        let track = this._audioTrack;\n\n        if (!meta) {\n            if (this._hasAudio === false && this._hasAudioFlagOverrided === false) {\n                this._hasAudio = true;\n                this._mediaInfo.hasAudio = true;\n            }\n\n            // initial metadata\n            meta = this._audioMetadata = {};\n            meta.type = 'audio';\n            meta.id = track.id;\n            meta.timescale = this._timescale;\n            meta.duration = this._duration;\n            meta.audioSampleRate = soundRate;\n            meta.channelCount = (soundType === 0 ? 1 : 2);\n        }\n\n        if (soundFormat === 10) {  // AAC\n            let aacData = this._parseAACAudioData(payload.slice(1));\n            if (aacData == undefined) {\n                return;\n            }\n\n            if (aacData.packetType === 0) {  // AAC sequence header (AudioSpecificConfig)\n                if (meta.config) {\n                    logger.w(this.TAG, 'Found another AudioSpecificConfig!');\n                }\n                let misc = aacData.data;\n                meta.audioSampleRate = misc.samplingRate;\n                meta.channelCount = misc.channelCount;\n                meta.codec = misc.codec;\n                meta.originalCodec = misc.originalCodec;\n                meta.config = misc.config;\n                // The decode result of an aac sample is 1024 PCM samples\n                meta.refSampleDuration = 1024 / meta.audioSampleRate * meta.timescale;\n                logger.v(this.TAG, 'Parsed AudioSpecificConfig');\n\n                if (this._isInitialMetadataDispatched()) {\n                    // Non-initial metadata, force dispatch (or flush) parsed frames to remuxer\n                    if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {\n                        this._onDataAvailable(this._audioTrack, this._videoTrack);\n                    }\n                } else {\n                    this._audioInitialMetadataDispatched = true;\n                }\n                // then notify new metadata\n                this._dispatch = false;\n                logger.i(this.TAG, \"ON!\");\n                this._onTrackMetadata('audio', meta);\n\n                let mi = this._mediaInfo;\n                mi.audioCodec = meta.originalCodec;\n                mi.audioSampleRate = meta.audioSampleRate;\n                mi.audioChannelCount = meta.channelCount;\n                if (mi.hasVideo) {\n                    if (mi.videoCodec != null) {\n                        mi.mimeType = 'video/x-flv; codecs=\"' + mi.videoCodec + ',' + mi.audioCodec + '\"';\n                    }\n                } else {\n                    mi.mimeType = 'video/x-flv; codecs=\"' + mi.audioCodec + '\"';\n                }\n                if (mi.isComplete()) {\n                    this._onMediaInfo(mi);\n                }\n            } else if (aacData.packetType === 1) {  // AAC raw frame data\n                let dts = this._timestampBase + tagTimestamp;\n                let aacSample = {unit: aacData.data, length: aacData.data.byteLength, dts: dts, pts: dts};\n                track.samples.push(aacSample);\n                track.length += aacData.data.length;\n            } else {\n                logger.e(this.TAG, `Flv: Unsupported AAC data type ${aacData.packetType}`);\n            }\n        } else if (soundFormat === 2) {  // MP3\n            if (!meta.codec) {\n                // We need metadata for mp3 audio track, extract info from frame header\n                let misc = this._parseMP3AudioData(payload.slice(1), true);\n                if (misc == undefined) {\n                    return;\n                }\n                meta.audioSampleRate = misc.samplingRate;\n                meta.channelCount = misc.channelCount;\n                meta.codec = misc.codec;\n                meta.originalCodec = misc.originalCodec;\n                // The decode result of an mp3 sample is 1152 PCM samples\n                meta.refSampleDuration = 1152 / meta.audioSampleRate * meta.timescale;\n                logger.v(this.TAG, 'Parsed MPEG Audio Frame Header');\n\n                this._audioInitialMetadataDispatched = true;\n                this._onTrackMetadata('audio', meta);\n\n                let mi = this._mediaInfo;\n                mi.audioCodec = meta.codec;\n                mi.audioSampleRate = meta.audioSampleRate;\n                mi.audioChannelCount = meta.channelCount;\n                mi.audioDataRate = misc.bitRate;\n                if (mi.hasVideo) {\n                    if (mi.videoCodec != null) {\n                        mi.mimeType = 'video/x-flv; codecs=\"' + mi.videoCodec + ',' + mi.audioCodec + '\"';\n                    }\n                } else {\n                    mi.mimeType = 'video/x-flv; codecs=\"' + mi.audioCodec + '\"';\n                }\n                if (mi.isComplete()) {\n                    this._onMediaInfo(mi);\n                }\n            }\n\n            // This packet is always a valid audio packet, extract it\n            let data = this._parseMP3AudioData(payload.slice(1), false);\n            if (data == undefined) {\n                return;\n            }\n            let dts = this._timestampBase + tagTimestamp;\n            let mp3Sample = {unit: data, length: data.byteLength, dts: dts, pts: dts};\n            track.samples.push(mp3Sample);\n            track.length += data.length;\n        }\n    }\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     * @returns {{}}\n     * @private\n     */\n    _parseAACAudioData(payload) {\n        if (payload.length <= 1) {\n            logger.w(this.TAG, 'Flv: Invalid AAC packet, missing AACPacketType or/and Data!');\n            return;\n        }\n\n        let result = {};\n\n        result.packetType = payload[0];\n\n        if (payload[0] === 0) {\n            result.data = this._parseAACAudioSpecificConfig(payload.slice(1));\n        } else {\n            result.data = payload.subarray(1);\n        }\n\n        return result;\n    }\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @returns {{channelCount: number, codec: string, originalCodec: string, samplingRate: *, config: any[]}}\n     * @private\n     */\n    _parseAACAudioSpecificConfig(array) {\n        let config = null;\n\n        /* Audio Object Type:\n           0: Null\n           1: AAC Main\n           2: AAC LC\n           3: AAC SSR (Scalable Sample Rate)\n           4: AAC LTP (Long Term Prediction)\n           5: HE-AAC / SBR (Spectral Band Replication)\n           6: AAC Scalable\n        */\n\n        let audioObjectType = 0;\n        let originalAudioObjectType = 0;\n        let audioExtensionObjectType = null;\n        let samplingIndex = 0;\n        let extensionSamplingIndex = null;\n\n        // 5 bits\n        audioObjectType = originalAudioObjectType = array[0] >>> 3;\n        // 4 bits\n        samplingIndex = ((array[0] & 0x07) << 1) | (array[1] >>> 7);\n        if (samplingIndex < 0 || samplingIndex >= this._mpegSamplingRates.length) {\n            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: AAC invalid sampling frequency index!');\n            return;\n        }\n\n        let samplingFrequence = this._mpegSamplingRates[samplingIndex];\n\n        // 4 bits\n        let channelConfig = (array[1] & 0x78) >>> 3;\n        if (channelConfig < 0 || channelConfig >= 8) {\n            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: AAC invalid channel configuration');\n            return;\n        }\n\n        if (audioObjectType === 5) {  // HE-AAC?\n            // 4 bits\n            extensionSamplingIndex = ((array[1] & 0x07) << 1) | (array[2] >>> 7);\n            // 5 bits\n            audioExtensionObjectType = (array[2] & 0x7C) >>> 2;\n        }\n\n        // workarounds for various browsers\n        let userAgent = self.navigator.userAgent.toLowerCase();\n\n        if (userAgent.indexOf('firefox') !== -1) {\n            // firefox: use SBR (HE-AAC) if freq less than 24kHz\n            if (samplingIndex >= 6) {\n                audioObjectType = 5;\n                config = new Array(4);\n                extensionSamplingIndex = samplingIndex - 3;\n            } else {  // use LC-AAC\n                audioObjectType = 2;\n                config = new Array(2);\n                extensionSamplingIndex = samplingIndex;\n            }\n        } else if (userAgent.indexOf('android') !== -1) {\n            // android: always use LC-AAC\n            audioObjectType = 2;\n            config = new Array(2);\n            extensionSamplingIndex = samplingIndex;\n        } else {\n            // for other browsers, e.g. chrome...\n            // Always use HE-AAC to make it easier to switch aac codec profile\n            audioObjectType = 5;\n            extensionSamplingIndex = samplingIndex;\n            config = new Array(4);\n\n            if (samplingIndex >= 6) {\n                extensionSamplingIndex = samplingIndex - 3;\n            } else if (channelConfig === 1) {  // Mono channel\n                audioObjectType = 2;\n                config = new Array(2);\n                extensionSamplingIndex = samplingIndex;\n            }\n        }\n\n        config[0]  = audioObjectType << 3;\n        config[0] |= (samplingIndex & 0x0F) >>> 1;\n        config[1]  = (samplingIndex & 0x0F) << 7;\n        config[1] |= (channelConfig & 0x0F) << 3;\n        if (audioObjectType === 5) {\n            config[1] |= ((extensionSamplingIndex & 0x0F) >>> 1);\n            config[2]  = (extensionSamplingIndex & 0x01) << 7;\n            // extended audio object type: force to 2 (LC-AAC)\n            config[2] |= (2 << 2);\n            config[3]  = 0;\n        }\n\n        return {\n            config: config,\n            samplingRate: samplingFrequence,\n            channelCount: channelConfig,\n            codec: 'mp4a.40.' + audioObjectType,\n            originalCodec: 'mp4a.40.' + originalAudioObjectType\n        };\n    }\n\n    /**\n     *\n     * @param {Uint8Array} array\n     * @param requestHeader\n     * @returns {*}\n     * @private\n     */\n    _parseMP3AudioData(array, requestHeader) {\n        if (array.length < 4) {\n            logger.w(this.TAG, 'Flv: Invalid MP3 packet, header missing!');\n            return;\n        }\n\n        let result = null;\n\n        if (requestHeader) {\n            if (array[0] !== 0xFF) {\n                return;\n            }\n            let ver = (array[1] >>> 3) & 0x03;\n            let layer = (array[1] & 0x06) >> 1;\n\n            let bitrate_index = (array[2] & 0xF0) >>> 4;\n            let sampling_freq_index = (array[2] & 0x0C) >>> 2;\n\n            let channel_mode = (array[3] >>> 6) & 0x03;\n            let channel_count = channel_mode !== 3 ? 2 : 1;\n\n            let sample_rate = 0;\n            let bit_rate = 0;\n            let object_type = 34;  // Layer-3, listed in MPEG-4 Audio Object Types\n\n            let codec = 'mp3';\n\n            switch (ver) {\n                case 0:  // MPEG 2.5\n                    sample_rate = this._mpegAudioV25SampleRateTable[sampling_freq_index];\n                    break;\n                case 2:  // MPEG 2\n                    sample_rate = this._mpegAudioV20SampleRateTable[sampling_freq_index];\n                    break;\n                case 3:  // MPEG 1\n                    sample_rate = this._mpegAudioV10SampleRateTable[sampling_freq_index];\n                    break;\n            }\n\n            switch (layer) {\n                case 1:  // Layer 3\n                    object_type = 34;\n                    if (bitrate_index < this._mpegAudioL3BitRateTable.length) {\n                        bit_rate = this._mpegAudioL3BitRateTable[bitrate_index];\n                    }\n                    break;\n                case 2:  // Layer 2\n                    object_type = 33;\n                    if (bitrate_index < this._mpegAudioL2BitRateTable.length) {\n                        bit_rate = this._mpegAudioL2BitRateTable[bitrate_index];\n                    }\n                    break;\n                case 3:  // Layer 1\n                    object_type = 32;\n                    if (bitrate_index < this._mpegAudioL1BitRateTable.length) {\n                        bit_rate = this._mpegAudioL1BitRateTable[bitrate_index];\n                    }\n                    break;\n            }\n\n            result = {\n                bitRate: bit_rate,\n                samplingRate: sample_rate,\n                channelCount: channel_count,\n                codec: codec,\n                originalCodec: codec\n            };\n        } else {\n            result = array;\n        }\n\n        return result;\n    }\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     * @param tagTimestamp\n     * @param tagPosition\n     * @private\n     */\n    _parseVideoData(payload, tagTimestamp, tagPosition) {\n        if (payload.length <= 1) {\n            logger.w(this.TAG, 'Flv: Invalid video packet, missing VideoData payload!');\n            return;\n        }\n\n        if (this._hasVideoFlagOverrided === true && this._hasVideo === false) {\n            // If hasVideo: false indicated explicitly in MediaDataSource,\n            // Ignore all the video packets\n            return;\n        }\n\n        let spec = payload[0];\n\n        let frameType = (spec & 240) >>> 4;\n        let codecId = spec & 15;\n\n        if (codecId !== 7) {\n            this._onError(DemuxErrors.CODEC_UNSUPPORTED, `Flv: Unsupported codec in video frame: ${codecId}`);\n            return;\n        }\n\n        this._parseAVCVideoPacket(payload.slice(1), tagTimestamp, tagPosition, frameType);\n    }\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     * @param tagTimestamp\n     * @param tagPosition\n     * @param frameType\n     * @private\n     */\n    _parseAVCVideoPacket(payload, tagTimestamp, tagPosition, frameType) {\n        if (payload.length < 4) {\n            logger.w(this.TAG, 'Flv: Invalid AVC packet, missing AVCPacketType or/and CompositionTime');\n            return;\n        }\n\n        let le = this._littleEndian;\n        let v = new DataView(payload.buffer);\n\n        let packetType = v.getUint8(0);\n        let cts_unsigned = v.getUint32(0, !le) & 0x00FFFFFF;\n        let cts = (cts_unsigned << 8) >> 8;  // convert to 24-bit signed int\n\n        if (packetType === 0) {  // AVCDecoderConfigurationRecord\n            this._parseAVCDecoderConfigurationRecord(payload.slice(4));\n        } else if (packetType === 1) {  // One or more Nalus\n            this._parseAVCVideoData(payload.slice(4), tagTimestamp, tagPosition, frameType, cts);\n        } else if (packetType === 2) {\n            // empty, AVC end of sequence\n        } else {\n            this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Invalid video packet type ${packetType}`);\n            return;\n        }\n    }\n\n    /**\n     *\n     * @param {Uint8Array} payload\n     * @private\n     */\n    _parseAVCDecoderConfigurationRecord(payload) {\n        if (payload.length < 7) {\n            logger.w(this.TAG, 'Flv: Invalid AVCDecoderConfigurationRecord, lack of data!');\n            return;\n        }\n\n        let meta = this._videoMetadata;\n        let track = this._videoTrack;\n        let le = this._littleEndian;\n        let v = new DataView(payload.buffer);\n\n        if (!meta) {\n            if (this._hasVideo === false && this._hasVideoFlagOverrided === false) {\n                this._hasVideo = true;\n                this._mediaInfo.hasVideo = true;\n            }\n\n            meta = this._videoMetadata = {};\n            meta.type = 'video';\n            meta.id = track.id;\n            meta.timescale = this._timescale;\n            meta.duration = this._duration;\n\n        } else {\n            if (typeof meta.avcc !== 'undefined') {\n                logger.w(this.TAG, 'Found another AVCDecoderConfigurationRecord!');\n            }\n        }\n\n        let version = v.getUint8(0);  // configurationVersion\n        let avcProfile = v.getUint8(1);  // avcProfileIndication\n        let profileCompatibility = v.getUint8(2);  // profile_compatibility\n        let avcLevel = v.getUint8(3);  // AVCLevelIndication\n\n        if (version !== 1 || avcProfile === 0) {\n            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord');\n            return;\n        }\n\n        this._naluLengthSize = (v.getUint8(4) & 3) + 1;  // lengthSizeMinusOne\n        if (this._naluLengthSize !== 3 && this._naluLengthSize !== 4) {  // holy shit!!!\n            this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Strange NaluLengthSizeMinusOne: ${this._naluLengthSize - 1}`);\n            return;\n        }\n\n        let spsCount = v.getUint8(5) & 31;  // numOfSequenceParameterSets\n        if (spsCount === 0) {\n            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No SPS');\n            return;\n        } else if (spsCount > 1) {\n            logger.w(this.TAG, `Flv: Strange AVCDecoderConfigurationRecord: SPS Count = ${spsCount}`);\n        }\n\n        let offset = 6;\n\n        for (let i = 0; i < spsCount; i++) {\n            let len = v.getUint16(offset, !le);  // sequenceParameterSetLength\n            offset += 2;\n\n            if (len === 0) {\n                continue;\n            }\n\n            // Notice: Nalu without startcode header (00 00 00 01)\n            let sps = new Uint8Array(payload.slice(offset, offset + len));\n            offset += len;\n\n            let config = sps_parser.parseSPS(sps);\n            if (i !== 0) {\n                // ignore other sps's config\n                continue;\n            }\n\n            meta.codecWidth = config.codec_size.width;\n            meta.codecHeight = config.codec_size.height;\n            meta.presentWidth = config.present_size.width;\n            meta.presentHeight = config.present_size.height;\n\n            meta.profile = config.profile_string;\n            meta.level = config.level_string;\n            meta.bitDepth = config.bit_depth;\n            meta.chromaFormat = config.chroma_format;\n            meta.sarRatio = config.sar_ratio;\n            meta.frameRate = config.frame_rate;\n\n            if (config.frame_rate.fixed === false ||\n                config.frame_rate.fps_num === 0 ||\n                config.frame_rate.fps_den === 0) {\n                meta.frameRate = this._referenceFrameRate;\n            }\n\n            let fps_den = meta.frameRate.fps_den;\n            let fps_num = meta.frameRate.fps_num;\n            meta.refSampleDuration = meta.timescale * (fps_den / fps_num);\n\n            let codecArray = sps.subarray(1, 4);\n            let codecString = 'avc1.';\n            for (let j = 0; j < 3; j++) {\n                let h = codecArray[j].toString(16);\n                if (h.length < 2) {\n                    h = '0' + h;\n                }\n                codecString += h;\n            }\n            meta.codec = codecString;\n\n            let mi = this._mediaInfo;\n            mi.width = meta.codecWidth;\n            mi.height = meta.codecHeight;\n            mi.fps = meta.frameRate.fps;\n            mi.profile = meta.profile;\n            mi.level = meta.level;\n            mi.refFrames = config.ref_frames;\n            mi.chromaFormat = config.chroma_format_string;\n            mi.sarNum = meta.sarRatio.width;\n            mi.sarDen = meta.sarRatio.height;\n            mi.videoCodec = codecString;\n\n            if (mi.hasAudio) {\n                if (mi.audioCodec != null) {\n                    mi.mimeType = 'video/x-flv; codecs=\"' + mi.videoCodec + ',' + mi.audioCodec + '\"';\n                }\n            } else {\n                mi.mimeType = 'video/x-flv; codecs=\"' + mi.videoCodec + '\"';\n            }\n            if (mi.isComplete()) {\n                this._onMediaInfo(mi);\n            }\n        }\n\n        let ppsCount = v.getUint8(offset);  // numOfPictureParameterSets\n        if (ppsCount === 0) {\n            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No PPS');\n            return;\n        } else if (ppsCount > 1) {\n            logger.w(this.TAG, `Flv: Strange AVCDecoderConfigurationRecord: PPS Count = ${ppsCount}`);\n        }\n\n        offset++;\n\n        for (let i = 0; i < ppsCount; i++) {\n            let len = v.getUint16(offset, !le);  // pictureParameterSetLength\n            offset += 2;\n\n            if (len === 0) {\n                continue;\n            }\n\n            // pps is useless for extracting video information\n            offset += len;\n        }\n\n        meta.avcc = new Uint8Array(payload.length);\n        meta.avcc.set(new Uint8Array(payload), 0);\n        logger.v(this.TAG, 'Parsed AVCDecoderConfigurationRecord');\n\n        if (this._isInitialMetadataDispatched()) {\n            // flush parsed frames\n            if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {\n                this._onDataAvailable(this._audioTrack, this._videoTrack);\n            }\n        } else {\n            this._videoInitialMetadataDispatched = true;\n        }\n        // notify new metadata\n        this._dispatch = false;\n        this._onTrackMetadata('video', meta);\n    }\n\n    _parseAVCVideoData(payload, tagTimestamp, tagPosition, frameType, cts) {\n        logger.v(this.TAG, tagTimestamp, tagPosition, this._timestampBase);\n\n        let le = this._littleEndian;\n        let v = new DataView(payload.buffer);\n\n        let units = [], length = 0;\n\n        let dataSize = payload.length;\n\n        let offset = 0;\n        const lengthSize = this._naluLengthSize;\n        let dts = this._timestampBase + tagTimestamp;\n        let keyframe = (frameType === 1);  // from FLV Frame Type constants\n\n        while (offset < dataSize) {\n            if (offset + 4 >= dataSize) {\n                logger.w(this.TAG, `Malformed Nalu near timestamp ${dts}, offset = ${offset}, dataSize = ${dataSize}`);\n                break;  // data not enough for next Nalu\n            }\n            // Nalu with length-header (AVC1)\n            let naluSize = v.getUint32(offset, !le);  // Big-Endian read\n            if (lengthSize === 3) {\n                naluSize >>>= 8;\n            }\n            if (naluSize > dataSize - lengthSize) {\n                logger.w(this.TAG, `Malformed Nalus near timestamp ${dts}, NaluSize > DataSize!`);\n                return;\n            }\n\n            let unitType = v.getUint8(offset + lengthSize) & 0x1F;\n\n            if (unitType === 5) {  // IDR\n                keyframe = true;\n            }\n\n            let data = new Uint8Array(payload.slice(offset, offset + lengthSize + naluSize));\n            let unit = {type: unitType, data: data};\n            units.push(unit);\n            length += data.byteLength;\n\n            offset += lengthSize + naluSize;\n        }\n\n        if (units.length) {\n            let track = this._videoTrack;\n            let avcSample = {\n                units: units,\n                length: length,\n                isKeyframe: keyframe,\n                dts: dts,\n                cts: cts,\n                pts: (dts + cts)\n            };\n            if (keyframe) {\n                avcSample.fileposition = tagPosition;\n            }\n            track.samples.push(avcSample);\n            track.length += length;\n        }\n    }\n}\n\n/* harmony default export */ const rtmp_RTMPMediaMessageHandler = (RTMPMediaMessageHandler);\n\n;// CONCATENATED MODULE: ./src/rtmp/AMF0Object.js\n\n\n\nclass AMF0Object {\n\tTAG = \"AMF0Object\";\n\n\tdata;\n\n    params;\n\n\t/**\n\t *\n\t * @param {Object} params\n\t */\n\tconstructor(params) {\n\t\tif(params) {\n            this.params = params;\n\t\t\tlogger.d(this.TAG, \"cmd: \" + this.params[0]);\n\t\t}\n\t}\n\n    /**\n     *\n     * @param {Uint8Array} data\n     * @returns {*[]}\n     */\n\tparseAMF0(data) {\n\t\tthis.data = Array.from(data);\n\t\tlet obj = [];\n\n\t\twhile (this.data.length > 0) {\n\t\t\tconst var_type = this.data.shift();\n\n\t\t\tswitch(var_type) {\n\t\t\tcase 0x00: // Number\n\t\t\t\tobj.push(_byteArrayToNumber(this.data.slice(0, 8)));\n\t\t\t\tthis.data = this.data.slice(8);\n\t\t\t\tbreak;\n\n\t\t\tcase 0x01: // boolean\n\t\t\t\tif (this.data.shift() === 0) {\n\t\t\t\t\tobj.push(false);\n\t\t\t\t} else {\n\t\t\t\t\tobj.push(true);\n\t\t\t\t}\n\n\t\t\t\tbreak;\n\n\t\t\tcase 0x02: // String\n\t\t\t\tlet len = (this.data[0] << 8) | (this.data[1]);\n\t\t\t\tthis.data = this.data.slice(2);\n\n\t\t\t\tobj.push(_byteArrayToString(this.data.slice(0, len)));\n\t\t\t\tthis.data = this.data.slice(len);\n\t\t\t\tbreak;\n\n\t\t\tcase 0x03: // AMF encoded object\n\t\t\t\tobj.push(this._parseAMF0Object());\n\t\t\t\tbreak;\n\n\t\t\tcase 0x05: // NUll\n                obj.push(null);\n\t\t\t\tbreak;\n\n            default:\n                logger.w(this.TAG, \"var_type: \" + var_type + \" not yet implemented\");\n                break;\n\t\t\t}\n\t\t}\n        this.params = obj;\n\t\treturn obj;\n\t}\n\n\t_parseAMF0Object() {\n\t\tlet o2 = {};\n\n\t\twhile (this.data.length > 0) {\n\t\t\tlet keylen = (this.data[0] << 8) | (this.data[1]); this.data = this.data.slice(2);\n\n\t\t\t// Object end marker\n\t\t\tif (keylen === 0 && this.data[0] === 9) {\n\t\t\t\tthis.data = this.data.slice(1);\n\t\t\t\treturn o2;\n\t\t\t}\n\n\t\t\tlet keyName = _byteArrayToString(this.data.slice(0, keylen)); this.data = this.data.slice(keylen);\n\n\t\t\tconst var_type = this.data.shift();\n\n\t\t\tswitch(var_type) {\n            case 0x00: // Number\n                o2[keyName] = _byteArrayToNumber(this.data.slice(0, 8));\n                this.data = this.data.slice(8);\n                break;\n\n            case 0x01: // boolean\n                if (this.data.shift() === 0) {\n                    o2[keyName] = false;\n                } else {\n                    o2[keyName] = true;\n                }\n\n                break;\n\n            case 0x02: // String\n                let len = (this.data[0] << 8) | (this.data[1]);\n                this.data = this.data.slice(2);\n\n                o2[keyName] = _byteArrayToString(this.data.slice(0, len));\n                this.data = this.data.slice(len);\n                break;\n\n            case 0x05:\n                o2[keyName] = null;\n                break;\n\n            default:\n\t\t\t\tlogger.w(this.TAG, \"var_type: \" + var_type + \" not yet implemented\");\n                break;\n\t\t\t}\n\t\t}\n\n\t\treturn o2;\n\t}\n\n    /**\n     *\n     * @returns {Uint8Array}\n     */\n\tgetBytes() {\n\t\tlet bytes = [];\n\n        for(let i = 0; i < this.params.length; i++) {\n            const param = this.params[i];\n\n            switch(typeof param){\n            case \"string\":\n                // Command\n                bytes.push(0x02); // String\n                bytes.push(param.length >>> 8);\n                bytes.push(param.length);\n                bytes = bytes.concat(_stringToByteArray(param));\n                break;\n\n            case \"number\":\n                // TransactionID\n                bytes.push(0x00); // Number\n                bytes = bytes.concat(_numberToByteArray(param));\n                break;\n\n            case \"object\":\n                // Command Object\n                bytes.push(0x03); // Object\n\n                for (let key in param) {\n                    let value = param[key];\n                    let keylength = key.length;\n\n                    bytes.push(keylength >>> 8);\n                    bytes.push(keylength);\n                    bytes = bytes.concat(_stringToByteArray(key));\n\n                    switch(typeof value) {\n                    case \"object\":\n                        if (value == null) {\n                            bytes.push(0x05); // Null\n                        }\n\n                        break;\n\n                    case \"string\":\n                        const length = value.length;\n                        bytes.push(0x02);\n                        bytes.push(length >>> 8);\n                        bytes.push(length);\n                        bytes = bytes.concat(_stringToByteArray(value))\n                        break;\n\n                    case \"number\":\n                        bytes.push(0x00);\n                        bytes = bytes.concat(_numberToByteArray(value))\n                        break;\n\n                    case \"boolean\":\n                        bytes.push(0x01);\n                        if (value) bytes.push(0x01);\n                        else bytes.push(0x00);\n                        break;\n\n                    default:\n\t\t\t\t\t\tlogger.w(this.TAG, typeof value, \" not yet implementd\");\n                        break;\n                    }\n                }\n\n                bytes.push(0x00); // End Marker\n                bytes.push(0x00);\n                bytes.push(0x09);\n                break;\n\n            case \"boolean\":\n                bytes.push(0x01);\n                if(param) bytes.push(0x01);\n                else bytes.push(0x00);\n                break;\n\n            default:\n\t\t\t\tlogger.w(this.TAG, typeof param, \" not yet implementd\");\n                break;\n            }\n        }\n\n\t\treturn new Uint8Array(bytes);\n\t}\n\n    getCommand(){\n        return this.params[0];\n    }\n\n    getTransactionId(){\n        return this.params[1];\n    }\n\n    getCommandObject(){\n        return this.params[2];\n    }\n\n    getAdditionalInfo(){\n        return this.params[3];\n    }\n}\n\n/* harmony default export */ const rtmp_AMF0Object = (AMF0Object);\n\n;// CONCATENATED MODULE: ./src/rtmp/RTMPMessageHandler.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\n\n\n\n\n\n\nclass RTMPMessageHandler {\n    TAG = \"RTMPMessageHandler\";\n\n    paused = false;\n    netconnections = {};\n    chunk_stream_id = 2;\n    trackedCommand = \"\";\n    socket;\n    current_stream_id;\n\n    /**\n     *\n     * @param {WebSocket} socket\n     */\n    constructor(socket) {\n        this.socket = socket;\n        this.chunk_parser = new rtmp_ChunkParser(this);\n        this.media_handler = new rtmp_RTMPMediaMessageHandler();\n\n        this.media_handler.onError = (type, info)=>{\n            logger.d(this.TAG, type, info);\n            postMessage([\"onError\", type, info]);\n        }\n\n        this.media_handler.onMediaInfo = (mediainfo)=>{\n            logger.d(this.TAG, mediainfo);\n            postMessage([\"onMediaInfo\", mediainfo]);\n        }\n\n        this.media_handler.onMetaDataArrived = (metadata)=>{\n            postMessage([\"onMetaDataArrived\", metadata]);\n        }\n\n        this.media_handler.onScriptDataArrived= (data)=>{\n            postMessage([\"onScriptDataArrived\", data]);\n        }\n\n        this.media_handler.onScriptDataArrived= (data)=>{\n            postMessage([\"onMetaDataArrived\", data]);\n        }\n\n        this.media_handler.onScriptDataArrived= (data)=>{\n            postMessage([\"onMetaDataArrived\", data]);\n        }\n    }\n\n    destroy(){\n        this.media_handler.destroy();\n        this.media_handler = null;\n        this.chunk_parser = null\n    }\n\n    /**\n     *\n     * @param {Uint8Array} data\n     */\n    parseChunk(data){\n        logger.d(this.TAG, \"parseChunk: \" + data.length);\n        this.chunk_parser.parseChunk(data);\n    }\n\n    /**\n     *\n     * @param {RTMPMessage} msg\n     */\n    onMessage(msg){\n        logger.d(this.TAG, \" onMessage: \" + msg.getMessageType() + \" StreamID:\" + msg.getMessageStreamID());\n\n        switch(msg.getMessageType()){\n        case 1:         // PCM Set Chunk Size\n        case 2:         // PCM Abort Message\n        case 3:         // PCM Acknowledgement\n        case 5:         // PCM Window Acknowledgement Size\n        case 6:         // PCM Set Peer Bandwidth\n            this.netconnections[msg.getMessageStreamID()].parseMessage(msg);\n            break;\n\n        case 4:          // User Control Messages\n            this._handleUserControlMessage(msg);\n            break;\n\n        case 8:         // Audio Message\n            logger.d(this.TAG, \"AUDIOFRAME: \", msg);\n            this.media_handler.handleMediaMessage(msg);\n            break;\n\n        case 9:         // Video Message\n            logger.d(this.TAG, \"VIDEOFRAME: \", msg);\n            this.media_handler.handleMediaMessage(msg);\n            break;\n\n        case 18:        // Data Message AMF0\n            logger.d(this.TAG, \"DATAFRAME: \", msg);\n            this.media_handler.handleMediaMessage(msg);\n            break;\n\n        case 19:        // Shared Object Message AMF0\n            logger.d(this.TAG, \"SharedObjectMessage\", msg);\n            break;\n\n        case 20:        // Command Message AMF0\n            const command = new rtmp_AMF0Object();\n            let cmd = command.parseAMF0(msg.getPayload());\n\n            logger.d(this.TAG, \"AMF0\", cmd);\n\n            switch(cmd[0]) {\n            case \"_error\":\n                logger.e(this.TAG, cmd);\n                break;\n\n            case \"_result\":\n                switch(this.trackedCommand){\n                case \"connect\":\n                    logger.d(this.TAG,\"got _result: \" + cmd[3].code);\n                    if(cmd[3].code === \"NetConnection.Connect.Success\") {\n                        postMessage([cmd[3].code]);\n                        this.createStream(null);\n                    }\n                    break;\n\n                case \"createStream\":\n                    logger.d(this.TAG,\"got _result: \" + cmd[3]);\n                    if(cmd[3]) {\n                        this.current_stream_id = cmd[4];\n                        postMessage([\"RTMPStreamCreated\", cmd[3], cmd[4]]);\n                    }\n                    break;\n\n                case \"play\":\n                    break;\n\n                case \"pause\":\n                    break;\n\n                default:\n                    logger.w(\"tracked command:\" + this.trackedCommand);\n                    break;\n                }\n\n                break;\n\n            case \"onStatus\":\n                logger.d(this.TAG,\"onStatus: \" + cmd[3].code);\n                postMessage([cmd[3].code]);\n                break;\n\n            default:\n                logger.w(this.TAG,\"CommandMessage \" + cmd[0] + \" not yet implemented\");\n                break;\n            }\n\n            break;\n\n        case 22:        // Aggregate Message\n            break;\n\n        case 15:        // Data Message AMF3\n        case 16:        // Shared Object Message AMF3\n        case 17:        // Command Message AMF3\n            logger.e(this.TAG,\"AMF3 is not yet implemented\");\n            break;\n\n        default:\n            logger.d(this.TAG,\"[MessageType: \" + rtmp_RTMPMessage.MessageTypes[msg.getMessageType()] + \"(\" + msg.getMessageType() + \")\");\n            break;\n\n        }\n    }\n\n    /**\n     *\n     * @param {Object} connectionParams\n     */\n    connect(connectionParams){\n        const command = new rtmp_AMF0Object([\n            \"connect\", 1, connectionParams\n        ]);\n\n        this._sendCommand(3, command);\n    }\n\n    /**\n     *\n     * @param {Object} options\n     */\n    createStream(options){\n        const command = new rtmp_AMF0Object([\n            \"createStream\", 1, options\n        ]);\n\n        this._sendCommand(3, command);\n    }\n\n    deleteStream(stream_id){\n        const command = new rtmp_AMF0Object([\n            \"deleteStream\", 1, null, stream_id\n        ]);\n\n        this._sendCommand(3, command);\n    }\n\n    /**\n     *\n     * @param {String} streamName\n     */\n    play(streamName){\n        const command = new rtmp_AMF0Object([\n            \"play\", 1, null, streamName\n        ]);\n\n        this._sendCommand(3, command);\n    }\n\n    stop(){\n        this.deleteStream(this.current_stream_id);\n    }\n\n    /**\n     *\n     * @param {boolean} enable\n     */\n    pause(enable){\n        if(this.paused !== enable) {\n            this.paused = enable;\n\n            const command = new rtmp_AMF0Object([\n                \"pause\", 0, null, enable,0\n            ]);\n\n            this._sendCommand(3, command);\n        }\n    }\n\n    receiveVideo(enable){\n        const command = new rtmp_AMF0Object([\n            \"receiveVideo\", 0, null, enable\n        ]);\n\n        this._sendCommand(3, command);\n    }\n\n    receiveAudio(enable){\n        const command = new rtmp_AMF0Object([\n            \"receiveAudio\", 0, null, enable\n        ]);\n\n        this._sendCommand(3, command);\n    }\n\n    /**\n     *\n     * @param {Number} csid\n     * @param {AMF0Object} command\n     * @private\n     */\n    _sendCommand(csid, command){\n        logger.d(this.TAG, \"sendCommand:\", command);\n\n        this.trackedCommand = command.getCommand();\n\n        let msg = new rtmp_RTMPMessage(command.getBytes());\n        msg.setMessageType(0x14);\t\t// AMF0 Command\n        msg.setMessageStreamID(0);\n\n        const chunk = new rtmp_Chunk(msg);\n        chunk.setChunkStreamID(csid);\n\n        let buf = chunk.getBytes();\n\n        this.netconnections[0] = new rtmp_NetConnection(0, this);\n\n        this.socket.send(buf);\n    }\n\n    /**\n     *\n     * @param {Number} size\n     */\n    setChunkSize(size){\n        this.chunk_parser.setChunkSize(size);\n    }\n\n    _getNextMessageStreamID(){\n        return this.netconnections.length;\n    }\n\n    _getNextChunkStreamID(){\n        return ++this.chunk_stream_id;      // increase chunk stream id\n    }\n\n    /**\n     *\n     * @param {RTMPMessage} msg\n     * @private\n     */\n    _handleUserControlMessage(msg) {\n        let data = msg.getPayload()\n\n        this.event_type = (data[0] <<8) | data[1];\n        data = data.slice(2);\n\n        switch (this.event_type){\n            case 0x00:      // StreamBegin\n            case 0x01:      // Stream EOF\n            case 0x02:      // StreamDry\n            case 0x04:      // StreamIsRecorded\n                this.event_data1 = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n                break;\n\n\n            case 0x03:      // SetBuffer\n                this.event_data1 = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n                this.event_data2 = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | (data[7]);\n                break;\n\n            case 0x06:      // PingRequest\n            case 0x07:      // PingResponse\n                this.event_data1 = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);\n                break;\n        }\n\n        // Handle Ping internal\n        if(this.event_type === 0x06) {  // Ping Request\n            postMessage([\"UserControlMessage\", [\"ping\", this.event_data1]]);\n\n            const msg = new rtmp_UserControlMessage();\n            msg.setType(0x07);          // Ping Response\n            msg.setEventData(this.event_data1);\n\n\n            let m2 = new rtmp_RTMPMessage(msg.getBytes());\n            m2.setMessageType(0x04)     // UserControlMessage\n\n            const chunk = new rtmp_Chunk(m2);\n            chunk.setChunkStreamID(2);  // Control Channel\n\n            logger.i(this.TAG,\"send Pong\");\n            this.socket.send(chunk.getBytes());\n        }\n    }\n}\n\n/* harmony default export */ const rtmp_RTMPMessageHandler = (RTMPMessageHandler);\n\n\n;// CONCATENATED MODULE: ./src/wss/connection.worker.js\n/*\n *\n * Copyright (C) 2023 itNOX. All Rights Reserved.\n *\n * @author Michael Balen <mb@itnox.de>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n\n\n\n\n\nconst TAG = \"WebRTMP Worker\";\n\nlet port;\nlet host;\nlet message_handler;\nlogger.LEVEL = logger.DEBUG;\n\nconst wss_manager = new wss_WSSConnectionManager();\n\nself.addEventListener('message', function(e) {\n\tlet data = e.data;\n\n\tlogger.d(TAG, \"CMD: \" + data.cmd);\n\n\tswitch(data.cmd) {\n\t\tcase \"open\":    // connect WebSocket\n\t\t\thost = data.host;\n\t\t\tport = data.port;\n\n\t\t\twss_manager.open(host, port, (success)=>{\n\t\t\t\tlogger.v(TAG, \"open: \" + host + \":\" +port);\n\t\t\t\tif(success){\n\t\t\t\t\tlogger.v(TAG, \"WSSConnected\");\n\t\t\t\t\tpostMessage([\"WSSConnected\"]);\n\n\t\t\t\t\tconst handshake = new rtmp_RTMPHandshake(wss_manager.getSocket());\n\n\t\t\t\t\thandshake.onHandshakeDone = (success)=>{\n\t\t\t\t\t\tif(success){\n\t\t\t\t\t\t\tmessage_handler = new rtmp_RTMPMessageHandler(wss_manager.getSocket());\n\n\t\t\t\t\t\t\tlogger.d(TAG, \"connect to RTMPManager\");\n\n\t\t\t\t\t\t\twss_manager.registerMessageHandler((e)=> {\n\t\t\t\t\t\t\t\tmessage_handler.parseChunk(new Uint8Array(e.data));\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\tpostMessage([\"RTMPHandshakeDone\"]);\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tlogger.e(TAG, \"Handshake failed\");\n\t\t\t\t\t\t\tpostMessage([\"RTMPHandshakeFailed\"]);\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\n\t\t\t\t\thandshake.do();\n\n\t\t\t\t} else {\n\t\t\t\t\tlogger.v(this.TAG, \"WSSConnectFailed\");\n\t\t\t\t\tpostMessage([\"WSSConnectFailed\"]);\n\t\t\t\t}\n\t\t\t});\n\t\t\tbreak;\n\n\t\tcase \"connect\":             // RTMP Connect Application\n            if(!message_handler) {\n                logger.e(this.TAG, \"RTMP not connected\");\n                break;\n            }\n\t\t\tmessage_handler.connect(makeDefaultConnectionParams(data.appName));\n\t\t\tbreak;\n\n\t\tcase \"play\":\n            if(!message_handler) {\n                logger.e(this.TAG, \"RTMP not connected\");\n                break;\n            }\n\t\t\tmessage_handler.play(data.streamName);\n\t\t\tbreak;\n\n\t\tcase \"stop\":\n            if(!message_handler) {\n                logger.e(this.TAG, \"RTMP not connected\");\n                break;\n            }\n\t\t\tmessage_handler.stop();\n\t\t\tbreak;\n\n        case \"pause\":\n            if(!message_handler) {\n                logger.e(this.TAG, \"RTMP not connected\");\n                break;\n            }\n\t\t\tmessage_handler.pause(data.enable);\n            break;\n\n        case \"disconnect\":\n            if(message_handler) {\n\t\t\t\tmessage_handler.destroy();\n            }\n\t\t\twss_manager.close();\n\t\t\tbreak;\n\n\t\tcase \"loglevels\":\n\t\t\tlogger.d(TAG, \"setting loglevels\", data.loglevels);\n\t\t\tlogger.loglevels = data.loglevels;\n            break;\n\n\t\tdefault:\n\t\t\tlogger.w(TAG, \"Unknown CMD: \" + data.cmd);\n\t\t\tbreak;\n\t}\n\n}, false);\n\nfunction makeDefaultConnectionParams(application){\n\treturn {\n\t\t\"app\": application,\n\t\t\"flashVer\": \"WebRTMP 0,0,1\",\n\t\t\"tcUrl\": \"rtmp://\" + host + \":1935/\" + application,\n\t\t\"fpad\": false,\n\t\t\"capabilities\": 15,\n\t\t\"audioCodecs\": 0x0400,\t// AAC\n\t\t\"videoCodecs\": 0x0080,\t// H264\n\t\t\"videoFunction\": 0\t\t// Seek false\n\t};\n}\n\npostMessage([\"Started\"]);\n\n\n/******/ })()\n;\n", "Worker", undefined, undefined);
}

;// CONCATENATED MODULE: ./src/wss/webrtmp.controller.js
/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */





class WebRTMP_Controller {
	TAG = "WebRTMP_Controller";
	host = document.location.host;
	port = 9001;
	WSSReconnect = false;
	isConnected = false;

	WebRTMPWorker = new Worker_fn();

	constructor() {
		logger.loglevels = {
            "RTMPMessage": logger.ERROR,
            "RTMPMessageHandler": logger.WARN,
            "RTMPMediaMessageHandler": logger.ERROR,
            "ChunkParser": logger.WARN,
            "RTMPHandshake": logger.ERROR,
            "Chunk": logger.OFF,
            "MP4Remuxer": logger.ERROR,
            "Transmuxer": logger.WARN,
            "EventEmitter": logger.DEBUG,
            "MSEController": logger.INFO,
            "WebRTMP": logger.DEBUG,
            "WebRTMP_Controller": logger.WARN,
            "WebRTMP Worker": logger.WARN,
            "AMF": logger.WARN,
            "WSSConnectionManager": logger.DEBUG
        };

		this._emitter = new event_emitter();

		this.WebRTMPWorker.addEventListener("message", (evt)=>{
			this.WorkerListener(evt);
		});
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 */
	open(host, port){
		return new Promise((resolve, reject)=>{
			if(this.isConnected) return reject("Already Connected. Please disconnect first");
			this._emitter.waitForEvent("RTMPHandshakeDone", resolve);
			this._emitter.waitForEvent("WSSConnectFailed", reject);

			if(host) this.host = host;
			if(port) this.port = port;

			this.WebRTMPWorker.postMessage({cmd: "open", host: this.host, port: this.port});
		})
	}

	/**
	 * Websocket disconnect
	 */
	disconnect() {
		this.WSSReconnect = false;
		this.WebRTMPWorker.postMessage({cmd: "disconnect"});
	}

	/**
	 * RTMP connect application
	 * @param {String} appName
	 */
	connect(appName){
		return new Promise((resolve, reject)=>{
			this._emitter.waitForEvent("RTMPStreamCreated", resolve);
			this.WebRTMPWorker.postMessage({cmd: "connect", appName: appName});
		})

	}

	/**
	 * RTMP play streamname
	 * @param {String} streamName
	 */
	play(streamName){
		this.WebRTMPWorker.postMessage({cmd: "play", streamName: streamName});
	}

	stop(){
		this.WebRTMPWorker.postMessage({cmd: "stop"});
	}

    pause(enable){
        this.WebRTMPWorker.postMessage({cmd: "pause", enable: enable});
    }


	/**
	 * Eventlistener hinzufügenm
	 * @param type
	 * @param listener
	 * @param {boolean} modal
	 */
	addEventListener(type, listener, modal){
		this._emitter.addEventListener(type, listener, modal);
	}

	removeEventListener(type, listener){
		this._emitter.removeEventListener(type, listener);
	}

	removeAllEventListener(type){
		this._emitter.removeAllEventListener(type);
	}


	/**
	 *
	 * @param {MessageEvent} evt
	 * @constructor
	 */
	WorkerListener(evt){
		// Message.data wieder zum Event machen
		const data = evt.data;

		switch(data[0]){
			case "ConnectionLost":
				this._emitter.emit("ConnectionLost");
				logger.d(this.TAG, "Event ConnectionLost");

				this.isConnected = false;

				if(this.WSSReconnect) {
					logger.w(this.TAG,"[ WorkerListener ] Reconnect timed");

					window.setTimeout(()=>{
						logger.w(this.TAG, "timed Reconnect");
						this.open(this.host, this.port);
					}, 1000)
				}

				break;

			case "Connected":
				logger.d(this.TAG, "Event Connected");
				this._emitter.emit("Connected");
				this.isConnected = true;
				break;

			case "Started":
				this.WebRTMPWorker.postMessage({
					cmd: "loglevels",
					loglevels: this.loglevels
				});
				break;

			default:
				logger.i(this.TAG, data[0], data.slice(1));
				this._emitter.emit(data[0], data.slice(1));
				break;
		}
	}
}

/* harmony default export */ const webrtmp_controller = (WebRTMP_Controller);

;// CONCATENATED MODULE: ./src/webrtmp.js
/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */







class WebRTMP{
	TAG = 'WebRTMP';

	/**
	 *
	 * @type {HTMLVideoElement}
	 * @private
	 */
	_mediaElement = null;

	constructor() {
		this.wss = new webrtmp_controller();

		this._config = defaultConfig

		this.wss.addEventListener("RTMPMessageArrived", (data)=>{
			logger.d(this.TAG,"RTMPMessageArrived", data);
		});

		this.wss.addEventListener("ProtocolControlMessage", (data)=>{
			logger.d(this.TAG,"ProtocolControlMessage", data);
		});

		this.wss.addEventListener("UserControlMessage", (data)=>{
			logger.d(this.TAG,"UserControlMessage", data);
		});

		this.wss.addEventListener("ConnectionLost", ()=>{});

		this._emitter = new event_emitter();

		this.e = {
			onvLoadedMetadata: this._onvLoadedMetadata.bind(this),
			onvCanPlay: this._onvCanPlay.bind(this),
			onvStalled: this._onvStalled.bind(this),
			onvProgress: this._onvProgress.bind(this),
			onvPlay: this._onvPlay.bind(this),
			onvPause: this._onvPause.bind(this),
			onAppendInitSegment: this._appendMediaSegment.bind(this),
			onAppendMediaSegment: this._appendMediaSegment.bind(this)
		};
	}

	_checkAndResumeStuckPlayback(stalled) {
		let media = this._mediaElement;
		if (stalled || !this._receivedCanPlay || media.readyState < 2) {  // HAVE_CURRENT_DATA
			let buffered = media.buffered;
			if (buffered.length > 0 && media.currentTime < buffered.start(0)) {
				logger.w(this.TAG, `Playback seems stuck at ${media.currentTime}, seek to ${buffered.start(0)}`);
				//this._requestSetTime = true;
				this._mediaElement.currentTime = buffered.start(0);
				this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			}
		} else {
			// Playback didn't stuck, remove progress event listener
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
		}
	}

	_onvLoadedMetadata() {
		if (this._pendingSeekTime != null) {
			this._mediaElement.currentTime = this._pendingSeekTime;
			this._pendingSeekTime = null;
		}
	}

	_onvCanPlay(e) {
		logger.d(this.TAG, "onvCanPlay", e);
		this._mediaElement.play().then(()=>{
			logger.d(this.TAG, "promise play");
		});
		this._receivedCanPlay = true;
		this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
	}

	_onvStalled() {
		this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress() {
		this._checkAndResumeStuckPlayback();
	}

	_onmseBufferFull() {
		logger.w(this.TAG, 'MSE SourceBuffer is full');
	}

	_onvPlay(e){
		logger.d(this.TAG, "play:", e);
		this.pause(false);
	}

	_onvPause(e) {
		logger.d(this.TAG, "pause", e);
		this.pause(true);
	}

	destroy() {
		logger.w(this.TAG, "destroy webrtmp");
		if (this._mediaElement) {
			this.detachMediaElement();
		}
		this.e = null;
		this._emitter.removeAllListener();
		this._emitter = null;
	}

	disconnect(){
		this.wss.disconnect();
		this.wss.removeAllEventListener("RTMPHandshakeDone");
		this.wss.removeAllEventListener("WSSConnectFailed");
	}

	/**
	 * send play command
	 * @param {String} streamName
	 * @returns {Promise<unknown>}
	 */
	play(streamName){
		this.wss.play(streamName);
		return this._mediaElement.play();
	}

	stopLoad(){
		//this.wss.stop()
		this._mediaElement.pause();
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 * @returns {Promise<unknown>}
	 */
	open(host, port){
		return this.wss.open(host, port);
	}

	/**
	 *
	 * @param {String} appName
	 * @returns {Promise<unknown>}
	 */
	connect(appName){
		return this.wss.connect(appName);
	}

	pause(enable){
		this.wss.pause(enable);

		if(enable) {
			this._mediaElement.pause();

		} else {
			this.kerkDown = 10;
			this._mediaElement.play().then(()=>{

			});
		}
	}

	detachMediaElement() {
		this.wss.removeAllEventListener(TransmuxingEvents.INIT_SEGMENT);
		this.wss.removeAllEventListener(TransmuxingEvents.MEDIA_SEGMENT);

		if (this._mediaElement) {
			this._msectl.detachMediaElement();
			this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
			this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
			this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			this._mediaElement.removeEventListener('play', this.e.onvPlay);
			this._mediaElement.removeEventListener('pause', this.e.onvPause);
			this._mediaElement = null;
		}

		if (this._msectl) {
			this._msectl.destroy();
			this._msectl = null;
		}

		this.disconnect();
	}

	/**
	 *
	 * @param {HTMLVideoElement} mediaElement
	 */
	attachMediaElement(mediaElement) {
		this._mediaElement = mediaElement;
		mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);
		mediaElement.addEventListener('canplay', this.e.onvCanPlay);
		mediaElement.addEventListener('stalled', this.e.onvStalled);
		mediaElement.addEventListener('progress', this.e.onvProgress);
		mediaElement.addEventListener('play', this.e.onvPlay);
		mediaElement.addEventListener('pause', this.e.onvPause);

		this._msectl = new mse_controller(defaultConfig);

		//this._msectl.on(MSEEvents.UPDATE_END, this._onmseUpdateEnd.bind(this));
		this._msectl.on(MSEEvents.BUFFER_FULL, this._onmseBufferFull.bind(this));

		this._msectl.on(MSEEvents.ERROR, (info) => {
			this._emitter.emit(PlayerEvents.ERROR,
				ErrorTypes.MEDIA_ERROR,
				ErrorDetails.MEDIA_MSE_ERROR,
				info
			);
		});

		this.wss.addEventListener(TransmuxingEvents.INIT_SEGMENT, this._appendInitSegment.bind(this), true);
		this.wss.addEventListener(TransmuxingEvents.MEDIA_SEGMENT, this._appendMediaSegment.bind(this), true);

		this._msectl.attachMediaElement(mediaElement);
	}

	_appendInitSegment(data){
		logger.i(this.TAG, TransmuxingEvents.INIT_SEGMENT, data[0], data[1]);
		this._msectl.appendInitSegment(data[1]);
	}

	_appendMediaSegment(data){
		logger.t(this.TAG, TransmuxingEvents.MEDIA_SEGMENT, data[0], data[1]);
		this._msectl.appendMediaSegment(data[1]);
		if(this.kerkDown) {
			this.kerkDown--;
			this._mediaElement.currentTime = 2000000000;

			if(!this.kerkDown) logger.d(this.TAG, "kerkdown reached");
		}
	}
}

;// CONCATENATED MODULE: ./src/index.js
/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */






function createWebRTMP(){
    return new WebRTMP();
}

window["Log"] = logger;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=webrtmp.js.map