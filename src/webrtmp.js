import Log from "./utils/logger";
import MSEController from "./utils/mse-controller";
import {defaultConfig, ErrorDetails, ErrorTypes, MSEEvents, PlayerEvents, TransmuxingEvents} from "./utils/utils";
import EventEmitter from "./utils/event_emitter";
import WebRTMP_Controller from "./wss/webrtmp.controller";
import Browser from "./utils/browser";

class WebRTMP{
	TAG = 'WebRTMP';

	constructor() {
		this.wss = new WebRTMP_Controller();

		this._config = defaultConfig

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


		/*

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

		this._transmuxer.on(TransmuxingEvents.INIT_SEGMENT, (type, is) => {
			this._msectl.appendInitSegment(is);
		});

		this._transmuxer.on(TransmuxingEvents.MEDIA_SEGMENT, (type, ms) => {
			this._msectl.appendMediaSegment(ms);
		});


		this._transmuxer.on(TransmuxingEvents.LOADING_COMPLETE, () => {
			this._msectl.endOfStream();
			this._emitter.emit(PlayerEvents.LOADING_COMPLETE);
		});

		this._transmuxer.on(TransmuxingEvents.RECOVERED_EARLY_EOF, () => {
			this._emitter.emit(PlayerEvents.RECOVERED_EARLY_EOF);
		});

		this._transmuxer.on(TransmuxingEvents.IO_ERROR, (detail, info) => {
			this._emitter.emit(PlayerEvents.ERROR, ErrorTypes.NETWORK_ERROR, detail, info);
		});

		this._transmuxer.on(TransmuxingEvents.DEMUX_ERROR, (detail, info) => {
			this._emitter.emit(PlayerEvents.ERROR, ErrorTypes.MEDIA_ERROR, detail, {code: -1, msg: info});
		});

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

		this._transmuxer.on(TransmuxingEvents.STATISTICS_INFO, (statInfo) => {
			this._statisticsInfo = this._fillStatisticsInfo(statInfo);
			this._emitter.emit(PlayerEvents.STATISTICS_INFO, Object.assign({}, this._statisticsInfo));
		});

		let chromeNeedIDRFix = (Browser.chrome &&
			(Browser.version.major < 50 ||
				(Browser.version.major === 50 && Browser.version.build < 2661)));
		this._alwaysSeekKeyframe = (chromeNeedIDRFix || Browser.msedge || Browser.msie) ? true : false;

		if (this._alwaysSeekKeyframe) {
			this._config.accurateSeek = false;
		}
*/
	}

