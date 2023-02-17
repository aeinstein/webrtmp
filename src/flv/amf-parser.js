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


import {IllegalStateException} from "../utils/exception";
import {decodeUTF8} from "../utils/utf8-conv";

let le = (function () {
    let buf = new ArrayBuffer(2);
    (new DataView(buf)).setInt16(0, 256, true);  // little-endian write
    return (new Int16Array(buf))[0] === 256;  // platform-spec read, if equal then LE
})();

class AMF {

    /**
     *
     * @param {Uint8Array} array
     * @returns {{}}
     */
    static parseScriptData(array) {
        console.log(array);

        let data = {};

        try {
            let name = AMF.parseValue(array);
            console.log(name);

            let value = AMF.parseValue(array.slice(name.size));
            console.log(value);

            data[name.data] = value.data;

        } catch (e) {
            console.error('AMF', e.toString());
        }

        return data;
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: {name: string, value: {}}, size: number, objectEnd: boolean}}
     */
    static parseObject(array) {
        if (array.length < 3) {
            throw new IllegalStateException('Data not enough when parse ScriptDataObject');
        }
        let name = AMF.parseString(array);
        let value = AMF.parseValue(array.slice(name.size, array.length - name.size));
        let isObjectEnd = value.objectEnd;

        return {
            data: {
                name: name.data,
                value: value.data
            },
            size: name.size + value.size,
            objectEnd: isObjectEnd
        };
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: {name: string, value: {}}, size: number, objectEnd: boolean}}
     */
    static parseVariable(array) {
        return AMF.parseObject(array);
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: string, size: number}}
     */
    static parseString(array) {
        if (array.length < 2) {
            throw new IllegalStateException('Data not enough when parse String');
        }
        let v = new DataView(array.buffer);
        let length = v.getUint16(0, !le);

        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(array.slice(2, 2 + length)));
        } else {
            str = '';
        }

        return {
            data: str,
            size: 2 + length
        };
    }

    static parseLongString(array) {
        if (array.length() < 4) {
            throw new IllegalStateException('Data not enough when parse LongString');
        }
        let v = new DataView(array.buffer);
        let length = v.getUint32(0, !le);

        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(array.slice(4, 4 +length)));
        } else {
            str = '';
        }

        return {
            data: str,
            size: 4 + length
        };
    }

    static parseDate(array) {
        if (array.length() < 10) {
            throw new IllegalStateException('Data size invalid when parse Date');
        }
        let v = new DataView(array.buffer);
        let timestamp = v.getFloat64(0, !le);
        let localTimeOffset = v.getInt16(8, !le);
        timestamp += localTimeOffset * 60 * 1000;  // get UTC time

        return {
            data: new Date(timestamp),
            size: 8 + 2
        };
    }

    /**
     *
     * @param {Uint8Array} array
     * @returns {{data: {}, size: number, objectEnd: boolean}}
     */
    static parseValue(array) {
        if (array.length < 1) {
            throw new IllegalStateException('Data not enough when parse Value');
        }

        let v = new DataView(array.buffer);

        let offset = 1;
        let type = v.getUint8(0);
        let value;
        let objectEnd = false;

        try {
            switch (type) {
                case 0:  // Number(Double) type
                    value = v.getFloat64(1, !le);
                    offset += 8;
                    break;
                case 1: {  // Boolean type
                    let b = v.getUint8(1);
                    value = b ? true : false;
                    offset += 1;
                    break;
                }
                case 2: {  // String type
                    let amfstr = AMF.parseString(array.slice(1));
                    value = amfstr.data;
                    offset += amfstr.size;
                    break;
                }
                case 3: { // Object(s) type
                    value = {};
                    let terminal = 0;  // workaround for malformed Objects which has missing ScriptDataObjectEnd
                    if ((v.getUint32(array.length - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (offset < array.length - 4) {  // 4 === type(UI8) + ScriptDataObjectEnd(UI24)
                        let amfobj = AMF.parseObject(array.slice(offset, offset + array.length - terminal));
                        if (amfobj.objectEnd)
                            break;
                        value[amfobj.data.name] = amfobj.data.value;
                        offset += amfobj.size;
                    }
                    if (offset <= array.length - 3) {
                        let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            offset += 3;
                        }
                    }
                    break;
                }
                case 8: { // ECMA array type (Mixed array)
                    value = {};
                    offset += 4;  // ECMAArrayLength(UI32)
                    let terminal = 0;  // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd
                    if ((v.getUint32(array.length - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (offset < array.length - 8) {  // 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)
                        let amfvar = AMF.parseVariable(array.slice(offset, offset + array.length - terminal));
                        if (amfvar.objectEnd)
                            break;
                        value[amfvar.data.name] = amfvar.data.value;
                        offset += amfvar.size;
                    }
                    if (offset <= array.length - 3) {
                        let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            offset += 3;
                        }
                    }
                    break;
                }
                case 9:  // ScriptDataObjectEnd
                    value = undefined;
                    offset = 1;
                    objectEnd = true;
                    break;
                case 10: {  // Strict array type
                    // ScriptDataValue[n]. NOTE: according to video_file_format_spec_v10_1.pdf
                    value = [];
                    let strictArrayLength = v.getUint32(1, !le);
                    offset += 4;
                    for (let i = 0; i < strictArrayLength; i++) {
                        let val = AMF.parseValue(array.slice(offset, array.length));
                        value.push(val.data);
                        offset += val.size;
                    }
                    break;
                }
                case 11: {  // Date type
                    let date = AMF.parseDate(array.slice(1));
                    value = date.data;
                    offset += date.size;
                    break;
                }
                case 12: {  // Long string type
                    let amfLongStr = AMF.parseString(array.slice(1));
                    value = amfLongStr.data;
                    offset += amfLongStr.size;
                    break;
                }
                default:
                    // ignore and skip
                    offset = array.length;
                    console.warn('Unsupported AMF value type ' + type);
            }
        } catch (e) {
            console.error('AMF', e.toString());
        }

        return {
            data: value,
            size: offset,
            objectEnd: objectEnd
        };
    }
}

export default AMF;
