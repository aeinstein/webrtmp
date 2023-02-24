(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webrtmp"] = factory();
	else
		root["webrtmp"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***************************************************!*\
  !*** ./src/wss/connection.worker.js + 26 modules ***!
  \***************************************************/

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

;// CONCATENATED MODULE: ./src/wss/WSSConnectionManager.js
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



class WSSConnectionManager{
    TAG = "WSSConnectionManager";
    host;
    port;
    wss;

    /**
     *
     * @param {String} host
     * @param {Number} port
     * @param callback
     */
    open(host, port, callback){
        this.host = host;
        logger.v(this.TAG, "connecting to: " + host + ":" + port);
        this.wss = new WebSocket("wss://" + host + ":" + port + "/");

        this.wss.binaryType = "arraybuffer";

        this.wss.onopen = (e)=>{
            logger.v(this.TAG, e);
            callback(true);
        }

        this.wss.onclose = (e)=>{
            logger.w(this.TAG, e);
            postMessage(["ConnectionLost"]);
        }

        this.wss.onerror = (e)=>{
            logger.e(this.TAG, e);
            callback(false);
        }
    }

    registerMessageHandler(cb){
        this.wss.onmessage = cb;
    }

    getSocket(){
        return this.wss;
    }

    getHost(){
        return this.host;
    }

    /**
     * close Websocket
     */
    close(){
        this.wss.close();
    }
}

/* harmony default export */ const wss_WSSConnectionManager = (WSSConnectionManager);

;// CONCATENATED MODULE: ./src/rtmp/RTMPHandshake.js
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



class RTMPHandshake{
    TAG = "RTMPHandshake";
    state = 0;
    onHandshakeDone = null;
    c1;
    c2;

    /**
     *
     * @param {WebSocket} socket
     */
    constructor(socket) {
        this.socket = socket;

        this.socket.onmessage = (e)=>{
            logger.v(this.TAG, e.data);
            this.processServerInput(new Uint8Array(e.data));
        }
    }

    /**
     * Do RTMP Handshake
     */
    do(){
        if(!this.onHandshakeDone) {
            logger.e(this.TAG, "onHandshakeDone not defined");
            return;
        }

        logger.v(this.TAG, "send C0");
        this.socket.send(new Uint8Array([0x03]));
        this.state = 1;

        logger.v(this.TAG, "send C1");
        this.socket.send(this._generateC1());
        this.state = 2;
    }

    _generateC1(){
        const c1 = new Uint8Array(1536);

        for(let i = 0; i < c1.length; i++) {
            c1[i] = Math.floor(Math.random() * 256);
        }

        let time = Math.round(Date.now() / 1000);

        c1[0] = (time >>> 24);
        c1[1] = (time >>> 16);
        c1[2] = (time >>> 8);
        c1[3] = (time);

        c1[4] = 0;
        c1[5] = 0;
        c1[6] = 0;
        c1[7] = 0;

        this.c1 = c1;
        return c1;
    }

    _generateC2(s1){
        this.c2 = s1;
        return this.c2;
    }

    /**
     *
     * @param {Uint8Array} data
     * @private
     */
    _parseS0(data){
        logger.v(this.TAG, "S0: ", data);

        if(data[0] !== 0x03) {
            logger.e(this.TAG, "S0 response not 0x03");

        } else {
            logger.v(this.TAG, "1st Byte OK");
        }

        this.state = 3;

        if(data.length > 1) {
            logger.v(this.TAG, "S1 included");
            this._parseS1(data.slice(1));
        }
    }

    /**
     *
     * @param {Uint8Array} data
     * @private
     */
    _parseS1(data){
        logger.v(this.TAG, "parse S1: ", data);
        this.state = 4;

        let s1 = data.slice(0, 1536);

        logger.v(this.TAG, "send C2");
        this.socket.send(this._generateC2(s1));

        this.state = 5;

        if(data.length > 1536) {
            logger.v(this.TAG, "S2 included: " + data.length);
            this._parseS2(data.slice(1536));
        }
    }

    /**
     *
     * @param {Uint8Array} data
     * @private
     */
    _parseS2(data) {
        logger.v(this.TAG, "parse S2: ", data);

        if(!this._compare(this.c1, data)) {
            logger.e(this.TAG, "C1 S1 not equal");
            this.onHandshakeDone(false);
            return;
        }

        this.state = 6;

        logger.v(this.TAG, "RTMP Connection established");

        this.onHandshakeDone(true);
    }

    _compare(ar1, ar2){
        for(let i = 0; i < ar1.length; i++){
            if(ar1[i] !== ar2[i]) return false;
        }

        return true;
    }


    /**
     *
     * @param {Uint8Array} data
     */
    processServerInput(data){
        switch(this.state){
            case 2:		//
                this._parseS0(data);
                break;

            case 3:
                this._parseS1(data);
                break;

            case 5:
                this._parseS2(data);
                break;
        }
    }
}

/* harmony default export */ const rtmp_RTMPHandshake = (RTMPHandshake);

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

;// CONCATENATED MODULE: ./src/rtmp/RTMPMessage.js
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




class RTMPMessage{
	TAG = "RTMPMessage";

    static MessageTypes = ["dummy", "PCMSetChunkSize", "PCMAbortMessage", "PCMAcknolegement", "UserControlMessage", "WindowAcknowledgementSize", "PCMSetPeerBandwidth",
        "dummy", "AudioMessage", "VideoMessage", "dummy", "dummy", "dummy", "dummy", "dummy", "DataMessageAMF3", "Shared Object Message AMF3", "CommandMessageAMF3",
        "DataMessageAMF0", "SharedObjectMessageAMF0", "CommandMessageAMF0", "dummy", "Aggregate Message"];

    messageType;
	messageLength = 0;
    length = 0;
	timestamp = 0;
    extendedTimestamp = false;
	message_stream_id = 0;
	payload = new Uint8Array(0);

    /**
     *
     * @param {Uint8Array} payload
     */
	constructor(payload) {
        if(payload) {
			this.setMessageLength(payload.length);
            this.addPayload(payload);
        }
	}

	clearPayload(){
		this.payload = new Uint8Array(0);
	}

    /**
     *
     * @returns {Uint8Array}
     */
	getBytes(){
		this.header = new Uint8Array(11);
		this.header[0] = this.messageType;

		this.header[1] = (this.length >>> 16);
		this.header[2] = (this.length >>> 8);
		this.header[3] = (this.length);

		this.header[4] = (this.timestamp >>> 24);
		this.header[5] = (this.timestamp >>> 16);
		this.header[6] = (this.timestamp >>> 8);
		this.header[7] = (this.timestamp);

		this.header[8] = (this.message_stream_id >>> 16);
		this.header[9] = (this.message_stream_id >>> 8);
		this.header[10] = (this.message_stream_id);

		return _concatArrayBuffers(this.header, this.payload);
	}

	/**
	 *
	 * @param {Number} message_type
	 */
    setMessageType(message_type){
        this.messageType = message_type;
        switch(message_type){
            case 1:		// setBandwidth
            case 2:
            case 3:
            case 4:     // UserControlMSG
            case 5:
            case 6:
                this.message_stream_id = 0;
                break;
        }
    }

	getMessageType(){
		return this.messageType;
	}

    getMessageStreamID(){
        return this.message_stream_id;
    }

	setMessageStreamID(messageStreamID) {
		this.message_stream_id = messageStreamID;
	}

	getPayloadlength(){
		return this.payload.length;
	}

    getTimestamp(){
        return this.timestamp;
    }

	setMessageTimestamp(timestamp) {
		logger.v(this.TAG, "TS: " + timestamp);
		this.timestamp = timestamp;
	}

    /**
     *
     * @param {boolean} yes
     */
    setExtendedTimestamp(yes){
		logger.w(this.TAG, "setExtendedTimestamp");
        this.extendedTimestamp = yes;
    }

    getExtendedTimestamp(){
        return this.extendedTimestamp;
    }

	setTimestampDelta(timestamp_delta){
		logger.v(this.TAG, "TS: " + this.timestamp + " Delta: " + timestamp_delta);
		this.timestamp += timestamp_delta;
	}

	/**
	 *
	 * @param {Uint8Array} data
	 */
	addPayload(data){
		if(data.length > this.bytesMissing()) {
			logger.e(this.TAG, "try to add too much data");
			return;
		}

		this.payload = _concatArrayBuffers(this.payload, data);
		this.length = this.payload.length;
		logger.d(this.TAG, "[ RTMPMessage ] payload size is now: " + this.length);
	}

	getPayload(){
		return this.payload;
	}

    setMessageLength(message_length) {
        this.messageLength = message_length;
    }

	getMessageLength(){
		return this.messageLength;
	}

	isComplete(){
		if(this.payload.length === this.messageLength) return true;
		return false;
	}

	bytesMissing(){
		return this.messageLength - this.payload.length;
	}
}

/* harmony default export */ const rtmp_RTMPMessage = (RTMPMessage);

;// CONCATENATED MODULE: ./src/rtmp/Chunk.js

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




class Chunk{
    TAG = "Chunk";
    chunk_stream_id = 0;

    length;

    message_type;
    message_stream_id = 0;

    timestamp;
    CHUNK_SIZE = 128;
    payload;

    /**
     * @param {RTMPMessage} message
     */
    constructor(message) {  // RTMP Message
        this.payload = message.getPayload();
        this.length = this.payload.length;
        this.message_type = message.getMessageType();
        this.message_stream_id = message.getMessageStreamID();
    }

    /**
     *
     * @returns {Uint8Array}
     */
    getBytes(){
        let p = new Uint8Array(this.payload);

        let ret = new Uint8Array(0);
        let fmt = 0;

        do {
            logger.d(this.TAG, "create chunk: " + p.length);
            ret = _concatArrayBuffers(ret, this._getHeaderBytes(fmt), p.slice(0,this.CHUNK_SIZE));
            p = p.slice(this.CHUNK_SIZE);
            fmt = 0x3;	// next chunk without header

        } while(p.length > 0);

        return ret;
    }

    /**
     *
     * @param {Number} fmt
     * @returns {Uint8Array}
     * @private
     */
    _getHeaderBytes(fmt){
        let basic_header;
        let header;

        if(this.chunk_stream_id < 63) {
            basic_header = new Uint8Array(1);
            basic_header[0] = (fmt << 6) | this.chunk_stream_id;

        } else if(this.chunk_stream_id < 65599) {
            basic_header = new Uint8Array(2);
            basic_header[0] = (fmt << 6);
            basic_header[1] = (this.chunk_stream_id -64);

        } else {
            basic_header = new Uint8Array(3);
            basic_header[0] = (fmt << 6) | 63;
            basic_header[1] = ((this.chunk_stream_id -64) >>> 8);
            basic_header[2] = ((this.chunk_stream_id -64));
        }

        switch(fmt){
            case 0x0:
                header = new Uint8Array(11);
                header[0] = (this.timestamp >>> 16);
                header[1] = (this.timestamp >>> 8);
                header[2] = (this.timestamp);

                header[3] = (this.length >>> 16);
                header[4] = (this.length >>> 8);
                header[5] = (this.length);

                header[6] = (this.message_type);

                header[7] = (this.message_stream_id >>> 24);
                header[8] = (this.message_stream_id >>> 16);
                header[9] = (this.message_stream_id >>> 8);
                header[10] = (this.message_stream_id);
                break;

            case 0x1:
                header = new Uint8Array(7);
                header[0] = (this.timestamp >>> 16);
                header[1] = (this.timestamp >>> 8);
                header[2] = (this.timestamp);

                header[3] = (this.length >>> 16);
                header[4] = (this.length >>> 8);
                header[5] = (this.length);

                header[6] = (this.message_type);
                break;


            case 0x2:
                header = new Uint8Array(3);
                header[0] = (this.timestamp >>> 16);
                header[1] = (this.timestamp >>> 8);
                header[2] = (this.timestamp);
                break;

            case 0x3:
                header = new Uint8Array(0);
                break;
        }

        return _concatArrayBuffers(basic_header, header);
    }

    getPayload(){
        return this.payload;
    }

    getMessageType(){
        return this.message_type;
    }

    getMessageStreamID() {
        return this.message_stream_id;
    }

    setChunkSize(size){
        this.CHUNK_SIZE = size;
    }

    /**
     *
     * @param {Number} chunk_stream_id
     */
    setChunkStreamID(chunk_stream_id) {
        logger.d(this.TAG, "setChunkStreamID:" + chunk_stream_id);
        this.chunk_stream_id = chunk_stream_id;
    }

    /**
     *
     * @param {Number} message_stream_id
     */
    setMessageStreamID(message_stream_id) {
        this.message_stream_id = message_stream_id;
    }

    /**
     *
     * @param {Number} timestamp
     */
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    }
}

/* harmony default export */ const rtmp_Chunk = (Chunk);

;// CONCATENATED MODULE: ./src/rtmp/UserControlMessage.js
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

class UserControlMessage{
    event_type;
    event_data1;
    event_data2;

    static events = ["StreamBegin", "StreamEOF", "StreamDry", "SetBuffer", "StreamIsRecorded", "dummy", "PingRequest", "PingResponse"];

    /**
     *
     * @returns {Uint8Array}
     */
    getBytes(){
        let ret;

        if(this.event_data2) {
            ret = new Uint8Array(10);
            ret[0] = (this.event_type >>> 8);
            ret[1] = (this.event_type);

            ret[2] = (this.event_data1 >>> 24);
            ret[3] = (this.event_data1 >>> 16);
            ret[4] = (this.event_data1 >>> 8);
            ret[5] = (this.event_data1);

            ret[6] = (this.event_data2 >>> 24);
            ret[7] = (this.event_data2 >>> 16);
            ret[8] = (this.event_data2 >>> 8);
            ret[9] = (this.event_data2);

        } else {
            ret = new Uint8Array(6);
            ret[0] = (this.event_type >>> 8);
            ret[1] = (this.event_type);

            ret[2] = (this.event_data1 >>> 24);
            ret[3] = (this.event_data1 >>> 16);
            ret[4] = (this.event_data1 >>> 8);
            ret[5] = (this.event_data1);
        }

        return ret;
    }

    getEventMessage(){
        let o = {};

        if(this.event_type === 3) {
            o[UserControlMessage.events[this.event_type]] = [this.event_data1, this.event_data2];
        } else {
            o[UserControlMessage.events[this.event_type]] = this.event_data1;
        }

        return o;
    }

    setType(event_type){
        this.event_type = event_type;
    }

    setEventData(event_data){
        this.event_data1 = event_data;
    }
}

/* harmony default export */ const rtmp_UserControlMessage = (UserControlMessage);

;// CONCATENATED MODULE: ./src/rtmp/ProtocolControlMessage.js
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



class ProtocolControlMessage{
    TAG = "ProtocolControlMessage";
    pcm_type;
    data;

    static pcm_types = ["dummy", "SetChunkSize", "AbortMessage", "Acknowledgement", "UserControlMessage", "WindowAcknowledgementSize", "SetPeerBandwidth"];

    constructor(pcm_type, data) {
        switch(pcm_type){
        case 1:
        case 2:
        case 3:
        case 5:
            this.pcm_type = pcm_type;
            this.data = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            break;

        case 6:
            logger.w(this.TAG, "Protocol Control Message Type: " + pcm_type + " use SetPeerBandwidthMessage");
            break;

        default:
            logger.e(this.TAG, "Protocol Control Message Type: " + pcm_type + " not supported");
            break;
        }
    }

    setPayload(data){
        this.data = data;
    }

    getEventMessage(){
        let o = {};
        o[ProtocolControlMessage.pcm_types[this.pcm_type]] = this.data;
        return o;
    }

    getBytes(){
        let ret = [];

        ret[0] = (this.data >>> 24);
        ret[1] = (this.data >>> 16);
        ret[2] = (this.data >>> 8);
        ret[3] = (this.data);

        return new Uint8Array(ret);
    }
}
/* harmony default export */ const rtmp_ProtocolControlMessage = (ProtocolControlMessage);

;// CONCATENATED MODULE: ./src/rtmp/NetConnection.js
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






class NetConnection{
    TAG = "NetConnection";
    WindowAcknowledgementSize;
    MessageStreamID;
    CHUNK_SIZE = 128;
    BandWidth;
    socket;

    /**
     *
     * @param {Number} message_stream_id
     * @param {RTMPMessageHandler} handler
     */
    constructor(message_stream_id, handler) {
        this.MessageStreamID = message_stream_id;

        logger.d(this.TAG, handler);

        this.handler = handler;
        this.socket = handler.socket;
    }

    /**
     *
     * @param {RTMPMessage} message
     */
    parseMessage(message){      // RTMPMessage
        let data = message.getPayload();

        switch(message.getMessageType()){
        case 1:         // PCM Set Chunk Size
            this.CHUNK_SIZE = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            this.handler.setChunkSize(this.CHUNK_SIZE)
            break;

        case 2:         // PCM Abort Message
        case 3:         // PCM Acknowledgement
        case 5:         // PCM Window Acknowledgement Size
            this.WindowAcknowledgementSize = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            logger.i(this.TAG, "WindowAcknowledgementSize: " + this.WindowAcknowledgementSize);
            break;

        case 6:         // PCM Set Peer Bandwidth
            this.BandWidth = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            logger.i(this.TAG, "SetPeerBandwidth: " + this.BandWidth);

            // send Window Ack Size
            let msg = new rtmp_ProtocolControlMessage(0x05, this.WindowAcknowledgementSize);

            let m2 = new rtmp_RTMPMessage(msg.getBytes());
            m2.setMessageType(0x05)     // WinACKSize

            const chunk = new rtmp_Chunk(m2);
            chunk.setChunkStreamID(2);  // Control Channel

            logger.i(this.TAG, "send WindowAcksize");
            this.socket.send(chunk.getBytes());

            break;

        default:
            break;
        }
    }
}

/* harmony default export */ const rtmp_NetConnection = (NetConnection);

;// CONCATENATED MODULE: ./src/rtmp/ChunkParser.js
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





class ChunkParser {
    TAG = "ChunkParser";

    /**
     *
     * @type {number}
     */
	static CHUNK_SIZE = 128;
    chunkstreams = [];

    /**
     * @type {Uint8Array}
     */
    buffer = new Uint8Array(0);

    /**
     *
     * @param {RTMPMessageHandler} conn_worker
     */
	constructor(conn_worker) {
        this.conn_worker = conn_worker;
    }

    /**
     * @param {Uint8Array} newdata
     */
    parseChunk(newdata){
        let msg;
        let timestamp;
        let fmt;

        this.buffer = _concatArrayBuffers(this.buffer, newdata);      // Neues Packet an Buffer anfügen

        do {
            logger.d(this.TAG, "buffer length: " + this.buffer.length);

            if(this.buffer.length < 100) logger.d(this.TAG, this.buffer);

            /**
             *
             * @type {Uint8Array}
             */
            let data = this.buffer;
            let header_length = 0;
            let message_length = 0;
            let payload_length = 0;

            // Message Header Type
            fmt = ((data[0] & 0xC0) >>> 6);  // upper 2 bit

            // Basic Header ChunkID
            let csid = data[header_length++] & 0x3f;	// lower 6 bits

            if(csid === 0) {					// csid is 14bit
                csid = data[header_length++] + 64;

            } else if (csid === 1) {			// csid is 22bit
                csid = data[header_length++] * 256 + data[header_length++] + 64;
            }

            logger.d(this.TAG, "chunk type: ", fmt, " StreamID: " + csid);

            let payload;

            // Message
            switch(fmt) {
                case 0:		// 11 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp
                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte Message length

                msg = new rtmp_RTMPMessage();
                msg.setMessageType(data[header_length++]);                // 1 byte msg type
                msg.setMessageStreamID((data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]));	// 4 byte Message stream id
                msg.setMessageLength(message_length);

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);
                    msg.setExtendedTimestamp(true);
                }

                msg.setMessageTimestamp(timestamp);

                logger.d(this.TAG, "message_length: " + message_length);

                this.chunkstreams[csid] = msg;
                break;

            case 1:		// 7 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp
                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte Message length

                msg = this.chunkstreams[csid];
                msg.setMessageType(data[header_length++]);
                msg.setMessageLength(message_length);

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);
                    msg.setExtendedTimestamp(true);
                } else {
                    msg.setExtendedTimestamp(false);
                }

                msg.setTimestampDelta(timestamp);

                logger.d(this.TAG, "message_length: " + message_length);

                this.chunkstreams[csid] = msg;
                break;

            case 2:		// 3 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp delta

                msg = this.chunkstreams[csid];

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);
                    msg.setExtendedTimestamp(true);

                } else {
                    msg.setExtendedTimestamp(false);
                }

                msg.setTimestampDelta(timestamp);

                break;

            case 3:		// 0 byte
                msg = this.chunkstreams[csid];

                // extended timestamp is present when setted in the chunk stream
                if(msg.getExtendedTimestamp()) {
                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);
                    msg.setTimestampDelta(timestamp);
                }

                break;
            }

            if(!msg) {
                logger.e(this.TAG, "No suitable RTMPMessage found");
            }



            payload_length = this.chunkstreams[csid].bytesMissing();

            if(payload_length > this.CHUNK_SIZE) payload_length = this.CHUNK_SIZE;      // Max. CHUNK_SIZE erwarten

            payload = data.slice(header_length, header_length +payload_length);

            // sind genug bytes für das chunk da?
            if(payload.length < payload_length){
                logger.d(this.TAG, "packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                return;
            }

            this.chunkstreams[csid].addPayload(payload);

            if(this.chunkstreams[csid].isComplete()) {     // Message complete
                logger.d(this.TAG, "RTMP: ", msg.getMessageType(), rtmp_RTMPMessage.MessageTypes[msg.getMessageType()], msg.getPayloadlength(), msg.getMessageStreamID());
                this.conn_worker.onMessage(this.chunkstreams[csid]);
                this.chunkstreams[csid].clearPayload();
            }

            let consumed = (header_length + payload_length);

            if(consumed > this.buffer.length) {
                logger.w(this.TAG, "mehr abschneiden als da");
            }

            this.buffer = this.buffer.slice(consumed);
            logger.d(this.TAG, "consumed: " + consumed + " bytes, rest: " + this.buffer.length);

        } while(this.buffer.length > 11);   // minimum size

        logger.d(this.TAG, "parseChunk complete");
    }



    /**
     *
     * @param {Number} size
     */
    setChunkSize(size){
        logger.d(this.TAG, "SetChunkSize: " + size);
        this.CHUNK_SIZE = size;
    }
}

