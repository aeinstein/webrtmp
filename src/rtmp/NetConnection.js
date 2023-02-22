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

import ProtocolControlMessage from "./ProtocolControlMessage";
import RTMPMessage from "./RTMPMessage";
import Chunk from "./Chunk";
import Log from "../utils/logger";

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

        Log.d(this.TAG, handler);

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
            Log.i(this.TAG, "WindowAcknowledgementSize: " + this.WindowAcknowledgementSize);
            break;

        case 6:         // PCM Set Peer Bandwidth
            this.BandWidth = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            Log.i(this.TAG, "SetPeerBandwidth: " + this.BandWidth);

            // send Window Ack Size
            let msg = new ProtocolControlMessage(0x05, this.WindowAcknowledgementSize);

            let m2 = new RTMPMessage(msg.getBytes());
            m2.setMessageType(0x05)     // WinACKSize

            const chunk = new Chunk(m2);
            chunk.setChunkStreamID(2);  // Control Channel

            Log.i(this.TAG, "send WindowAcksize");
            this.socket.send(chunk.getBytes());

            break;

        default:
            break;
        }
    }
}

export default NetConnection;
