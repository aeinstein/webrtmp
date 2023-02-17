import {_byteArrayToNumber, _byteArrayToString, _numberToByteArray, _stringToByteArray} from "../utils/utils";
import Log from "../utils/logger";

class AMF0Object {
	TAG = "AMF0Object";

	command;
	transaction_id;
	command_object;
    additionalInfo;

	data;

    params;

	/**
	 *
	 * @param {Object} params
	 */
	constructor(params) {
		if(params) {
            this.params = params;
			Log.d(this.TAG, "cmd: " + this.params[0]);
		}
	}

    /**
     *
     * @param {Uint8Array} data
     * @returns {*[]}
     */
	parseAMF0(data) {
		this.data = Array.from(data);
		let obj = [];

		while (this.data.length > 0) {
			const var_type = this.data.shift();

			switch(var_type) {
			case 0x00: // Number
				obj.push(_byteArrayToNumber(this.data.slice(0, 8)));
				this.data = this.data.slice(8);
				break;

			case 0x01: // boolean
				if (this.data.shift() === 0) {
					obj.push(false);
				} else {
					obj.push(true);
				}

				break;

			case 0x02: // String
				let len = (this.data[0] << 8) | (this.data[1]);
				this.data = this.data.slice(2);

				obj.push(_byteArrayToString(this.data.slice(0, len)));
				this.data = this.data.slice(len);
				break;

			case 0x03: // AMF encoded object
				obj.push(this._parseAMF0Object());
				break;

			case 0x05: // NUll
                obj.push(null);
				break;

            default:
                Log.w(this.TAG, "var_type: " + var_type + " not yet implemented");
                break;
			}
		}
        this.params = obj;
		return obj;
	}

	_parseAMF0Object() {
		let o2 = {};

		while (this.data.length > 0) {
			let keylen = (this.data[0] << 8) | (this.data[1]); this.data = this.data.slice(2);

			// Object end marker
			if (keylen === 0 && this.data[0] === 9) {
				this.data = this.data.slice(1);
				return o2;
			}

			let keyName = _byteArrayToString(this.data.slice(0, keylen)); this.data = this.data.slice(keylen);

			const var_type = this.data.shift();

			switch(var_type) {
            case 0x00: // Number
                o2[keyName] = _byteArrayToNumber(this.data.slice(0, 8));
                this.data = this.data.slice(8);
                break;

            case 0x01: // boolean
                if (this.data.shift() === 0) {
                    o2[keyName] = false;
                } else {
                    o2[keyName] = true;
                }

                break;

            case 0x02: // String
                let len = (this.data[0] << 8) | (this.data[1]);
                this.data = this.data.slice(2);

                o2[keyName] = _byteArrayToString(this.data.slice(0, len));
                this.data = this.data.slice(len);
                break;

            case 0x05:
                o2[keyName] = null;
                break;

            default:
				Log.w(this.TAG, "var_type: " + var_type + " not yet implemented");
                break;
			}
		}

		return o2;
	}

    /**
     *
     * @returns {Uint8Array}
     */
	getBytes() {
		let bytes = [];

        for(let i = 0; i < this.params.length; i++) {
            const param = this.params[i];

            switch(typeof param){
            case "string":
                // Command
                bytes.push(0x02); // String
                bytes.push(param.length >>> 8);
                bytes.push(param.length);
                bytes = bytes.concat(_stringToByteArray(param));
                break;

            case "number":
                // TransactionID
                bytes.push(0x00); // Number
                bytes = bytes.concat(_numberToByteArray(param));
                break;

            case "object":
                // Command Object
                bytes.push(0x03); // Object

                for (let key in param) {
                    let value = param[key];
                    let keylength = key.length;

                    bytes.push(keylength >>> 8);
                    bytes.push(keylength);
                    bytes = bytes.concat(_stringToByteArray(key));

                    switch(typeof value) {
                    case "object":
                        if (value == null) {
                            bytes.push(0x05); // Null
                        }

                        break;

                    case "string":
                        const length = value.length;
                        bytes.push(0x02);
                        bytes.push(length >>> 8);
                        bytes.push(length);
                        bytes = bytes.concat(_stringToByteArray(value))
                        break;

                    case "number":
                        bytes.push(0x00);
                        bytes = bytes.concat(_numberToByteArray(value))
                        break;

                    case "boolean":
                        bytes.push(0x01);
                        if (value) bytes.push(0x01);
                        else bytes.push(0x00);
                        break;

                    default:
						Log.w(this.TAG, typeof value, " not yet implementd");
                        break;
                    }
                }

                bytes.push(0x00); // End Marker
                bytes.push(0x00);
                bytes.push(0x09);
                break;

            case "boolean":
                bytes.push(0x01);
                if(param) bytes.push(0x01);
                else bytes.push(0x00);
                break;

            default:
				Log.w(this.TAG, typeof param, " not yet implementd");
                break;
            }
        }

		return new Uint8Array(bytes);
	}

    getCommand(){
        return this.command;
    }

    getTransactionId(){
        return this.transaction_id;
    }

    getCommandObject(){
        return this.command_object;
    }

    getAdditionalInfo(){
        return this.additionalInfo;
    }
}

export default AMF0Object;

const test = [
	0x02, 0x00, 0x07,  0x63, 0x6f, 0x6e, 0x6e, 0x65, 0x63, 0x74, // 7 connect
	0x00, 0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 		// Tid 1
	0x03, 		// object start
	0x00, 0x03,  0x61, 0x70, 0x70,  // key app 3
	0x02, 0x00, 0x08, 0x62, 0x75, 0x6e, 0x6b, 0x65, 0x72, 0x74, 0x76, // string bunkertv
	0x00, 0x08, 0x66, 0x6c, 0x61, 0x73, 0x68, 0x56, 0x65, 0x72,  // flashVer
	0x02, 0x00, 0x0d,  0x4c, 0x4e, 0x58, 0x20, 0x39, 0x2c, 0x30, 0x2c, 0x31, 0x32, 0x34, 0x2c, 0x32, //LNX
	0x00, 0x05, 0x74, 0x63, 0x55, 0x72, 0x6c,  // tcUrl...

	0x02, 0x00, 0x21,  0x72, 0x74, 0x6d, 0x70, 0x3a, 0x2f, 0x2f, 0x62, 0x75, 0x6e, 0x6b, 0x65,
	0x72, 0x74, 0x76, 0x2e, 0x6f, 0x72, 0x67, 0x3a, 0x31, 0x39, 0x33, 0x35, 0x2f, 0x62, 0x75, 0x6e,
	0x6b, 0x65, 0x72, 0x74, 0x76,

	0x00, 0x04, 0x66, 0x70, 0x61, 0x64, 		//fpad
	0x01, 0x00, 					// bool false
	0x00, 0x0c, 0x63, 0x61, 0x70, 0x61, 0x62, 0x69, 0x6c, 0x69, 0x74, 0x69, 0x65, 0x73,  //capabilities
	0x00, 0x40, 0x2e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x0b, 0x61, 0x75, 0x64, 0x69, 0x6f, 0x43, 0x6f, 0x64, 0x65, 0x63, 0x73, // audio..
	0x00, 0x40, 0xaf, 0xce, 0x00, 0x00, 0x00, 0x00, 0x00,

	0x00, 0x0b, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x43, 0x6f, 0x64, 0x65, 0x63, 0x73, //videocodecs
	0x00, 0x40, 0x6f, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x0d, 0x76, 0x69, 0x64, 0x65, 0x6f, 0x46, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e, //videoFunction
	0x00, 0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x09];