	_checkAndResumeStuckPlayback(stalled) {
		let media = this._mediaElement;
		if (stalled || !this._receivedCanPlay || media.readyState < 2) {  // HAVE_CURRENT_DATA
			let buffered = media.buffered;
			if (buffered.length > 0 && media.currentTime < buffered.start(0)) {
				Log.w(this.TAG, `Playback seems stuck at ${media.currentTime}, seek to ${buffered.start(0)}`);
				this._requestSetTime = true;
				this._mediaElement.currentTime = buffered.start(0);
				this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			}
		} else {
			// Playback didn't stuck, remove progress event listener
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
		}
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
		this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress(e) {
		this._checkAndResumeStuckPlayback();
	}

	_onvSeeking(){
		let target = this._mediaElement.currentTime;
		let buffered = this._mediaElement.buffered;

		if (this._requestSetTime) {
			this._requestSetTime = false;
			return;
		}

		if (target < 1.0 && buffered.length > 0) {
			// seek to video begin, set currentTime directly if beginPTS buffered
			let videoBeginTime = buffered.start(0);
			if ((videoBeginTime < 1.0 && target < videoBeginTime) || Browser.safari) {
				this._requestSetTime = true;
				// also workaround for Safari: Seek to 0 may cause video stuck, use 0.1 to avoid
				this._mediaElement.currentTime = Browser.safari ? 0.1 : videoBeginTime;
				return;
			}
		}

		if (this._isTimepointBuffered(target)) {
			if (this._alwaysSeekKeyframe) {
				let idr = this._msectl.getNearestKeyframe(Math.floor(target * 1000));
				if (idr != null) {
					this._requestSetTime = true;
					this._mediaElement.currentTime = idr.dts / 1000;
				}
			}
			if (this._progressChecker != null) {
				this._checkProgressAndResume();
			}
			return;
		}

		this._seekpointRecord = {
			seekPoint: target,
			recordTime: this._now()
		};
		window.setTimeout(this._checkAndApplyUnbufferedSeekpoint.bind(this), 50);
	}

	_isTimepointBuffered(seconds) {
		let buffered = this._mediaElement.buffered;

		for (let i = 0; i < buffered.length; i++) {
			let from = buffered.start(i);
			let to = buffered.end(i);
			if (seconds >= from && seconds < to) {
				return true;
			}
		}
		return false;
	}

	_checkProgressAndResume() {
		let currentTime = this._mediaElement.currentTime;
		let buffered = this._mediaElement.buffered;

		let needResume = false;

		for (let i = 0; i < buffered.length; i++) {
			let from = buffered.start(i);
			let to = buffered.end(i);
			if (currentTime >= from && currentTime < to) {
				if (currentTime >= to - this._config.lazyLoadRecoverDuration) {
					needResume = true;
				}
				break;
			}
		}

		if (needResume) {
			window.clearInterval(this._progressChecker);
			this._progressChecker = null;
			if (needResume) {
				Log.v(this.TAG, 'Continue loading from paused position');
				//this._transmuxer.resume();
			}
		}
	}

	_checkAndApplyUnbufferedSeekpoint() {
		if (this._seekpointRecord) {
			if (this._seekpointRecord.recordTime <= this._now() - 100) {
				let target = this._mediaElement.currentTime;
				this._seekpointRecord = null;
				if (!this._isTimepointBuffered(target)) {
					if (this._progressChecker != null) {
						window.clearTimeout(this._progressChecker);
						this._progressChecker = null;
					}
					// .currentTime is consists with .buffered timestamp
					// Chrome/Edge use DTS, while FireFox/Safari use PTS
					this._msectl.seek(target);
					this._transmuxer.seek(Math.floor(target * 1000));
					// set currentTime if accurateSeek, or wait for recommend_seekpoint callback
					if (this._config.accurateSeek) {
						this._requestSetTime = true;
						this._mediaElement.currentTime = target;
					}
				}
			} else {
				window.setTimeout(this._checkAndApplyUnbufferedSeekpoint.bind(this), 50);
			}
		}
	}


	_fillStatisticsInfo(statInfo) {
		statInfo.playerType = this._type;

		if (!(this._mediaElement instanceof HTMLVideoElement)) {
			return statInfo;
		}

		let hasQualityInfo = true;
		let decoded = 0;
		let dropped = 0;

		if (this._mediaElement.getVideoPlaybackQuality) {
			let quality = this._mediaElement.getVideoPlaybackQuality();
			decoded = quality.totalVideoFrames;
			dropped = quality.droppedVideoFrames;
		} else if (this._mediaElement.webkitDecodedFrameCount != undefined) {
			decoded = this._mediaElement.webkitDecodedFrameCount;
			dropped = this._mediaElement.webkitDroppedFrameCount;
		} else {
			hasQualityInfo = false;
		}

		if (hasQualityInfo) {
			statInfo.decodedFrames = decoded;
			statInfo.droppedFrames = dropped;
		}

		return statInfo;
	}

	_onmseBufferFull() {
		Log.w(this.TAG, 'MSE SourceBuffer is full, suspend transmuxing task');
		if (this._progressChecker == null) {
			//this._suspendTransmuxer();
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

		this._msectl = new MSEController(defaultConfig);

		this._msectl.on(MSEEvents.UPDATE_END, this._onmseUpdateEnd.bind(this));
		this._msectl.on(MSEEvents.BUFFER_FULL, this._onmseBufferFull.bind(this));

		this._msectl.on(MSEEvents.ERROR, (info) => {
			this._emitter.emit(PlayerEvents.ERROR,
				ErrorTypes.MEDIA_ERROR,
				ErrorDetails.MEDIA_MSE_ERROR,
				info
			);
		});

		this.wss.addEventListener(TransmuxingEvents.INIT_SEGMENT, (data)=>{
			Log.i(this.TAG, TransmuxingEvents.INIT_SEGMENT, data[0], data[1]);
			this._msectl.appendInitSegment(data[1]);
		});

		this.wss.addEventListener(TransmuxingEvents.MEDIA_SEGMENT, (data)=>{
			Log.i(this.TAG, TransmuxingEvents.MEDIA_SEGMENT, data[0], data[1]);
			this._msectl.appendMediaSegment(data[1]);
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


	}
}
Log.LEVEL = Log.DEBUG;

export default WebRTMP;

window["Log"] = Log;
window["webrtmp"] = new WebRTMP();

