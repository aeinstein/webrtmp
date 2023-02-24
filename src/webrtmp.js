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

	/**
	 *
	 * @type {HTMLVideoElement}
	 * @private
	 */
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
		Log.d(this.TAG, "onvCanPlay");
		this._mediaElement.play().then(()=>{
			Log.d(this.TAG, "promise play");
		});
		this._receivedCanPlay = true;
		this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
	}

	_onvStalled(e) {
		this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress(e) {
		this._checkAndResumeStuckPlayback();
	}

	_onmseBufferFull() {
		Log.w(this.TAG, 'MSE SourceBuffer is full');
	}

	destroy() {
		if (this._mediaElement) {
			this.detachMediaElement();
		}
		this.e = null;
		this._emitter.removeAllListeners();
		this._emitter = null;
	}

	disconnect(){
		this.wss.disconnect();
	}

	/**
	 * send play command
	 * @param {String} streamName
	 * @returns {Promise<unknown>}
	 */
	play(streamName){
		return new Promise((resolve, reject)=>{
			this.wss.play(streamName);
			this._mediaElement.play().then(resolve);
		});
	}

	stop(){
		this.wss.stop()
		this._mediaElement.pause();
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
			this.wss.addEventListener("RTMPStreamCreated", (cmd, stream_id)=>{
				Log.d(this.TAG,"RTMPStreamCreated: " + stream_id);
				resolve();
			});

			this.wss.connect(appName);
		})
	}

	pause(enable){
		this.wss.pause(enable);


		if(enable) {
			this._mediaElement.pause();


		} else {
			this.kerkDown = 10;
			this._mediaElement.play().then(()=>{

			});
		}
	}

	detachMediaElement() {
		if (this._mediaElement) {
			this._msectl.detachMediaElement();
			this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
			this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
			this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			this._mediaElement = null;
		}

		if (this._msectl) {
			this.wss.removeEventListener(TransmuxingEvents.INIT_SEGMENT, this._appendInitSegment);
			this.wss.removeEventListener(TransmuxingEvents.MEDIA_SEGMENT, this._appendMediaSegment);
			this._msectl.destroy();
			this._msectl = null;
		}
	}

	/**
	 *
	 * @param {HTMLVideoElement} mediaElement
	 */
	attachMediaElement(mediaElement) {
		this._mediaElement = mediaElement;
		mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);
		mediaElement.addEventListener('canplay', this.e.onvCanPlay);
		mediaElement.addEventListener('stalled', this.e.onvStalled);
		mediaElement.addEventListener('progress', this.e.onvProgress);

		this._msectl = new MSEController(defaultConfig);

		//this._msectl.on(MSEEvents.UPDATE_END, this._onmseUpdateEnd.bind(this));
		this._msectl.on(MSEEvents.BUFFER_FULL, this._onmseBufferFull.bind(this));

		this._msectl.on(MSEEvents.ERROR, (info) => {
			this._emitter.emit(PlayerEvents.ERROR,
				ErrorTypes.MEDIA_ERROR,
				ErrorDetails.MEDIA_MSE_ERROR,
				info
			);
		});

		this.wss.addEventListener(TransmuxingEvents.INIT_SEGMENT, this._appendInitSegment.bind(this));
		this.wss.addEventListener(TransmuxingEvents.MEDIA_SEGMENT, this._appendMediaSegment.bind(this));

		this._msectl.attachMediaElement(mediaElement);
	}

	_appendInitSegment(data){
		Log.t(this.TAG, TransmuxingEvents.INIT_SEGMENT, data[0], data[1]);
		this._msectl.appendInitSegment(data[1]);
	}

	_appendMediaSegment(data){
		Log.t(this.TAG, TransmuxingEvents.MEDIA_SEGMENT, data[0], data[1]);
		this._msectl.appendMediaSegment(data[1]);
		if(this.kerkDown) {
			this.kerkDown--;
			console.log("settime");
			this._mediaElement.currentTime = 2000000000;
		}
	}
}

export default WebRTMP;

window["Log"] = Log;
window["webrtmp"] = new WebRTMP();

