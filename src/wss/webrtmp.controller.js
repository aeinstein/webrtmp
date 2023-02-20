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

class WebRTMP_Controller {
	TAG = "WebRTMP_Controller";
	host = document.location.host;
	port = 9001;
	WSSReconnect = false;
	isConnected = false;

	loglevels = {
		"RTMPMessage": Log.WARN,
		"RTMPMessageHandler": Log.WARN,
		"RTMPMediaMessageHandler": Log.ERROR,
		"ChunkParser": Log.WARN,
		"RTMPHandshake": Log.WARN,
		"Chunk": Log.OFF,
		"MP4Remuxer": Log.ERROR,
		"Transmuxer": Log.WARN,
		"EventEmitter": Log.DEBUG,
		"MSEController": Log.INFO,
		"WebRTMP": Log.WARN,
		"WebRTMP_Controller": Log.WARN,
		"WebRTMP Worker": Log.WARN
	}

	WebRTMPWorker = new Worker(new URL('connection.worker.js', import.meta.url), {
		name: "webrtmp.worker",
		type: "module"
		/* webpackEntryOptions: { filename: "[name].js" } */
	});

	constructor() {
		this.e = new EventEmitter();

		this.WebRTMPWorker.addEventListener("message", (e)=>{
			this.WorkerListener(e);
		})

		Log.loglevels = this.loglevels;
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 * @returns {boolean}
	 */
	open(host, port){
		if(this.isConnected) return false;

		if(host) this.host = host;
		if(port) this.port = port;

		this.WebRTMPWorker.postMessage({cmd: "open", host: this.host, port: this.port});
	}

	/**
	 * Websocket disconnect
	 */
	disconnect() {
		this.WSSReconnect = true;
		this.WebRTMPWorker.postMessage({cmd: "disconnect"});
	}

	/**
	 * RTMP connect application
	 * @param {String} appName
	 */
	connect(appName){
		this.WebRTMPWorker.postMessage({cmd: "connect", appName: appName});
	}

	/**
	 * RTMP play streamname
	 * @param {String} streamName
	 */
	play(streamName){
		this.WebRTMPWorker.postMessage({cmd: "play", streamName: streamName});
	}

    pause(enable){
        this.WebRTMPWorker.postMessage({cmd: "pause", enable: enable});
    }


	/**
	 * Eventlistenre hinzufügenm
	 * @param type
	 * @param listener
	 */
	addEventListener(type, listener){
		this.e.addEventListener(type, listener);
	}



	/**
	 * Verarbeitet MQTT Events
	 * @param e Event
	 */
	WorkerListener(e){
		// Message.data wieder zum Event machen
		const data = e.data;

		switch(data[0]){
			case "ConnectionLost":
				this.e.emit("ConnectionLost");
				Log.d(this.TAG, "Event ConnectionLost");

				this.isConnected = false;

				if(this.WSSReconnect) {
					Log.w(this.TAG,"[ WorkerListener ] Reconnect timed");

					window.setTimeout(()=>{
						Log.w(this.TAG, "timed Reconnect");
						this.open();
					}, 1000)
				}

				break;

			case "Connected":
				Log.d(this.TAG, "Event Connected");
				this.e.emit("Connected");
				this.isConnected = true;
				break;

			case "Started":
				Log.d(this.TAG, "Event Started");
				this.WebRTMPWorker.postMessage({
					cmd: "loglevels",
					loglevels: this.loglevels
				});
				break;

			default:
				Log.i(this.TAG, data[0], data.slice(1));
				this.e.emit(data[0], data.slice(1));
				break;
		}
	}
}

export default WebRTMP_Controller;
