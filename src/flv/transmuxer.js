/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
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
 */


import {TransmuxingEvents} from "../utils/utils";
import EventEmitter from "../utils/event_emitter";
import MP4Remuxer from "../formats/mp4-remuxer";
import Browser from "../utils/browser";
import Log from "../utils/logger";

class Transmuxer {
    TAG = 'Transmuxer';

    constructor(config) {
        this._emitter = new EventEmitter();

        this._config = config;

        this._pendingSeekTime = null;
        this._pendingResolveSeekPoint = null;

        this._remuxer = new MP4Remuxer(this._config);
        this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival.bind(this);
        this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival.bind(this);
    }

    destroy() {
        if (this._remuxer) {
            this._remuxer.destroy();
            this._remuxer = null;
        }

        this._emitter.removeAllListener();
        this._emitter = null;
    }

    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    remux(audioTrack, videoTrack){
        this._remuxer.remux(audioTrack, videoTrack);
    }

    _onTrackMetadataReceived(type, metadata) {
        this._remuxer._onTrackMetadataReceived(type, metadata);
    }

    stop() {
       // this._internalAbort();
    }

    _onRemuxerInitSegmentArrival(type, initSegment) {
        this._emitter.emit(TransmuxingEvents.INIT_SEGMENT, type, initSegment);
    }

    _onRemuxerMediaSegmentArrival(type, mediaSegment) {
        Log.d(this.TAG, "_onRemuxerMediaSegmentArrival");
        if (this._pendingSeekTime != null) {
            // Media segments after new-segment cross-seeking should be dropped.
            return;
        }
        this._emitter.emit(TransmuxingEvents.MEDIA_SEGMENT, type, mediaSegment);

        // Resolve pending seekPoint
        if (this._pendingResolveSeekPoint != null && type === 'video') {
            let syncPoints = mediaSegment.info.syncPoints;
            let seekpoint = this._pendingResolveSeekPoint;
            this._pendingResolveSeekPoint = null;

            // Safari: Pass PTS for recommend_seekpoint
            if (Browser.safari && syncPoints.length > 0 && syncPoints[0].originalDts === seekpoint) {
                seekpoint = syncPoints[0].pts;
            }
            // else: use original DTS (keyframe.milliseconds)

            this._emitter.emit(TransmuxingEvents.RECOMMEND_SEEKPOINT, seekpoint);
        }
    }
}

export default Transmuxer;
