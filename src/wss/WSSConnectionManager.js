import Log from "../utils/logger";

class WSSConnectionManager{
    TAG = "WSSConnectionManager";
    host;
    wss;

    /**
     *
     * @param {String} host
     * @param {Number} port
     * @param callback
     */
    connect(host, port, callback){
        this.host = host;
        Log.v(this.TAG, "connecting to : " + host + ":" + port);
        this.wss = new WebSocket("wss://" + host + ":" + port + "/");

        this.wss.binaryType = "arraybuffer";

        this.wss.onopen = (e)=>{
            Log.v(this.TAG, e);
            callback(true);
        }

        this.wss.onclose = (e)=>{
            Log.w(this.TAG, e);
            postMessage(["ConnectionLost"]);
        }

        this.wss.onerror = (e)=>{
            Log.e(this.TAG, e);
            postMessage(["Failure"]);
        }
    }

    registerMessageHandler(cb){
        this.wss.onmessage = cb;
    }

    getSocket(){
        return this.wss;
    }

    getHost(){
        return this.host;
    }

    close(){
        this.wss.close();
    }
}

export default WSSConnectionManager;