/* harmony default export */ const rtmp_ChunkParser = (ChunkParser);

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

;// CONCATENATED MODULE: ./src/formats/media-info.js
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

;// CONCATENATED MODULE: ./src/utils/utf8-conv.js
/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * This file is derived from C++ project libWinTF8 (https://github.com/m13253/libWinTF8)
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

function checkContinuation(uint8array, start, checkLength) {
    let array = uint8array;
    if (start + checkLength < array.length) {
        while (checkLength--) {
            if ((array[++start] & 0xC0) !== 0x80)
                return false;
        }
        return true;
    } else {
        return false;
    }
}

function decodeUTF8(uint8array) {
    let out = [];
    let input = uint8array;
    let i = 0;
    let length = uint8array.length;

    while (i < length) {
        if (input[i] < 0x80) {
            out.push(String.fromCharCode(input[i]));
            ++i;
            continue;
        } else if (input[i] < 0xC0) {
            // fallthrough
        } else if (input[i] < 0xE0) {
            if (checkContinuation(input, i, 1)) {
                let ucs4 = (input[i] & 0x1F) << 6 | (input[i + 1] & 0x3F);
                if (ucs4 >= 0x80) {
                    out.push(String.fromCharCode(ucs4 & 0xFFFF));
                    i += 2;
                    continue;
                }
            }
        } else if (input[i] < 0xF0) {
            if (checkContinuation(input, i, 2)) {
                let ucs4 = (input[i] & 0xF) << 12 | (input[i + 1] & 0x3F) << 6 | input[i + 2] & 0x3F;
                if (ucs4 >= 0x800 && (ucs4 & 0xF800) !== 0xD800) {
                    out.push(String.fromCharCode(ucs4 & 0xFFFF));
                    i += 3;
                    continue;
                }
            }
        } else if (input[i] < 0xF8) {
            if (checkContinuation(input, i, 3)) {
                let ucs4 = (input[i] & 0x7) << 18 | (input[i + 1] & 0x3F) << 12
                    | (input[i + 2] & 0x3F) << 6 | (input[i + 3] & 0x3F);
                if (ucs4 > 0x10000 && ucs4 < 0x110000) {
                    ucs4 -= 0x10000;
                    out.push(String.fromCharCode((ucs4 >>> 10) | 0xD800));
                    out.push(String.fromCharCode((ucs4 & 0x3FF) | 0xDC00));
                    i += 4;
                    continue;
                }
            }
        }
        out.push(String.fromCharCode(0xFFFD));
        ++i;
    }

    return out.join('');
}

;// CONCATENATED MODULE: ./src/flv/amf-parser.js
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






let le = (function () {
    let buf = new ArrayBuffer(2);
    (new DataView(buf)).setInt16(0, 256, true);  // little-endian write
    return (new Int16Array(buf))[0] === 256;  // platform-spec read, if equal then LE
})();

class AMF {
    static TAG = "AMF";

    /**
     *
     * @param {Uint8Array} array
     * @returns {{}}
     */
    static parseScriptData(array) {
        logger.d(this.TAG, array);

        let data = {};

        try {
            let name = AMF.parseValue(array);
            logger.d(this.TAG, name);

            let value = AMF.parseValue(array.slice(name.size));
            logger.d(this.TAG, value);

            data[name.data] = value.data;

        } catch (e) {
            logger.w(this.TAG, e.toString());
        }

        return data;
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: {name: string, value: {}}, size: number, objectEnd: boolean}}
     */
    static parseObject(array) {
        if (array.length < 3) {
            throw new IllegalStateException('Data not enough when parse ScriptDataObject');
        }
        let name = AMF.parseString(array);
        let value = AMF.parseValue(array.slice(name.size, array.length - name.size));
        let isObjectEnd = value.objectEnd;

        return {
            data: {
                name: name.data,
                value: value.data
            },
            size: name.size + value.size,
            objectEnd: isObjectEnd
        };
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: {name: string, value: {}}, size: number, objectEnd: boolean}}
     */
    static parseVariable(array) {
        return AMF.parseObject(array);
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: string, size: number}}
     */
    static parseString(array) {
        if (array.length < 2) {
            throw new IllegalStateException('Data not enough when parse String');
        }
        let v = new DataView(array.buffer);
        let length = v.getUint16(0, !le);

        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(array.slice(2, 2 + length)));
        } else {
            str = '';
        }

        return {
            data: str,
            size: 2 + length
        };
    }

    static parseLongString(array) {
        if (array.length() < 4) {
            throw new IllegalStateException('Data not enough when parse LongString');
        }
        let v = new DataView(array.buffer);
        let length = v.getUint32(0, !le);

        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(array.slice(4, 4 +length)));
        } else {
            str = '';
        }

        return {
            data: str,
            size: 4 + length
        };
    }

    static parseDate(array) {
        if (array.length() < 10) {
            throw new IllegalStateException('Data size invalid when parse Date');
        }
        let v = new DataView(array.buffer);
        let timestamp = v.getFloat64(0, !le);
        let localTimeOffset = v.getInt16(8, !le);
        timestamp += localTimeOffset * 60 * 1000;  // get UTC time

        return {
            data: new Date(timestamp),
            size: 8 + 2
        };
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: {}, size: number, objectEnd: boolean}}
     */
    static parseValue(array) {
        if (array.length < 1) {
            throw new IllegalStateException('Data not enough when parse Value');
        }

        let v = new DataView(array.buffer);

        let offset = 1;
        let type = v.getUint8(0);
        let value;
        let objectEnd = false;

        try {
            switch (type) {
                case 0:  // Number(Double) type
                    value = v.getFloat64(1, !le);
                    offset += 8;
                    break;
                case 1: {  // Boolean type
                    let b = v.getUint8(1);
                    value = b ? true : false;
                    offset += 1;
                    break;
                }
                case 2: {  // String type
                    let amfstr = AMF.parseString(array.slice(1));
                    value = amfstr.data;
                    offset += amfstr.size;
                    break;
                }
                case 3: { // Object(s) type
                    value = {};
                    let terminal = 0;  // workaround for malformed Objects which has missing ScriptDataObjectEnd
                    if ((v.getUint32(array.length - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (offset < array.length - 4) {  // 4 === type(UI8) + ScriptDataObjectEnd(UI24)
                        let amfobj = AMF.parseObject(array.slice(offset, offset + array.length - terminal));
                        if (amfobj.objectEnd)
                            break;
                        value[amfobj.data.name] = amfobj.data.value;
                        offset += amfobj.size;
                    }
                    if (offset <= array.length - 3) {
                        let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            offset += 3;
                        }
                    }
                    break;
                }
                case 8: { // ECMA array type (Mixed array)
                    value = {};
                    offset += 4;  // ECMAArrayLength(UI32)
                    let terminal = 0;  // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd
                    if ((v.getUint32(array.length - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (offset < array.length - 8) {  // 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)
                        let amfvar = AMF.parseVariable(array.slice(offset, offset + array.length - terminal));
                        if (amfvar.objectEnd)
                            break;
                        value[amfvar.data.name] = amfvar.data.value;
                        offset += amfvar.size;
                    }
                    if (offset <= array.length - 3) {
                        let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            offset += 3;
                        }
                    }
                    break;
                }
                case 9:  // ScriptDataObjectEnd
                    value = undefined;
                    offset = 1;
                    objectEnd = true;
                    break;
                case 10: {  // Strict array type
                    // ScriptDataValue[n]. NOTE: according to video_file_format_spec_v10_1.pdf
                    value = [];
                    let strictArrayLength = v.getUint32(1, !le);
                    offset += 4;
                    for (let i = 0; i < strictArrayLength; i++) {
                        let val = AMF.parseValue(array.slice(offset, array.length));
                        value.push(val.data);
                        offset += val.size;
                    }
                    break;
                }
                case 11: {  // Date type
                    let date = AMF.parseDate(array.slice(1));
                    value = date.data;
                    offset += date.size;
                    break;
                }
                case 12: {  // Long string type
                    let amfLongStr = AMF.parseString(array.slice(1));
                    value = amfLongStr.data;
                    offset += amfLongStr.size;
                    break;
                }
                default:
                    // ignore and skip
                    offset = array.length;
                    logger.w(this.TAG, 'Unsupported AMF value type ' + type);
            }
        } catch (e) {
            logger.e(this.TAG, e.toString());
        }

        return {
            data: value,
            size: offset,
            objectEnd: objectEnd
        };
    }
}

/* harmony default export */ const amf_parser = (AMF);

;// CONCATENATED MODULE: ./src/flv/exp-golomb.js
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

// Exponential-Golomb buffer decoder


class ExpGolomb {

    constructor(uint8array) {
        this.TAG = 'ExpGolomb';

        this._buffer = uint8array;
        this._buffer_index = 0;
        this._total_bytes = uint8array.byteLength;
        this._total_bits = uint8array.byteLength * 8;
        this._current_word = 0;
        this._current_word_bits_left = 0;
    }

    destroy() {
        this._buffer = null;
    }

    _fillCurrentWord() {
        let buffer_bytes_left = this._total_bytes - this._buffer_index;
        if (buffer_bytes_left <= 0)
            throw new IllegalStateException('ExpGolomb: _fillCurrentWord() but no bytes available');

        let bytes_read = Math.min(4, buffer_bytes_left);
        let word = new Uint8Array(4);
        word.set(this._buffer.subarray(this._buffer_index, this._buffer_index + bytes_read));
        this._current_word = new DataView(word.buffer).getUint32(0, false);

        this._buffer_index += bytes_read;
        this._current_word_bits_left = bytes_read * 8;
    }

    readBits(bits) {
        if (bits > 32)
            throw new InvalidArgumentException('ExpGolomb: readBits() bits exceeded max 32bits!');

        if (bits <= this._current_word_bits_left) {
            let result = this._current_word >>> (32 - bits);
            this._current_word <<= bits;
            this._current_word_bits_left -= bits;
            return result;
        }

        let result = this._current_word_bits_left ? this._current_word : 0;
        result = result >>> (32 - this._current_word_bits_left);
        let bits_need_left = bits - this._current_word_bits_left;

        this._fillCurrentWord();
        let bits_read_next = Math.min(bits_need_left, this._current_word_bits_left);

        let result2 = this._current_word >>> (32 - bits_read_next);
        this._current_word <<= bits_read_next;
        this._current_word_bits_left -= bits_read_next;

        result = (result << bits_read_next) | result2;
        return result;
    }

    readBool() {
        return this.readBits(1) === 1;
    }

    readByte() {
        return this.readBits(8);
    }

    _skipLeadingZero() {
        let zero_count;
        for (zero_count = 0; zero_count < this._current_word_bits_left; zero_count++) {
            if (0 !== (this._current_word & (0x80000000 >>> zero_count))) {
                this._current_word <<= zero_count;
                this._current_word_bits_left -= zero_count;
                return zero_count;
            }
        }
        this._fillCurrentWord();
        return zero_count + this._skipLeadingZero();
    }

    readUEG() {  // unsigned exponential golomb
        let leading_zeros = this._skipLeadingZero();
        return this.readBits(leading_zeros + 1) - 1;
    }

    readSEG() {  // signed exponential golomb
        let value = this.readUEG();
        if (value & 0x01) {
            return (value + 1) >>> 1;
        } else {
            return -1 * (value >>> 1);
        }
    }

}

/* harmony default export */ const exp_golomb = (ExpGolomb);

;// CONCATENATED MODULE: ./src/flv/sps-parser.js
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





class SPSParser {
    static _ebsp2rbsp(uint8array) {
        let src = uint8array;
        let src_length = src.byteLength;
        let dst = new Uint8Array(src_length);
        let dst_idx = 0;

        for (let i = 0; i < src_length; i++) {
            if (i >= 2) {
                // Unescape: Skip 0x03 after 00 00
                if (src[i] === 0x03 && src[i - 1] === 0x00 && src[i - 2] === 0x00) {
                    continue;
                }
            }
            dst[dst_idx] = src[i];
            dst_idx++;
        }

        return new Uint8Array(dst.buffer, 0, dst_idx);
    }

    static parseSPS(uint8array) {
        let rbsp = SPSParser._ebsp2rbsp(uint8array);
        let gb = new exp_golomb(rbsp);

        gb.readByte();
        let profile_idc = gb.readByte();  // profile_idc
        gb.readByte();  // constraint_set_flags[5] + reserved_zero[3]
        let level_idc = gb.readByte();  // level_idc
        gb.readUEG();  // seq_parameter_set_id

        let profile_string = SPSParser.getProfileString(profile_idc);
        let level_string = SPSParser.getLevelString(level_idc);
        let chroma_format_idc = 1;
        let chroma_format = 420;
        let chroma_format_table = [0, 420, 422, 444];
        let bit_depth = 8;

        if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 ||
            profile_idc === 244 || profile_idc === 44 || profile_idc === 83 ||
            profile_idc === 86 || profile_idc === 118 || profile_idc === 128 ||
            profile_idc === 138 || profile_idc === 144) {

            chroma_format_idc = gb.readUEG();
            if (chroma_format_idc === 3) {
                gb.readBits(1);  // separate_colour_plane_flag
            }
            if (chroma_format_idc <= 3) {
                chroma_format = chroma_format_table[chroma_format_idc];
            }

            bit_depth = gb.readUEG() + 8;  // bit_depth_luma_minus8
            gb.readUEG();  // bit_depth_chroma_minus8
            gb.readBits(1);  // qpprime_y_zero_transform_bypass_flag
            if (gb.readBool()) {  // seq_scaling_matrix_present_flag
                let scaling_list_count = (chroma_format_idc !== 3) ? 8 : 12;
                for (let i = 0; i < scaling_list_count; i++) {
                    if (gb.readBool()) {  // seq_scaling_list_present_flag
                        if (i < 6) {
                            SPSParser._skipScalingList(gb, 16);
                        } else {
                            SPSParser._skipScalingList(gb, 64);
                        }
                    }
                }
            }
        }
        gb.readUEG();  // log2_max_frame_num_minus4
        let pic_order_cnt_type = gb.readUEG();
        if (pic_order_cnt_type === 0) {
            gb.readUEG();  // log2_max_pic_order_cnt_lsb_minus_4
        } else if (pic_order_cnt_type === 1) {
            gb.readBits(1);  // delta_pic_order_always_zero_flag
            gb.readSEG();  // offset_for_non_ref_pic
            gb.readSEG();  // offset_for_top_to_bottom_field
            let num_ref_frames_in_pic_order_cnt_cycle = gb.readUEG();
            for (let i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i++) {
                gb.readSEG();  // offset_for_ref_frame
            }
        }
        let ref_frames = gb.readUEG();  // max_num_ref_frames
        gb.readBits(1);  // gaps_in_frame_num_value_allowed_flag

        let pic_width_in_mbs_minus1 = gb.readUEG();
        let pic_height_in_map_units_minus1 = gb.readUEG();

        let frame_mbs_only_flag = gb.readBits(1);
        if (frame_mbs_only_flag === 0) {
            gb.readBits(1);  // mb_adaptive_frame_field_flag
        }
        gb.readBits(1);  // direct_8x8_inference_flag

        let frame_crop_left_offset = 0;
        let frame_crop_right_offset = 0;
        let frame_crop_top_offset = 0;
        let frame_crop_bottom_offset = 0;

        let frame_cropping_flag = gb.readBool();
        if (frame_cropping_flag) {
            frame_crop_left_offset = gb.readUEG();
            frame_crop_right_offset = gb.readUEG();
            frame_crop_top_offset = gb.readUEG();
            frame_crop_bottom_offset = gb.readUEG();
        }

        let sar_width = 1, sar_height = 1;
        let fps = 0, fps_fixed = true, fps_num = 0, fps_den = 0;

        let vui_parameters_present_flag = gb.readBool();
        if (vui_parameters_present_flag) {
            if (gb.readBool()) {  // aspect_ratio_info_present_flag
                let aspect_ratio_idc = gb.readByte();
                let sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
                let sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33,  99, 3, 2, 1];

                if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {
                    sar_width = sar_w_table[aspect_ratio_idc - 1];
                    sar_height = sar_h_table[aspect_ratio_idc - 1];
                } else if (aspect_ratio_idc === 255) {
                    sar_width = gb.readByte() << 8 | gb.readByte();
                    sar_height = gb.readByte() << 8 | gb.readByte();
                }
            }

            if (gb.readBool()) {  // overscan_info_present_flag
                gb.readBool();  // overscan_appropriate_flag
            }
            if (gb.readBool()) {  // video_signal_type_present_flag
                gb.readBits(4);  // video_format & video_full_range_flag
                if (gb.readBool()) {  // colour_description_present_flag
                    gb.readBits(24);  // colour_primaries & transfer_characteristics & matrix_coefficients
                }
            }
            if (gb.readBool()) {  // chroma_loc_info_present_flag
                gb.readUEG();  // chroma_sample_loc_type_top_field
                gb.readUEG();  // chroma_sample_loc_type_bottom_field
            }
            if (gb.readBool()) {  // timing_info_present_flag
                let num_units_in_tick = gb.readBits(32);
                let time_scale = gb.readBits(32);
                fps_fixed = gb.readBool();  // fixed_frame_rate_flag

                fps_num = time_scale;
                fps_den = num_units_in_tick * 2;
                fps = fps_num / fps_den;
            }
        }

        let sarScale = 1;
        if (sar_width !== 1 || sar_height !== 1) {
            sarScale = sar_width / sar_height;
        }

        let crop_unit_x = 0, crop_unit_y = 0;
        if (chroma_format_idc === 0) {
            crop_unit_x = 1;
            crop_unit_y = 2 - frame_mbs_only_flag;
        } else {
            let sub_wc = (chroma_format_idc === 3) ? 1 : 2;
            let sub_hc = (chroma_format_idc === 1) ? 2 : 1;
            crop_unit_x = sub_wc;
            crop_unit_y = sub_hc * (2 - frame_mbs_only_flag);
        }

        let codec_width = (pic_width_in_mbs_minus1 + 1) * 16;
        let codec_height = (2 - frame_mbs_only_flag) * ((pic_height_in_map_units_minus1 + 1) * 16);

        codec_width -= (frame_crop_left_offset + frame_crop_right_offset) * crop_unit_x;
        codec_height -= (frame_crop_top_offset + frame_crop_bottom_offset) * crop_unit_y;

        let present_width = Math.ceil(codec_width * sarScale);

        gb.destroy();
        gb = null;

        return {
            profile_string: profile_string,  // baseline, high, high10, ...
            level_string: level_string,  // 3, 3.1, 4, 4.1, 5, 5.1, ...
            bit_depth: bit_depth,  // 8bit, 10bit, ...
            ref_frames: ref_frames,
            chroma_format: chroma_format,  // 4:2:0, 4:2:2, ...
            chroma_format_string: SPSParser.getChromaFormatString(chroma_format),

            frame_rate: {
                fixed: fps_fixed,
                fps: fps,
                fps_den: fps_den,
                fps_num: fps_num
            },

            sar_ratio: {
                width: sar_width,
                height: sar_height
            },

            codec_size: {
                width: codec_width,
                height: codec_height
            },

            present_size: {
                width: present_width,
                height: codec_height
            }
        };
    }

    static _skipScalingList(gb, count) {
        let last_scale = 8, next_scale = 8;
        let delta_scale = 0;
        for (let i = 0; i < count; i++) {
            if (next_scale !== 0) {
                delta_scale = gb.readSEG();
                next_scale = (last_scale + delta_scale + 256) % 256;
            }
            last_scale = (next_scale === 0) ? last_scale : next_scale;
        }
    }

    static getProfileString(profile_idc) {
        switch (profile_idc) {
            case 66:
                return 'Baseline';
            case 77:
                return 'Main';
            case 88:
                return 'Extended';
            case 100:
                return 'High';
            case 110:
                return 'High10';
            case 122:
                return 'High422';
            case 244:
                return 'High444';
            default:
                return 'Unknown';
        }
    }

    static getLevelString(level_idc) {
        return (level_idc / 10).toFixed(1);
    }

    static getChromaFormatString(chroma) {
        switch (chroma) {
            case 420:
                return '4:2:0';
            case 422:
                return '4:2:2';
            case 444:
                return '4:4:4';
            default:
                return 'Unknown';
        }
    }

}

/* harmony default export */ const sps_parser = (SPSParser);

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


;// CONCATENATED MODULE: ./src/formats/mp4.js
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

;// CONCATENATED MODULE: ./src/formats/aac-silent.js
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

;// CONCATENATED MODULE: ./src/formats/mp4-remuxer.js
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
		this._isLive = (config.isLive === true);

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
		logger.i(this.TAG, "_onTrackMetadataReceived");
		let metabox = null;

		let container = 'mp4';
		let codec = metadata.codec;

		if (type === 'audio') {
			this._audioMeta = metadata;
			if (metadata.codec === 'mp3' && this._mp3UseMpegAudio) {
				// 'audio/mpeg' for MP3 audio track
				container = 'mpeg';
				codec = '';
				metabox = new Uint8Array(0);
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
		logger.i(this.TAG, "_remuxAudio");
		if (this._audioMeta == null) {
			logger.w(this.TAG, "no audioMeta");
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
			logger.w(this.TAG, "no samples");
			return;
		}
		if (samples.length === 1 && !force) {
			// If [sample count in current batch] === 1 && (force != true)
			// Ignore and keep in demuxer's queue
			logger.w(this.TAG, "1 sample");
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
					logger.v(this.TAG, `InsertPrefixSilentAudio: dts: ${dts}, duration: ${silentFrameDuration}`);
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
					logger.w(this.TAG, `Dropping 1 audio frame (originalDts: ${originalDts} ms ,curRefDts: ${curRefDts} ms)  due to dtsCorrection: ${dtsCorrection} ms overlap.`);
					continue;
				}
				else if (dtsCorrection >= maxAudioFramesDrift * refSampleDuration && this._fillAudioTimestampGap && !browser.safari) {
					// Silent frame generation, if large timestamp gap detected && config.fixAudioTimestampGap
					needFillSilentFrames = true;
					// We need to insert silent frames to fill timestamp gap
					let frameCount = Math.floor(dtsCorrection / refSampleDuration);
					logger.w(this.TAG, 'Large audio timestamp gap detected, may cause AV sync to drift. ' +
						'Silent frames will be generated to avoid unsync.\n' +
						`originalDts: ${originalDts} ms, curRefDts: ${curRefDts} ms, ` +
						`dtsCorrection: ${Math.round(dtsCorrection)} ms, generate: ${frameCount} frames`);


					dts = Math.floor(curRefDts);
					sampleDuration = Math.floor(curRefDts + refSampleDuration) - dts;

					let silentUnit = aac_silent.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);
					if (silentUnit == null) {
						logger.w(this.TAG, 'Unable to generate silent frame for ' +
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
						mdatBytes += frame.size;

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
			logger.w(this.TAG, "no mp4Samples = 0");
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

		let moofbox;

		if (mpegRawTrack) {
			// Generate empty buffer, because useless for raw mpeg
			moofbox = new Uint8Array(0);
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

		logger.i(this.TAG, "send onMediaSegment audio");
		this._onMediaSegment('audio', segment);
	}

	_remuxVideo(videoTrack, force) {
		logger.i(this.TAG, "_remuxVideo");
		if (this._videoMeta == null) {
			return;
		}

		let track = videoTrack;
		let samples = track.samples;
		let dtsCorrection = undefined;
		let firstDts = -1, lastDts = -1;
		let firstPts = -1, lastPts = -1;

		if (!samples || samples.length === 0) {
			logger.w(this.TAG, "no samples");
			return;
		}
		if (samples.length === 1 && !force) {
			// If [sample count in current batch] === 1 && (force != true)
			// Ignore and keep in demuxer's queue
			logger.w(this.TAG, "no sampes = 1");
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

		logger.i(this.TAG, "send onMediaSegment video");
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

;// CONCATENATED MODULE: ./src/flv/transmuxer.js
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









class Transmuxer {
    TAG = 'Transmuxer';

    constructor(config) {
        this._emitter = new event_emitter();

        this._config = config;

        this._currentSegmentIndex = 0;

        this._mediaInfo = null;
        this._ioctl = null;

        this._pendingSeekTime = null;
        this._pendingResolveSeekPoint = null;

        this._statisticsReporter = null;

        this._remuxer = new mp4_remuxer(this._config);
        this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival.bind(this);
        this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival.bind(this);
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

    _onTrackMetadataReceived(type, metadata) {
        this._remuxer._onTrackMetadataReceived(type, metadata);
    }

    stop() {
        this._internalAbort();
    }

    _internalAbort() {
        if (this._ioctl) {
            this._ioctl.destroy();
            this._ioctl = null;
        }
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

    _onMediaInfo(mediaInfo) {
        if (this._mediaInfo == null) {
            // Store first segment's mediainfo as global mediaInfo
            this._mediaInfo = Object.assign({}, mediaInfo);
            this._mediaInfo.keyframesIndex = null;
            this._mediaInfo.segments = [];
            //this._mediaInfo.segmentCount = this._mediaDataSource.segments.length;
            Object.setPrototypeOf(this._mediaInfo, media_info.prototype);
        }

        let segmentInfo = Object.assign({}, mediaInfo);
        Object.setPrototypeOf(segmentInfo, media_info.prototype);
        this._mediaInfo.segments[this._currentSegmentIndex] = segmentInfo;

        // notify mediaInfo update
        this._reportSegmentMediaInfo(this._currentSegmentIndex);

        /*
        if (this._pendingSeekTime != null) {
            Promise.resolve().then(() => {
                let target = this._pendingSeekTime;
                this._pendingSeekTime = null;
                this.seek(target);
            });
        }*/
    }

    _onMetaDataArrived(metadata) {
        this._emitter.emit(TransmuxingEvents.METADATA_ARRIVED, metadata);
    }

    _onScriptDataArrived(data) {
        this._emitter.emit(TransmuxingEvents.SCRIPTDATA_ARRIVED, data);
    }

    _onRemuxerInitSegmentArrival(type, initSegment) {
        this._emitter.emit(TransmuxingEvents.INIT_SEGMENT, type, initSegment);
    }

    _onRemuxerMediaSegmentArrival(type, mediaSegment) {
        logger.d(this.TAG, "_onRemuxerMediaSegmentArrival");
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
            if (browser.safari && syncPoints.length > 0 && syncPoints[0].originalDts === seekpoint) {
                seekpoint = syncPoints[0].pts;
            }
            // else: use original DTS (keyframe.milliseconds)

            this._emitter.emit(TransmuxingEvents.RECOMMEND_SEEKPOINT, seekpoint);
        }
    }
}

/* harmony default export */ const transmuxer = (Transmuxer);

;// CONCATENATED MODULE: ./src/rtmp/RTMPMediaMessageHandler.js
/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * This was heavily inspired by bilibi FLVPlayer (flv.js/src/demux/flv-demuxer.js)
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









class RTMPMediaMessageHandler{
    TAG = "RTMPMediaMessageHandler";

    constructor(config) {
        this._config = config;

        this._onError = null;
        this._onMediaInfo = null;
        this._onMetaDataArrived = null;
        this._onScriptDataArrived = null;
        this._onDataAvailable = null;
        this._onTrackMetadata = null;

        this._dispatch = false;

        this._hasAudio = true;
        this._hasVideo = true;

        this._hasAudioFlagOverrided = false;
        this._hasVideoFlagOverrided = false;

        this._audioInitialMetadataDispatched = false;
        this._videoInitialMetadataDispatched = false;

        this._mediaInfo = new media_info();
        this._mediaInfo.hasAudio = this._hasAudio;
        this._mediaInfo.hasVideo = this._hasVideo;
        this._metadata = null;
        this._audioMetadata = null;
        this._videoMetadata = null;

        this._naluLengthSize = 4;
        this._timestampBase = 0;  // int32, in milliseconds
        this._timescale = 1000;
        this._duration = 0;  // int32, in milliseconds
        this._durationOverrided = false;
        this._referenceFrameRate = {
            fixed: true,
            fps: 23.976,
            fps_num: 23976,
            fps_den: 1000
        };

        this._flvSoundRateTable = [5500, 11025, 22050, 44100, 48000];

        this._mpegSamplingRates = [
            96000, 88200, 64000, 48000, 44100, 32000,
            24000, 22050, 16000, 12000, 11025, 8000, 7350
        ];

        this._mpegAudioV10SampleRateTable = [44100, 48000, 32000, 0];
        this._mpegAudioV20SampleRateTable = [22050, 24000, 16000, 0];
        this._mpegAudioV25SampleRateTable = [11025, 12000, 8000,  0];

        this._mpegAudioL1BitRateTable = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1];
        this._mpegAudioL2BitRateTable = [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, -1];
        this._mpegAudioL3BitRateTable = [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, -1];

        this._videoTrack = {type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0};
        this._audioTrack = {type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0};

        this._littleEndian = (function () {
            let buf = new ArrayBuffer(2);
            (new DataView(buf)).setInt16(0, 256, true);  // little-endian write
            return (new Int16Array(buf))[0] === 256;  // platform-spec read, if equal then LE
        })();


        this.bytePos = 0;

        this._config = defaultConfig;
        this._transmuxer = new transmuxer(this._config);

        this._transmuxer.on(TransmuxingEvents.INIT_SEGMENT, (type, is) => {
            postMessage([TransmuxingEvents.INIT_SEGMENT, type, is]);
        });

        this._transmuxer.on(TransmuxingEvents.MEDIA_SEGMENT, (type, ms) => {
            postMessage([TransmuxingEvents.MEDIA_SEGMENT, type, ms]);
        });

        this._transmuxer.on(TransmuxingEvents.MEDIA_INFO, (mediaInfo) => {
            this._mediaInfo = mediaInfo;
            postMessage([TransmuxingEvents.MEDIA_INFO, mediaInfo]);
        });

        this._transmuxer.on(TransmuxingEvents.METADATA_ARRIVED, (metadata) => {
            postMessage([TransmuxingEvents.METADATA_ARRIVED, metadata]);
        });

        this._transmuxer.on(TransmuxingEvents.SCRIPTDATA_ARRIVED, (data) => {
            postMessage([TransmuxingEvents.SCRIPTDATA_ARRIVED, data]);
        });

        this._onDataAvailable = (audioTrack, videoTrack) =>{
            logger.d(this.TAG, "_onDataAvailable");
            this._transmuxer.remux(audioTrack, videoTrack);
        }

        this._onTrackMetadata = (type, metadata)=>{
            logger.d(this.TAG, "_onTrackMetadata");
            this._transmuxer._onTrackMetadataReceived(type, metadata);
        }
    }

    destroy() {
        this._mediaInfo = null;
        this._metadata = null;
        this._audioMetadata = null;
        this._videoMetadata = null;
        this._videoTrack = null;
        this._audioTrack = null;

        this._onError = null;
        this._onMediaInfo = null;
        this._onMetaDataArrived = null;
        this._onScriptDataArrived = null;
        this._onTrackMetadata = null;
        this._onDataAvailable = null;
    }

    // prototype: function(type: string, metadata: any): void
    get onTrackMetadata() {
        return this._onTrackMetadata;
    }

    set onTrackMetadata(callback) {
        this._onTrackMetadata = callback;
    }

    // prototype: function(mediaInfo: MediaInfo): void
    get onMediaInfo() {
        return this._onMediaInfo;
    }

    set onMediaInfo(callback) {
        this._onMediaInfo = callback;
    }

    get onMetaDataArrived() {
        return this._onMetaDataArrived;
    }

    set onMetaDataArrived(callback) {
        this._onMetaDataArrived = callback;
    }

    get onScriptDataArrived() {
        return this._onScriptDataArrived;
    }

    set onScriptDataArrived(callback) {
        this._onScriptDataArrived = callback;
    }

    // prototype: function(type: number, info: string): void
    get onError() {
        return this._onError;
    }

    set onError(callback) {
        this._onError = callback;
    }

    // prototype: function(videoTrack: any, audioTrack: any): void
    get onDataAvailable() {
        return this._onDataAvailable;
    }

    set onDataAvailable(callback) {
        this._onDataAvailable = callback;
    }

    // timestamp base for output samples, must be in milliseconds
    get timestampBase() {
        return this._timestampBase;
    }

    set timestampBase(base) {
        this._timestampBase = base;
    }

    get overridedDuration() {
        return this._duration;
    }

    // Force-override media duration. Must be in milliseconds, int32
    set overridedDuration(duration) {
        this._durationOverrided = true;
        this._duration = duration;
        this._mediaInfo.duration = duration;
    }

    // Force-override audio track present flag, boolean
    set overridedHasAudio(hasAudio) {
        this._hasAudioFlagOverrided = true;
        this._hasAudio = hasAudio;
        this._mediaInfo.hasAudio = hasAudio;
    }

    // Force-override video track present flag, boolean
    set overridedHasVideo(hasVideo) {
        this._hasVideoFlagOverrided = true;
        this._hasVideo = hasVideo;
        this._mediaInfo.hasVideo = hasVideo;
    }

    resetMediaInfo() {
        this._mediaInfo = new media_info();
    }

    _isInitialMetadataDispatched() {
        if (this._hasAudio && this._hasVideo) {  // both audio & video
            return this._audioInitialMetadataDispatched && this._videoInitialMetadataDispatched;
        }
        if (this._hasAudio && !this._hasVideo) {  // audio only
            return this._audioInitialMetadataDispatched;
        }
        if (!this._hasAudio && this._hasVideo) {  // video only
            return this._videoInitialMetadataDispatched;
        }
        return false;
    }

    /**
     *
     * @param {RTMPMessage} msg
     */
    handleMediaMessage(msg) {
        logger.d(this.TAG, "handleMediaMessage", msg.getMessageType());
        if (!this._onError || !this._onMediaInfo || !this._onTrackMetadata || !this._onDataAvailable) {
            throw new IllegalStateException('Flv: onError & onMediaInfo & onTrackMetadata & onDataAvailable callback must be specified');
        }

        this._dispatch = true;

        let tagType = msg.getMessageType();
        let timestamp = msg.getTimestamp();
        let streamId = msg.getMessageStreamID()
        if (streamId !== 0) {
            logger.w(this.TAG, 'Meet tag which has StreamID != 0!');
        }

        logger.d(this.TAG, msg);

        switch (tagType) {
            case 8:  // Audio
                this._parseAudioData(msg.getPayload(), timestamp);
                break;
            case 9:  // Video
                this._parseVideoData(msg.getPayload(), timestamp, this.bytePos);
                break;
            case 18:  // ScriptDataObject
                this._parseScriptData(msg.getPayload());
                break;
        }

        this.bytePos += msg.getMessageLength() + 11 +1;

        // dispatch parsed frames to consumer (typically, the remuxer)
        if (this._isInitialMetadataDispatched()) {
            if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
                logger.i(this.TAG, "sedn2");
                this._onDataAvailable(this._audioTrack, this._videoTrack);
            }
        }

        return;
    }

    /**
     *
     * @param {Uint8Array} payload
     * @private
     */
    _parseScriptData(payload) {
        let scriptData = amf_parser.parseScriptData(payload);

        if (scriptData.hasOwnProperty('onMetaData')) {
            if (scriptData.onMetaData == null || typeof scriptData.onMetaData !== 'object') {
                logger.w(this.TAG, 'Invalid onMetaData structure!');
                return;
            }
            if (this._metadata) {
                logger.w(this.TAG, 'Found another onMetaData tag!');
            }
            this._metadata = scriptData;
            let onMetaData = this._metadata.onMetaData;

            if (this._onMetaDataArrived) {
                this._onMetaDataArrived(Object.assign({}, onMetaData));
            }

            if (typeof onMetaData.hasAudio === 'boolean') {  // hasAudio
                if (this._hasAudioFlagOverrided === false) {
                    this._hasAudio = onMetaData.hasAudio;
                    this._mediaInfo.hasAudio = this._hasAudio;
                }
            }
            if (typeof onMetaData.hasVideo === 'boolean') {  // hasVideo
                if (this._hasVideoFlagOverrided === false) {
                    this._hasVideo = onMetaData.hasVideo;
                    this._mediaInfo.hasVideo = this._hasVideo;
                }
            }
            if (typeof onMetaData.audiodatarate === 'number') {  // audiodatarate
                this._mediaInfo.audioDataRate = onMetaData.audiodatarate;
            }
            if (typeof onMetaData.videodatarate === 'number') {  // videodatarate
                this._mediaInfo.videoDataRate = onMetaData.videodatarate;
            }
            if (typeof onMetaData.width === 'number') {  // width
                this._mediaInfo.width = onMetaData.width;
            }
            if (typeof onMetaData.height === 'number') {  // height
                this._mediaInfo.height = onMetaData.height;
            }
            if (typeof onMetaData.duration === 'number') {  // duration
                if (!this._durationOverrided) {
                    let duration = Math.floor(onMetaData.duration * this._timescale);
                    this._duration = duration;
                    this._mediaInfo.duration = duration;
                }
            } else {
                this._mediaInfo.duration = 0;
            }
            if (typeof onMetaData.framerate === 'number') {  // framerate
                let fps_num = Math.floor(onMetaData.framerate * 1000);
                if (fps_num > 0) {
                    let fps = fps_num / 1000;
                    this._referenceFrameRate.fixed = true;
                    this._referenceFrameRate.fps = fps;
                    this._referenceFrameRate.fps_num = fps_num;
                    this._referenceFrameRate.fps_den = 1000;
                    this._mediaInfo.fps = fps;
                }
            }
            if (typeof onMetaData.keyframes === 'object') {  // keyframes
                this._mediaInfo.hasKeyframesIndex = true;
                let keyframes = onMetaData.keyframes;
                this._mediaInfo.keyframesIndex = this._parseKeyframesIndex(keyframes);
                onMetaData.keyframes = null;  // keyframes has been extracted, remove it
            } else {
                this._mediaInfo.hasKeyframesIndex = false;
            }
            this._dispatch = false;
            this._mediaInfo.metadata = onMetaData;
            logger.v(this.TAG, 'Parsed onMetaData');
            if (this._mediaInfo.isComplete()) {
                this._onMediaInfo(this._mediaInfo);
            }
        }

        if (Object.keys(scriptData).length > 0) {
            if (this._onScriptDataArrived) {
                this._onScriptDataArrived(Object.assign({}, scriptData));
            }
        }
    }

    _parseKeyframesIndex(keyframes) {
        let times = [];
        let filepositions = [];

        // ignore first keyframe which is actually AVC Sequence Header (AVCDecoderConfigurationRecord)
        for (let i = 1; i < keyframes.times.length; i++) {
            let time = this._timestampBase + Math.floor(keyframes.times[i] * 1000);
            times.push(time);
            filepositions.push(keyframes.filepositions[i]);
        }

        return {
            times: times,
            filepositions: filepositions
        };
    }

    /**
     *
     * @param {Uint8Array} payload
     * @param tagTimestamp
     * @private
     */
    _parseAudioData(payload, tagTimestamp) {
        logger.d(this.TAG, "_parseAudioData", tagTimestamp);
        if (payload.length <= 1) {
            logger.w(this.TAG, 'Flv: Invalid audio packet, missing SoundData payload!');
            return;
        }

        if (this._hasAudioFlagOverrided === true && this._hasAudio === false) {
            // If hasAudio: false indicated explicitly in MediaDataSource,
            // Ignore all the audio packets
            return;
        }

        let le = this._littleEndian;
        let v = new DataView(payload.buffer);

        let soundSpec = v.getUint8(0);

        let soundFormat = soundSpec >>> 4;
        if (soundFormat !== 2 && soundFormat !== 10) {  // MP3 or AAC
            this._onError(DemuxErrors.CODEC_UNSUPPORTED, 'Flv: Unsupported audio codec idx: ' + soundFormat);
            return;
        }

        let soundRate = 0;
        let soundRateIndex = (soundSpec & 12) >>> 2;
        if (soundRateIndex >= 0 && soundRateIndex <= 4) {
            soundRate = this._flvSoundRateTable[soundRateIndex];
        } else {
            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid audio sample rate idx: ' + soundRateIndex);
            return;
        }

        let soundSize = (soundSpec & 2) >>> 1;  // unused
        let soundType = (soundSpec & 1);


        let meta = this._audioMetadata;
        let track = this._audioTrack;

        if (!meta) {
            if (this._hasAudio === false && this._hasAudioFlagOverrided === false) {
                this._hasAudio = true;
                this._mediaInfo.hasAudio = true;
            }

            // initial metadata
            meta = this._audioMetadata = {};
            meta.type = 'audio';
            meta.id = track.id;
            meta.timescale = this._timescale;
            meta.duration = this._duration;
            meta.audioSampleRate = soundRate;
            meta.channelCount = (soundType === 0 ? 1 : 2);
        }

        if (soundFormat === 10) {  // AAC
            let aacData = this._parseAACAudioData(payload.slice(1));
            if (aacData == undefined) {
                return;
            }

            if (aacData.packetType === 0) {  // AAC sequence header (AudioSpecificConfig)
                if (meta.config) {
                    logger.w(this.TAG, 'Found another AudioSpecificConfig!');
                }
                let misc = aacData.data;
                meta.audioSampleRate = misc.samplingRate;
                meta.channelCount = misc.channelCount;
                meta.codec = misc.codec;
                meta.originalCodec = misc.originalCodec;
                meta.config = misc.config;
                // The decode result of an aac sample is 1024 PCM samples
                meta.refSampleDuration = 1024 / meta.audioSampleRate * meta.timescale;
                logger.v(this.TAG, 'Parsed AudioSpecificConfig');

                if (this._isInitialMetadataDispatched()) {
                    // Non-initial metadata, force dispatch (or flush) parsed frames to remuxer
                    if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
                        this._onDataAvailable(this._audioTrack, this._videoTrack);
                    }
                } else {
                    this._audioInitialMetadataDispatched = true;
                }
                // then notify new metadata
                this._dispatch = false;
                logger.i(this.TAG, "ON!");
                this._onTrackMetadata('audio', meta);

                let mi = this._mediaInfo;
                mi.audioCodec = meta.originalCodec;
                mi.audioSampleRate = meta.audioSampleRate;
                mi.audioChannelCount = meta.channelCount;
                if (mi.hasVideo) {
                    if (mi.videoCodec != null) {
                        mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + ',' + mi.audioCodec + '"';
                    }
                } else {
                    mi.mimeType = 'video/x-flv; codecs="' + mi.audioCodec + '"';
                }
                if (mi.isComplete()) {
                    this._onMediaInfo(mi);
                }
            } else if (aacData.packetType === 1) {  // AAC raw frame data
                let dts = this._timestampBase + tagTimestamp;
                let aacSample = {unit: aacData.data, length: aacData.data.byteLength, dts: dts, pts: dts};
                track.samples.push(aacSample);
                track.length += aacData.data.length;
            } else {
                logger.e(this.TAG, `Flv: Unsupported AAC data type ${aacData.packetType}`);
            }
        } else if (soundFormat === 2) {  // MP3
            if (!meta.codec) {
                // We need metadata for mp3 audio track, extract info from frame header
                let misc = this._parseMP3AudioData(payload.slice(1), true);
                if (misc == undefined) {
                    return;
                }
                meta.audioSampleRate = misc.samplingRate;
                meta.channelCount = misc.channelCount;
                meta.codec = misc.codec;
                meta.originalCodec = misc.originalCodec;
                // The decode result of an mp3 sample is 1152 PCM samples
                meta.refSampleDuration = 1152 / meta.audioSampleRate * meta.timescale;
                logger.v(this.TAG, 'Parsed MPEG Audio Frame Header');

                this._audioInitialMetadataDispatched = true;
                this._onTrackMetadata('audio', meta);

                let mi = this._mediaInfo;
                mi.audioCodec = meta.codec;
                mi.audioSampleRate = meta.audioSampleRate;
                mi.audioChannelCount = meta.channelCount;
                mi.audioDataRate = misc.bitRate;
                if (mi.hasVideo) {
                    if (mi.videoCodec != null) {
                        mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + ',' + mi.audioCodec + '"';
                    }
                } else {
                    mi.mimeType = 'video/x-flv; codecs="' + mi.audioCodec + '"';
                }
                if (mi.isComplete()) {
                    this._onMediaInfo(mi);
                }
            }

            // This packet is always a valid audio packet, extract it
            let data = this._parseMP3AudioData(payload.slice(1), false);
            if (data == undefined) {
                return;
            }
            let dts = this._timestampBase + tagTimestamp;
            let mp3Sample = {unit: data, length: data.byteLength, dts: dts, pts: dts};
            track.samples.push(mp3Sample);
            track.length += data.length;
        }
    }

    /**
     *
     * @param {Uint8Array} payload
     * @returns {{}}
     * @private
     */
    _parseAACAudioData(payload) {
        if (payload.length <= 1) {
            logger.w(this.TAG, 'Flv: Invalid AAC packet, missing AACPacketType or/and Data!');
            return;
        }

        let result = {};

        result.packetType = payload[0];

        if (payload[0] === 0) {
            result.data = this._parseAACAudioSpecificConfig(payload.slice(1));
        } else {
            result.data = payload.subarray(1);
        }

        return result;
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{channelCount: number, codec: string, originalCodec: string, samplingRate: *, config: any[]}}
     * @private
     */
    _parseAACAudioSpecificConfig(array) {
        let config = null;

        /* Audio Object Type:
           0: Null
           1: AAC Main
           2: AAC LC
           3: AAC SSR (Scalable Sample Rate)
           4: AAC LTP (Long Term Prediction)
           5: HE-AAC / SBR (Spectral Band Replication)
           6: AAC Scalable
        */

        let audioObjectType = 0;
        let originalAudioObjectType = 0;
        let audioExtensionObjectType = null;
        let samplingIndex = 0;
        let extensionSamplingIndex = null;

        // 5 bits
        audioObjectType = originalAudioObjectType = array[0] >>> 3;
        // 4 bits
        samplingIndex = ((array[0] & 0x07) << 1) | (array[1] >>> 7);
        if (samplingIndex < 0 || samplingIndex >= this._mpegSamplingRates.length) {
            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: AAC invalid sampling frequency index!');
            return;
        }

        let samplingFrequence = this._mpegSamplingRates[samplingIndex];

        // 4 bits
        let channelConfig = (array[1] & 0x78) >>> 3;
        if (channelConfig < 0 || channelConfig >= 8) {
            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: AAC invalid channel configuration');
            return;
        }

        if (audioObjectType === 5) {  // HE-AAC?
            // 4 bits
            extensionSamplingIndex = ((array[1] & 0x07) << 1) | (array[2] >>> 7);
            // 5 bits
            audioExtensionObjectType = (array[2] & 0x7C) >>> 2;
        }

        // workarounds for various browsers
        let userAgent = self.navigator.userAgent.toLowerCase();

        if (userAgent.indexOf('firefox') !== -1) {
            // firefox: use SBR (HE-AAC) if freq less than 24kHz
            if (samplingIndex >= 6) {
                audioObjectType = 5;
                config = new Array(4);
                extensionSamplingIndex = samplingIndex - 3;
            } else {  // use LC-AAC
                audioObjectType = 2;
                config = new Array(2);
                extensionSamplingIndex = samplingIndex;
            }
        } else if (userAgent.indexOf('android') !== -1) {
            // android: always use LC-AAC
            audioObjectType = 2;
            config = new Array(2);
            extensionSamplingIndex = samplingIndex;
        } else {
            // for other browsers, e.g. chrome...
            // Always use HE-AAC to make it easier to switch aac codec profile
            audioObjectType = 5;
            extensionSamplingIndex = samplingIndex;
            config = new Array(4);

            if (samplingIndex >= 6) {
                extensionSamplingIndex = samplingIndex - 3;
            } else if (channelConfig === 1) {  // Mono channel
                audioObjectType = 2;
                config = new Array(2);
                extensionSamplingIndex = samplingIndex;
            }
        }

        config[0]  = audioObjectType << 3;
        config[0] |= (samplingIndex & 0x0F) >>> 1;
        config[1]  = (samplingIndex & 0x0F) << 7;
        config[1] |= (channelConfig & 0x0F) << 3;
        if (audioObjectType === 5) {
            config[1] |= ((extensionSamplingIndex & 0x0F) >>> 1);
            config[2]  = (extensionSamplingIndex & 0x01) << 7;
            // extended audio object type: force to 2 (LC-AAC)
            config[2] |= (2 << 2);
            config[3]  = 0;
        }

        return {
            config: config,
            samplingRate: samplingFrequence,
            channelCount: channelConfig,
            codec: 'mp4a.40.' + audioObjectType,
            originalCodec: 'mp4a.40.' + originalAudioObjectType
        };
    }

    /**
     *
     * @param {Uint8Array} array
     * @param requestHeader
     * @returns {*}
     * @private
     */
    _parseMP3AudioData(array, requestHeader) {
        if (array.length < 4) {
            logger.w(this.TAG, 'Flv: Invalid MP3 packet, header missing!');
            return;
        }

        let result = null;

        if (requestHeader) {
            if (array[0] !== 0xFF) {
                return;
            }
            let ver = (array[1] >>> 3) & 0x03;
            let layer = (array[1] & 0x06) >> 1;

            let bitrate_index = (array[2] & 0xF0) >>> 4;
            let sampling_freq_index = (array[2] & 0x0C) >>> 2;

            let channel_mode = (array[3] >>> 6) & 0x03;
            let channel_count = channel_mode !== 3 ? 2 : 1;

            let sample_rate = 0;
            let bit_rate = 0;
            let object_type = 34;  // Layer-3, listed in MPEG-4 Audio Object Types

            let codec = 'mp3';

            switch (ver) {
                case 0:  // MPEG 2.5
                    sample_rate = this._mpegAudioV25SampleRateTable[sampling_freq_index];
                    break;
                case 2:  // MPEG 2
                    sample_rate = this._mpegAudioV20SampleRateTable[sampling_freq_index];
                    break;
                case 3:  // MPEG 1
                    sample_rate = this._mpegAudioV10SampleRateTable[sampling_freq_index];
                    break;
            }

            switch (layer) {
                case 1:  // Layer 3
                    object_type = 34;
                    if (bitrate_index < this._mpegAudioL3BitRateTable.length) {
                        bit_rate = this._mpegAudioL3BitRateTable[bitrate_index];
                    }
                    break;
                case 2:  // Layer 2
                    object_type = 33;
                    if (bitrate_index < this._mpegAudioL2BitRateTable.length) {
                        bit_rate = this._mpegAudioL2BitRateTable[bitrate_index];
                    }
                    break;
                case 3:  // Layer 1
                    object_type = 32;
                    if (bitrate_index < this._mpegAudioL1BitRateTable.length) {
                        bit_rate = this._mpegAudioL1BitRateTable[bitrate_index];
                    }
                    break;
            }

            result = {
                bitRate: bit_rate,
                samplingRate: sample_rate,
                channelCount: channel_count,
                codec: codec,
                originalCodec: codec
            };
        } else {
            result = array;
        }

        return result;
    }

    /**
     *
     * @param {Uint8Array} payload
     * @param tagTimestamp
     * @param tagPosition
     * @private
     */
    _parseVideoData(payload, tagTimestamp, tagPosition) {
        if (payload.length <= 1) {
            logger.w(this.TAG, 'Flv: Invalid video packet, missing VideoData payload!');
            return;
        }

        if (this._hasVideoFlagOverrided === true && this._hasVideo === false) {
            // If hasVideo: false indicated explicitly in MediaDataSource,
            // Ignore all the video packets
            return;
        }

        let spec = payload[0];

        let frameType = (spec & 240) >>> 4;
        let codecId = spec & 15;

        if (codecId !== 7) {
            this._onError(DemuxErrors.CODEC_UNSUPPORTED, `Flv: Unsupported codec in video frame: ${codecId}`);
            return;
        }

        this._parseAVCVideoPacket(payload.slice(1), tagTimestamp, tagPosition, frameType);
    }

    /**
     *
     * @param {Uint8Array} payload
     * @param tagTimestamp
     * @param tagPosition
     * @param frameType
     * @private
     */
    _parseAVCVideoPacket(payload, tagTimestamp, tagPosition, frameType) {
        if (payload.length < 4) {
            logger.w(this.TAG, 'Flv: Invalid AVC packet, missing AVCPacketType or/and CompositionTime');
            return;
        }

        let le = this._littleEndian;
        let v = new DataView(payload.buffer);

        let packetType = v.getUint8(0);
        let cts_unsigned = v.getUint32(0, !le) & 0x00FFFFFF;
        let cts = (cts_unsigned << 8) >> 8;  // convert to 24-bit signed int

        if (packetType === 0) {  // AVCDecoderConfigurationRecord
            this._parseAVCDecoderConfigurationRecord(payload.slice(4));
        } else if (packetType === 1) {  // One or more Nalus
            this._parseAVCVideoData(payload.slice(4), tagTimestamp, tagPosition, frameType, cts);
        } else if (packetType === 2) {
            // empty, AVC end of sequence
        } else {
            this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Invalid video packet type ${packetType}`);
            return;
        }
    }

    /**
     *
     * @param {Uint8Array} payload
     * @private
     */
    _parseAVCDecoderConfigurationRecord(payload) {
        if (payload.length < 7) {
            logger.w(this.TAG, 'Flv: Invalid AVCDecoderConfigurationRecord, lack of data!');
            return;
        }

        let meta = this._videoMetadata;
        let track = this._videoTrack;
        let le = this._littleEndian;
        let v = new DataView(payload.buffer);

        if (!meta) {
            if (this._hasVideo === false && this._hasVideoFlagOverrided === false) {
                this._hasVideo = true;
                this._mediaInfo.hasVideo = true;
            }

            meta = this._videoMetadata = {};
            meta.type = 'video';
            meta.id = track.id;
            meta.timescale = this._timescale;
            meta.duration = this._duration;

        } else {
            if (typeof meta.avcc !== 'undefined') {
                logger.w(this.TAG, 'Found another AVCDecoderConfigurationRecord!');
            }
        }

        let version = v.getUint8(0);  // configurationVersion
        let avcProfile = v.getUint8(1);  // avcProfileIndication
        let profileCompatibility = v.getUint8(2);  // profile_compatibility
        let avcLevel = v.getUint8(3);  // AVCLevelIndication

        if (version !== 1 || avcProfile === 0) {
            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord');
            return;
        }

        this._naluLengthSize = (v.getUint8(4) & 3) + 1;  // lengthSizeMinusOne
        if (this._naluLengthSize !== 3 && this._naluLengthSize !== 4) {  // holy shit!!!
            this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Strange NaluLengthSizeMinusOne: ${this._naluLengthSize - 1}`);
            return;
        }

        let spsCount = v.getUint8(5) & 31;  // numOfSequenceParameterSets
        if (spsCount === 0) {
            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No SPS');
            return;
        } else if (spsCount > 1) {
            logger.w(this.TAG, `Flv: Strange AVCDecoderConfigurationRecord: SPS Count = ${spsCount}`);
        }

        let offset = 6;

        for (let i = 0; i < spsCount; i++) {
            let len = v.getUint16(offset, !le);  // sequenceParameterSetLength
            offset += 2;

            if (len === 0) {
                continue;
            }

            // Notice: Nalu without startcode header (00 00 00 01)
            let sps = new Uint8Array(payload.slice(offset, offset + len));
            offset += len;

            let config = sps_parser.parseSPS(sps);
            if (i !== 0) {
                // ignore other sps's config
                continue;
            }

            meta.codecWidth = config.codec_size.width;
            meta.codecHeight = config.codec_size.height;
            meta.presentWidth = config.present_size.width;
            meta.presentHeight = config.present_size.height;

            meta.profile = config.profile_string;
            meta.level = config.level_string;
            meta.bitDepth = config.bit_depth;
            meta.chromaFormat = config.chroma_format;
            meta.sarRatio = config.sar_ratio;
            meta.frameRate = config.frame_rate;

            if (config.frame_rate.fixed === false ||
                config.frame_rate.fps_num === 0 ||
                config.frame_rate.fps_den === 0) {
                meta.frameRate = this._referenceFrameRate;
            }

            let fps_den = meta.frameRate.fps_den;
            let fps_num = meta.frameRate.fps_num;
            meta.refSampleDuration = meta.timescale * (fps_den / fps_num);

            let codecArray = sps.subarray(1, 4);
            let codecString = 'avc1.';
            for (let j = 0; j < 3; j++) {
                let h = codecArray[j].toString(16);
                if (h.length < 2) {
                    h = '0' + h;
                }
                codecString += h;
            }
            meta.codec = codecString;

            let mi = this._mediaInfo;
            mi.width = meta.codecWidth;
            mi.height = meta.codecHeight;
            mi.fps = meta.frameRate.fps;
            mi.profile = meta.profile;
            mi.level = meta.level;
            mi.refFrames = config.ref_frames;
            mi.chromaFormat = config.chroma_format_string;
            mi.sarNum = meta.sarRatio.width;
            mi.sarDen = meta.sarRatio.height;
            mi.videoCodec = codecString;

            if (mi.hasAudio) {
                if (mi.audioCodec != null) {
                    mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + ',' + mi.audioCodec + '"';
                }
            } else {
                mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + '"';
            }
            if (mi.isComplete()) {
                this._onMediaInfo(mi);
            }
        }

        let ppsCount = v.getUint8(offset);  // numOfPictureParameterSets
        if (ppsCount === 0) {
            this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No PPS');
            return;
        } else if (ppsCount > 1) {
            logger.w(this.TAG, `Flv: Strange AVCDecoderConfigurationRecord: PPS Count = ${ppsCount}`);
        }

        offset++;

        for (let i = 0; i < ppsCount; i++) {
            let len = v.getUint16(offset, !le);  // pictureParameterSetLength
            offset += 2;

            if (len === 0) {
                continue;
            }

            // pps is useless for extracting video information
            offset += len;
        }

        meta.avcc = new Uint8Array(payload.length);
        meta.avcc.set(new Uint8Array(payload), 0);
        logger.v(this.TAG, 'Parsed AVCDecoderConfigurationRecord');

        if (this._isInitialMetadataDispatched()) {
            // flush parsed frames
            if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
                this._onDataAvailable(this._audioTrack, this._videoTrack);
            }
        } else {
            this._videoInitialMetadataDispatched = true;
        }
        // notify new metadata
        this._dispatch = false;
        this._onTrackMetadata('video', meta);
    }

    _parseAVCVideoData(payload, tagTimestamp, tagPosition, frameType, cts) {
        logger.v(this.TAG, tagTimestamp, tagPosition, this._timestampBase);

        let le = this._littleEndian;
        let v = new DataView(payload.buffer);

        let units = [], length = 0;

        let dataSize = payload.length;

        let offset = 0;
        const lengthSize = this._naluLengthSize;
        let dts = this._timestampBase + tagTimestamp;
        let keyframe = (frameType === 1);  // from FLV Frame Type constants

        while (offset < dataSize) {
            if (offset + 4 >= dataSize) {
                logger.w(this.TAG, `Malformed Nalu near timestamp ${dts}, offset = ${offset}, dataSize = ${dataSize}`);
                break;  // data not enough for next Nalu
            }
            // Nalu with length-header (AVC1)
            let naluSize = v.getUint32(offset, !le);  // Big-Endian read
            if (lengthSize === 3) {
                naluSize >>>= 8;
            }
            if (naluSize > dataSize - lengthSize) {
                logger.w(this.TAG, `Malformed Nalus near timestamp ${dts}, NaluSize > DataSize!`);
                return;
            }

            let unitType = v.getUint8(offset + lengthSize) & 0x1F;

            if (unitType === 5) {  // IDR
                keyframe = true;
            }

            let data = new Uint8Array(payload.slice(offset, offset + lengthSize + naluSize));
            let unit = {type: unitType, data: data};
            units.push(unit);
            length += data.byteLength;

            offset += lengthSize + naluSize;
        }

        if (units.length) {
            let track = this._videoTrack;
            let avcSample = {
                units: units,
                length: length,
                isKeyframe: keyframe,
                dts: dts,
                cts: cts,
                pts: (dts + cts)
            };
            if (keyframe) {
                avcSample.fileposition = tagPosition;
            }
            track.samples.push(avcSample);
            track.length += length;
        }
    }
}

/* harmony default export */ const rtmp_RTMPMediaMessageHandler = (RTMPMediaMessageHandler);

;// CONCATENATED MODULE: ./src/rtmp/AMF0Object.js



class AMF0Object {
	TAG = "AMF0Object";

	data;

    params;

	/**
	 *
	 * @param {Object} params
	 */
	constructor(params) {
		if(params) {
            this.params = params;
			logger.d(this.TAG, "cmd: " + this.params[0]);
		}
	}

    /**
     *
     * @param {Uint8Array} data
     * @returns {*[]}
     */
	parseAMF0(data) {
		this.data = Array.from(data);
		let obj = [];

		while (this.data.length > 0) {
			const var_type = this.data.shift();

			switch(var_type) {
			case 0x00: // Number
				obj.push(_byteArrayToNumber(this.data.slice(0, 8)));
				this.data = this.data.slice(8);
				break;

			case 0x01: // boolean
				if (this.data.shift() === 0) {
					obj.push(false);
				} else {
					obj.push(true);
				}

				break;

			case 0x02: // String
				let len = (this.data[0] << 8) | (this.data[1]);
				this.data = this.data.slice(2);

				obj.push(_byteArrayToString(this.data.slice(0, len)));
				this.data = this.data.slice(len);
				break;

			case 0x03: // AMF encoded object
				obj.push(this._parseAMF0Object());
				break;

			case 0x05: // NUll
                obj.push(null);
				break;

            default:
                logger.w(this.TAG, "var_type: " + var_type + " not yet implemented");
                break;
			}
		}
        this.params = obj;
		return obj;
	}

	_parseAMF0Object() {
		let o2 = {};

		while (this.data.length > 0) {
			let keylen = (this.data[0] << 8) | (this.data[1]); this.data = this.data.slice(2);

			// Object end marker
			if (keylen === 0 && this.data[0] === 9) {
				this.data = this.data.slice(1);
				return o2;
			}

			let keyName = _byteArrayToString(this.data.slice(0, keylen)); this.data = this.data.slice(keylen);

			const var_type = this.data.shift();

			switch(var_type) {
            case 0x00: // Number
                o2[keyName] = _byteArrayToNumber(this.data.slice(0, 8));
                this.data = this.data.slice(8);
                break;

            case 0x01: // boolean
                if (this.data.shift() === 0) {
                    o2[keyName] = false;
                } else {
                    o2[keyName] = true;
                }

                break;

            case 0x02: // String
                let len = (this.data[0] << 8) | (this.data[1]);
                this.data = this.data.slice(2);

                o2[keyName] = _byteArrayToString(this.data.slice(0, len));
                this.data = this.data.slice(len);
                break;

            case 0x05:
                o2[keyName] = null;
                break;

            default:
				logger.w(this.TAG, "var_type: " + var_type + " not yet implemented");
                break;
			}
		}

		return o2;
	}

    /**
     *
     * @returns {Uint8Array}
     */
	getBytes() {
		let bytes = [];

        for(let i = 0; i < this.params.length; i++) {
            const param = this.params[i];

            switch(typeof param){
            case "string":
                // Command
                bytes.push(0x02); // String
                bytes.push(param.length >>> 8);
                bytes.push(param.length);
                bytes = bytes.concat(_stringToByteArray(param));
                break;

            case "number":
                // TransactionID
                bytes.push(0x00); // Number
                bytes = bytes.concat(_numberToByteArray(param));
                break;

            case "object":
                // Command Object
                bytes.push(0x03); // Object

                for (let key in param) {
                    let value = param[key];
                    let keylength = key.length;

                    bytes.push(keylength >>> 8);
                    bytes.push(keylength);
                    bytes = bytes.concat(_stringToByteArray(key));

                    switch(typeof value) {
                    case "object":
                        if (value == null) {
                            bytes.push(0x05); // Null
                        }

                        break;

                    case "string":
                        const length = value.length;
                        bytes.push(0x02);
                        bytes.push(length >>> 8);
                        bytes.push(length);
                        bytes = bytes.concat(_stringToByteArray(value))
                        break;

                    case "number":
                        bytes.push(0x00);
                        bytes = bytes.concat(_numberToByteArray(value))
                        break;

                    case "boolean":
                        bytes.push(0x01);
                        if (value) bytes.push(0x01);
                        else bytes.push(0x00);
                        break;

                    default:
						logger.w(this.TAG, typeof value, " not yet implementd");
                        break;
                    }
                }

                bytes.push(0x00); // End Marker
                bytes.push(0x00);
                bytes.push(0x09);
                break;

            case "boolean":
                bytes.push(0x01);
                if(param) bytes.push(0x01);
                else bytes.push(0x00);
                break;

            default:
				logger.w(this.TAG, typeof param, " not yet implementd");
                break;
            }
        }

		return new Uint8Array(bytes);
	}

    getCommand(){
        return this.params[0];
    }

    getTransactionId(){
        return this.params[1];
    }

    getCommandObject(){
        return this.params[2];
    }

    getAdditionalInfo(){
        return this.params[3];
    }
}

/* harmony default export */ const rtmp_AMF0Object = (AMF0Object);

;// CONCATENATED MODULE: ./src/rtmp/RTMPMessageHandler.js
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










class RTMPMessageHandler {
    TAG = "RTMPMessageHandler";

    netconnections = {};
    chunk_stream_id = 2;
    trackedCommand = "";
    socket;
    current_stream_id;

    /**
     *
     * @param {WebSocket} socket
     */
    constructor(socket) {
        this.socket = socket;
        this.chunk_parser = new rtmp_ChunkParser(this);
        this.media_handler = new rtmp_RTMPMediaMessageHandler();

        this.media_handler.onError = (type, info)=>{
            logger.d(this.TAG, type, info);
            postMessage(["onError", type, info]);
        }

        this.media_handler.onMediaInfo = (mediainfo)=>{
            logger.d(this.TAG, mediainfo);
            postMessage(["onMediaInfo", mediainfo]);
        }

        this.media_handler.onMetaDataArrived = (metadata)=>{
            postMessage(["onMetaDataArrived", metadata]);
        }

        this.media_handler.onScriptDataArrived= (data)=>{
            postMessage(["onScriptDataArrived", data]);
        }

        this.media_handler.onScriptDataArrived= (data)=>{
            postMessage(["onMetaDataArrived", data]);
        }

        this.media_handler.onScriptDataArrived= (data)=>{
            postMessage(["onMetaDataArrived", data]);
        }
    }

    /**
     *
     * @param {Uint8Array} data
     */
    parseChunk(data){
        logger.d(this.TAG, "parseChunk: " + data.length);
        this.chunk_parser.parseChunk(data);
    }

    /**
     *
     * @param {RTMPMessage} msg
     */
    onMessage(msg){
        logger.d(this.TAG, " onMessage: " + msg.getMessageType() + " StreamID:" + msg.getMessageStreamID());

        switch(msg.getMessageType()){
        case 1:         // PCM Set Chunk Size
        case 2:         // PCM Abort Message
        case 3:         // PCM Acknowledgement
        case 5:         // PCM Window Acknowledgement Size
        case 6:         // PCM Set Peer Bandwidth
            this.netconnections[msg.getMessageStreamID()].parseMessage(msg);
            break;

        case 4:          // User Control Messages
            this._handleUserControlMessage(msg);
            break;

        case 8:         // Audio Message
            logger.d(this.TAG, "AUDIOFRAME: ", msg);
            this.media_handler.handleMediaMessage(msg);
            break;

        case 9:         // Video Message
            logger.d(this.TAG, "VIDEOFRAME: ", msg);
            this.media_handler.handleMediaMessage(msg);
            break;

        case 18:        // Data Message AMF0
            logger.d(this.TAG, "DATAFRAME: ", msg);
            this.media_handler.handleMediaMessage(msg);
            break;

        case 19:        // Shared Object Message AMF0
            logger.d(this.TAG, "SharedObjectMessage", msg);
            break;

        case 20:        // Command Message AMF0
            const command = new rtmp_AMF0Object();
            let cmd = command.parseAMF0(msg.getPayload());

            logger.d(this.TAG, "AMF0", cmd);

            switch(cmd[0]) {
            case "_error":
                logger.e(this.TAG, cmd);
                break;

            case "_result":
                switch(this.trackedCommand){
                case "connect":
                    logger.d(this.TAG,"got _result: " + cmd[3].code);
                    if(cmd[3].code === "NetConnection.Connect.Success") {
                        postMessage([cmd[3].code]);
                        this.createStream(null);
                    }
                    break;

                case "createStream":
                    logger.d(this.TAG,"got _result: " + cmd[3]);
                    if(cmd[3]) {
                        this.current_stream_id = cmd[4];
                        postMessage(["RTMPStreamCreated", cmd[3], cmd[4]]);
                    }
                    break;

                case "play":
                    break;

                case "pause":
                    break;

                default:
                    logger.w("tracked command:" + this.trackedCommand);
                    break;
                }

                break;

            case "onStatus":
                logger.d(this.TAG,"onStatus: " + cmd[3].code);
                postMessage([cmd[3].code]);
                break;

            default:
                logger.w(this.TAG,"CommandMessage " + cmd[0] + " not yet implemented");
                break;
            }

            break;

        case 22:        // Aggregate Message
            break;

        case 15:        // Data Message AMF3
        case 16:        // Shared Object Message AMF3
        case 17:        // Command Message AMF3
            logger.e(this.TAG,"AMF3 is not yet implemented");
            break;

        default:
            logger.d(this.TAG,"[MessageType: " + rtmp_RTMPMessage.MessageTypes[msg.getMessageType()] + "(" + msg.getMessageType() + ")");
            break;

        }
    }

    /**
     *
     * @param {Object} connectionParams
     */
    connect(connectionParams){
        const command = new rtmp_AMF0Object([
            "connect", 1, connectionParams
        ]);

        this._sendCommand(3, command);
    }

    /**
     *
     * @param {Object} options
     */
    createStream(options){
        const command = new rtmp_AMF0Object([
            "createStream", 1, options
        ]);

        this._sendCommand(3, command);
    }

    deleteStream(stream_id){
        const command = new rtmp_AMF0Object([
            "deleteStream", 1, null, stream_id
        ]);

        this._sendCommand(3, command);
    }

    /**
     *
     * @param {String} streamName
     */
    play(streamName){
        const command = new rtmp_AMF0Object([
            "play", 1, null, streamName
        ]);

        this._sendCommand(3, command);
    }

    stop(){
        this.deleteStream(this.current_stream_id);
    }

    /**
     *
     * @param {boolean} enable
     */
    pause(enable){
        const command = new rtmp_AMF0Object([
            "pause", 0, null, enable,0
        ]);

        this._sendCommand(3, command);
    }

    receiveVideo(enable){
        const command = new rtmp_AMF0Object([
            "receiveVideo", 0, null, enable
        ]);

        this._sendCommand(3, command);
    }

    receiveAudio(enable){
        const command = new rtmp_AMF0Object([
            "receiveAudio", 0, null, enable
        ]);

        this._sendCommand(3, command);
    }

    /**
     *
     * @param {Number} csid
     * @param {AMF0Object} command
     * @private
     */
    _sendCommand(csid, command){
        logger.d(this.TAG, "sendCommand:", command);

        this.trackedCommand = command.getCommand();

        let msg = new rtmp_RTMPMessage(command.getBytes());
        msg.setMessageType(0x14);		// AMF0 Command
        msg.setMessageStreamID(0);

        const chunk = new rtmp_Chunk(msg);
        chunk.setChunkStreamID(csid);

        let buf = chunk.getBytes();

        this.netconnections[0] = new rtmp_NetConnection(0, this);

        this.socket.send(buf);
    }

    /**
     *
     * @param {Number} size
     */
    setChunkSize(size){
        this.chunk_parser.setChunkSize(size);
    }

    _getNextMessageStreamID(){
        return this.netconnections.length;
    }

    _getNextChunkStreamID(){
        return ++this.chunk_stream_id;      // increase chunk stream id
    }

    /**
     *
     * @param {RTMPMessage} msg
     * @private
     */
    _handleUserControlMessage(msg) {
        let data = msg.getPayload()

        this.event_type = (data[0] <<8) | data[1];
        data = data.slice(2);

        switch (this.event_type){
            case 0x00:      // StreamBegin
            case 0x01:      // Stream EOF
            case 0x02:      // StreamDry
            case 0x04:      // StreamIsRecorded
                this.event_data1 = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
                break;


            case 0x03:      // SetBuffer
                this.event_data1 = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
                this.event_data2 = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | (data[7]);
                break;

            case 0x06:      // PingRequest
            case 0x07:      // PingResponse
                this.event_data1 = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
                break;
        }

        // Handle Ping internal
        if(this.event_type === 0x06) {  // Ping Request
            postMessage(["UserControlMessage", ["ping", this.event_data1]]);

            const msg = new rtmp_UserControlMessage();
            msg.setType(0x07);          // Ping Response
            msg.setEventData(this.event_data1);


            let m2 = new rtmp_RTMPMessage(msg.getBytes());
            m2.setMessageType(0x04)     // UserControlMessage

            const chunk = new rtmp_Chunk(m2);
            chunk.setChunkStreamID(2);  // Control Channel

            logger.i(this.TAG,"send Pong");
            this.socket.send(chunk.getBytes());
        }
    }
}

/* harmony default export */ const rtmp_RTMPMessageHandler = (RTMPMessageHandler);


;// CONCATENATED MODULE: ./src/wss/connection.worker.js
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






const TAG = "WebRTMP Worker";

let port;
let host;
let message_handler;
logger.LEVEL = logger.DEBUG;

const wss_manager = new wss_WSSConnectionManager();

self.addEventListener('message', function(e) {
	let data = e.data;

	logger.d(TAG, "CMD: " + data.cmd);

	switch(data.cmd) {
		case "open":    // connect WebSocket
			host = data.host;
			port = data.port;

			wss_manager.open(host, port, (success)=>{
				logger.v(TAG, "open: " + host + ":" +port);
				if(success){
					logger.v(TAG, "WSSConnected");
					postMessage(["WSSConnected"]);

					const handshake = new rtmp_RTMPHandshake(wss_manager.getSocket());

					handshake.onHandshakeDone = (success)=>{
						if(success){
							message_handler = new rtmp_RTMPMessageHandler(wss_manager.getSocket());

							logger.d(TAG, "connect to RTMPManager");

							wss_manager.registerMessageHandler((e)=> {
								message_handler.parseChunk(new Uint8Array(e.data));
							});

							postMessage(["RTMPHandshakeDone"]);

						} else {
							logger.e(TAG, "Handshake failed");
							postMessage(["RTMPHandshakeFailed"]);
						}
					};

					handshake.do();

				} else {
					logger.v(this.TAG, "WSSConnectFailed");
					postMessage(["WSSConnectFailed"]);
				}
			});
			break;

		case "connect":             // RTMP Connect Application
            if(!message_handler) {
                logger.e(this.TAG, "RTMP not connected");
                break;
            }
			message_handler.connect(makeDefaultConnectionParams(data.appName));
			break;

		case "play":
            if(!message_handler) {
                logger.e(this.TAG, "RTMP not connected");
                break;
            }
			message_handler.play(data.streamName);
			break;

		case "stop":
            if(!message_handler) {
                logger.e(this.TAG, "RTMP not connected");
                break;
            }
			message_handler.stop();
			break;

        case "pause":
            if(!message_handler) {
                logger.e(this.TAG, "RTMP not connected");
                break;
            }
			message_handler.pause(data.enable);
            break;

        case "disconnect":
            if(!message_handler) {
                logger.e(this.TAG, "RTMP not connected");
                break;
            }
			wss_manager.close();
			break;

		case "loglevels":
			logger.d(TAG, "setting loglevels", data.loglevels);
			logger.loglevels = data.loglevels;
            break;

		default:
			logger.w(TAG, "Unknown CMD: " + data.cmd);
			break;
	}

}, false);

function makeDefaultConnectionParams(application){
	return {
		"app": application,
		"flashVer": "WebRTMP 0,0,1",
		"tcUrl": "rtmp://" + host + ":1935/" + application,
		"fpad": false,
		"capabilities": 15,
		"audioCodecs": 0x0400,	// AAC
		"videoCodecs": 0x0080,	// H264
		"videoFunction": 0		// Seek false
	};
}

postMessage(["Started"]);


/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=webrtmp.worker.js.map