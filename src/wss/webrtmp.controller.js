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

import EventEmitter from "../utils/event_emitter";
import Log from "../utils/logger";
import Worker from "./connection.worker.js";

class WebRTMP_Controller {
	TAG = "WebRTMP_Controller";
	host = document.location.host;
	port = 9001;
	WSSReconnect = false;
	isConnected = false;

	WebRTMPWorker = new Worker();

	constructor() {
		Log.loglevels = {
            "RTMPMessage": Log.ERROR,
            "RTMPMessageHandler": Log.WARN,
            "RTMPMediaMessageHandler": Log.ERROR,
            "ChunkParser": Log.WARN,
            "RTMPHandshake": Log.ERROR,
            "Chunk": Log.OFF,
            "MP4Remuxer": Log.ERROR,
            "Transmuxer": Log.WARN,
            "EventEmitter": Log.DEBUG,
            "MSEController": Log.INFO,
            "WebRTMP": Log.DEBUG,
            "WebRTMP_Controller": Log.WARN,
            "WebRTMP Worker": Log.WARN,
            "AMF": Log.WARN,
            "WSSConnectionManager": Log.DEBUG
        };

		this._emitter = new EventEmitter();

		this.WebRTMPWorker.addEventListener("message", (evt)=>{
			this.WorkerListener(evt);
		});
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 */
	open(host, port){
		return new Promise((resolve, reject)=>{
			if(this.isConnected) return reject("Already Connected. Please disconnect first");
			this._emitter.waitForEvent("RTMPHandshakeDone", resolve);
			this._emitter.waitForEvent("WSSConnectFailed", reject);

			if(host) this.host = host;
			if(port) this.port = port;

			this.WebRTMPWorker.postMessage({cmd: "open", host: this.host, port: this.port});
		})
	}

	/**
	 * Websocket disconnect
	 */
	disconnect() {
		this.WSSReconnect = false;
		this.WebRTMPWorker.postMessage({cmd: "disconnect"});
	}

	/**
	 * RTMP connect application
	 * @param {String} appName
	 */
	connect(appName){
		return new Promise((resolve, reject)=>{
			this._emitter.waitForEvent("RTMPStreamCreated", resolve);
			this.WebRTMPWorker.postMessage({cmd: "connect", appName: appName});
		})

	}

	/**
	 * RTMP play streamname
	 * @param {String} streamName
	 */
	play(streamName){
		this.WebRTMPWorker.postMessage({cmd: "play", streamName: streamName});
	}

	stop(){
		this.WebRTMPWorker.postMessage({cmd: "stop"});
	}

    pause(enable){
        this.WebRTMPWorker.postMessage({cmd: "pause", enable: enable});
    }


	/**
	 * Eventlistener hinzufügenm
	 * @param type
	 * @param listener
	 * @param {boolean} modal
	 */
	addEventListener(type, listener, modal){
		this._emitter.addEventListener(type, listener, modal);
	}

	removeEventListener(type, listener){
		this._emitter.removeEventListener(type, listener);
	}

	removeAllEventListener(type){
		this._emitter.removeAllEventListener(type);
	}


	/**
	 *
	 * @param {MessageEvent} evt
	 * @constructor
	 */
	WorkerListener(evt){
		// Message.data wieder zum Event machen
		const data = evt.data;

		switch(data[0]){
			case "ConnectionLost":
				this._emitter.emit("ConnectionLost");
				Log.d(this.TAG, "Event ConnectionLost");

				this.isConnected = false;

				if(this.WSSReconnect) {
					Log.w(this.TAG,"[ WorkerListener ] Reconnect timed");

					window.setTimeout(()=>{
						Log.w(this.TAG, "timed Reconnect");
						this.open(this.host, this.port);
					}, 1000)
				}

				break;

			case "Connected":
				Log.d(this.TAG, "Event Connected");
				this._emitter.emit("Connected");
				this.isConnected = true;
				break;

			case "Started":
				this.WebRTMPWorker.postMessage({
					cmd: "loglevels",
					loglevels: this.loglevels
				});
				break;

			default:
				Log.i(this.TAG, data[0], data.slice(1));
				this._emitter.emit(data[0], data.slice(1));
				break;
		}
	}
}

export default WebRTMP_Controller;
