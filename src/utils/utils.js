
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

/**
 * concat two Uint8Array
 * @param {Uint8Array} bufs
 * @returns {Uint8Array}
 */

export function _concatArrayBuffers(...bufs){
    const result = new Uint8Array(bufs.reduce((totalSize, buf)=>totalSize+buf.byteLength,0));
    bufs.reduce((offset, buf)=>{
        result.set(buf,offset)
        return offset+buf.byteLength
    },0)

    return result;
}

/**
 *
 * @param {String} str
 * @returns {*[]}
 * @private
 */
export function _stringToByteArray(str) {
    const bytes = [];

    for(let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        if(char > 0xFF) {
            bytes.push(char >>> 8);
        }

        bytes.push(char & 0xFF);
    }
    return bytes;
}

/**
 * convert Float64 to 8 byteArray
 * @param {Number} num
 * @returns {*[]}
 * @private
 */
export function _numberToByteArray(num) {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, num, false);
    return [].slice.call(new Uint8Array(buffer));
}

/**
 * convert 8 byte byteArray to Float64
 * @param {byte[]} ba
 * @returns {number}
 * @private
 */
export function _byteArrayToNumber(ba){
    let buf = new ArrayBuffer(ba.length);
    let view = new DataView(buf);

    ba.forEach(function (b, i) {
        view.setUint8(i, b);
    });

    return view.getFloat64(0);
}

/**
 * convert byteArray to string
 * @param {byte[]} ba
 * @returns {string}
 * @private
 */
export function _byteArrayToString(ba){
    let ret = "";

    for(let i = 0; i < ba.length; i++){
        ret += String.fromCharCode(ba[i]);
    }

    return ret;
}

export const defaultConfig = {
    enableStashBuffer: true,
    stashInitialSize: undefined,

    isLive: true,

    autoCleanupSourceBuffer: true,
    autoCleanupMaxBackwardDuration: 3 * 60,
    autoCleanupMinBackwardDuration: 2 * 60,

    statisticsInfoReportInterval: 600,

    fixAudioTimestampGap: true,

    headers: undefined
};


export const TransmuxingEvents = {
    IO_ERROR: 'io_error',
    DEMUX_ERROR: 'demux_error',
    INIT_SEGMENT: 'init_segment',
    MEDIA_SEGMENT: 'media_segment',
    LOADING_COMPLETE: 'loading_complete',
    RECOVERED_EARLY_EOF: 'recovered_early_eof',
    MEDIA_INFO: 'media_info',
    METADATA_ARRIVED: 'metadata_arrived',
    SCRIPTDATA_ARRIVED: 'scriptdata_arrived',
    STATISTICS_INFO: 'statistics_info',
    RECOMMEND_SEEKPOINT: 'recommend_seekpoint'
};

export const DemuxErrors = {
    OK: 'OK',
    FORMAT_ERROR: 'FormatError',
    FORMAT_UNSUPPORTED: 'FormatUnsupported',
    CODEC_UNSUPPORTED: 'CodecUnsupported'
};

export const MSEEvents = {
    ERROR: 'error',
    SOURCE_OPEN: 'source_open',
    UPDATE_END: 'update_end',
    BUFFER_FULL: 'buffer_full'
};

export const PlayerEvents = {
    ERROR: 'error',
    LOADING_COMPLETE: 'loading_complete',
    RECOVERED_EARLY_EOF: 'recovered_early_eof',
    MEDIA_INFO: 'media_info',
    METADATA_ARRIVED: 'metadata_arrived',
    SCRIPTDATA_ARRIVED: 'scriptdata_arrived',
    STATISTICS_INFO: 'statistics_info'
};

export const ErrorTypes = {
    NETWORK_ERROR: 'NetworkError',
    MEDIA_ERROR: 'MediaError',
    OTHER_ERROR: 'OtherError'
};

export const LoaderErrors = {
    OK: 'OK',
    EXCEPTION: 'Exception',
    HTTP_STATUS_CODE_INVALID: 'HttpStatusCodeInvalid',
    CONNECTING_TIMEOUT: 'ConnectingTimeout',
    EARLY_EOF: 'EarlyEof',
    UNRECOVERABLE_EARLY_EOF: 'UnrecoverableEarlyEof'
};

export const ErrorDetails = {
    NETWORK_EXCEPTION: LoaderErrors.EXCEPTION,
    NETWORK_STATUS_CODE_INVALID: LoaderErrors.HTTP_STATUS_CODE_INVALID,
    NETWORK_TIMEOUT: LoaderErrors.CONNECTING_TIMEOUT,
    NETWORK_UNRECOVERABLE_EARLY_EOF: LoaderErrors.UNRECOVERABLE_EARLY_EOF,

    MEDIA_MSE_ERROR: 'MediaMSEError',

    MEDIA_FORMAT_ERROR: DemuxErrors.FORMAT_ERROR,
    MEDIA_FORMAT_UNSUPPORTED: DemuxErrors.FORMAT_UNSUPPORTED,
    MEDIA_CODEC_UNSUPPORTED: DemuxErrors.CODEC_UNSUPPORTED
};
