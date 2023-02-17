/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***********************************************!*\
  !*** ./wss/connection.worker.js + 19 modules ***!
  \***********************************************/

;// CONCATENATED MODULE: ./wss/WSSConnectionManager.js
class WSSConnectionManager{
    wss;

    connect(host, port, callback){
        console.log("[ WSSConnectionManager ] connecting to : " + host + ":" + port);
        this.wss = new WebSocket("wss://" + host + ":" + port + "/");

        this.wss.binaryType = "arraybuffer";

        this.wss.onopen = (e)=>{
            console.log(e);
            callback(true);
        }

        this.wss.onclose = (e)=>{
            console.log(e);
            postMessage(["ConnectionLost"]);
        }

        this.wss.onerror = (e)=>{
            console.log(e);
            postMessage(["Failure"]);
        }
    }

    registerMessageHandler(cb){
        this.wss.onmessage = cb;
    }

    getSocket(){
        return this.wss;
    }

    close(){
        this.wss.close();
    }
}

/* harmony default export */ const wss_WSSConnectionManager = (WSSConnectionManager);

;// CONCATENATED MODULE: ./rtmp/RTMPHandshake.js
class RTMPHandshake{
    state = 0;
    c1;
    c2;
    s1;
    s2;

    constructor(socket) {
        this.socket = socket;

        this.socket.onmessage = (e)=>{
            this.processServerInput(e.data);
        }
    }

    do(){
        console.log("send C0");
        this.socket.send(new Uint8Array([0x03]));
        this.state = 1;

        this._generateC1();
        console.log("send C1");
        this.socket.send(this.c1);
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
    }

    _generateC2(){
        console.log("[ RTMPHandshake ] send C2");
        this.socket.send(this.s1);
        this.state = 5;
    }

    _parseS0(data){
        console.log("[ RTMPHandshake ] S0: ", data);

        let buffer = new Uint8Array(data);

        if(buffer.at(0) != 0x03) {
            console.error("[ RTMPHandshake ] S0 response not 0x03");

        } else {
            console.log("1st Byte OK");
        }

        this.state = 3;

        if(buffer.length > 1) {
            console.log("S1 included");
            data = data.slice(1);
            this.processServerInput(data);
        }
    }

    _parseS1(data){
        console.log("[ RTMPHandshake ] parse S1: ", data);
        this.state = 4;

        this.s1 = data;

        this._generateC2();
    }

    _parseS2(data) {
        console.log("[ RTMPHandshake ] parse S2: ", data);

        let newdata = [];

        if(data.length > 1536) {
            console.log("data stripped");
            data = data.slice(1536);
        }


        if(!this._compare(this.c1, new Uint8Array(data))) {
            console.warn("C1 S1 not equal");
            this.onHandshakeDone(false);
            return;
        }

        this.state = 6;

        console.log("[ RTMPHandshake ] RTMP Connection established");

        this.onHandshakeDone(true);
    }

    _compare(ar1, ar2){
        for(let i = 0; i < ar1.length; i++){
            if(ar1[i] != ar2[i]) return false;
        }

        return true;
    }

    onHandshakeDone(){

    }

    processServerInput(data){
        console.log("[ Connection Worker ] processing mode " + this.state + ": ", data);

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

function _numberToByteArray(num) {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, num, false);
    return [].slice.call(new Uint8Array(buffer));
}

function _byteArrayToNumber(ba){
    let buf = new ArrayBuffer(ba.length);
    let view = new DataView(buf);

    ba.forEach(function (b, i) {
        view.setUint8(i, b);
    });

    return view.getFloat64(0);
}

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

;// CONCATENATED MODULE: ./rtmp/RTMPMessage.js


class RTMPMessage{
    static MessageTypes = ["dummy", "PCMSetChunkSize", "PCMAbortMessage", "PCMAcknolegement", "UserControlMessage", "WindowAcknowledgementSize", "PCMSetPeerBandwidth",
        "dummy", "AudioMessage", "VideoMessage", "dummy", "dummy", "dummy", "dummy", "dummy", "DataMessageAMF3", "Shared Object Message AMF3", "CommandMessageAMF3",
        "DataMessageAMF0", "SharedObjectMessageAMF0", "CommandMessageAMF0", "dummy", "Aggregate Message"];

    messageType;
	messageLength;
    length;
	timestamp;
    extendedTimestamp = false;
	message_stream_id = 0;
	payload;

