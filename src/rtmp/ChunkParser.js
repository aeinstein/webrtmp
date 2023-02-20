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

import RTMPMessage from "./RTMPMessage";
import {_concatArrayBuffers} from "../utils/utils";
import Log from "../utils/logger";

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
            Log.d(this.TAG, "buffer length: " + this.buffer.length);

            if(this.buffer.length < 100) Log.d(this.TAG, this.buffer);

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

            Log.d(this.TAG, "chunk type: ", fmt, " StreamID: " + csid);

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
                    timestamp = (data[header_length++] << 24) | (data[header_length++] << 16) | (data[header_length++] << 8) | (data[header_length++]);
                    msg.setExtendedTimestamp(true);
                }

                msg.setMessageTimestamp(timestamp);

                Log.d(this.TAG, "message_length: " + message_length);

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

                Log.d(this.TAG, "message_length: " + message_length);

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
                Log.e(this.TAG, "No suitable RTMPMessage found");
            }



            payload_length = this.chunkstreams[csid].bytesMissing();

            if(payload_length > this.CHUNK_SIZE) payload_length = this.CHUNK_SIZE;      // Max. CHUNK_SIZE erwarten

            payload = data.slice(header_length, header_length +payload_length);

            // sind genug bytes für das chunk da?
            if(payload.length < payload_length){
                Log.d(this.TAG, "packet(" + payload.length + "/" + payload_length + ") too small, wait for next");
                return;
            }

            this.chunkstreams[csid].addPayload(payload);

            if(this.chunkstreams[csid].isComplete()) {     // Message complete
                Log.d(this.TAG, "RTMP: ", msg.getMessageType(), RTMPMessage.MessageTypes[msg.getMessageType()], msg.getPayloadlength(), msg.getMessageStreamID());
                this.conn_worker.onMessage(this.chunkstreams[csid]);
                this.chunkstreams[csid].clearPayload();
            }

            let consumed = (header_length + payload_length);

            if(consumed > this.buffer.length) {
                Log.w(this.TAG, "mehr abschneiden als da");
            }

            this.buffer = this.buffer.slice(consumed);
            Log.d(this.TAG, "consumed: " + consumed + " bytes, rest: " + this.buffer.length);

        } while(this.buffer.length > 11);   // minimum size

        Log.d(this.TAG, "parseChunk complete");
    }



    /**
     *
     * @param {Number} size
     */
    setChunkSize(size){
        Log.d(this.TAG, "SetChunkSize: " + size);
        this.CHUNK_SIZE = size;
    }
}

export default ChunkParser;
