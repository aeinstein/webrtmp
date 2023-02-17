import EventEmitter from "../utils/event_emitter";

class WebRTMP_Controller {
	host = document.location.host;

	WebRTMPWorker = new Worker(new URL('connection.worker.js', import.meta.url), {
		name: "webrtmp.worker",
		type: "module"
		/* webpackEntryOptions: { filename: "[name].js" } */
	});


	DEBUG = false;

	isConnected = false;

	constructor() {
		this.e = new EventEmitter();

		this.WebRTMPWorker.addEventListener("message", (e)=>{
			this.WorkerListener(e);
		})
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
		this.MQTT_Reconnect = true;
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
				console.log("[ WorkerListener ] Event ConnectionLost");

				this.isConnected = false;

				if(this.MQTT_Reconnect) {
					console.log("[ WorkerListener ] Reconnect timed");

					window.setTimeout(()=>{
						console.log("[ WorkerListener ] timed Reconnect");
						this.createConnection();
					}, 1000)
				}

				break;

			case "Connected":
				console.log("[ WorkerListener ] Event Connected");
				this.e.emit("Connected");
				this.isConnected = true;
				break;

			case "Started":
				console.log("[ WorkerListener ] Event Started");

				this.createConnection();
				/*
				window.setTimeout(()=>{
					this.connect();
				}, 2000);*/
				break;

			default:
				this.e.emit(data[0], data[1]);
				break;
		}
	}
}

export default WebRTMP_Controller;
