import {_concatArrayBuffers} from "../utils/utils";
import Log from "../utils/logger";

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
		Log.v(this.TAG, "TS: " + timestamp);
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

	setTimestampDelta(timestamp_delta){

		this.timestamp += timestamp_delta;

		Log.v(this.TAG, "TS: " + this.timestamp + " Delta: " + timestamp_delta);
	}

	/**
	 *
	 * @param {Uint8Array} data
	 */
	addPayload(data){
		if(data.length > this.bytesMissing()) {
			Log.e(this.TAG, "try to add too much data");
			return;
		}

		this.payload = _concatArrayBuffers(this.payload, data);
		this.length = this.payload.length;
		Log.d(this.TAG, "[ RTMPMessage ] payload size is now: " + this.length);
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

export default RTMPMessage;
