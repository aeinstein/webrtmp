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

import Log from "./utils/logger";
import MSEController from "./utils/mse-controller";
import {defaultConfig, ErrorDetails, ErrorTypes, MSEEvents, PlayerEvents, TransmuxingEvents} from "./utils/utils";
import EventEmitter from "./utils/event_emitter";
import WebRTMP_Controller from "./wss/webrtmp.controller";
import Browser from "./utils/browser";

class WebRTMP{
	TAG = 'WebRTMP';
	_mediaElement = null;

	constructor() {
		this.wss = new WebRTMP_Controller();

		this._config = defaultConfig

		this.wss.addEventListener("RTMPMessageArrived", (data)=>{
			Log.d(this.TAG,"RTMPMessageArrived", data);
		});

		this.wss.addEventListener("ProtocolControlMessage", (data)=>{
			Log.d(this.TAG,"ProtocolControlMessage", data);
		});

		this.wss.addEventListener("UserControlMessage", (data)=>{
			Log.d(this.TAG,"UserControlMessage", data);
		});

		this.wss.addEventListener("ConnectionLost", ()=>{});

		this._emitter = new EventEmitter();

		this.e = {
			onvLoadedMetadata: this._onvLoadedMetadata.bind(this),
			onvSeeking: this._onvSeeking.bind(this),
			onvCanPlay: this._onvCanPlay.bind(this),
			onvStalled: this._onvStalled.bind(this),
			onvProgress: this._onvProgress.bind(this)
		};
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
		return new Promise((resolve, reject)=>{
			/*
			this.wss.addEventListener("RTMPHandshakeDone", (success)=>{
				Log.d(this.TAG,"RTMPHandshakeDone");
				if(success) resolve();
				else reject();
			});*/

			this.wss.play(streamName);
			this._mediaElement.play();
			resolve();
		});
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 * @returns {Promise<unknown>}
	 */
	open(host, port){
		return new Promise((resolve, reject)=>{
			this.wss.addEventListener("RTMPHandshakeDone", (success)=>{
				Log.d(this.TAG,"RTMPHandshakeDone");
				if(success) resolve();
				else reject();
			});

			this.wss.addEventListener("WSSConnectFailed", ()=>{
				Log.d(this.TAG,"WSSConnectFailed");
				reject();
			});

			this.wss.open(host, port);
		})
	}

	/**
	 *
	 * @param {String} appName
	 * @returns {Promise<unknown>}
	 */
	connect(appName){
		return new Promise((resolve, reject)=>{
			this.wss.addEventListener("RTMPStreamCreated", ()=>{
				Log.d(this.TAG,"RTMPStreamCreated");
				resolve();
			});

			this.wss.connect(appName);
		})

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

export default WebRTMP;

window["Log"] = Log;
window["webrtmp"] = new WebRTMP();

