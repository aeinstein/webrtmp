import Log from "./utils/logger";
import MSEController from "./utils/mse-controller";
import {defaultConfig, ErrorDetails, ErrorTypes, MSEEvents, PlayerEvents, TransmuxingEvents} from "./utils/utils";
import Transmuxer from "./flv/transmuxer";
import EventEmitter from "./utils/event_emitter";
import WebRTMP_Controller from "./wss/webrtmp.controller";

class WebRTMP{
	TAG = 'WebRTMP';

	constructor() {
		this.wss = new WebRTMP_Controller();

		this.wss.addEventListener("Connected", ()=>{
			Log.d(this.TAG, "Connected");
		});

		this.wss.addEventListener("RTMPConnected", ()=>{
			Log.d(this.TAG,"RTMPConnected");
		});

		this.wss.addEventListener("RTMPMessageArrived", (data)=>{
			Log.d(this.TAG,"RTMPMessageArrived", data);
		});

		this.wss.addEventListener("ProtocolControlMessage", (data)=>{
			Log.d(this.TAG,"ProtocolControlMessage", data);
		});

		this.wss.addEventListener("UserControlMessage", (data)=>{
			Log.d(this.TAG,"UserControlMessage", data);
		});

		this.wss.addEventListener("Started", ()=>{});

		this.wss.addEventListener("ConnectionLost", ()=>{});

		this.wss.addEventListener("ConnectionLost", ()=>{});

		this._emitter = new EventEmitter();

		this.e = {
			onvLoadedMetadata: this._onvLoadedMetadata.bind(this),
			onvSeeking: this._onvSeeking.bind(this),
			onvCanPlay: this._onvCanPlay.bind(this),
			onvStalled: this._onvStalled.bind(this),
			onvProgress: this._onvProgress.bind(this)
		};

		this._config = defaultConfig;
		this._transmuxer = new Transmuxer(this._config);

		// transmuxdr Events
		this.wss.addEventListener("onMediaInfo", (mediaInfo)=>{
			Log.i(this.TAG, "onMediaInfo");
			this._transmuxer._onMediaInfo(mediaInfo);
		});

		this.wss.addEventListener("onMediaSegment", (data)=>{
			Log.i(this.TAG, "onMediaSegment");
			this._transmuxer._onMediaInfo(mediaInfo);
		});

		this.wss.addEventListener("onDataAvailable", (data)=>{
			Log.i(this.TAG, "onDataAvailable");
			this._transmuxer.remux(data[0], data[1]);
		});

		this.wss.addEventListener("onTrackMetadata", (data)=>{
			Log.i(this.TAG, "onTrackMetaData");
			this._transmuxer._onTrackMetadataReceived(data[0], data[1]);
		});

	}

	_onvLoadedMetadata(e) {
		if (this._pendingSeekTime != null) {
			this._mediaElement.currentTime = this._pendingSeekTime;
			this._pendingSeekTime = null;
		}
	}

	_onvCanPlay(e) {
		this._receivedCanPlay = true;
		this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
	}

	_onvStalled(e) {
		//this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress(e) {
		//this._checkAndResumeStuckPlayback();
	}

	_onvSeeking(){

	}

	_onmseBufferFull() {
		Log.v(this.TAG, 'MSE SourceBuffer is full, suspend transmuxing task');
		if (this._progressChecker == null) {
			this._suspendTransmuxer();
		}
	}

	_onmseUpdateEnd() {
		if (!this._config.lazyLoad || this._config.isLive) {
			return;
		}

		let buffered = this._mediaElement.buffered;
		let currentTime = this._mediaElement.currentTime;
		let currentRangeStart = 0;
		let currentRangeEnd = 0;

		for (let i = 0; i < buffered.length; i++) {
			let start = buffered.start(i);
			let end = buffered.end(i);
			if (start <= currentTime && currentTime < end) {
				currentRangeStart = start;
				currentRangeEnd = end;
				break;
			}
		}

		if (currentRangeEnd >= currentTime + this._config.lazyLoadMaxDuration && this._progressChecker == null) {
			Log.v(this.TAG, 'Maximum buffering duration exceeded, suspend transmuxing task');
			this._suspendTransmuxer();
		}
	}


	destroy() {
		if (this._progressChecker != null) {
			window.clearInterval(this._progressChecker);
			this._progressChecker = null;
		}
		if (this._transmuxer) {
			this.unload();
		}
		if (this._mediaElement) {
			this.detachMediaElement();
		}
		this.e = null;
		this._mediaDataSource = null;

		this._emitter.removeAllListeners();
		this._emitter = null;
	}

	disconnect(){
		this.wss.disconnect();
	}

	play(streamName){
		this.wss.play(streamName);
	}

	connect(appName){
		this.wss.connect(appName);
	}

	pause(enable){
		this.wss.pause(enable);
	}

	detachMediaElement() {
		if (this._mediaElement) {
			this._msectl.detachMediaElement();
			this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
			this._mediaElement.removeEventListener('seeking', this.e.onvSeeking);
			this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
			this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			this._mediaElement = null;
		}

		if (this._msectl) {
			this._msectl.destroy();
			this._msectl = null;
		}
	}

	attachMediaElement(mediaElement) {
		this._mediaElement = mediaElement;
		mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);
		mediaElement.addEventListener('seeking', this.e.onvSeeking);
		mediaElement.addEventListener('canplay', this.e.onvCanPlay);
		mediaElement.addEventListener('stalled', this.e.onvStalled);
		mediaElement.addEventListener('progress', this.e.onvProgress);

		this._msectl = new MSEController(this._config);

		this._transmuxer.on(TransmuxingEvents.INIT_SEGMENT, (type, is) => {
			this._msectl.appendInitSegment(is);
		});

		this._transmuxer.on(TransmuxingEvents.MEDIA_SEGMENT, (type, ms) => {
			this._msectl.appendMediaSegment(ms);
		});

		this._msectl.on(MSEEvents.UPDATE_END, this._onmseUpdateEnd.bind(this));
		this._msectl.on(MSEEvents.BUFFER_FULL, this._onmseBufferFull.bind(this));
		this._msectl.on(MSEEvents.ERROR, (info) => {
			this._emitter.emit(PlayerEvents.ERROR,
				ErrorTypes.MEDIA_ERROR,
				ErrorDetails.MEDIA_MSE_ERROR,
				info
			);
		});

		this._msectl.attachMediaElement(mediaElement);

		if (this._pendingSeekTime != null) {
			try {
				mediaElement.currentTime = this._pendingSeekTime;
				this._pendingSeekTime = null;
			} catch (e) {
				// IE11 may throw InvalidStateError if readyState === 0
				// We can defer set currentTime operation after loadedmetadata
			}
		}

		this._transmuxer.on(TransmuxingEvents.MEDIA_INFO, (mediaInfo) => {
			this._mediaInfo = mediaInfo;
			this._emitter.emit(PlayerEvents.MEDIA_INFO, Object.assign({}, mediaInfo));
		});
		this._transmuxer.on(TransmuxingEvents.METADATA_ARRIVED, (metadata) => {
			this._emitter.emit(PlayerEvents.METADATA_ARRIVED, metadata);
		});
		this._transmuxer.on(TransmuxingEvents.SCRIPTDATA_ARRIVED, (data) => {
			this._emitter.emit(PlayerEvents.SCRIPTDATA_ARRIVED, data);
		});
	}
}
Log.LEVEL = Log.DEBUG;

export default WebRTMP;

window["Log"] = Log;
window["webrtmp"] = new WebRTMP();

