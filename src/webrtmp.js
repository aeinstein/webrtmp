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

/**
 * the main class for webrtmp. Handles the remuxer result
 */
export class WebRTMP{
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
			onvProgress: this._onvProgress.bind(this),
			onvPlay: this._onvPlay.bind(this),
			onvPause: this._onvPause.bind(this),
			onAppendInitSegment: this._appendMediaSegment.bind(this),
			onAppendMediaSegment: this._appendMediaSegment.bind(this)
		};
	}

	_checkAndResumeStuckPlayback(stalled) {
		let media = this._mediaElement;
		if (stalled || !this._receivedCanPlay || media.readyState < 2) {  // HAVE_CURRENT_DATA
			let buffered = media.buffered;
			if (buffered.length > 0 && media.currentTime < buffered.start(0)) {
				Log.w(this.TAG, `Playback seems stuck at ${media.currentTime}, seek to ${buffered.start(0)}`);
				//this._requestSetTime = true;
				this._mediaElement.currentTime = buffered.start(0);
				this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			}
		} else {
			// Playback didn't stuck, remove progress event listener
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
		}
	}

	_onvLoadedMetadata() {
		if (this._pendingSeekTime != null) {
			this._mediaElement.currentTime = this._pendingSeekTime;
			this._pendingSeekTime = null;
		}
	}

	_onvCanPlay(e) {
		Log.d(this.TAG, "onvCanPlay", e);
		this._mediaElement.play().then(()=>{
			Log.d(this.TAG, "promise play");
		});
		this._receivedCanPlay = true;
		this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
	}

	_onvStalled() {
		this._checkAndResumeStuckPlayback(true);
	}

	_onvProgress() {
		this._checkAndResumeStuckPlayback();
	}

	_onmseBufferFull() {
		Log.w(this.TAG, 'MSE SourceBuffer is full');
	}

	_onvPlay(e){
		Log.d(this.TAG, "play:", e);
		this.pause(false);
	}

	_onvPause(e) {
		Log.d(this.TAG, "pause", e);
		this.pause(true);
	}

	destroy() {
		Log.w(this.TAG, "destroy webrtmp");
		if (this._mediaElement) {
			this.detachMediaElement();
		}
		this.e = null;
		this._emitter.removeAllListener();
		this._emitter = null;
	}

	disconnect(){
		this.wss.disconnect();
		this.wss.removeAllEventListener("RTMPHandshakeDone");
		this.wss.removeAllEventListener("WSSConnectFailed");
	}

	/**
	 * send play command
	 * @param {String} streamName
	 * @returns {Promise<unknown>}
	 */
	play(streamName){
		this.wss.play(streamName);
		return this._mediaElement.play();
	}

    /**
     * Stops loading, same as pause(true)
     */
	stopLoad(){
		//this.wss.stop()
		this._mediaElement.pause();
	}

	/**
	 *
	 * @param {String|null} host
	 * @param {Number|null} port
	 * @returns {Promise<unknown>}
	 */
	open(host, port){
		return this.wss.open(host, port);
	}

	/**
	 *
	 * @param {String} appName
	 * @returns {Promise<unknown>}
	 */
	connect(appName){
		return this.wss.connect(appName);
	}

    /**
     * Pause a rtmp stream
     * @param {boolean} enable
     */
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

    /**
     * Detach Mediaelement
     */
	detachMediaElement() {
		this.wss.removeAllEventListener(TransmuxingEvents.INIT_SEGMENT);
		this.wss.removeAllEventListener(TransmuxingEvents.MEDIA_SEGMENT);

		if (this._mediaElement) {
			this._msectl.detachMediaElement();
			this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
			this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
			this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
			this._mediaElement.removeEventListener('progress', this.e.onvProgress);
			this._mediaElement.removeEventListener('play', this.e.onvPlay);
			this._mediaElement.removeEventListener('pause', this.e.onvPause);
			this._mediaElement = null;
		}

		if (this._msectl) {
			this._msectl.destroy();
			this._msectl = null;
		}

		this.disconnect();
	}

	/**
	 * Attach MediaElement
	 * @param {HTMLVideoElement} mediaElement
	 */
	attachMediaElement(mediaElement) {
		this._mediaElement = mediaElement;
		mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);
		mediaElement.addEventListener('canplay', this.e.onvCanPlay);
		mediaElement.addEventListener('stalled', this.e.onvStalled);
		mediaElement.addEventListener('progress', this.e.onvProgress);
		mediaElement.addEventListener('play', this.e.onvPlay);
		mediaElement.addEventListener('pause', this.e.onvPause);

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

		this.wss.addEventListener(TransmuxingEvents.INIT_SEGMENT, this._appendInitSegment.bind(this), true);
		this.wss.addEventListener(TransmuxingEvents.MEDIA_SEGMENT, this._appendMediaSegment.bind(this), true);

		this._msectl.attachMediaElement(mediaElement);
	}

    /**
     * Append Init Segment to MSE
     * @param data
     * @private
     */
	_appendInitSegment(data){
		Log.i(this.TAG, TransmuxingEvents.INIT_SEGMENT, data[0], data[1]);
		this._msectl.appendInitSegment(data[1]);
	}

    /**
     * Append Media Segment to MSE
     * @param data
     * @private
     */
	_appendMediaSegment(data){
		Log.t(this.TAG, TransmuxingEvents.MEDIA_SEGMENT, data[0], data[1]);
		this._msectl.appendMediaSegment(data[1]);
		if(this.kerkDown) {
			this.kerkDown--;
			this._mediaElement.currentTime = 2000000000;

			if(!this.kerkDown) Log.d(this.TAG, "kerkdown reached");
		}
	}
}