    /**
     *
     * @param {Uint8Array} payload
     */
	constructor(payload) {
        if(payload) {
            this.setPayload(payload);
        }
	}

    /**
     *
     * @param {Uint8Array} payload
     */
	setPayload(payload){
		this.payload = payload;
		this.length = this.payload.length;
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
		this.timestamp = timestamp;
	}

    /**
     *
     * @param {boolean} yes
     */
    setExtendedTimestamp(yes){
        this.extendedTimestamp = yes;
    }

    getExtendedTimestamp(){
        return this.extendedTimestamp;
    }

	addPayload(data){
		if(data.length > this.bytesMissing()) {
			console.error("try to add too much data");
			return;
		}

		this.payload = _concatArrayBuffers(this.payload, data);
		this.length = this.payload.length;
		console.log("[ RTMPMessage ] payload size is now: " + this.length);
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

;// CONCATENATED MODULE: ./rtmp/Chunk.js


class Chunk{
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
            console.log("[ Chunk ] create chunk: " + p.length);
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

    setChunkStreamID(chunk_stream_id) {
        console.log("[ Chunk ] setChunkStreamID:" + chunk_stream_id);
        this.chunk_stream_id = chunk_stream_id;
    }

    setMessageStreamID(message_stream_id) {
        this.message_stream_id = message_stream_id;
    }

    setTimestamp(timestamp){
        this.timestamp = timestamp;
    }
}

/* harmony default export */ const rtmp_Chunk = (Chunk);

;// CONCATENATED MODULE: ./rtmp/UserControlMessage.js
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

;// CONCATENATED MODULE: ./rtmp/ProtocolControlMessage.js
class ProtocolControlMessage{
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
            console.error("Protocol Control Message Type: " + pcm_type + " use SetPeerBandwidthMessage");
            break;

        default:
            console.error("Protocol Control Message Type: " + pcm_type + " not supported");
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

;// CONCATENATED MODULE: ./rtmp/NetConnection.js




class NetConnection{
    WindowAcknowledgementSize;
    MessageStreamID;
    CHUNK_SIZE = 128;
    BandWidth;
    socket;

    netstreams = [];

    /**
     *
     * @param {Number} message_stream_id
     * @param {RTMPMessageHandler} handler
     */
    constructor(message_stream_id, handler) {
        this.MessageStreamID = message_stream_id;

        console.log(handler);

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
            console.log("[ NetConnection ] WindowAcknowledgementSize: " + this.WindowAcknowledgementSize);
            break;

        case 6:         // PCM Set Peer Bandwidth
            this.BandWidth = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            console.log("[ NetConnection ] SetPeerBandwidth: " + this.BandWidth);

            // send Window Ack Size
            let msg = new rtmp_ProtocolControlMessage(0x05, this.WindowAcknowledgementSize);

            let m2 = new rtmp_RTMPMessage(msg.getBytes());
            m2.setMessageType(0x05)     // WinACKSize

            const chunk = new rtmp_Chunk(m2);
            chunk.setChunkStreamID(2);  // Control Channel

            console.log("[ NetConnection ] send WindowAcksize");
            this.socket.send(chunk.getBytes());

            break;

        default:
            break;
        }
    }

    createStream(){

    }
}

/* harmony default export */ const rtmp_NetConnection = (NetConnection);

;// CONCATENATED MODULE: ./rtmp/ChunkParser.js



class ChunkParser {
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
            console.log("[ ChunkParser ] buffer length: " + this.buffer.length);

            if(this.buffer.length < 100) console.log(this.buffer);

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
            console.log("[ ChunkParser ] chunk type: ", fmt);

            // Basic Header ChunkID
            let csid = data[header_length++] & 0x3f;	// lower 6 bits

            if(csid === 0) {					// csid is 14bit
                csid = data[header_length++] + 64;

            } else if (csid === 1) {			// csid is 22bit
                csid = data[header_length++] * 256 + data[header_length++] + 64;
            }

            console.log("[ ChunkParser ] chunk_stream_id: ", csid);

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
                    timestamp += data[header_length++];
                    msg.setExtendedTimestamp(true);
                }

                msg.setMessageTimestamp(timestamp);

                console.log("[ ChunkParser ] message_length: " + message_length);

                payload_length = message_length;

                if(payload_length > this.CHUNK_SIZE){
                    // Wir erwarten CHUNK_SIZE bytes
                    payload_length = this.CHUNK_SIZE;
                }

                payload = data.slice(header_length, header_length +payload_length);

                // haben wir alles
                if(payload.length < payload_length){
                    // wait for next packet
                    console.log("[ ChunkParser ] packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                    return;
                }

                msg.setPayload(payload);

                this.chunkstreams[csid] = msg;
                break;

            case 1:		// 7 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp
                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte Message length

                msg = new rtmp_RTMPMessage();
                msg.setMessageType(data[header_length++]);
                msg.setMessageLength(message_length);

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp += data[header_length++];
                    msg.setExtendedTimestamp(true);
                }
                msg.setMessageTimestamp(timestamp);


                console.log("[ ChunkParser ] message_length: " + message_length);

                payload_length = message_length;

                if(payload_length > this.CHUNK_SIZE){
                    // Wir erwarten CHUNK_SIZE bytes
                    payload_length = this.CHUNK_SIZE;
                }

                payload = data.slice(header_length, header_length +payload_length);

                // haben wir alles? message_length oder CHUNK_SIZE
                if(payload.length < payload_length){
                    // wait for next packet
                    console.log("[ ChunkParser ] packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                    return;
                }

                msg.setPayload(payload);

                this.chunkstreams[csid] = msg;
                break;

            case 2:		// 3 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp delta

                msg = this.chunkstreams[csid];

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp += data[header_length++];
                    msg.setExtendedTimestamp(true);
                }

                msg.setMessageTimestamp(timestamp);

                payload = data.slice(header_length);
                payload_length = msg.getMessageLength();

                // haben wir alles
                if(payload.length < payload_length){
                    // wait for next packet
                    console.log("[ ChunkParser ] packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                    return;
                }

                if(payload.length > this.CHUNK_SIZE) {
                    msg.addPayload(payload.slice(0, this.CHUNK_SIZE));
                } else {
                    msg.addPayload(payload);
                }
                break;

            case 3:		// 0 byte
                msg = this.chunkstreams[csid];

                // extended timestamp is present when setted in the chunk stream
                if(msg.getExtendedTimestamp()) {
                    header_length++;
                }

                payload_length = msg.bytesMissing();

                if(payload_length > this.CHUNK_SIZE) {
                    payload_length = this.CHUNK_SIZE;
                }

                payload = data.slice(header_length, header_length +payload_length);

                // haben wir alles
                if(payload.length < payload_length){
                    // wait for next packet
                    console.log("[ ChunkParser ] packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                    return;
                }

                msg.addPayload(payload);
                break;
            }








            if(this.chunkstreams[csid].isComplete()) {     // Message complete
                console.log("[ ChunkParser ] RTMP: ", msg.getMessageType(), rtmp_RTMPMessage.MessageTypes[msg.getMessageType()], msg.getPayloadlength(), msg.getMessageStreamID());

                this.conn_worker.onMessage(this.chunkstreams[csid]);
            }

            let consumed = (header_length + payload_length);

            console.log("[ ChunkParser ] cut: " + consumed);

            if(isNaN(consumed)) {
                return;
            }

            if(consumed > this.buffer.length) {
                console.warn("[ ChunkParser ] mehr abschneiden als da");
                return;
            }

            this.buffer = this.buffer.slice(consumed);
            console.log("[ ChunkParser ] now: " + this.buffer.length);

        } while(this.buffer.length > 11);   // minimum size

        console.log("parseChunk complete");
    }

