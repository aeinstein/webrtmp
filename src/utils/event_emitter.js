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
	waiters = [];

	constructor() {
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 * @param {boolean} modal
	 */
	addEventListener(event, listener, modal = false){
		Log.d(this.TAG, "addEventListener: " + event);

		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event) {
				if (modal || entry[1] === listener) {
					Log.w(this.TAG, "Listener already registered, overriding");
					return;
				}
			}
		}
		this.ListenerList.push([event, listener]);
	}

	waitForEvent(event, callback){
		this.waiters.push([event, callback]);
	}

	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 * @param {boolean} modal
	 */
	addListener(event, listener, modal){
		this.addEventListener(event, listener, modal);
	}


	/**
	 *
	 * @param {String} event
	 * @param {Function} listener
	 */
	removeEventListener(event, listener){
		Log.d(this.TAG, "removeEventListener: " + event);

		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event && entry[1] === listener){
				this.ListenerList.splice(i,1);
				return;
			}
		}
	}

	removeListener(event, listener){
		this.removeEventListener(event, listener);
	}

	/**
	 * Remove all listener
	 */
	removeAllEventListener(event){
		Log.d(this.TAG, "removeAllEventListener: ", event);
		if(event) {
			for(let i = 0; i < this.ListenerList.length;i++) {
				let entry = this.ListenerList[i];
				if(entry[0] === event){
					this.ListenerList.splice(i,1);
					i--;
				}
			}
		} else
			this.ListenerList = [];
	}

	removeAllListener(event){
		this.removeAllEventListener(event);
	}

	/**
	 *
	 * @param {String} event
	 * @param data
	 */
	emit(event, ...data){
		Log.t(this.TAG, "emit EVENT: " + event, ...data);

		for(let i = 0; i < this.waiters.length;i++){
			let entry = this.waiters[i];

			if(entry[0] === event){
				Log.d(this.TAG, "hit waiting event: " + event);
				entry[1].call(this, ...data);
				this.waiters.splice(i,1);
				i--;
			}
		}

		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] === event){
				entry[1].call(this, ...data);
			}
		}
	}
}

export default EventEmitter;

