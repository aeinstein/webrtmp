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
/******/ 			return "" + "webrtmp.worker" + ".js";
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
/*!*********************************!*\
  !*** ./webrtmp.js + 13 modules ***!
  \*********************************/

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: ./utils/logger.js
class logger_Log {
    static OFF = -1;
    static TRACE = 0;
    static DEBUG = 1;
    static INFO = 2;
    static WARN = 3;
    static ERROR = 4;
    static CRITICAL = 5;
    static WITH_STACKTRACE = true;

    static LEVEL = logger_Log.INFO;

    /**
     *
     * @param {Number} level
     * @param {String} tag
     * @param txt
     * @private
     */
    static _output = function output(level, tag, ...txt){
        if(logger_Log.LEVEL === logger_Log.OFF) return;
        if(level < logger_Log.LEVEL) return;

        const callstack = logger_Log.getStackTrace();

        // debug aufruf entfernen
        callstack.shift();
        callstack.shift();

        let color = "color: silver";

        switch(level) {
            case logger_Log.TRACE:	// TRACE
                color = "background-color: gray";
                break;

            case logger_Log.DEBUG:	// DEBUG

                break;

            case logger_Log.INFO:	// INFO
                color = "color: green";
                break;

            case logger_Log.WARN:	// WARN
                color = "color: orange; background-color: #EAA80035";
                break;

            case logger_Log.ERROR:	// ERROR
                color = "color: red; background-color: #FF000020";
                break;

            case logger_Log.CRITICAL:	// CRITICAL
                color = "color: red";
                break;
        }

        logger_Log._print(callstack, color, tag, ...txt);
    };

    static _print(callstack, color, tag, ...txt){
        if(logger_Log.WITH_STACKTRACE){
            if(logger_Log.LEVEL === logger_Log.ERROR){
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
        logger_Log._output(logger_Log.CRITICAL, tag, ...msg);
    }

    static e(tag, ...msg) {
        logger_Log._output(logger_Log.ERROR, tag, ...msg);
    }

    static i(tag, ...msg) {
        logger_Log._output(logger_Log.INFO, tag, ...msg);
    }

    static w(tag, ...msg) {
        logger_Log._output(logger_Log.WARN, tag, ...msg);
    }

    static d(tag, ...msg) {
        logger_Log._output(logger_Log.DEBUG, tag, ...msg);
    }

    static v(tag, ...msg) {
        logger_Log._output(logger_Log.DEBUG, tag, ...msg);
    }

    static t(tag, ...msg) {
        logger_Log._output(logger_Log.TRACE, tag, ...msg);
    }
}

/* harmony default export */ const logger = (logger_Log);

;// CONCATENATED MODULE: ./utils/event_emitter.js


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


;// CONCATENATED MODULE: ./formats/media-segment-info.js
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
		if (this._list.length == 0) {
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

;// CONCATENATED MODULE: ./utils/exception.js
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

;// CONCATENATED MODULE: ./utils/utils.js
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
    enableWorker: false,
    enableStashBuffer: true,
    stashInitialSize: undefined,

    isLive: true,

    lazyLoad: true,
    lazyLoadMaxDuration: 3 * 60,
    lazyLoadRecoverDuration: 30,
    deferLoadAfterSourceOpen: true,

    // autoCleanupSourceBuffer: default as false, leave unspecified
    autoCleanupMaxBackwardDuration: 3 * 60,
    autoCleanupMinBackwardDuration: 2 * 60,

    statisticsInfoReportInterval: 600,

    fixAudioTimestampGap: true,

    accurateSeek: false,
    seekType: 'range',  // [range, param, custom]
    seekParamStart: 'bstart',
    seekParamEnd: 'bend',
    rangeLoadZeroStart: false,
    customSeekHandler: undefined,
    reuseRedirectedURL: false,
    // referrerPolicy: leave as unspecified

    headers: undefined,
    customLoader: undefined
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

;// CONCATENATED MODULE: ./utils/browser.js
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

let browser_Browser = {};

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

	for (let key in browser_Browser) {
		if (browser_Browser.hasOwnProperty(key)) {
			delete browser_Browser[key];
		}
	}
	Object.assign(browser_Browser, browser);
}

detect();

/* harmony default export */ const browser = (browser_Browser);

;// CONCATENATED MODULE: ./utils/mse-controller.js
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

;// CONCATENATED MODULE: ./wss/connection.controller.js



class WebRTMP_Controller {
	TAG = "WebRTMP_Controller";
	host = document.location.host;
	WSSReconnect = false;
	isConnected = false;

	WebRTMPWorker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(306), __webpack_require__.b), {
		name: "webrtmp.worker",
		type: undefined
		/* webpackEntryOptions: { filename: "[name].js" } */
	});

	constructor() {
		this.e = new event_emitter();

		this.WebRTMPWorker.addEventListener("message", (e)=>{
			this.WorkerListener(e);
		})
	}

	/**
	 * WSS Verbindung aufbauen
	 */
	createConnection(){
		if(this.isConnected) return false;
		this.WebRTMPWorker.postMessage({cmd: "createConnection", host: this.host});
	}

	/**
	 * MQTT Verbindung trennen
	 */
	disconnect() {
		this.WSSReconnect = true;
		this.WebRTMPWorker.postMessage({cmd: "disconnect"});
	}

	connect(appName){
		this.WebRTMPWorker.postMessage({cmd: "connect", appName: appName});
	}

	play(streamName){
		this.WebRTMPWorker.postMessage({cmd: "play", streamName: streamName});
	}

    pause(enable){
        this.WebRTMPWorker.postMessage({cmd: "pause", enable: enable});
    }


	/**
	 * Eventlistenre hinzufügenm
	 * @param type
	 * @param listener
	 */
	addEventListener(type, listener){
		this.e.addEventListener(type, listener);
	}



	/**
	 * Verarbeitet MQTT Events
	 * @param e Event
	 */
	WorkerListener(e){
		// Message.data wieder zum Event machen
		const data = e.data;

		switch(data[0]){
			case "ConnectionLost":
				this.e.emit("ConnectionLost");
				logger.d(this.TAG, "Event ConnectionLost");

				this.isConnected = false;

				if(this.WSSReconnect) {
					logger.w(this.TAG,"[ WorkerListener ] Reconnect timed");

					window.setTimeout(()=>{
						logger.w(this.TAG, "timed Reconnect");
						this.createConnection();
					}, 1000)
				}

				break;

			case "Connected":
				logger.d(this.TAG, "Event Connected");
				this.e.emit("Connected");
				this.isConnected = true;
				break;

			case "Started":
				logger.d(this.TAG, "Event Started");

				this.createConnection();
				/*
				window.setTimeout(()=>{
					this.connect();
				}, 2000);*/
				break;

			default:
				logger.d(this.TAG, data[0], data[1]);
				this.e.emit(data[0], data[1]);
				break;
		}
	}
}

/* harmony default export */ const connection_controller = (WebRTMP_Controller);

;// CONCATENATED MODULE: ./formats/mp4.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * This file is derived from dailymotion's hls.js library (hls.js/src/remux/mp4-generator.js)
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