    /**
     *
     * @param {Number} size
     */
    setChunkSize(size){
        console.log("[ ChunkParser ] SetChunkSize: " + size);
        this.CHUNK_SIZE = size;
    }
}

/* harmony default export */ const rtmp_ChunkParser = (ChunkParser);

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

class exception_IllegalStateException extends RuntimeException {
    constructor(message) {
        super(message);
    }

    get name() {
        return 'IllegalStateException';
    }
}

class exception_InvalidArgumentException extends RuntimeException {
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

;// CONCATENATED MODULE: ./utils/utf8-conv.js
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

;// CONCATENATED MODULE: ./flv/amf-parser.js
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

    /**
     *
     * @param {Uint8Array} array
     * @returns {{}}
     */
    static parseScriptData(array) {
        console.log(array);

        let data = {};

        try {
            let name = AMF.parseValue(array);
            console.log(name);

            let value = AMF.parseValue(array.slice(name.size));
            console.log(value);

            data[name.data] = value.data;

        } catch (e) {
            console.error('AMF', e.toString());
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
            throw new exception_IllegalStateException('Data not enough when parse ScriptDataObject');
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
            throw new exception_IllegalStateException('Data not enough when parse String');
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
            throw new exception_IllegalStateException('Data not enough when parse LongString');
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
            throw new exception_IllegalStateException('Data size invalid when parse Date');
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
            throw new exception_IllegalStateException('Data not enough when parse Value');
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
                    console.warn('Unsupported AMF value type ' + type);
            }
        } catch (e) {
            console.error('AMF', e.toString());
        }

