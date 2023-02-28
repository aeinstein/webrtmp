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
import Chunk from "./Chunk";
import UserControlMessage from "./UserControlMessage";
import NetConnection from "./NetConnection";
import ChunkParser from "./ChunkParser";
import RTMPMediaMessageHandler from "./RTMPMediaMessageHandler";
import AMF0Object from "./AMF0Object";
import Log from "../utils/logger";

/**
 * Class for handling rtmp messages
 */
class RTMPMessageHandler {
    TAG = "RTMPMessageHandler";

    paused = false;
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
        this.chunk_parser = new ChunkParser(this);
        this.media_handler = new RTMPMediaMessageHandler();

        this.media_handler.onError = (type, info)=>{
            Log.d(this.TAG, type, info);
            postMessage(["onError", type, info]);
        }

        this.media_handler.onMediaInfo = (mediainfo)=>{
            Log.d(this.TAG, mediainfo);
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

    destroy(){
        this.media_handler.destroy();
        this.media_handler = null;
        this.chunk_parser = null
    }

    /**
     *
     * @param {Uint8Array} data
     */
    parseChunk(data){
        Log.d(this.TAG, "parseChunk: " + data.length);
        this.chunk_parser.parseChunk(data);
    }

    /**
     *
     * @param {RTMPMessage} msg
     */
    onMessage(msg){
        Log.d(this.TAG, " onMessage: " + msg.getMessageType() + " StreamID:" + msg.getMessageStreamID());

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
            Log.d(this.TAG, "AUDIOFRAME: ", msg);
            this.media_handler.handleMediaMessage(msg);
            break;

        case 9:         // Video Message
            Log.d(this.TAG, "VIDEOFRAME: ", msg);
            this.media_handler.handleMediaMessage(msg);
            break;

        case 18:        // Data Message AMF0
            Log.d(this.TAG, "DATAFRAME: ", msg);
            this.media_handler.handleMediaMessage(msg);
            break;

        case 19:        // Shared Object Message AMF0
            Log.d(this.TAG, "SharedObjectMessage", msg);
            break;

        case 20:        // Command Message AMF0
            const command = new AMF0Object();
            let cmd = command.parseAMF0(msg.getPayload());

            Log.d(this.TAG, "AMF0", cmd);

            switch(cmd[0]) {
            case "_error":
                Log.e(this.TAG, cmd);
                break;

            case "_result":
                switch(this.trackedCommand){
                case "connect":
                    Log.d(this.TAG,"got _result: " + cmd[3].code);
                    if(cmd[3].code === "NetConnection.Connect.Success") {
                        postMessage([cmd[3].code]);
                        this.createStream(null);
                    }
                    break;

                case "createStream":
                    Log.d(this.TAG,"got _result: " + cmd[3]);
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
                    Log.w("tracked command:" + this.trackedCommand);
                    break;
                }

                break;

            case "onStatus":
                Log.d(this.TAG,"onStatus: " + cmd[3].code);
                postMessage([cmd[3].code]);
                break;

            default:
                Log.w(this.TAG,"CommandMessage " + cmd[0] + " not yet implemented");
                break;
            }

            break;

        case 22:        // Aggregate Message
            break;

        case 15:        // Data Message AMF3
        case 16:        // Shared Object Message AMF3
        case 17:        // Command Message AMF3
            Log.e(this.TAG,"AMF3 is not yet implemented");
            break;

        default:
            Log.d(this.TAG,"[MessageType: " + RTMPMessage.MessageTypes[msg.getMessageType()] + "(" + msg.getMessageType() + ")");
            break;

        }
    }

    /**
     *
     * @param {Object} connectionParams
     */
    connect(connectionParams){
        const command = new AMF0Object([
            "connect", 1, connectionParams
        ]);

        this._sendCommand(3, command);
    }

    /**
     *
     * @param {Object} options
     */
    createStream(options){
        const command = new AMF0Object([
            "createStream", 1, options
        ]);

        this._sendCommand(3, command);
    }

    deleteStream(stream_id){
        const command = new AMF0Object([
            "deleteStream", 1, null, stream_id
        ]);

        this._sendCommand(3, command);
    }

    /**
     *
     * @param {String} streamName
     */
    play(streamName){
        const command = new AMF0Object([
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
        if(this.paused !== enable) {
            this.paused = enable;

            const command = new AMF0Object([
                "pause", 0, null, enable,0
            ]);

            this._sendCommand(3, command);
        }
    }

    receiveVideo(enable){
        const command = new AMF0Object([
            "receiveVideo", 0, null, enable
        ]);

        this._sendCommand(3, command);
    }

    receiveAudio(enable){
        const command = new AMF0Object([
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
        Log.d(this.TAG, "sendCommand:", command);

        this.trackedCommand = command.getCommand();

        let msg = new RTMPMessage(command.getBytes());
        msg.setMessageType(0x14);		// AMF0 Command
        msg.setMessageStreamID(0);

        const chunk = new Chunk(msg);
        chunk.setChunkStreamID(csid);

        let buf = chunk.getBytes();

        this.netconnections[0] = new NetConnection(0, this);

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

            const msg = new UserControlMessage();
            msg.setType(0x07);          // Ping Response
            msg.setEventData(this.event_data1);


            let m2 = new RTMPMessage(msg.getBytes());
            m2.setMessageType(0x04)     // UserControlMessage

            const chunk = new Chunk(m2);
            chunk.setChunkStreamID(2);  // Control Channel

            Log.i(this.TAG,"send Pong");
            this.socket.send(chunk.getBytes());
        }
    }
}

export default RTMPMessageHandler;