//  MP4 boxes generator for ISO BMFF (ISO Base Media File Format, defined in ISO/IEC 14496-12)
class MP4 {
    static init() {
        MP4.types = {
            avc1: [], avcC: [], btrt: [], dinf: [],
            dref: [], esds: [], ftyp: [], hdlr: [],
            mdat: [], mdhd: [], mdia: [], mfhd: [],
            minf: [], moof: [], moov: [], mp4a: [],
            mvex: [], mvhd: [], sdtp: [], stbl: [],
            stco: [], stsc: [], stsd: [], stsz: [],
            stts: [], tfdt: [], tfhd: [], traf: [],
            trak: [], trun: [], trex: [], tkhd: [],
            vmhd: [], smhd: [], '.mp3': []
        };

        for (let name in MP4.types) {
            if (MP4.types.hasOwnProperty(name)) {
                MP4.types[name] = [
                    name.charCodeAt(0),
                    name.charCodeAt(1),
                    name.charCodeAt(2),
                    name.charCodeAt(3)
                ];
            }
        }

        let constants = MP4.constants = {};

        constants.FTYP = new Uint8Array([
            0x69, 0x73, 0x6F, 0x6D,  // major_brand: isom
            0x0,  0x0,  0x0,  0x1,   // minor_version: 0x01
            0x69, 0x73, 0x6F, 0x6D,  // isom
            0x61, 0x76, 0x63, 0x31   // avc1
        ]);

        constants.STSD_PREFIX = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x01   // entry_count
        ]);

        constants.STTS = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00   // entry_count
        ]);

        constants.STSC = constants.STCO = constants.STTS;

        constants.STSZ = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00,  // sample_size
            0x00, 0x00, 0x00, 0x00   // sample_count
        ]);

        constants.HDLR_VIDEO = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00,  // pre_defined
            0x76, 0x69, 0x64, 0x65,  // handler_type: 'vide'
            0x00, 0x00, 0x00, 0x00,  // reserved: 3 * 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x56, 0x69, 0x64, 0x65,
            0x6F, 0x48, 0x61, 0x6E,
            0x64, 0x6C, 0x65, 0x72, 0x00  // name: VideoHandler
        ]);

        constants.HDLR_AUDIO = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00,  // pre_defined
            0x73, 0x6F, 0x75, 0x6E,  // handler_type: 'soun'
            0x00, 0x00, 0x00, 0x00,  // reserved: 3 * 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x53, 0x6F, 0x75, 0x6E,
            0x64, 0x48, 0x61, 0x6E,
            0x64, 0x6C, 0x65, 0x72, 0x00  // name: SoundHandler
        ]);

        constants.DREF = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x01,  // entry_count
            0x00, 0x00, 0x00, 0x0C,  // entry_size
            0x75, 0x72, 0x6C, 0x20,  // type 'url '
            0x00, 0x00, 0x00, 0x01   // version(0) + flags
        ]);

        // Sound media header
        constants.SMHD = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00   // balance(2) + reserved(2)
        ]);

        // video media header
        constants.VMHD = new Uint8Array([
            0x00, 0x00, 0x00, 0x01,  // version(0) + flags
            0x00, 0x00,              // graphicsmode: 2 bytes
            0x00, 0x00, 0x00, 0x00,  // opcolor: 3 * 2 bytes
            0x00, 0x00
        ]);
    }

    // Generate a box
    static box(type) {
        let size = 8;
        let result;
        let datas = Array.prototype.slice.call(arguments, 1);
        let arrayCount = datas.length;

        for (let i = 0; i < arrayCount; i++) {
            size += datas[i].byteLength;
        }

        result = new Uint8Array(size);
        result[0] = (size >>> 24) & 0xFF;  // size
        result[1] = (size >>> 16) & 0xFF;
        result[2] = (size >>>  8) & 0xFF;
        result[3] = (size) & 0xFF;

        result.set(type, 4);  // type

        let offset = 8;
        for (let i = 0; i < arrayCount; i++) {  // data body
            result.set(datas[i], offset);
            offset += datas[i].byteLength;
        }

        return result;
    }

    // emit ftyp & moov
    static generateInitSegment(meta) {
        let ftyp = MP4.box(MP4.types.ftyp, MP4.constants.FTYP);
        let moov = MP4.moov(meta);

        let result = new Uint8Array(ftyp.byteLength + moov.byteLength);
        result.set(ftyp, 0);
        result.set(moov, ftyp.byteLength);
        return result;
    }

    // Movie metadata box
    static moov(meta) {
        let mvhd = MP4.mvhd(meta.timescale, meta.duration);
        let trak = MP4.trak(meta);
        let mvex = MP4.mvex(meta);
        return MP4.box(MP4.types.moov, mvhd, trak, mvex);
    }

    // Movie header box
    static mvhd(timescale, duration) {
        return MP4.box(MP4.types.mvhd, new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00,  // creation_time
            0x00, 0x00, 0x00, 0x00,  // modification_time
            (timescale >>> 24) & 0xFF,  // timescale: 4 bytes
            (timescale >>> 16) & 0xFF,
            (timescale >>>  8) & 0xFF,
            (timescale) & 0xFF,
            (duration >>> 24) & 0xFF,   // duration: 4 bytes
            (duration >>> 16) & 0xFF,
            (duration >>>  8) & 0xFF,
            (duration) & 0xFF,
            0x00, 0x01, 0x00, 0x00,  // Preferred rate: 1.0
            0x01, 0x00, 0x00, 0x00,  // PreferredVolume(1.0, 2bytes) + reserved(2bytes)
            0x00, 0x00, 0x00, 0x00,  // reserved: 4 + 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,  // ----begin composition matrix----
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x40, 0x00, 0x00, 0x00,  // ----end composition matrix----
            0x00, 0x00, 0x00, 0x00,  // ----begin pre_defined 6 * 4 bytes----
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,  // ----end pre_defined 6 * 4 bytes----
            0xFF, 0xFF, 0xFF, 0xFF   // next_track_ID
        ]));
    }

    // Track box
    static trak(meta) {
        return MP4.box(MP4.types.trak, MP4.tkhd(meta), MP4.mdia(meta));
    }

    // Track header box
    static tkhd(meta) {
        let trackId = meta.id, duration = meta.duration;
        let width = meta.presentWidth, height = meta.presentHeight;

        return MP4.box(MP4.types.tkhd, new Uint8Array([
            0x00, 0x00, 0x00, 0x07,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00,  // creation_time
            0x00, 0x00, 0x00, 0x00,  // modification_time
            (trackId >>> 24) & 0xFF,  // track_ID: 4 bytes
            (trackId >>> 16) & 0xFF,
            (trackId >>>  8) & 0xFF,
            (trackId) & 0xFF,
            0x00, 0x00, 0x00, 0x00,  // reserved: 4 bytes
            (duration >>> 24) & 0xFF, // duration: 4 bytes
            (duration >>> 16) & 0xFF,
            (duration >>>  8) & 0xFF,
            (duration) & 0xFF,
            0x00, 0x00, 0x00, 0x00,  // reserved: 2 * 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,  // layer(2bytes) + alternate_group(2bytes)
            0x00, 0x00, 0x00, 0x00,  // volume(2bytes) + reserved(2bytes)
            0x00, 0x01, 0x00, 0x00,  // ----begin composition matrix----
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x40, 0x00, 0x00, 0x00,  // ----end composition matrix----
            (width >>> 8) & 0xFF,    // width and height
            (width) & 0xFF,
            0x00, 0x00,
            (height >>> 8) & 0xFF,
            (height) & 0xFF,
            0x00, 0x00
        ]));
    }

    // Media Box
    static mdia(meta) {
        return MP4.box(MP4.types.mdia, MP4.mdhd(meta), MP4.hdlr(meta), MP4.minf(meta));
    }

    // Media header box
    static mdhd(meta) {
        let timescale = meta.timescale;
        let duration = meta.duration;
        return MP4.box(MP4.types.mdhd, new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            0x00, 0x00, 0x00, 0x00,  // creation_time
            0x00, 0x00, 0x00, 0x00,  // modification_time
            (timescale >>> 24) & 0xFF,  // timescale: 4 bytes
            (timescale >>> 16) & 0xFF,
            (timescale >>>  8) & 0xFF,
            (timescale) & 0xFF,
            (duration >>> 24) & 0xFF,   // duration: 4 bytes
            (duration >>> 16) & 0xFF,
            (duration >>>  8) & 0xFF,
            (duration) & 0xFF,
            0x55, 0xC4,             // language: und (undetermined)
            0x00, 0x00              // pre_defined = 0
        ]));
    }

    // Media handler reference box
    static hdlr(meta) {
        let data;
        if (meta.type === 'audio') {
            data = MP4.constants.HDLR_AUDIO;
        } else {
            data = MP4.constants.HDLR_VIDEO;
        }
        return MP4.box(MP4.types.hdlr, data);
    }

    // Media infomation box
    static minf(meta) {
        let xmhd;
        if (meta.type === 'audio') {
            xmhd = MP4.box(MP4.types.smhd, MP4.constants.SMHD);
        } else {
            xmhd = MP4.box(MP4.types.vmhd, MP4.constants.VMHD);
        }
        return MP4.box(MP4.types.minf, xmhd, MP4.dinf(), MP4.stbl(meta));
    }

    // Data infomation box
    static dinf() {
        return MP4.box(MP4.types.dinf,
            MP4.box(MP4.types.dref, MP4.constants.DREF)
        );
    }

    // Sample table box
    static stbl(meta) {
        return MP4.box(MP4.types.stbl,  // type: stbl
            MP4.stsd(meta),  // Sample Description Table
            MP4.box(MP4.types.stts, MP4.constants.STTS),  // Time-To-Sample
            MP4.box(MP4.types.stsc, MP4.constants.STSC),  // Sample-To-Chunk
            MP4.box(MP4.types.stsz, MP4.constants.STSZ),  // Sample size
            MP4.box(MP4.types.stco, MP4.constants.STCO)   // Chunk offset
        );
    }

    // Sample description box
    static stsd(meta) {
        if (meta.type === 'audio') {
            if (meta.codec === 'mp3') {
                return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp3(meta));
            }
            // else: aac -> mp4a
            return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp4a(meta));
        } else {
            return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.avc1(meta));
        }
    }

    static mp3(meta) {
        let channelCount = meta.channelCount;
        let sampleRate = meta.audioSampleRate;

        let data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // reserved(4)
            0x00, 0x00, 0x00, 0x01,  // reserved(2) + data_reference_index(2)
            0x00, 0x00, 0x00, 0x00,  // reserved: 2 * 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, channelCount,      // channelCount(2)
            0x00, 0x10,              // sampleSize(2)
            0x00, 0x00, 0x00, 0x00,  // reserved(4)
            (sampleRate >>> 8) & 0xFF,  // Audio sample rate
            (sampleRate) & 0xFF,
            0x00, 0x00
        ]);

        return MP4.box(MP4.types['.mp3'], data);
    }

    static mp4a(meta) {
        let channelCount = meta.channelCount;
        let sampleRate = meta.audioSampleRate;

        let data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // reserved(4)
            0x00, 0x00, 0x00, 0x01,  // reserved(2) + data_reference_index(2)
            0x00, 0x00, 0x00, 0x00,  // reserved: 2 * 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, channelCount,      // channelCount(2)
            0x00, 0x10,              // sampleSize(2)
            0x00, 0x00, 0x00, 0x00,  // reserved(4)
            (sampleRate >>> 8) & 0xFF,  // Audio sample rate
            (sampleRate) & 0xFF,
            0x00, 0x00
        ]);

        return MP4.box(MP4.types.mp4a, data, MP4.esds(meta));
    }

    static esds(meta) {
        let config = meta.config || [];
        let configSize = config.length;
        let data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version 0 + flags

            0x03,                    // descriptor_type
            0x17 + configSize,       // length3
            0x00, 0x01,              // es_id
            0x00,                    // stream_priority

            0x04,                    // descriptor_type
            0x0F + configSize,       // length
            0x40,                    // codec: mpeg4_audio
            0x15,                    // stream_type: Audio
            0x00, 0x00, 0x00,        // buffer_size
            0x00, 0x00, 0x00, 0x00,  // maxBitrate
            0x00, 0x00, 0x00, 0x00,  // avgBitrate

            0x05                     // descriptor_type
        ].concat([
            configSize
        ]).concat(
            config
        ).concat([
            0x06, 0x01, 0x02         // GASpecificConfig
        ]));
        return MP4.box(MP4.types.esds, data);
    }

    static avc1(meta) {
        let avcc = meta.avcc;
        let width = meta.codecWidth, height = meta.codecHeight;

        let data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // reserved(4)
            0x00, 0x00, 0x00, 0x01,  // reserved(2) + data_reference_index(2)
            0x00, 0x00, 0x00, 0x00,  // pre_defined(2) + reserved(2)
            0x00, 0x00, 0x00, 0x00,  // pre_defined: 3 * 4 bytes
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            (width >>> 8) & 0xFF,    // width: 2 bytes
            (width) & 0xFF,
            (height >>> 8) & 0xFF,   // height: 2 bytes
            (height) & 0xFF,
            0x00, 0x48, 0x00, 0x00,  // horizresolution: 4 bytes
            0x00, 0x48, 0x00, 0x00,  // vertresolution: 4 bytes
            0x00, 0x00, 0x00, 0x00,  // reserved: 4 bytes
            0x00, 0x01,              // frame_count
            0x0A,                    // strlen
            0x78, 0x71, 0x71, 0x2F,  // compressorname: 32 bytes
            0x66, 0x6C, 0x76, 0x2E,
            0x6A, 0x73, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00,
            0x00, 0x18,              // depth
            0xFF, 0xFF               // pre_defined = -1
        ]);
        return MP4.box(MP4.types.avc1, data, MP4.box(MP4.types.avcC, avcc));
    }

    // Movie Extends box
    static mvex(meta) {
        return MP4.box(MP4.types.mvex, MP4.trex(meta));
    }

    // Track Extends box
    static trex(meta) {
        let trackId = meta.id;
        let data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) + flags
            (trackId >>> 24) & 0xFF, // track_ID
            (trackId >>> 16) & 0xFF,
            (trackId >>>  8) & 0xFF,
            (trackId) & 0xFF,
            0x00, 0x00, 0x00, 0x01,  // default_sample_description_index
            0x00, 0x00, 0x00, 0x00,  // default_sample_duration
            0x00, 0x00, 0x00, 0x00,  // default_sample_size
            0x00, 0x01, 0x00, 0x01   // default_sample_flags
        ]);
        return MP4.box(MP4.types.trex, data);
    }

    // Movie fragment box
    static moof(track, baseMediaDecodeTime) {
        return MP4.box(MP4.types.moof, MP4.mfhd(track.sequenceNumber), MP4.traf(track, baseMediaDecodeTime));
    }

    static mfhd(sequenceNumber) {
        let data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,
            (sequenceNumber >>> 24) & 0xFF,  // sequence_number: int32
            (sequenceNumber >>> 16) & 0xFF,
            (sequenceNumber >>>  8) & 0xFF,
            (sequenceNumber) & 0xFF
        ]);
        return MP4.box(MP4.types.mfhd, data);
    }

    // Track fragment box
    static traf(track, baseMediaDecodeTime) {
        let trackId = track.id;

        // Track fragment header box
        let tfhd = MP4.box(MP4.types.tfhd, new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) & flags
            (trackId >>> 24) & 0xFF, // track_ID
            (trackId >>> 16) & 0xFF,
            (trackId >>>  8) & 0xFF,
            (trackId) & 0xFF
        ]));
        // Track Fragment Decode Time
        let tfdt = MP4.box(MP4.types.tfdt, new Uint8Array([
            0x00, 0x00, 0x00, 0x00,  // version(0) & flags
            (baseMediaDecodeTime >>> 24) & 0xFF,  // baseMediaDecodeTime: int32
            (baseMediaDecodeTime >>> 16) & 0xFF,
            (baseMediaDecodeTime >>>  8) & 0xFF,
            (baseMediaDecodeTime) & 0xFF
        ]));
        let sdtp = MP4.sdtp(track);
        let trun = MP4.trun(track, sdtp.byteLength + 16 + 16 + 8 + 16 + 8 + 8);

        return MP4.box(MP4.types.traf, tfhd, tfdt, trun, sdtp);
    }

    // Sample Dependency Type box
    static sdtp(track) {
        let samples = track.samples || [];
        let sampleCount = samples.length;
        let data = new Uint8Array(4 + sampleCount);
        // 0~4 bytes: version(0) & flags
        for (let i = 0; i < sampleCount; i++) {
            let flags = samples[i].flags;
            data[i + 4] = (flags.isLeading << 6)    // is_leading: 2 (bit)
                | (flags.dependsOn << 4)    // sample_depends_on
                | (flags.isDependedOn << 2) // sample_is_depended_on
                | (flags.hasRedundancy);    // sample_has_redundancy
        }
        return MP4.box(MP4.types.sdtp, data);
    }

    // Track fragment run box
    static trun(track, offset) {
        let samples = track.samples || [];
        let sampleCount = samples.length;
        let dataSize = 12 + 16 * sampleCount;
        let data = new Uint8Array(dataSize);
        offset += 8 + dataSize;

        data.set([
            0x00, 0x00, 0x0F, 0x01,      // version(0) & flags
            (sampleCount >>> 24) & 0xFF, // sample_count
            (sampleCount >>> 16) & 0xFF,
            (sampleCount >>>  8) & 0xFF,
            (sampleCount) & 0xFF,
            (offset >>> 24) & 0xFF,      // data_offset
            (offset >>> 16) & 0xFF,
            (offset >>>  8) & 0xFF,
            (offset) & 0xFF
        ], 0);

        for (let i = 0; i < sampleCount; i++) {
            let duration = samples[i].duration;
            let size = samples[i].size;
            let flags = samples[i].flags;
            let cts = samples[i].cts;
            data.set([
                (duration >>> 24) & 0xFF,  // sample_duration
                (duration >>> 16) & 0xFF,
                (duration >>>  8) & 0xFF,
                (duration) & 0xFF,
                (size >>> 24) & 0xFF,      // sample_size
                (size >>> 16) & 0xFF,
                (size >>>  8) & 0xFF,
                (size) & 0xFF,
                (flags.isLeading << 2) | flags.dependsOn,  // sample_flags
                (flags.isDependedOn << 6) | (flags.hasRedundancy << 4) | flags.isNonSync,
                0x00, 0x00,                // sample_degradation_priority
                (cts >>> 24) & 0xFF,       // sample_composition_time_offset
                (cts >>> 16) & 0xFF,
                (cts >>>  8) & 0xFF,
                (cts) & 0xFF
            ], 12 + 16 * i);
        }
        return MP4.box(MP4.types.trun, data);
    }

    static mdat(data) {
        return MP4.box(MP4.types.mdat, data);
    }

}