        return {
            data: value,
            size: offset,
            objectEnd: objectEnd
        };
    }
}

/* harmony default export */ const amf_parser = (AMF);

;// CONCATENATED MODULE: ./utils/logger.js
class Log {
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

;// CONCATENATED MODULE: ./flv/exp-golomb.js
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

;// CONCATENATED MODULE: ./flv/sps-parser.js
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

;// CONCATENATED MODULE: ./rtmp/RTMPMediaMessageHandler.js







class RTMPMediaMessageHandler{
    TAG = "RTMPMediaMessageHandler";

    constructor(probeData, config) {
        this._config = config;

        this._onError = null;
        this._onMediaInfo = null;
        this._onMetaDataArrived = null;
        this._onScriptDataArrived = null;
        this._onTrackMetadata = null;
        this._onDataAvailable = null;

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
        if (!this._onError || !this._onMediaInfo || !this._onTrackMetadata || !this._onDataAvailable) {
            throw new exception_IllegalStateException('Flv: onError & onMediaInfo & onTrackMetadata & onDataAvailable callback must be specified');
        }

        this._dispatch = true;

        let tagType = msg.getMessageType();
        let timestamp = msg.getTimestamp();
        let streamId = msg.getMessageStreamID()
        if (streamId !== 0) {
            Log.w(this.TAG, 'Meet tag which has StreamID != 0!');
        }

        switch (tagType) {
            case 8:  // Audio
                this._parseAudioData(msg.getPayload(), timestamp);
                break;
            case 9:  // Video
                this._parseVideoData(msg.getPayload(), timestamp, 0);
                break;
            case 18:  // ScriptDataObject
                this._parseScriptData(msg.getPayload());
                break;
        }

        // dispatch parsed frames to consumer (typically, the remuxer)
        if (this._isInitialMetadataDispatched()) {
            if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
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
                Log.w(this.TAG, 'Invalid onMetaData structure!');
                return;
            }
            if (this._metadata) {
                Log.w(this.TAG, 'Found another onMetaData tag!');
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
            Log.v(this.TAG, 'Parsed onMetaData');
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
        if (payload.length <= 1) {
            Log.w(this.TAG, 'Flv: Invalid audio packet, missing SoundData payload!');
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
                    Log.w(this.TAG, 'Found another AudioSpecificConfig!');
                }
                let misc = aacData.data;
                meta.audioSampleRate = misc.samplingRate;
                meta.channelCount = misc.channelCount;
                meta.codec = misc.codec;
                meta.originalCodec = misc.originalCodec;
                meta.config = misc.config;
                // The decode result of an aac sample is 1024 PCM samples
                meta.refSampleDuration = 1024 / meta.audioSampleRate * meta.timescale;
                Log.v(this.TAG, 'Parsed AudioSpecificConfig');

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
                Log.e(this.TAG, `Flv: Unsupported AAC data type ${aacData.packetType}`);
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
                Log.v(this.TAG, 'Parsed MPEG Audio Frame Header');

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
            Log.w(this.TAG, 'Flv: Invalid AAC packet, missing AACPacketType or/and Data!');
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
            Log.w(this.TAG, 'Flv: Invalid MP3 packet, header missing!');
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
            Log.w(this.TAG, 'Flv: Invalid video packet, missing VideoData payload!');
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
            Log.w(this.TAG, 'Flv: Invalid AVC packet, missing AVCPacketType or/and CompositionTime');
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
            Log.w(this.TAG, 'Flv: Invalid AVCDecoderConfigurationRecord, lack of data!');
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
                Log.w(this.TAG, 'Found another AVCDecoderConfigurationRecord!');
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
            Log.w(this.TAG, `Flv: Strange AVCDecoderConfigurationRecord: SPS Count = ${spsCount}`);
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
            Log.w(this.TAG, `Flv: Strange AVCDecoderConfigurationRecord: PPS Count = ${ppsCount}`);
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
        Log.v(this.TAG, 'Parsed AVCDecoderConfigurationRecord');

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
                Log.w(this.TAG, `Malformed Nalu near timestamp ${dts}, offset = ${offset}, dataSize = ${dataSize}`);
                break;  // data not enough for next Nalu
            }
            // Nalu with length-header (AVC1)
            let naluSize = v.getUint32(offset, !le);  // Big-Endian read
            if (lengthSize === 3) {
                naluSize >>>= 8;
            }
            if (naluSize > dataSize - lengthSize) {
                Log.w(this.TAG, `Malformed Nalus near timestamp ${dts}, NaluSize > DataSize!`);
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

;// CONCATENATED MODULE: ./rtmp/AMF0Object.js


class AMF0Object {
	command;
	transaction_id;
	command_object;
    additionalInfo;

	data;

    params;

	constructor(params) {
		if(params) {
            this.params = params;
			console.log("cmd: " + this.params[0]);
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
                console.warn("var_type: " + var_type + " not yet implemented");
                break;
			}
		}
        this.params = obj;
		return obj;
	}

	_parseAMF0Object() {
		let o2 = {};

		//console.log("parseObject: " + this.data.length);

		while (this.data.length > 0) {
			let keylen = (this.data[0] << 8) | (this.data[1]); this.data = this.data.slice(2);

			// Object end marker
			if (keylen === 0 && this.data[0] === 9) {
				//console.log("endmarker found");
				this.data = this.data.slice(1);
				return o2;
			}

			let keyName = _byteArrayToString(this.data.slice(0, keylen)); this.data = this.data.slice(keylen);

			//console.log("key found: " + keyName);

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
                console.warn("var_type: " + var_type + " not yet implemented");
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

            //console.log("Param", i, typeof param);

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
                    //console.log("param: " + key);

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
                        console.warn(typeof value, " not yet implementd");
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
                console.warn(typeof param, " not yet implementd");
                break;
            }
        }

		return new Uint8Array(bytes);
	}

    getCommand(){
        return this.command;
    }

    getTransactionId(){
        return this.transaction_id;
    }

    getCommandObject(){
        return this.command_object;
    }

    getAdditionalInfo(){
        return this.additionalInfo;
    }
}

/* harmony default export */ const rtmp_AMF0Object = (AMF0Object);

const test = [
	0x02, 0x00, 0x07,  0x63, 0x6f, 0x6e, 0x6e, 0x65, 0x63, 0x74, // 7 connect
	0x00, 0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 		// Tid 1
	0x03, 		// object start
	0x00, 0x03,  0x61, 0x70, 0x70,  // key app 3
	0x02, 0x00, 0x08, 0x62, 0x75, 0x6e, 0x6b, 0x65, 0x72, 0x74, 0x76, // string bunkertv
	0x00, 0x08, 0x66, 0x6c, 0x61, 0x73, 0x68, 0x56, 0x65, 0x72,  // flashVer
	0x02, 0x00, 0x0d,  0x4c, 0x4e, 0x58, 0x20, 0x39, 0x2c, 0x30, 0x2c, 0x31, 0x32, 0x34, 0x2c, 0x32, //LNX
	0x00, 0x05, 0x74, 0x63, 0x55, 0x72, 0x6c,  // tcUrl...

	0x02, 0x00, 0x21,  0x72, 0x74, 0x6d, 0x70, 0x3a, 0x2f, 0x2f, 0x62, 0x75, 0x6e, 0x6b, 0x65,
	0x72, 0x74, 0x76, 0x2e, 0x6f, 0x72, 0x67, 0x3a, 0x31, 0x39, 0x33, 0x35, 0x2f, 0x62, 0x75, 0x6e,
	0x6b, 0x65, 0x72, 0x74, 0x76,

	0x00, 0x04, 0x66, 0x70, 0x61, 0x64, 		//fpad
	0x01, 0x00, 					// bool false
	0x00, 0x0c, 0x63, 0x61, 0x70, 0x61, 0x62, 0x69, 0x6c, 0x69, 0x74, 0x69, 0x65, 0x73,  //capabilities
	0x00, 0x40, 0x2e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x0b, 0x61, 0x75, 0x64, 0x69, 0x6f, 0x43, 0x6f, 0x64, 0x65, 0x63, 0x73, // audio..
	0x00, 0x40, 0xaf, 0xce, 0x00, 0x00, 0x00, 0x00, 0x00,

	0x00, 0x0b, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x43, 0x6f, 0x64, 0x65, 0x63, 0x73, //videocodecs
	0x00, 0x40, 0x6f, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x0d, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x46, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e, //videoFunction
	0x00, 0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x09];
;// CONCATENATED MODULE: ./rtmp/RTMPMessageHandler.js








class RTMPMessageHandler {
    netconnections = {};
    chunk_stream_id = 2;
    trackedCommand = "";
    socket;

