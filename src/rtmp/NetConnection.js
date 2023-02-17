import ProtocolControlMessage from "./ProtocolControlMessage";
import RTMPMessage from "./RTMPMessage";
import Chunk from "./Chunk";

class NetConnection{
    WindowAcknowledgementSize;
    MessageStreamID;
    CHUNK_SIZE = 128;
    BandWidth;
    socket;

    netstreams = [];

    /**
     *
     * @param {Number} message_stream_id
     * @param {RTMPMessageHandler} handler
     */
    constructor(message_stream_id, handler) {
        this.MessageStreamID = message_stream_id;

        console.log(handler);

        this.handler = handler;
        this.socket = handler.socket;
    }

    /**
     *
     * @param {RTMPMessage} message
     */
    parseMessage(message){      // RTMPMessage
        let data = message.getPayload();

        switch(message.getMessageType()){
        case 1:         // PCM Set Chunk Size
            this.CHUNK_SIZE = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            this.handler.setChunkSize(this.CHUNK_SIZE)
            break;

        case 2:         // PCM Abort Message
        case 3:         // PCM Acknowledgement
        case 5:         // PCM Window Acknowledgement Size
            this.WindowAcknowledgementSize = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            console.log("[ NetConnection ] WindowAcknowledgementSize: " + this.WindowAcknowledgementSize);
            break;

        case 6:         // PCM Set Peer Bandwidth
            this.BandWidth = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | (data[3]);
            console.log("[ NetConnection ] SetPeerBandwidth: " + this.BandWidth);

            // send Window Ack Size
            let msg = new ProtocolControlMessage(0x05, this.WindowAcknowledgementSize);

            let m2 = new RTMPMessage(msg.getBytes());
            m2.setMessageType(0x05)     // WinACKSize

            const chunk = new Chunk(m2);
            chunk.setChunkStreamID(2);  // Control Channel

            console.log("[ NetConnection ] send WindowAcksize");
            this.socket.send(chunk.getBytes());

            break;

        default:
            break;
        }
    }

    createStream(){

    }
}

export default NetConnection;