MP4.init();

/* harmony default export */ const mp4 = (MP4);

;// CONCATENATED MODULE: ./formats/aac-silent.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * This file is modified from dailymotion's hls.js library (hls.js/src/helper/aac.js)
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

class AAC {
	static getSilentFrame(codec, channelCount) {
		if (codec === 'mp4a.40.2') {
			// handle LC-AAC
			if (channelCount === 1) {
				return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x23, 0x80]);
			} else if (channelCount === 2) {
				return new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);
			} else if (channelCount === 3) {
				return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x8e]);
			} else if (channelCount === 4) {
				return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x80, 0x2c, 0x80, 0x08, 0x02, 0x38]);
			} else if (channelCount === 5) {
				return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x38]);
			} else if (channelCount === 6) {
				return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x00, 0xb2, 0x00, 0x20, 0x08, 0xe0]);
			}
		} else {
			// handle HE-AAC (mp4a.40.5 / mp4a.40.29)
			if (channelCount === 1) {
				// ffmpeg -y -f lavfi -i "aevalsrc=0:d=0.05" -c:a libfdk_aac -profile:a aac_he -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
				return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x4e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x1c, 0x6, 0xf1, 0xc1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
			} else if (channelCount === 2) {
				// ffmpeg -y -f lavfi -i "aevalsrc=0|0:d=0.05" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
				return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
			} else if (channelCount === 3) {
				// ffmpeg -y -f lavfi -i "aevalsrc=0|0|0:d=0.05" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
				return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
			}
		}
		return null;
	}

}

