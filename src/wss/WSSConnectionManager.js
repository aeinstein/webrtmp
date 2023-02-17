class WSSConnectionManager{
    wss;

    connect(host, port, callback){
        console.log("[ WSSConnectionManager ] connecting to : " + host + ":" + port);
        this.wss = new WebSocket("wss://" + host + ":" + port + "/");

        this.wss.binaryType = "arraybuffer";

        this.wss.onopen = (e)=>{
            console.log(e);
            callback(true);
        }

        this.wss.onclose = (e)=>{
            console.log(e);
            postMessage(["ConnectionLost"]);
        }

        this.wss.onerror = (e)=>{
            console.log(e);
            postMessage(["Failure"]);
        }
    }

    registerMessageHandler(cb){
        this.wss.onmessage = cb;
    }

    getSocket(){
        return this.wss;
    }

    close(){
        this.wss.close();
    }
}

export default WSSConnectionManager;
