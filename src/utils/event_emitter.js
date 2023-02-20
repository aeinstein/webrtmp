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

import Log from "../utils/logger";

class EventEmitter{
	ListenerList = [];
	TAG = "EventEmitter";

	constructor() {
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	addEventListener(event, listener){
		this.ListenerList.push([event, listener]);
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	addListener(event, listener){
		this.ListenerList.push([event, listener]);
	}


	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	removeListener(event, listener){
		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] == event && entry[1] == listener){
				this.ListenerList.splice(i,1);
				return;
			}
		}
	}

	/**
	 * Remove all listener
	 */
	removeAllListeners(){
		this.ListenerList = [];
	}

	/**
	 *
	 * @param {String} event
	 * @param data
	 */
	emit(event, ...data){
		Log.t(this.TAG, "emit EVENT: " + event, ...data);
		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event){
				entry[1].call(this, ...data);
			}
		}
	}
}

export default EventEmitter;