/* harmony default export */ const aac_silent = (AAC);

;// CONCATENATED MODULE: ./formats/mp4-remuxer.js
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


// Fragmented mp4 remuxer






class MP4Remuxer {
	TAG = 'MP4Remuxer'

	constructor(config) {
		this._config = config;
		this._isLive = (config.isLive === true) ? true : false;

		this._dtsBase = -1;
		this._dtsBaseInited = false;
		this._audioDtsBase = Infinity;
		this._videoDtsBase = Infinity;
		this._audioNextDts = undefined;
		this._videoNextDts = undefined;
		this._audioStashedLastSample = null;
		this._videoStashedLastSample = null;

		this._audioMeta = null;
		this._videoMeta = null;

		this._audioSegmentInfoList = new MediaSegmentInfoList('audio');
		this._videoSegmentInfoList = new MediaSegmentInfoList('video');

		this._onInitSegment = null;
		this._onMediaSegment = null;

		// Workaround for chrome < 50: Always force first sample as a Random Access Point in media segment
		// see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
		this._forceFirstIDR = (browser.chrome &&
			(browser.version.major < 50 ||
				(browser.version.major === 50 && browser.version.build < 2661))) ? true : false;

		// Workaround for IE11/Edge: Fill silent aac frame after keyframe-seeking
		// Make audio beginDts equals with video beginDts, in order to fix seek freeze
		this._fillSilentAfterSeek = (browser.msedge || browser.msie);

		// While only FireFox supports 'audio/mp4, codecs="mp3"', use 'audio/mpeg' for chrome, safari, ...
		this._mp3UseMpegAudio = !browser.firefox;

		this._fillAudioTimestampGap = this._config.fixAudioTimestampGap;
	}

	destroy() {
		this._dtsBase = -1;
		this._dtsBaseInited = false;
		this._audioMeta = null;
		this._videoMeta = null;
		this._audioSegmentInfoList.clear();
		this._audioSegmentInfoList = null;
		this._videoSegmentInfoList.clear();
		this._videoSegmentInfoList = null;
		this._onInitSegment = null;
		this._onMediaSegment = null;
	}

	bindDataSource(producer) {
		producer.onDataAvailable = this.remux.bind(this);
		producer.onTrackMetadata = this._onTrackMetadataReceived.bind(this);
		return this;
	}

	get onInitSegment() {
		return this._onInitSegment;
	}

	set onInitSegment(callback) {
		this._onInitSegment = callback;
	}

	get onMediaSegment() {
		return this._onMediaSegment;
	}

	set onMediaSegment(callback) {
		this._onMediaSegment = callback;
	}

	insertDiscontinuity() {
		this._audioNextDts = this._videoNextDts = undefined;
	}

	seek(originalDts) {
		this._audioStashedLastSample = null;
		this._videoStashedLastSample = null;
		this._videoSegmentInfoList.clear();
		this._audioSegmentInfoList.clear();
	}

	remux(audioTrack, videoTrack) {
		if (!this._onMediaSegment) {
			throw new IllegalStateException('MP4Remuxer: onMediaSegment callback must be specificed!');
		}
		if (!this._dtsBaseInited) {
			this._calculateDtsBase(audioTrack, videoTrack);
		}
		this._remuxVideo(videoTrack);
		this._remuxAudio(audioTrack);
	}

	_onTrackMetadataReceived(type, metadata) {
		let metabox = null;

		let container = 'mp4';
		let codec = metadata.codec;

		if (type === 'audio') {
			this._audioMeta = metadata;
			if (metadata.codec === 'mp3' && this._mp3UseMpegAudio) {
				// 'audio/mpeg' for MP3 audio track
				container = 'mpeg';
				codec = '';
				metabox = new Uint8Array();
			} else {
				// 'audio/mp4, codecs="codec"'
				metabox = mp4.generateInitSegment(metadata);
			}
		} else if (type === 'video') {
			this._videoMeta = metadata;
			metabox = mp4.generateInitSegment(metadata);
		} else {
			return;
		}

		// dispatch metabox (Initialization Segment)
		if (!this._onInitSegment) {
			throw new IllegalStateException('MP4Remuxer: onInitSegment callback must be specified!');
		}
		this._onInitSegment(type, {
			type: type,
			data: metabox.buffer,
			codec: codec,
			container: `${type}/${container}`,
			mediaDuration: metadata.duration  // in timescale 1000 (milliseconds)
		});
	}

	_calculateDtsBase(audioTrack, videoTrack) {
		if (this._dtsBaseInited) {
			return;
		}

		if (audioTrack.samples && audioTrack.samples.length) {
			this._audioDtsBase = audioTrack.samples[0].dts;
		}
		if (videoTrack.samples && videoTrack.samples.length) {
			this._videoDtsBase = videoTrack.samples[0].dts;
		}

		this._dtsBase = Math.min(this._audioDtsBase, this._videoDtsBase);
		this._dtsBaseInited = true;
	}

	flushStashedSamples() {
		let videoSample = this._videoStashedLastSample;
		let audioSample = this._audioStashedLastSample;

		let videoTrack = {
			type: 'video',
			id: 1,
			sequenceNumber: 0,
			samples: [],
			length: 0
		};

		if (videoSample != null) {
			videoTrack.samples.push(videoSample);
			videoTrack.length = videoSample.length;
		}

		let audioTrack = {
			type: 'audio',
			id: 2,
			sequenceNumber: 0,
			samples: [],
			length: 0
		};

		if (audioSample != null) {
			audioTrack.samples.push(audioSample);
			audioTrack.length = audioSample.length;
		}

		this._videoStashedLastSample = null;
		this._audioStashedLastSample = null;

		this._remuxVideo(videoTrack, true);
		this._remuxAudio(audioTrack, true);
	}

	_remuxAudio(audioTrack, force) {
		if (this._audioMeta == null) {
			return;
		}

		let track = audioTrack;
		let samples = track.samples;
		let dtsCorrection = undefined;
		let firstDts = -1, lastDts = -1, lastPts = -1;
		let refSampleDuration = this._audioMeta.refSampleDuration;

		let mpegRawTrack = this._audioMeta.codec === 'mp3' && this._mp3UseMpegAudio;
		let firstSegmentAfterSeek = this._dtsBaseInited && this._audioNextDts === undefined;

		let insertPrefixSilentFrame = false;

		if (!samples || samples.length === 0) {
			return;
		}
		if (samples.length === 1 && !force) {
			// If [sample count in current batch] === 1 && (force != true)
			// Ignore and keep in demuxer's queue
			return;
		}  // else if (force === true) do remux

		let offset = 0;
		let mdatbox = null;
		let mdatBytes = 0;

		// calculate initial mdat size
		if (mpegRawTrack) {
			// for raw mpeg buffer
			offset = 0;
			mdatBytes = track.length;
		} else {
			// for fmp4 mdat box
			offset = 8;  // size + type
			mdatBytes = 8 + track.length;
		}


		let lastSample = null;

		// Pop the lastSample and waiting for stash
		if (samples.length > 1) {
			lastSample = samples.pop();
			mdatBytes -= lastSample.length;
		}

		// Insert [stashed lastSample in the previous batch] to the front
		if (this._audioStashedLastSample != null) {
			let sample = this._audioStashedLastSample;
			this._audioStashedLastSample = null;
			samples.unshift(sample);
			mdatBytes += sample.length;
		}

		// Stash the lastSample of current batch, waiting for next batch
		if (lastSample != null) {
			this._audioStashedLastSample = lastSample;
		}


		let firstSampleOriginalDts = samples[0].dts - this._dtsBase;

		// calculate dtsCorrection
		if (this._audioNextDts) {
			dtsCorrection = firstSampleOriginalDts - this._audioNextDts;
		} else {  // this._audioNextDts == undefined
			if (this._audioSegmentInfoList.isEmpty()) {
				dtsCorrection = 0;
				if (this._fillSilentAfterSeek && !this._videoSegmentInfoList.isEmpty()) {
					if (this._audioMeta.originalCodec !== 'mp3') {
						insertPrefixSilentFrame = true;
					}
				}
			} else {
				let lastSample = this._audioSegmentInfoList.getLastSampleBefore(firstSampleOriginalDts);
				if (lastSample != null) {
					let distance = (firstSampleOriginalDts - (lastSample.originalDts + lastSample.duration));
					if (distance <= 3) {
						distance = 0;
					}
					let expectedDts = lastSample.dts + lastSample.duration + distance;
					dtsCorrection = firstSampleOriginalDts - expectedDts;
				} else { // lastSample == null, cannot found
					dtsCorrection = 0;
				}
			}
		}

		if (insertPrefixSilentFrame) {
			// align audio segment beginDts to match with current video segment's beginDts
			let firstSampleDts = firstSampleOriginalDts - dtsCorrection;
			let videoSegment = this._videoSegmentInfoList.getLastSegmentBefore(firstSampleOriginalDts);
			if (videoSegment != null && videoSegment.beginDts < firstSampleDts) {
				let silentUnit = aac_silent.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);
				if (silentUnit) {
					let dts = videoSegment.beginDts;
					let silentFrameDuration = firstSampleDts - videoSegment.beginDts;
					Log.v(this.TAG, `InsertPrefixSilentAudio: dts: ${dts}, duration: ${silentFrameDuration}`);
					samples.unshift({ unit: silentUnit, dts: dts, pts: dts });
					mdatBytes += silentUnit.byteLength;
				}  // silentUnit == null: Cannot generate, skip
			} else {
				insertPrefixSilentFrame = false;
			}
		}

