import React,{ useState, useEffect, useRef } from "react";

export function ChkInfo({onBackButton}){
    const [mediaStream, setMediaStream] = useState(null);
    const videoRef = useRef();
    const [mediaSupported, setMediaSupported] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
              setErrorMsg(err.toString());
            }
          }

          if (!mediaStream) {
            enableStream();
          }

          if (mediaStream && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          return () => {
            if(mediaStream){
                mediaStream.getTracks().forEach(track => {
                  track.stop();
              });}
            }
    });

    function handleCanPlay() {
        videoRef.current.play();
    }

    function handleCapture(){
      alert('scanning/recognizing image');
    }

 
    return (
        <div className="video-container">
            { !mediaSupported && (<span>No Device Dectected!</span>)}
            <span>{errorMsg}</span>
            <video className="video-frame" ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
            <div className="button-panel">
              <button className="primary-btn" onClick={handleCapture}>Scan Check</button>
              <button className="cancel-btn" onClick={onBackButton}>Back</button>
            </div>
        </div>
    );
}

