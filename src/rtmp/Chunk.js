import {_concatArrayBuffers} from "../utils/utils";
import Log from "../utils/logger";

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
            Log.d("create chunk: " + p.length);
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
        Log.d(this.TAG, "setChunkStreamID:" + chunk_stream_id);
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

export default Chunk;