		let mp4Samples = [];

		// Correct dts for each sample, and calculate sample duration. Then output to mp4Samples
		for (let i = 0; i < samples.length; i++) {
			let sample = samples[i];
			let unit = sample.unit;
			let originalDts = sample.dts - this._dtsBase;
			let dts = originalDts;
			let needFillSilentFrames = false;
			let silentFrames = null;
			let sampleDuration = 0;

			if (originalDts < -0.001) {
				continue; //pass the first sample with the invalid dts
			}

			if (this._audioMeta.codec !== 'mp3') {
				// for AAC codec, we need to keep dts increase based on refSampleDuration
				let curRefDts = originalDts;
				const maxAudioFramesDrift = 3;
				if (this._audioNextDts) {
					curRefDts = this._audioNextDts;
				}

				dtsCorrection = originalDts - curRefDts;
				if (dtsCorrection <= -maxAudioFramesDrift * refSampleDuration) {
					// If we're overlapping by more than maxAudioFramesDrift number of frame, drop this sample
					Log.w(this.TAG, `Dropping 1 audio frame (originalDts: ${originalDts} ms ,curRefDts: ${curRefDts} ms)  due to dtsCorrection: ${dtsCorrection} ms overlap.`);
					continue;
				}
				else if (dtsCorrection >= maxAudioFramesDrift * refSampleDuration && this._fillAudioTimestampGap && !browser.safari) {
					// Silent frame generation, if large timestamp gap detected && config.fixAudioTimestampGap
					needFillSilentFrames = true;
					// We need to insert silent frames to fill timestamp gap
					let frameCount = Math.floor(dtsCorrection / refSampleDuration);
					Log.w(this.TAG, 'Large audio timestamp gap detected, may cause AV sync to drift. ' +
						'Silent frames will be generated to avoid unsync.\n' +
						`originalDts: ${originalDts} ms, curRefDts: ${curRefDts} ms, ` +
						`dtsCorrection: ${Math.round(dtsCorrection)} ms, generate: ${frameCount} frames`);


					dts = Math.floor(curRefDts);
					sampleDuration = Math.floor(curRefDts + refSampleDuration) - dts;

					let silentUnit = aac_silent.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);
					if (silentUnit == null) {
						Log.w(this.TAG, 'Unable to generate silent frame for ' +
							`${this._audioMeta.originalCodec} with ${this._audioMeta.channelCount} channels, repeat last frame`);
						// Repeat last frame
						silentUnit = unit;
					}
					silentFrames = [];

					for (let j = 0; j < frameCount; j++) {
						curRefDts = curRefDts + refSampleDuration;
						let intDts = Math.floor(curRefDts);  // change to integer
						let intDuration = Math.floor(curRefDts + refSampleDuration) - intDts;
						let frame = {
							dts: intDts,
							pts: intDts,
							cts: 0,
							unit: silentUnit,
							size: silentUnit.byteLength,
							duration: intDuration,  // wait for next sample
							originalDts: originalDts,
							flags: {
								isLeading: 0,
								dependsOn: 1,
								isDependedOn: 0,
								hasRedundancy: 0
							}
						};
						silentFrames.push(frame);
						mdatBytes += frame.size;;

					}

					this._audioNextDts = curRefDts + refSampleDuration;

				} else {

					dts = Math.floor(curRefDts);
					sampleDuration = Math.floor(curRefDts + refSampleDuration) - dts;
					this._audioNextDts = curRefDts + refSampleDuration;

				}
			} else {
				// keep the original dts calculate algorithm for mp3
				dts = originalDts - dtsCorrection;


				if (i !== samples.length - 1) {
					let nextDts = samples[i + 1].dts - this._dtsBase - dtsCorrection;
					sampleDuration = nextDts - dts;
				} else {  // the last sample
					if (lastSample != null) {  // use stashed sample's dts to calculate sample duration
						let nextDts = lastSample.dts - this._dtsBase - dtsCorrection;
						sampleDuration = nextDts - dts;
					} else if (mp4Samples.length >= 1) {  // use second last sample duration
						sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
					} else {  // the only one sample, use reference sample duration
						sampleDuration = Math.floor(refSampleDuration);
					}
				}
				this._audioNextDts = dts + sampleDuration;
			}

			if (firstDts === -1) {
				firstDts = dts;
			}
			mp4Samples.push({
				dts: dts,
				pts: dts,
				cts: 0,
				unit: sample.unit,
				size: sample.unit.byteLength,
				duration: sampleDuration,
				originalDts: originalDts,
				flags: {
					isLeading: 0,
					dependsOn: 1,
					isDependedOn: 0,
					hasRedundancy: 0
				}
			});