    /**
     *
     * @param {WebSocket} socket
     */
    constructor(socket) {
        this.socket = socket;
        this.chunk_parser = new rtmp_ChunkParser(this);
        this.media_handler = new rtmp_RTMPMediaMessageHandler();

        this.media_handler.onError = (type, info)=>{
            console.log(type, info);
            postMessage(["onError", type, info]);
        }

        this.media_handler.onMediaInfo = (mediainfo)=>{
            console.log(mediainfo);
            postMessage(["onMediaInfo", mediainfo]);
        }

        this.media_handler.onTrackMetadata = (type, metadata)=>{
            console.log(type, metadata);
            postMessage(["onTrackMetadata", type, metadata]);
        }

        this.media_handler.onDataAvailable = (videoTrack, audioTrack)=>{
            console.log(videoTrack, audioTrack);
            postMessage(["onDataAvailable", videoTrack, audioTrack]);
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

        this.media_handler.onScriptDataArrived= (data)=>{
            postMessage(["onMetaDataArrived", data]);
        }
    }

    /**
     *
     * @param {Uint8Array} data
     */
    parseChunk(data){
        console.log("[ RTMPMessageHandler ] parseChunk: " + data.length);
        this.chunk_parser.parseChunk(data);
    }

    /**
     *
     * @param {RTMPMessage} msg
     */
    onMessage(msg){
        console.log("[ RTMPMessageHandler ] onMessage: " + msg.getMessageType() + " StreamID:" + msg.getMessageStreamID());

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
            console.log("[ RTMPMessageHandler ] AUDIOFRAME: ", msg.getPayload());
            this.media_handler.handleMediaMessage(msg);
            break;

        case 9:         // Video Message
            console.log("[ RTMPMessageHandler ] VIDEOFRAME: ", msg.getPayload());
            this.media_handler.handleMediaMessage(msg);
            break;

        case 18:        // Data Message AMF0
            console.log("[ RTMPMessageHandler ] DATAFRAME: ", msg.getPayload());
            this.media_handler.handleMediaMessage(msg);
            break;

        case 19:        // Shared Object Message AMF0
            //new SharedObjectMessage(msg.getPayload());
            break;

        case 20:        // Command Message AMF0
            const command = new rtmp_AMF0Object();
            let cmd = command.parseAMF0(msg.getPayload());

            console.log("[ RTMPMessageHandler ] AMF0", cmd);

            switch(cmd[0]) {
            case "_result":
                switch(this.trackedCommand){
                case "connect":
                    if(cmd[3].code == "NetConnection.Connect.Success") {
                        console.log("[ RTMPMessageHandler ] got _result: " + cmd[3].code);
                        postMessage([cmd[3].code]);
                        this.createStream();
                    }
                    break;

                case "createStream":
                    break;

                case "play":
                    break;
                }

                break;

            case "onStatus":
                console.log("[ RTMPMessageHandler ] onStatus: " + cmd[3].code);
                postMessage([cmd[3].code]);
                break;

            default:
                console.warn("[ RTMPMessageHandler ] CommandMessage " + cmd[0] + " not yet implemented");
                break;
            }

            break;

        case 22:        // Aggregate Message
            break;

        case 15:        // Data Message AMF3
        case 16:        // Shared Object Message AMF3
        case 17:        // Command Message AMF3
            console.error("[ RTMPMessageHandler ] AMF3 is not yet implemented");
            break;

        default:
            console.warn("[ RTMPMessageHandler ] MessageType: " + rtmp_RTMPMessage.MessageTypes[msg.getMessageType()] + "(" + msg.getMessageType() + ")");
            break;

        }
    }

