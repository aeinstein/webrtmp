import RTMPMessage from "./RTMPMessage";
import {_concatArrayBuffers} from "../utils/utils";

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

            // Basic Header ChunkID
            let csid = data[header_length++] & 0x3f;	// lower 6 bits

            if(csid === 0) {					// csid is 14bit
                csid = data[header_length++] + 64;

            } else if (csid === 1) {			// csid is 22bit
                csid = data[header_length++] * 256 + data[header_length++] + 64;
            }

            console.log("[ ChunkParser ] chunk type: ", fmt, " StreamID: " + csid);

            let payload;

            // Message
            switch(fmt) {
                case 0:		// 11 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp
                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte Message length

                msg = new RTMPMessage();
                msg.setMessageType(data[header_length++]);                // 1 byte msg type
                msg.setMessageStreamID((data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]));	// 4 byte Message stream id
                msg.setMessageLength(message_length);

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp += data[header_length++];
                    msg.setExtendedTimestamp(true);
                }

                msg.setMessageTimestamp(timestamp);

                console.log("[ ChunkParser ] message_length: " + message_length);

                this.chunkstreams[csid] = msg;
                break;

            case 1:		// 7 byte
                timestamp = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte timestamp
                message_length = (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);	// 3 byte Message length

                msg = new RTMPMessage();
                msg.setMessageType(data[header_length++]);
                msg.setMessageLength(message_length);

                if (timestamp === 0xFFFFFF) {	// extended Timestamp
                    timestamp += data[header_length++];
                    msg.setExtendedTimestamp(true);
                }
                msg.setMessageTimestamp(timestamp);


                console.log("[ ChunkParser ] message_length: " + message_length);

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

                break;

            case 3:		// 0 byte
                msg = this.chunkstreams[csid];

                // extended timestamp is present when setted in the chunk stream
                if(msg.getExtendedTimestamp()) {
                    header_length++;
                }

                break;
            }

            payload_length = this.chunkstreams[csid].bytesMissing();

            if(payload_length > this.CHUNK_SIZE) payload_length = this.CHUNK_SIZE;      // Max. CHUNK_SIZE erwarten

            payload = data.slice(header_length, header_length +payload_length);

            // sind genug bytes für das chunk da?
            if(payload.length < payload_length){
                console.log("[ ChunkParser ] packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                return;
            }

            this.chunkstreams[csid].addPayload(payload);

            if(this.chunkstreams[csid].isComplete()) {     // Message complete
                console.log("[ ChunkParser ] RTMP: ", msg.getMessageType(), RTMPMessage.MessageTypes[msg.getMessageType()], msg.getPayloadlength(), msg.getMessageStreamID());
                this.conn_worker.onMessage(this.chunkstreams[csid]);
            }

            let consumed = (header_length + payload_length);

            if(consumed > this.buffer.length) {
                console.warn("[ ChunkParser ] mehr abschneiden als da");
            }

            this.buffer = this.buffer.slice(consumed);
            console.log("[ ChunkParser ] consumed: " + consumed + " bytes, rest: " + this.buffer.length);

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

export default ChunkParser;