			if (needFillSilentFrames) {
				// Silent frames should be inserted after wrong-duration frame
				mp4Samples.push.apply(mp4Samples, silentFrames);
			}
		}

		if (mp4Samples.length === 0) {
			//no samples need to remux
			track.samples = [];
			track.length = 0;
			return;
		}

		// allocate mdatbox
		if (mpegRawTrack) {
			// allocate for raw mpeg buffer
			mdatbox = new Uint8Array(mdatBytes);
		} else {
			// allocate for fmp4 mdat box
			mdatbox = new Uint8Array(mdatBytes);
			// size field
			mdatbox[0] = (mdatBytes >>> 24) & 0xFF;
			mdatbox[1] = (mdatBytes >>> 16) & 0xFF;
			mdatbox[2] = (mdatBytes >>> 8) & 0xFF;
			mdatbox[3] = (mdatBytes) & 0xFF;
			// type field (fourCC)
			mdatbox.set(mp4.types.mdat, 4);
		}

		// Write samples into mdatbox
		for (let i = 0; i < mp4Samples.length; i++) {
			let unit = mp4Samples[i].unit;
			mdatbox.set(unit, offset);
			offset += unit.byteLength;
		}

		let latest = mp4Samples[mp4Samples.length - 1];
		lastDts = latest.dts + latest.duration;
		//this._audioNextDts = lastDts;

		// fill media segment info & add to info list
		let info = new MediaSegmentInfo();
		info.beginDts = firstDts;
		info.endDts = lastDts;
		info.beginPts = firstDts;
		info.endPts = lastDts;
		info.originalBeginDts = mp4Samples[0].originalDts;
		info.originalEndDts = latest.originalDts + latest.duration;
		info.firstSample = new SampleInfo(mp4Samples[0].dts,
			mp4Samples[0].pts,
			mp4Samples[0].duration,
			mp4Samples[0].originalDts,
			false);
		info.lastSample = new SampleInfo(latest.dts,
			latest.pts,
			latest.duration,
			latest.originalDts,
			false);
		if (!this._isLive) {
			this._audioSegmentInfoList.append(info);
		}

		track.samples = mp4Samples;
		track.sequenceNumber++;

		let moofbox = null;

		if (mpegRawTrack) {
			// Generate empty buffer, because useless for raw mpeg
			moofbox = new Uint8Array();
		} else {
			// Generate moof for fmp4 segment
			moofbox = mp4.moof(track, firstDts);
		}

		track.samples = [];
		track.length = 0;

		let segment = {
			type: 'audio',
			data: this._mergeBoxes(moofbox, mdatbox).buffer,
			sampleCount: mp4Samples.length,
			info: info
		};

		if (mpegRawTrack && firstSegmentAfterSeek) {
			// For MPEG audio stream in MSE, if seeking occurred, before appending new buffer
			// We need explicitly set timestampOffset to the desired point in timeline for mpeg SourceBuffer.
			segment.timestampOffset = firstDts;
		}

		this._onMediaSegment('audio', segment);
	}

	_remuxVideo(videoTrack, force) {
		if (this._videoMeta == null) {
			return;
		}

		let track = videoTrack;
		let samples = track.samples;
		let dtsCorrection = undefined;
		let firstDts = -1, lastDts = -1;
		let firstPts = -1, lastPts = -1;

		if (!samples || samples.length === 0) {
			return;
		}
		if (samples.length === 1 && !force) {
			// If [sample count in current batch] === 1 && (force != true)
			// Ignore and keep in demuxer's queue
			return;
		}  // else if (force === true) do remux

		let offset = 8;
		let mdatbox = null;
		let mdatBytes = 8 + videoTrack.length;


		let lastSample = null;

		// Pop the lastSample and waiting for stash
		if (samples.length > 1) {
			lastSample = samples.pop();
			mdatBytes -= lastSample.length;
		}

		// Insert [stashed lastSample in the previous batch] to the front
		if (this._videoStashedLastSample != null) {
			let sample = this._videoStashedLastSample;
			this._videoStashedLastSample = null;
			samples.unshift(sample);
			mdatBytes += sample.length;
		}

		// Stash the lastSample of current batch, waiting for next batch
		if (lastSample != null) {
			this._videoStashedLastSample = lastSample;
		}


		let firstSampleOriginalDts = samples[0].dts - this._dtsBase;

		// calculate dtsCorrection
		if (this._videoNextDts) {
			dtsCorrection = firstSampleOriginalDts - this._videoNextDts;
		} else {  // this._videoNextDts == undefined
			if (this._videoSegmentInfoList.isEmpty()) {
				dtsCorrection = 0;
			} else {
				let lastSample = this._videoSegmentInfoList.getLastSampleBefore(firstSampleOriginalDts);
				if (lastSample != null) {
					let distance = (firstSampleOriginalDts - (lastSample.originalDts + lastSample.duration));
					if (distance <= 3) {
						distance = 0;
					}
					let expectedDts = lastSample.dts + lastSample.duration + distance;
					dtsCorrection = firstSampleOriginalDts - expectedDts;
				} else { // lastSample == null, cannot found
					dtsCorrection = 0;
				}
			}
		}

		let info = new MediaSegmentInfo();
		let mp4Samples = [];

		// Correct dts for each sample, and calculate sample duration. Then output to mp4Samples
		for (let i = 0; i < samples.length; i++) {
			let sample = samples[i];
			let originalDts = sample.dts - this._dtsBase;
			let isKeyframe = sample.isKeyframe;
			let dts = originalDts - dtsCorrection;
			let cts = sample.cts;
			let pts = dts + cts;

			if (firstDts === -1) {
				firstDts = dts;
				firstPts = pts;
			}

			let sampleDuration = 0;

			if (i !== samples.length - 1) {
				let nextDts = samples[i + 1].dts - this._dtsBase - dtsCorrection;
				sampleDuration = nextDts - dts;
			} else {  // the last sample
				if (lastSample != null) {  // use stashed sample's dts to calculate sample duration
					let nextDts = lastSample.dts - this._dtsBase - dtsCorrection;
					sampleDuration = nextDts - dts;
				} else if (mp4Samples.length >= 1) {  // use second last sample duration
					sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
				} else {  // the only one sample, use reference sample duration
					sampleDuration = Math.floor(this._videoMeta.refSampleDuration);
				}
			}

			if (isKeyframe) {
				let syncPoint = new SampleInfo(dts, pts, sampleDuration, sample.dts, true);
				syncPoint.fileposition = sample.fileposition;
				info.appendSyncPoint(syncPoint);
			}

			mp4Samples.push({
				dts: dts,
				pts: pts,
				cts: cts,
				units: sample.units,
				size: sample.length,
				isKeyframe: isKeyframe,
				duration: sampleDuration,
				originalDts: originalDts,
				flags: {
					isLeading: 0,
					dependsOn: isKeyframe ? 2 : 1,
					isDependedOn: isKeyframe ? 1 : 0,
					hasRedundancy: 0,
					isNonSync: isKeyframe ? 0 : 1
				}
			});
		}

		// allocate mdatbox
		mdatbox = new Uint8Array(mdatBytes);
		mdatbox[0] = (mdatBytes >>> 24) & 0xFF;
		mdatbox[1] = (mdatBytes >>> 16) & 0xFF;
		mdatbox[2] = (mdatBytes >>> 8) & 0xFF;
		mdatbox[3] = (mdatBytes) & 0xFF;
		mdatbox.set(mp4.types.mdat, 4);

		// Write samples into mdatbox
		for (let i = 0; i < mp4Samples.length; i++) {
			let units = mp4Samples[i].units;
			while (units.length) {
				let unit = units.shift();
				let data = unit.data;
				mdatbox.set(data, offset);
				offset += data.byteLength;
			}
		}

		let latest = mp4Samples[mp4Samples.length - 1];
		lastDts = latest.dts + latest.duration;
		lastPts = latest.pts + latest.duration;
		this._videoNextDts = lastDts;

		// fill media segment info & add to info list
		info.beginDts = firstDts;
		info.endDts = lastDts;
		info.beginPts = firstPts;
		info.endPts = lastPts;
		info.originalBeginDts = mp4Samples[0].originalDts;
		info.originalEndDts = latest.originalDts + latest.duration;
		info.firstSample = new SampleInfo(mp4Samples[0].dts,
			mp4Samples[0].pts,
			mp4Samples[0].duration,
			mp4Samples[0].originalDts,
			mp4Samples[0].isKeyframe);
		info.lastSample = new SampleInfo(latest.dts,
			latest.pts,
			latest.duration,
			latest.originalDts,
			latest.isKeyframe);
		if (!this._isLive) {
			this._videoSegmentInfoList.append(info);
		}

		track.samples = mp4Samples;
		track.sequenceNumber++;

		// workaround for chrome < 50: force first sample as a random access point
		// see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
		if (this._forceFirstIDR) {
			let flags = mp4Samples[0].flags;
			flags.dependsOn = 2;
			flags.isNonSync = 0;
		}

		let moofbox = mp4.moof(track, firstDts);
		track.samples = [];
		track.length = 0;

		this._onMediaSegment('video', {
			type: 'video',
			data: this._mergeBoxes(moofbox, mdatbox).buffer,
			sampleCount: mp4Samples.length,
			info: info
		});
	}

	_mergeBoxes(moof, mdat) {
		let result = new Uint8Array(moof.byteLength + mdat.byteLength);
		result.set(moof, 0);
		result.set(mdat, moof.byteLength);
		return result;
	}

}

/* harmony default export */ const mp4_remuxer = (MP4Remuxer);

;// CONCATENATED MODULE: ./formats/media-info.js
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

class MediaInfo {

	constructor() {
		this.mimeType = null;
		this.duration = null;

		this.hasAudio = null;
		this.hasVideo = null;
		this.audioCodec = null;
		this.videoCodec = null;
		this.audioDataRate = null;
		this.videoDataRate = null;

		this.audioSampleRate = null;
		this.audioChannelCount = null;

		this.width = null;
		this.height = null;
		this.fps = null;
		this.profile = null;
		this.level = null;
		this.refFrames = null;
		this.chromaFormat = null;
		this.sarNum = null;
		this.sarDen = null;

		this.metadata = null;
		this.segments = null;  // MediaInfo[]
		this.segmentCount = null;
		this.hasKeyframesIndex = null;
		this.keyframesIndex = null;
	}

	isComplete() {
		let audioInfoComplete = (this.hasAudio === false) ||
			(this.hasAudio === true &&
				this.audioCodec != null &&
				this.audioSampleRate != null &&
				this.audioChannelCount != null);

		let videoInfoComplete = (this.hasVideo === false) ||
			(this.hasVideo === true &&
				this.videoCodec != null &&
				this.width != null &&
				this.height != null &&
				this.fps != null &&
				this.profile != null &&
				this.level != null &&
				this.refFrames != null &&
				this.chromaFormat != null &&
				this.sarNum != null &&
				this.sarDen != null);

		// keyframesIndex may not be present
		return this.mimeType != null &&
			this.duration != null &&
			this.metadata != null &&
			this.hasKeyframesIndex != null &&
			audioInfoComplete &&
			videoInfoComplete;
	}

	isSeekable() {
		return this.hasKeyframesIndex === true;
	}

	getNearestKeyframe(milliseconds) {
		if (this.keyframesIndex == null) {
			return null;
		}

		let table = this.keyframesIndex;
		let keyframeIdx = this._search(table.times, milliseconds);

		return {
			index: keyframeIdx,
			milliseconds: table.times[keyframeIdx],
			fileposition: table.filepositions[keyframeIdx]
		};
	}

	_search(list, value) {
		let idx = 0;

		let last = list.length - 1;
		let mid = 0;
		let lbound = 0;
		let ubound = last;

		if (value < list[0]) {
			idx = 0;
			lbound = ubound + 1;  // skip search
		}

		while (lbound <= ubound) {
			mid = lbound + Math.floor((ubound - lbound) / 2);
			if (mid === last || (value >= list[mid] && value < list[mid + 1])) {
				idx = mid;
				break;
			} else if (list[mid] < value) {
				lbound = mid + 1;
			} else {
				ubound = mid - 1;
			}
		}

		return idx;
	}

}