    /**
     *
     * @param {Object} connectionParams
     * @param {callback} callback
     */
    connect(connectionParams, callback){
        this.callback = callback;
        const command = new rtmp_AMF0Object([
            "connect", 1, connectionParams
        ]);

        //const message_stream_id = this._getNextMessageStreamID();

        let msg = new rtmp_RTMPMessage(command.getBytes());
        msg.setMessageType(0x14);		// AMF0 Command
        msg.setMessageStreamID(0);

        const chunk = new rtmp_Chunk(msg);
        chunk.setChunkStreamID(this._getNextChunkStreamID());

        let buf = chunk.getBytes();

        this.netconnections[0] = new rtmp_NetConnection(0, this);

        this.trackedCommand = "connect";
        this.socket.send(buf);
    }

    /**
     *
     * @param {Object} options
     */
    createStream(options){
        this.trackedCommand = "createStream";

        const command = new rtmp_AMF0Object([
            "createStream", 1, options
        ]);

        let msg = new rtmp_RTMPMessage(command.getBytes());
        msg.setMessageType(0x14);		// AMF0 Command
        msg.setMessageStreamID(0);

        const chunk = new rtmp_Chunk(msg);
        chunk.setChunkStreamID(3);

        let buf = chunk.getBytes();

        this.netconnections[0] = new rtmp_NetConnection(0, this);

        this.socket.send(buf);
    }

