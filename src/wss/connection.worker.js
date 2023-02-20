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

import WSSConnectionManager from "./WSSConnectionManager";
import RTMPHandshake from "../rtmp/RTMPHandshake";
import RTMPMessageHandler from "../rtmp/RTMPMessageHandler";
import Log from "../utils/logger";

const TAG = "WebRTMP Worker";

let port;
let host;
let message_handler;
Log.LEVEL = Log.DEBUG;

const wss_manager = new WSSConnectionManager();

self.addEventListener('message', function(e) {
	let data = e.data;

	Log.d(TAG, "CMD: " + data.cmd);

	switch(data.cmd) {
		case "open":    // connect WebSocket
			host = data.host;
			port = data.port;

			wss_manager.open(host, port, (success)=>{
				Log.v(TAG, "open: " + host + ":" +port);
				if(success){
					Log.v(TAG, "WSSConnected");
					postMessage(["WSSConnected"]);

					const handshake = new RTMPHandshake(wss_manager.getSocket());

					handshake.onHandshakeDone = (success)=>{
						if(success){
							message_handler = new RTMPMessageHandler(wss_manager.getSocket());

							Log.d(TAG, "connect to RTMPManager");

							wss_manager.registerMessageHandler((e)=> {
								message_handler.parseChunk(new Uint8Array(e.data));
							});

							postMessage(["RTMPHandshakeDone"]);

						} else {
							Log.e(TAG, "Handshake failed");
							postMessage(["RTMPHandshakeFailed"]);
						}
					};

					handshake.do();

				} else {
					Log.v(this.TAG, "WSSConnectFailed");
					postMessage(["WSSConnectFailed"]);
				}
			});
			break;

		case "connect":             // RTMP Connect Application
			message_handler.connect(makeDefaultConnectionParams(data.appName), ()=>{
				Log.v(TAG, "connected");
				postMessage(["RTMPConnected"]);
			});
			break;

		case "play":
			message_handler.play(data.streamName);
			break;

        case "pause":
			message_handler.pause(data.enable);
            break;

        case "disconnect":
			wss_manager.close();
			break;

		case "loglevels":
			Log.loglevels = data.loglevels;
            break;

		default:
			Log.w(TAG, "Unknown CMD: " + data.cmd);
			break;
	}

}, false);

function makeDefaultConnectionParams(application){
	return {
		"app": application,
		"flashVer": "WebRTMP 0,0,1",
		"tcUrl": "rtmp://" + host + ":1935/" + application,
		"fpad": false,
		"capabilities": 15,
		"audioCodecs": 0x0400,	// AAC
		"videoCodecs": 0x0080,	// H264
		"videoFunction": 0		// Seek false
	};
}

postMessage(["Started"]);

