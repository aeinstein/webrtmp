import WSSConnectionManager from "./WSSConnectionManager";
import RTMPHandshake from "../rtmp/RTMPHandshake";
import RTMPMessageHandler from "../rtmp/RTMPMessageHandler";
import Log from "../utils/logger";

const TAG = "WebRTMP Worker";

let port = 9001;
let host;
let message_handler;
Log.LEVEL = Log.DEBUG;

const wss_manager = new WSSConnectionManager();

self.addEventListener('message', function(e) {
	let data = e.data;

	Log.d(TAG, "CMD: " + data.cmd);

	switch(data.cmd) {
		case "createConnection":    // connect WebSocket
			host = data.host;

			wss_manager.connect(data.host, port, (success)=>{
				if(success){
					postMessage(["WSSConnected"]);

					const handshake = new RTMPHandshake(wss_manager.getSocket());

					handshake.onHandshakeDone = (success)=>{
						if(success){
							message_handler = new RTMPMessageHandler(wss_manager.getSocket());

							Log.d(TAG, "connect to RTMPManager");

							wss_manager.registerMessageHandler((e)=> {
								// connect to chunkparser
								message_handler.parseChunk(new Uint8Array(e.data));
							});

							postMessage(["RTMPHandshakeDone"]);

						} else {
							Log.e(TAG, "Handshake failed");
						}
					};

					handshake.do();
				}
			});
			break;

		case "closeConnection":
			wss_manager.close();
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
		"audioCodecs": 4071,
		"videoCodecs": 252,
		"videoFunction": 1
	};
}

postMessage(["Started"]);

