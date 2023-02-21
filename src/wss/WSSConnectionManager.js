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
        Log.v(this.TAG, "connecting to: " + host + ":" + port);
        this.wss = new WebSocket("wss://" + host + ":" + port + "/");

        this.wss.binaryType = "arraybuffer";

        this.wss.onopen = (e)=>{
            Log.v(this.TAG, e);
            callback(true);
        }

        this.wss.onclose = (e)=>{
            Log.w(this.TAG, e);
            postMessage(["ConnectionLost"]);
        }

        this.wss.onerror = (e)=>{
            Log.e(this.TAG, e);
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

export default WSSConnectionManager;
