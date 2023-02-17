class EventEmitter{
	ListenerList = [];

	constructor() {
	}

	addListener(event, listener){
		this.ListenerList.push([event, listener]);
	}

	removeListener(event, listener){
		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] == event && entry[1] == listener){
				this.ListenerList.splice(i,1);
				return;
			}
		}
	}

	removeAllListeners(){
		this.ListenerList = [];
	}

	emit(event, data){
		console.log("emit EVENT: " + event, data);
		for(let i = 0; i < this.ListenerList.length;i++){
			let entry = this.ListenerList[i];
			if(entry[0] == event){
				entry[1].call(this, data);
			}
		}
	}
}

export default EventEmitter;

