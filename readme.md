WebRTMP
======
An HTML5 Flash Video (RTMP) Player written in pure JavaScript without Flash. LONG LIVE RTMP !

for those who really miss RTMP in Browser

### heavily inspired bei bilibi`s
[FlvPlayer](https://github.com/bilibili/flv.js)


## Introduction
This project consists of 2 parts. 
- A Simple Websocket <=> TCP Wrapper, which is running on the RTMP Server
- WebRTMP Client library 

stunnel is used for SSL/TLS 
(why stunnel ?, I never ever have any problems, since 2005 and millions of connections per day)


## Demo
[https://bunkertv.de/webrtmp/index.html](https://bunkertv.de/webrtmp/index.html)

## Features
- RTMP container with H.264 + AAC / MP3 codec playback
- RTMP over Websocket low latency live stream playback < 2sec.
- Compatible with Chrome, FireFox, Safari 10, IE11 and Edge
- Extremely low overhead, and hardware accelerated by your browser!


## Getting Started
ClientSide:
```html
<script src="dist/webrtmp.js"></script>
<video id="videoElement"></video>
<script>
    const videoElement = document.getElementById('videoElement');

    webrtmp.open("bunkertv.org", 9001).then(()=>{                       // Host, Port of WebRTMP Proxy
        webrtmp.connect("bunkertv").then(()=>{                          // Application name  
            webrtmp.play("fab5bc692e71e17fba34e92d47e64fd0").then(()=>{ // Stream name
                console.log("playing");
            })
        })
    })

</script>
```

ServerSide:

Launch WSS RTMP-Wrapper

```bash
java -jar WebRTMP.jar
```

## Tested
nginx-rtmp
Chrome

## Design
### ServerSide
![arch](docs/webrtmp_diagram.png)

#### ClientSide
![arch](docs/webrtmp_arch.png)
