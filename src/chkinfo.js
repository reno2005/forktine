import React,{ useState, useEffect, useRef } from "react";

export function ChkInfo(){
    const [mediaStream, setMediaStream] = useState(null);
    const videoRef = useRef();
    const [mediaSupported, setMediaSupported] = useState(false);

    useEffect(() => {
        async function enableStream() {
            try {
              const stream = await navigator.mediaDevices.getUserMedia( { audio: false,
                video: { facingMode: "environment" }});
              setMediaStream(stream);
              setMediaSupported(true);
            } catch(err) {
              // Removed for brevity
              //alert(err);
              setMediaSupported(false);
            }
          }


          if (!mediaStream) {
            enableStream();
          }

          if (mediaStream && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
    });

    function handleCanPlay() {
        videoRef.current.play();
      }

    return (
        <div className="video-container">
            { !mediaSupported && (<span>No Device Dectected!</span>)}
            <video className="video-frame" ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
        </div>
    );
}

