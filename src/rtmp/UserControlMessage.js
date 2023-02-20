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

export default UserControlMessage;
