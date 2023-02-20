import EventEmitter from "../utils/event_emitter";
import Log from "../utils/logger";

class WebRTMP_Controller {
	TAG = "WebRTMP_Controller";
	host = document.location.host;
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
		"WebRTMP_Controller": Log.WARN
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
	 * WSS Verbindung aufbauen
	 */
	createConnection(){
		if(this.isConnected) return false;
		this.WebRTMPWorker.postMessage({cmd: "createConnection", host: this.host});
	}

	/**
	 * MQTT Verbindung trennen
	 */
	disconnect() {
		this.WSSReconnect = true;
		this.WebRTMPWorker.postMessage({cmd: "disconnect"});
	}

	connect(appName){
		this.WebRTMPWorker.postMessage({cmd: "connect", appName: appName});
	}

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
						this.createConnection();
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

				this.createConnection();
				/*
				window.setTimeout(()=>{
					this.connect();
				}, 2000);*/
				break;

			default:
				Log.i(this.TAG, data[0], data.slice(1));
				this.e.emit(data[0], data.slice(1));
				break;
		}
	}
}

export default WebRTMP_Controller;
