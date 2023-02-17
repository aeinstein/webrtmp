class WebRTMP_Controller {
	host = document.location.host;

	WebRTMPWorker = new Worker(new URL('connection.worker.js', import.meta.url), {
		name: "webrtmp.worker",
		type: "module"
		/* webpackEntryOptions: { filename: "[name].js" } */
	});


	DEBUG = false;

	isConnected = false;

	ListenerList = [];

	constructor() {
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
		switch(type) {
			case "MessageArrived":
			case "Connected":
			case "ConnectionLost":
			case "Started":
			case "Subscribed":
			case "RTMPConnected":
			case "RTMPMessageArrived":
			case "ProtocolControlMessage":
			case "UserControlMessage":
            case "NetConnection.Connect.Success":
				this.ListenerList[this.ListenerList.length] = {type: type, listener: listener};
				break;

			default:
				console.error("Event " + type + " not recognized");
				break;
		}
	}

	/**
	 * intern: Feuert Event
	 * @param type
	 * @param message
	 */
	fireEvent(type, message){
		for(let i = 0; i < this.ListenerList.length; i++){
			let evt = this.ListenerList[i];
			if(evt.type === type) {
				evt.listener.call(this, message);
			}
		}
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
				this.fireEvent("ConnectionLost");
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
				this.fireEvent("Connected");
				this.isConnected = true;
				this.streams = []; // Streams löschen, damit Änderung erkannt wird nach einloggen und Liste aktualisiert
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
				this.fireEvent(data[0], data[1]);
				break;
		}
	}
}

export default WebRTMP_Controller;
