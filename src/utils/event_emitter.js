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