/* harmony default export */ const media_info = (MediaInfo);

;// CONCATENATED MODULE: ./flv/transmuxer.js
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


// Transmuxing (IO, Demuxing, Remuxing) controller, with multipart support





class Transmuxer {

    constructor(config) {
        this.TAG = 'Transmuxer';
        this._emitter = new event_emitter();

        this._config = config;

        this._currentSegmentIndex = 0;

        this._mediaInfo = null;
        this._remuxer = null;
        this._ioctl = null;

        this._pendingSeekTime = null;
        this._pendingResolveSeekPoint = null;

        this._statisticsReporter = null;

        this._remuxer = new mp4_remuxer(this._config);
    }

    destroy() {
        this._mediaInfo = null;
        this._mediaDataSource = null;

        if (this._statisticsReporter) {
            this._disableStatisticsReporter();
        }
        if (this._ioctl) {
            this._ioctl.destroy();
            this._ioctl = null;
        }

        if (this._remuxer) {
            this._remuxer.destroy();
            this._remuxer = null;
        }

        this._emitter.removeAllListeners();
        this._emitter = null;
    }

    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    remux(audioTrack, videoTrack){
        this._remuxer.remux(audioTrack, videoTrack);
    }

    /*
    _loadSegment(segmentIndex, optionalFrom) {
        this._currentSegmentIndex = segmentIndex;
        let dataSource = this._mediaDataSource.segments[segmentIndex];

        let ioctl = this._ioctl = new IOController(dataSource, this._config, segmentIndex);
        ioctl.onError = this._onIOException.bind(this);
        ioctl.onSeeked = this._onIOSeeked.bind(this);
        ioctl.onComplete = this._onIOComplete.bind(this);
        ioctl.onRedirect = this._onIORedirect.bind(this);
        ioctl.onRecoveredEarlyEof = this._onIORecoveredEarlyEof.bind(this);

        if (optionalFrom) {
            this._demuxer.bindDataSource(this._ioctl);
        } else {
            ioctl.onDataArrival = this._onInitChunkArrival.bind(this);
        }

        ioctl.open(optionalFrom);
    }*/

    stop() {
        this._internalAbort();
        this._disableStatisticsReporter();
    }

    _internalAbort() {
        if (this._ioctl) {
            this._ioctl.destroy();
            this._ioctl = null;
        }
    }


    seek(milliseconds) {
        if (this._mediaInfo == null || !this._mediaInfo.isSeekable()) {
            return;
        }

        let targetSegmentIndex = this._searchSegmentIndexContains(milliseconds);

        if (targetSegmentIndex === this._currentSegmentIndex) {
            // intra-segment seeking
            let segmentInfo = this._mediaInfo.segments[targetSegmentIndex];

            if (segmentInfo == undefined) {
                // current segment loading started, but mediainfo hasn't received yet
                // wait for the metadata loaded, then seek to expected position
                this._pendingSeekTime = milliseconds;
            } else {
                let keyframe = segmentInfo.getNearestKeyframe(milliseconds);
                this._remuxer.seek(keyframe.milliseconds);
                this._ioctl.seek(keyframe.fileposition);
                // Will be resolved in _onRemuxerMediaSegmentArrival()
                this._pendingResolveSeekPoint = keyframe.milliseconds;
            }
        } else {
            // cross-segment seeking
            let targetSegmentInfo = this._mediaInfo.segments[targetSegmentIndex];

            if (targetSegmentInfo == undefined) {
                // target segment hasn't been loaded. We need metadata then seek to expected time
                this._pendingSeekTime = milliseconds;
                this._internalAbort();
                this._remuxer.seek();
                this._remuxer.insertDiscontinuity();
                this._loadSegment(targetSegmentIndex);
                // Here we wait for the metadata loaded, then seek to expected position
            } else {
                // We have target segment's metadata, direct seek to target position
                let keyframe = targetSegmentInfo.getNearestKeyframe(milliseconds);
                this._internalAbort();
                this._remuxer.seek(milliseconds);
                this._remuxer.insertDiscontinuity();
                this._demuxer.resetMediaInfo();
                this._demuxer.timestampBase = this._mediaDataSource.segments[targetSegmentIndex].timestampBase;
                this._loadSegment(targetSegmentIndex, keyframe.fileposition);
                this._pendingResolveSeekPoint = keyframe.milliseconds;
                this._reportSegmentMediaInfo(targetSegmentIndex);
            }
        }

        this._enableStatisticsReporter();
    }

    _searchSegmentIndexContains(milliseconds) {
        let segments = this._mediaDataSource.segments;
        let idx = segments.length - 1;

        for (let i = 0; i < segments.length; i++) {
            if (milliseconds < segments[i].timestampBase) {
                idx = i - 1;
                break;
            }
        }
        return idx;
    }

    _onInitChunkArrival() {


        let mds = this._mediaDataSource;
        if (mds.duration != undefined && !isNaN(mds.duration)) {
            this._demuxer.overridedDuration = mds.duration;
        }
        if (typeof mds.hasAudio === 'boolean') {
            this._demuxer.overridedHasAudio = mds.hasAudio;
        }
        if (typeof mds.hasVideo === 'boolean') {
            this._demuxer.overridedHasVideo = mds.hasVideo;
        }

        this._demuxer.timestampBase = mds.segments[this._currentSegmentIndex].timestampBase;

        this._demuxer.onError = this._onDemuxException.bind(this);
        this._demuxer.onMediaInfo = this._onMediaInfo.bind(this);
        this._demuxer.onMetaDataArrived = this._onMetaDataArrived.bind(this);
        this._demuxer.onScriptDataArrived = this._onScriptDataArrived.bind(this);

        this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival.bind(this);
        this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival.bind(this);

    }

    _onMediaInfo(mediaInfo) {
        if (this._mediaInfo == null) {
            // Store first segment's mediainfo as global mediaInfo
            this._mediaInfo = Object.assign({}, mediaInfo);
            this._mediaInfo.keyframesIndex = null;
            this._mediaInfo.segments = [];
            this._mediaInfo.segmentCount = this._mediaDataSource.segments.length;
            Object.setPrototypeOf(this._mediaInfo, media_info.prototype);
        }

        let segmentInfo = Object.assign({}, mediaInfo);
        Object.setPrototypeOf(segmentInfo, media_info.prototype);
        this._mediaInfo.segments[this._currentSegmentIndex] = segmentInfo;

        // notify mediaInfo update
        this._reportSegmentMediaInfo(this._currentSegmentIndex);

        if (this._pendingSeekTime != null) {
            Promise.resolve().then(() => {
                let target = this._pendingSeekTime;
                this._pendingSeekTime = null;
                this.seek(target);
            });
        }
    }

    _onMetaDataArrived(metadata) {
        this._emitter.emit(TransmuxingEvents.METADATA_ARRIVED, metadata);
    }

    _onScriptDataArrived(data) {
        this._emitter.emit(TransmuxingEvents.SCRIPTDATA_ARRIVED, data);
    }

    _onIOSeeked() {
        this._remuxer.insertDiscontinuity();
    }

    _onIOComplete(extraData) {
        let segmentIndex = extraData;
        let nextSegmentIndex = segmentIndex + 1;

        if (nextSegmentIndex < this._mediaDataSource.segments.length) {
            this._internalAbort();
            this._remuxer.flushStashedSamples();
            this._loadSegment(nextSegmentIndex);
        } else {
            this._remuxer.flushStashedSamples();
            this._emitter.emit(TransmuxingEvents.LOADING_COMPLETE);
            this._disableStatisticsReporter();
        }
    }

    _onIORedirect(redirectedURL) {
        let segmentIndex = this._ioctl.extraData;
        this._mediaDataSource.segments[segmentIndex].redirectedURL = redirectedURL;
    }

    _onIORecoveredEarlyEof() {
        this._emitter.emit(TransmuxingEvents.RECOVERED_EARLY_EOF);
    }

    _onIOException(type, info) {
        Log.e(this.TAG, `IOException: type = ${type}, code = ${info.code}, msg = ${info.msg}`);
        this._emitter.emit(TransmuxingEvents.IO_ERROR, type, info);
        this._disableStatisticsReporter();
    }

    _onDemuxException(type, info) {
        Log.e(this.TAG, `DemuxException: type = ${type}, info = ${info}`);
        this._emitter.emit(TransmuxingEvents.DEMUX_ERROR, type, info);
    }

    _onRemuxerInitSegmentArrival(type, initSegment) {
        this._emitter.emit(TransmuxingEvents.INIT_SEGMENT, type, initSegment);
    }