    /**
     *
     * @param {String} streamName
     */
    play(streamName){
        this.trackedCommand = "play";

        const command = new rtmp_AMF0Object([
            "play", 1, null, streamName
        ]);

        let msg = new rtmp_RTMPMessage(command.getBytes());
        msg.setMessageType(0x14);		// AMF0 Command
        msg.setMessageStreamID(0);

        const chunk = new rtmp_Chunk(msg);
        chunk.setChunkStreamID(3);

        let buf = chunk.getBytes();

        this.netconnections[0] = new rtmp_NetConnection(0, this);

        this.socket.send(buf);
    }

    /**
     *
     * @param {boolean} enable
     */
    pause(enable){
        this.trackedCommand = "pause";

        const command = new rtmp_AMF0Object([
            "pause", 0, null, enable
        ]);

        let msg = new rtmp_RTMPMessage(command.getBytes());
        msg.setMessageType(0x14);		// AMF0 Command
        msg.setMessageStreamID(0);

        const chunk = new rtmp_Chunk(msg);
        chunk.setChunkStreamID(3);

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

            console.log("send Pong");
            this.socket.send(chunk.getBytes());
        }
    }
}

/* harmony default export */ const rtmp_RTMPMessageHandler = (RTMPMessageHandler);


;// CONCATENATED MODULE: ./wss/connection.worker.js




const port = 9001;
let host;
let message_handler;

const wss_manager = new wss_WSSConnectionManager();

self.addEventListener('message', function(e) {
	let data = e.data;

	console.log("[ WebRTMP Worker ] CMD: " + data.cmd);

	switch(data.cmd) {
		case "createConnection":    // connect WebSocket
			host = data.host;

			wss_manager.connect(data.host, port, (success)=>{
				if(success){
					postMessage(["WSSConnected"]);

					const handshake = new rtmp_RTMPHandshake(wss_manager.getSocket());

					handshake.onHandshakeDone = (success)=>{
						if(success){
							postMessage(["RTMPHandshakeDone"]);

							message_handler = new rtmp_RTMPMessageHandler(wss_manager.getSocket());

							console.log("[ WebRTMP Worker ] connect to RTMPManager");

							wss_manager.registerMessageHandler((e)=> {
								// connect to chunkparser
								message_handler.parseChunk(new Uint8Array(e.data));
							});

						} else {
							console.error("[ WebRTMP Worker ] Handshake failed");
						}
					};

					handshake.do();
				}
			});
			break;

		case "closeConnection":
			wss_manager.close();
			break;

		case "connect":             // RTMP Connect Application
			message_handler.connect(makeDefaultConnectionParams(data.appName), ()=>{
				console.log("connected");
				postMessage(["RTMPConnected"]);
			});
			break;

		case "play":
			message_handler.play(data.streamName);
			break;

        case "pause":
			message_handler.pause(data.enable);
            break;

        case "disconnect":
			wss_manager.close();
            break;

		default:
			console.warn("[ WebRTMP Worker ] Unknown CMD: " + data.cmd);
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
		"audioCodecs": 4071,
		"videoCodecs": 252,
		"videoFunction": 1
	};
}

postMessage(["Started"]);


/******/ })()
;
//# sourceMappingURL=webrtmp.worker.js.map