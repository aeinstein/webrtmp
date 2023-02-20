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
            Log.w(this.TAG, "Protocol Control Message Type: " + pcm_type + " use SetPeerBandwidthMessage");
            break;

        default:
            Log.e(this.TAG, "Protocol Control Message Type: " + pcm_type + " not supported");
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
export default ProtocolControlMessage;
