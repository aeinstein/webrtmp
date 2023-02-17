class RTMPHandshake{
    state = 0;
    c1;
    c2;
    s1;
    s2;

    constructor(socket) {
        this.socket = socket;

        this.socket.onmessage = (e)=>{
            this.processServerInput(e.data);
        }
    }

    do(){
        console.log("send C0");
        this.socket.send(new Uint8Array([0x03]));
        this.state = 1;

        this._generateC1();
        console.log("send C1");
        this.socket.send(this.c1);
        this.state = 2;
    }

    _generateC1(){
        const c1 = new Uint8Array(1536);

        for(let i = 0; i < c1.length; i++) {
            c1[i] = Math.floor(Math.random() * 256);
        }

        let time = Math.round(Date.now() / 1000);

        c1[0] = (time >>> 24);
        c1[1] = (time >>> 16);
        c1[2] = (time >>> 8);
        c1[3] = (time);

        c1[4] = 0;
        c1[5] = 0;
        c1[6] = 0;
        c1[7] = 0;

        this.c1 = c1;
    }

    _generateC2(){
        console.log("[ RTMPHandshake ] send C2");
        this.socket.send(this.s1);
        this.state = 5;
    }

    _parseS0(data){
        console.log("[ RTMPHandshake ] S0: ", data);

        let buffer = new Uint8Array(data);

        if(buffer.at(0) != 0x03) {
            console.error("[ RTMPHandshake ] S0 response not 0x03");

        } else {
            console.log("1st Byte OK");
        }

        this.state = 3;

        if(buffer.length > 1) {
            console.log("S1 included");
            data = data.slice(1);
            this.processServerInput(data);
        }
    }

    _parseS1(data){
        console.log("[ RTMPHandshake ] parse S1: ", data);
        this.state = 4;

        this.s1 = data;

        this._generateC2();
    }

    _parseS2(data) {
        console.log("[ RTMPHandshake ] parse S2: ", data);

        let newdata = [];

        if(data.length > 1536) {
            console.log("data stripped");
            data = data.slice(1536);
        }


        if(!this._compare(this.c1, new Uint8Array(data))) {
            console.warn("C1 S1 not equal");
            this.onHandshakeDone(false);
            return;
        }

        this.state = 6;

        console.log("[ RTMPHandshake ] RTMP Connection established");

        this.onHandshakeDone(true);
    }

    _compare(ar1, ar2){
        for(let i = 0; i < ar1.length; i++){
            if(ar1[i] != ar2[i]) return false;
        }

        return true;
    }

    onHandshakeDone(){

    }

    processServerInput(data){
        console.log("[ Connection Worker ] processing mode " + this.state + ": ", data);

        switch(this.state){
            case 2:		//
                this._parseS0(data);
                break;

            case 3:
                this._parseS1(data);
                break;

            case 5:
                this._parseS2(data);
                break;
        }
    }
}

export default RTMPHandshake;