    _onRemuxerMediaSegmentArrival(type, mediaSegment) {
        if (this._pendingSeekTime != null) {
            // Media segments after new-segment cross-seeking should be dropped.
            return;
        }
        this._emitter.emit(TransmuxingEvents.MEDIA_SEGMENT, type, mediaSegment);

        // Resolve pending seekPoint
        if (this._pendingResolveSeekPoint != null && type === 'video') {
            let syncPoints = mediaSegment.info.syncPoints;
            let seekpoint = this._pendingResolveSeekPoint;
            this._pendingResolveSeekPoint = null;

            // Safari: Pass PTS for recommend_seekpoint
            if (Browser.safari && syncPoints.length > 0 && syncPoints[0].originalDts === seekpoint) {
                seekpoint = syncPoints[0].pts;
            }
            // else: use original DTS (keyframe.milliseconds)

            this._emitter.emit(TransmuxingEvents.RECOMMEND_SEEKPOINT, seekpoint);
        }
    }

    _enableStatisticsReporter() {
        if (this._statisticsReporter == null) {
            this._statisticsReporter = self.setInterval(
                this._reportStatisticsInfo.bind(this),
                this._config.statisticsInfoReportInterval);
        }
    }

    _disableStatisticsReporter() {
        if (this._statisticsReporter) {
            self.clearInterval(this._statisticsReporter);
            this._statisticsReporter = null;
        }
    }

    _reportSegmentMediaInfo(segmentIndex) {
        let segmentInfo = this._mediaInfo.segments[segmentIndex];
        let exportInfo = Object.assign({}, segmentInfo);

        exportInfo.duration = this._mediaInfo.duration;
        exportInfo.segmentCount = this._mediaInfo.segmentCount;
        delete exportInfo.segments;
        delete exportInfo.keyframesIndex;

        this._emitter.emit(TransmuxingEvents.MEDIA_INFO, exportInfo);
    }

    _reportStatisticsInfo() {
        let info = {};

        info.url = this._ioctl.currentURL;
        info.hasRedirect = this._ioctl.hasRedirect;
        if (info.hasRedirect) {
            info.redirectedURL = this._ioctl.currentRedirectedURL;
        }

        info.speed = this._ioctl.currentSpeed;
        info.loaderType = this._ioctl.loaderType;
        info.currentSegmentIndex = this._currentSegmentIndex;
        info.totalSegmentCount = this._mediaDataSource.segments.length;

        this._emitter.emit(TransmuxingEvents.STATISTICS_INFO, info);
    }

}

/* harmony default export */ const transmuxer = (Transmuxer);

;// CONCATENATED MODULE: ./webrtmp.js







class WebRTMP{
	TAG = 'WebRTMP';

	constructor() {
		this.wss = new connection_controller();

		this.wss.addEventListener("Connected", ()=>{
			logger.d(this.TAG, "Connected");
		});

		this.wss.addEventListener("RTMPConnected", ()=>{
			logger.d(this.TAG,"RTMPConnected");
		});

		this.wss.addEventListener("RTMPMessageArrived", (data)=>{
			logger.d(this.TAG,"RTMPMessageArrived", data);
		});


		this.wss.addEventListener("ProtocolControlMessage", (data)=>{
			logger.d(this.TAG,"ProtocolControlMessage", data);
		});

		this.wss.addEventListener("UserControlMessage", (data)=>{
			logger.d(this.TAG,"UserControlMessage", data);
		});

		this.wss.addEventListener("Started", ()=>{});

		this.wss.addEventListener("onDataAvailable", (audioTrack, videoTrack)=>{
			this._transmuxer.remux(audioTrack, videoTrack);
		});

		this.wss.addEventListener("onTrackMetaData", (type, metadata)=>{
			this._transmuxer._onMetaDataArrived(metadata);
		});

		this.wss.addEventListener("onMediaInfo", (mediaInfo)=>{
			this._transmuxer._onMediaInfo(mediaInfo);
		});

		this.wss.addEventListener("ConnectionLost", ()=>{});

		this.wss.addEventListener("ConnectionLost", ()=>{});

		this._emitter = new event_emitter();

		this.e = {
			onvLoadedMetadata: this._onvLoadedMetadata.bind(this),
			onvSeeking: this._onvSeeking.bind(this),
			onvCanPlay: this._onvCanPlay.bind(this),
			onvStalled: this._onvStalled.bind(this),
			onvProgress: this._onvProgress.bind(this)
		};

		this._config = defaultConfig;
		if (typeof config === 'object') {
			Object.assign(this._config, config);
		}

		this._transmuxer = new transmuxer(this._config);
	}

	_onvLoadedMetadata(e) {
		if (this._pendingSeekTime != null) {
			this._mediaElement.currentTime = this._pendingSeekTime;
			this._pendingSeekTime = null;
		}
	}

	_onvCanPlay(e) {
		this._receivedCanPlay = true;
		this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
	}

	_onvStalled(e) {
		//this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress(e) {
		//this._checkAndResumeStuckPlayback();
	}

	_onvSeeking(){

	}

	_onmseBufferFull() {
		logger.v(this.TAG, 'MSE SourceBuffer is full, suspend transmuxing task');
		if (this._progressChecker == null) {
			this._suspendTransmuxer();
		}
	}

	_onmseUpdateEnd() {
		if (!this._config.lazyLoad || this._config.isLive) {
			return;
		}

		let buffered = this._mediaElement.buffered;
		let currentTime = this._mediaElement.currentTime;
		let currentRangeStart = 0;
		let currentRangeEnd = 0;

		for (let i = 0; i < buffered.length; i++) {
			let start = buffered.start(i);
			let end = buffered.end(i);
			if (start <= currentTime && currentTime < end) {
				currentRangeStart = start;
				currentRangeEnd = end;
				break;
			}
		}

		if (currentRangeEnd >= currentTime + this._config.lazyLoadMaxDuration && this._progressChecker == null) {
			logger.v(this.TAG, 'Maximum buffering duration exceeded, suspend transmuxing task');
			this._suspendTransmuxer();
		}
	}


	destroy() {
		if (this._progressChecker != null) {
			window.clearInterval(this._progressChecker);
			this._progressChecker = null;
		}
		if (this._transmuxer) {
			this.unload();
		}
		if (this._mediaElement) {
			this.detachMediaElement();
		}
		this.e = null;
		this._mediaDataSource = null;

		this._emitter.removeAllListeners();
		this._emitter = null;
	}

	disconnect(){
		this.wss.disconnect();
	}

	play(streamName){
		this.wss.play(streamName);
	}

	connect(appName){
		this.wss.connect(appName);
	}

	pause(enable){
		this.wss.connect(enable);
	}

	detachMediaElement() {
		if (this._mediaElement) {
			this._msectl.detachMediaElement();
			this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
			this._mediaElement.removeEventListener('seeking', this.e.onvSeeking);
			this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
			this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			this._mediaElement = null;
		}

		if (this._msectl) {
			this._msectl.destroy();
			this._msectl = null;
		}
	}

	attachMediaElement(mediaElement) {
		this._mediaElement = mediaElement;
		mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);
		mediaElement.addEventListener('seeking', this.e.onvSeeking);
		mediaElement.addEventListener('canplay', this.e.onvCanPlay);
		mediaElement.addEventListener('stalled', this.e.onvStalled);
		mediaElement.addEventListener('progress', this.e.onvProgress);

		this._msectl = new mse_controller(this._config);

		this._msectl.on(MSEEvents.UPDATE_END, this._onmseUpdateEnd.bind(this));
		this._msectl.on(MSEEvents.BUFFER_FULL, this._onmseBufferFull.bind(this));
		this._msectl.on(MSEEvents.SOURCE_OPEN, () => {
			this._mseSourceOpened = true;
			if (this._hasPendingLoad) {
				this._hasPendingLoad = false;
				this.load();
			}
		});
		this._msectl.on(MSEEvents.ERROR, (info) => {
			this._emitter.emit(PlayerEvents.ERROR,
				ErrorTypes.MEDIA_ERROR,
				ErrorDetails.MEDIA_MSE_ERROR,
				info
			);
		});

		this._msectl.attachMediaElement(mediaElement);

		if (this._pendingSeekTime != null) {
			try {
				mediaElement.currentTime = this._pendingSeekTime;
				this._pendingSeekTime = null;
			} catch (e) {
				// IE11 may throw InvalidStateError if readyState === 0
				// We can defer set currentTime operation after loadedmetadata
			}
		}


		this._transmuxer.on(TransmuxingEvents.INIT_SEGMENT, (type, is) => {
			this._msectl.appendInitSegment(is);
		});
		this._transmuxer.on(TransmuxingEvents.MEDIA_SEGMENT, (type, ms) => {
			this._msectl.appendMediaSegment(ms);

			// lazyLoad check
			if (this._config.lazyLoad && !this._config.isLive) {
				let currentTime = this._mediaElement.currentTime;
				if (ms.info.endDts >= (currentTime + this._config.lazyLoadMaxDuration) * 1000) {
					if (this._progressChecker == null) {
						logger.v(this.TAG, 'Maximum buffering duration exceeded, suspend transmuxing task');
						this._suspendTransmuxer();
					}
				}
			}
		});
	}
}
logger.LEVEL = logger.DEBUG;

/* harmony default export */ const webrtmp = (WebRTMP);

window["Log"] = logger;
window["webrtmp"] = new WebRTMP();


/******/ })()
;
//# sourceMappingURL=webrtmp.js.map