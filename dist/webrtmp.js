/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "dist/" + "webrtmp.worker" + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/webrtmp/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./src/webrtmp.js + 8 modules ***!
  \************************************/

// UNUSED EXPORTS: default

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
     * @type {}
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

	constructor() {
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	addEventListener(event, listener){
		this.ListenerList.push([event, listener]);
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	addListener(event, listener){
		this.ListenerList.push([event, listener]);
	}


	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	removeListener(event, listener){
		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] == event && entry[1] == listener){
				this.ListenerList.splice(i,1);
				return;
			}
		}
	}

	/**
	 * Remove all listener
	 */
	removeAllListeners(){
		this.ListenerList = [];
	}

	/**
	 *
	 * @param {String} event
	 * @param data
	 */
	emit(event, ...data){
		logger.t(this.TAG, "emit EVENT: " + event, ...data);
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
		this._emitter.removeAllListeners();
		this._emitter = null;
	}

	on(event, listener) {
		this._emitter.addListener(event, listener);
	}

	off(event, listener) {
		this._emitter.removeListener(event, listener);
	}

	attachMediaElement(mediaElement) {
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
		if (this._mediaSource) {
			let ms = this._mediaSource;
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
					if (ms.readyState !== 'closed') {
						// ms edge can throw an error: Unexpected call to method or property access
						try {
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
			if (ms.readyState === 'open') {
				try {
					ms.endOfStream();
				} catch (error) {
					logger.e(this.TAG, error.message);
				}
			}
			ms.removeEventListener('sourceopen', this.e.onSourceOpen);
			ms.removeEventListener('sourceended', this.e.onSourceEnded);
			ms.removeEventListener('sourceclose', this.e.onSourceClose);
			this._pendingSourceBufferInit = [];
			this._isBufferFull = false;
			this._idrList.clear();
			this._mediaSource = null;
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

	seek(seconds) {
		// remove all appended buffers
		for (let type in this._sourceBuffers) {
			if (!this._sourceBuffers[type]) {
				continue;
			}

			// abort current buffer append algorithm
			let sb = this._sourceBuffers[type];
			if (this._mediaSource.readyState === 'open') {
				try {
					// If range removal algorithm is running, InvalidStateError will be throwed
					// Ignore it.
					sb.abort();
				} catch (error) {
					logger.e(this.TAG, error.message);
				}
			}

			// IDRList should be clear
			this._idrList.clear();

			// pending segments should be discard
			let ps = this._pendingSegments[type];
			ps.splice(0, ps.length);

			if (this._mediaSource.readyState === 'closed') {
				// Parent MediaSource object has been detached from HTMLMediaElement
				continue;
			}

			// record ranges to be remove from SourceBuffer
			for (let i = 0; i < sb.buffered.length; i++) {
				let start = sb.buffered.start(i);
				let end = sb.buffered.end(i);
				this._pendingRemoveRanges[type].push({start, end});
			}

			// if sb is not updating, let's remove ranges now!
			if (!sb.updating) {
				this._doRemoveRanges();
			}

			// Safari 10 may get InvalidStateError in the later appendBuffer() after SourceBuffer.remove() call
			// Internal parser's state may be invalid at this time. Re-append last InitSegment to workaround.
			// Related issue: https://bugs.webkit.org/show_bug.cgi?id=159230
			if (browser.safari) {
				let lastInitSegment = this._lastInitSegments[type];
				if (lastInitSegment) {
					this._pendingSegments[type].push(lastInitSegment);
					if (!sb.updating) {
						this._doAppendSegments();
					}
				}
			}
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

	getNearestKeyframe(dts) {
		return this._idrList.getLastSyncPointBeforeDts(dts);
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

	loglevels = {
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
		"WebRTMP": logger.WARN,
		"WebRTMP_Controller": logger.WARN,
		"WebRTMP Worker": logger.WARN,
		"AMF": logger.WARN
	}

	WebRTMPWorker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(306), __webpack_require__.b), {
		name: "webrtmp.worker",
		type: undefined
		/* webpackEntryOptions: { filename: "dist/[name].js" } */
	});

	constructor() {
		logger.loglevels = this.loglevels;

		this._emitter = new event_emitter();

		this.WebRTMPWorker.addEventListener("message", (evt)=>{
			this.WorkerListener(evt);
		});
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 * @returns {boolean}
	 */
	open(host, port){
		if(this.isConnected) return false;

		if(host) this.host = host;
		if(port) this.port = port;

		this.WebRTMPWorker.postMessage({cmd: "open", host: this.host, port: this.port});
	}

	/**
	 * Websocket disconnect
	 */
	disconnect() {
		this.WSSReconnect = true;
		this.WebRTMPWorker.postMessage({cmd: "disconnect"});
	}

	/**
	 * RTMP connect application
	 * @param {String} appName
	 */
	connect(appName){
		this.WebRTMPWorker.postMessage({cmd: "connect", appName: appName});
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
	 */
	addEventListener(type, listener){
		this._emitter.addEventListener(type, listener);
	}

	removeEventListener(type, listener){
		this._emitter.removeListener(type, listener);
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
			onvProgress: this._onvProgress.bind(this)
		};
	}

	_checkAndResumeStuckPlayback(stalled) {
		let media = this._mediaElement;
		if (stalled || !this._receivedCanPlay || media.readyState < 2) {  // HAVE_CURRENT_DATA
			let buffered = media.buffered;
			if (buffered.length > 0 && media.currentTime < buffered.start(0)) {
				logger.w(this.TAG, `Playback seems stuck at ${media.currentTime}, seek to ${buffered.start(0)}`);
				this._requestSetTime = true;
				this._mediaElement.currentTime = buffered.start(0);
				this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			}
		} else {
			// Playback didn't stuck, remove progress event listener
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
		}
	}

	_onvLoadedMetadata(e) {
		if (this._pendingSeekTime != null) {
			this._mediaElement.currentTime = this._pendingSeekTime;
			this._pendingSeekTime = null;
		}
	}

	_onvCanPlay(e) {
		this._mediaElement.play();
		this._receivedCanPlay = true;
		this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
	}

	_onvStalled(e) {
		this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress(e) {
		this._checkAndResumeStuckPlayback();
	}

	_onmseBufferFull() {
		logger.w(this.TAG, 'MSE SourceBuffer is full');
	}

	destroy() {
		if (this._mediaElement) {
			this.detachMediaElement();
		}
		this.e = null;
		this._emitter.removeAllListeners();
		this._emitter = null;
	}

	disconnect(){
		this.wss.disconnect();
	}

	/**
	 * send play command
	 * @param {String} streamName
	 * @returns {Promise<unknown>}
	 */
	play(streamName){
		return new Promise((resolve, reject)=>{
			this.wss.play(streamName);
			this._mediaElement.play().then(resolve);
		});
	}

	stop(){
		this.wss.stop()
		this._mediaElement.pause();
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 * @returns {Promise<unknown>}
	 */
	open(host, port){
		return new Promise((resolve, reject)=>{
			this.wss.addEventListener("RTMPHandshakeDone", (success)=>{
				logger.d(this.TAG,"RTMPHandshakeDone");
				if(success) resolve();
				else reject();
			});

			this.wss.addEventListener("WSSConnectFailed", ()=>{
				logger.d(this.TAG,"WSSConnectFailed");
				reject();
			});

			this.wss.open(host, port);
		})
	}

	/**
	 *
	 * @param {String} appName
	 * @returns {Promise<unknown>}
	 */
	connect(appName){
		return new Promise((resolve, reject)=>{
			this.wss.addEventListener("RTMPStreamCreated", (cmd, stream_id)=>{
				logger.d(this.TAG,"RTMPStreamCreated: " + stream_id);
				resolve();
			});

			this.wss.connect(appName);
		})
	}

	pause(enable){
		this.wss.pause(enable);
	}

	detachMediaElement() {
		if (this._mediaElement) {
			this._msectl.detachMediaElement();
			this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
			this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
			this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			this._mediaElement = null;
		}

		if (this._msectl) {
			this.wss.removeEventListener(TransmuxingEvents.INIT_SEGMENT, this._appendInitSegment);
			this.wss.removeEventListener(TransmuxingEvents.MEDIA_SEGMENT, this._appendMediaSegment);
			this._msectl.destroy();
			this._msectl = null;
		}
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

		this.wss.addEventListener(TransmuxingEvents.INIT_SEGMENT, this._appendInitSegment.bind(this));
		this.wss.addEventListener(TransmuxingEvents.MEDIA_SEGMENT, this._appendMediaSegment.bind(this));

		this._msectl.attachMediaElement(mediaElement);
	}

	_appendInitSegment(data){
		logger.i(this.TAG, TransmuxingEvents.INIT_SEGMENT, data[0], data[1]);
		this._msectl.appendInitSegment(data[1]);
	}

	_appendMediaSegment(data){
		logger.i(this.TAG, TransmuxingEvents.MEDIA_SEGMENT, data[0], data[1]);
		this._msectl.appendMediaSegment(data[1]);
	}
}

/* harmony default export */ const webrtmp = (WebRTMP);

window["Log"] = logger;
window["webrtmp"] = new WebRTMP();


/******/ })()
;
//# sourceMappingURL=webrtmp.js.map