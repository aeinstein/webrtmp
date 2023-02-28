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

import Log from "../utils/logger";

/**
 * Class for handle the rtmp handshake
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
            Log.v(this.TAG, e.data);
            this.processServerInput(new Uint8Array(e.data));
        }
    }

    /**
     * Do RTMP Handshake
     */
    do(){
        if(!this.onHandshakeDone) {
            Log.e(this.TAG, "onHandshakeDone not defined");
            return;
        }

        Log.v(this.TAG, "send C0");
        this.socket.send(new Uint8Array([0x03]));
        this.state = 1;

        Log.v(this.TAG, "send C1");
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
        Log.v(this.TAG, "S0: ", data);

        if(data[0] !== 0x03) {
            Log.e(this.TAG, "S0 response not 0x03");

        } else {
            Log.v(this.TAG, "1st Byte OK");
        }

        this.state = 3;

        if(data.length > 1) {
            Log.v(this.TAG, "S1 included");
            this._parseS1(data.slice(1));
        }
    }

    /**
     *
     * @param {Uint8Array} data
     * @private
     */
    _parseS1(data){
        Log.v(this.TAG, "parse S1: ", data);
        this.state = 4;

        let s1 = data.slice(0, 1536);

        Log.v(this.TAG, "send C2");
        this.socket.send(this._generateC2(s1));

        this.state = 5;

        if(data.length > 1536) {
            Log.v(this.TAG, "S2 included: " + data.length);
            this._parseS2(data.slice(1536));
        }
    }

    /**
     *
     * @param {Uint8Array} data
     * @private
     */
    _parseS2(data) {
        Log.v(this.TAG, "parse S2: ", data);

        if(!this._compare(this.c1, data)) {
            Log.e(this.TAG, "C1 S1 not equal");
            this.onHandshakeDone(false);
            return;
        }

        this.state = 6;

        Log.v(this.TAG, "RTMP Connection established");

        this.onHandshakeDone(true);
    }

    /**
     * compare to arrays
     * @param ar1
     * @param ar2
     * @returns {boolean}
     * @private
     */
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

export default RTMPHandshake;
