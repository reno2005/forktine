import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import Modal from 'react-modal';

export function ChkInfo({ onBackButton, onAddItem }) {
  const [mediaStream, setMediaStream] = useState(null);
  const enableStreamAttempted = useRef(false);
  let videoRef = useRef();
  const canvasRef = useRef();
  const [mediaSupported, setMediaSupported] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [scanStaus, setScanStatus] = useState('ready'); //state = ready, scanning, checkdetected, checknotdetected
  const [scanData, setScanData] = useState('');
  const [checkInfo, setCheckInfo] = useState(null);


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  async function enableStream() {
    try {
      enableStreamAttempted.current = true;
      const m = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "environment" }
      });


      if (!mediaStream && videoRef.current) {    
        videoRef.current.srcObject = m;
        setMediaStream(m);     
        setMediaSupported(true);  
        console.log('setting media stream');
      }

    } catch (err) {
      setMediaSupported(false);
      setErrorMsg(err.toString());
    }
  }

  enableStream();
  
  // useEffect(() => {  
  //   async function enableStream() {
  //     try {
  //       enableStreamAttempted.current = true;
  //       const m = await navigator.mediaDevices.getUserMedia({
  //         audio: false,
  //         video: { facingMode: "environment" }
  //       });


  //       if (!mediaStream && videoRef.current) {    
  //         videoRef.current.srcObject = m;
  //         setMediaStream(m);     
  //         setMediaSupported(true);  
  //         console.log('setting media stream');
  //       }

  //     } catch (err) {
  //       // Removed for brevity
  //       //alert(err);
  //       setMediaSupported(false);
  //       setErrorMsg(err.toString());
  //     }
  //   }

  //   if(!mediaStream){
  //     enableStream();
  //   }
    
    

  //   console.log('end of useeffect');

  //   return () => {
  //     if (mediaStream) {
  //       mediaStream.getTracks().forEach(track => {
  //         track.stop();
  //         mediaStream.removeTrack(track);
  //       });
  //       setMediaStream(null);
  //     }
  //   }
  // },[mediaStream]);

  // useEffect(() => {
  //   let vidref = null;
  //   async function enableStream() {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: false,
  //         video: { facingMode: "environment" }
  //       });
  //       setMediaStream(stream);     
  //       setMediaSupported(true);  
  //     } catch (err) {
  //       // Removed for brevity
  //       //alert(err);
  //       setMediaSupported(false);
  //       setErrorMsg(err.toString());
  //     }
  //   }

  //   if (!mediaStream) {
  //     console.log('about t call enable');
  //     enableStream();
  //   }

  //   if (mediaStream && videoRef.current) {
      
  //     videoRef.current.srcObject = mediaStream;
  //     vidref = videoRef.current;
  //   }

  //   console.log('end of useeffect');
  //   return () => {

  //     if (mediaStream) {
  //       mediaStream.getTracks().forEach(track => {
  //         track.stop();
  //         mediaStream.removeTrack(track);
  //       });
  //       setMediaStream(null);
  //       vidref.srcObject = null;
  //     }
  //   }
  // });


  function handleCapture() {
    setModalTitle('Scanning....');
    setModalOpen(true);
    setScanStatus('scanning');

    const scantoText = async (imgdata) => {
      const result = await Tesseract.recognize(imgdata);
      console.log(result.data.text);
      if (processTextData(result.data.text)) {
        setScanStatus('checkdetected');
      }else{
        setScanStatus('checknotdetected');
      }
    };

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    const dataURL = canvasRef.current.toDataURL("image/jpeg", 1.0);
    scantoText(dataURL);
  }

  const processTextData = (textData) => {
    setCheckInfo({ checkno: "34567", amount : 700.00});
    setScanData(textData);
    return true;
  }

  function handleBackButton() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
        mediaStream.removeTrack(track);
      });
    }
    setMediaStream(null);
    videoRef.current.srcObject = null;

    onBackButton();
  };

  function closeModal() {
    if(checkInfo){
      onAddItem(checkInfo);
    }
    setCheckInfo(null);
    setScanStatus('ready');
    setModalOpen(false);
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    } 
  }


  return (
    <div className="video-container">
      {!mediaSupported && (<span>No Device Dectected!</span>)}
      <span>{errorMsg}</span>
      <video className="video-frame" ref={videoRef} autoPlay playsInline muted />
      <canvas
        ref={canvasRef}
      ></canvas>
      <div className="button-panel">
        <button className={(!mediaStream || !mediaStream.active) ? "disabled" : "primary-btn"} disabled={!mediaStream || !mediaStream.active} onClick={handleCapture}>Click To Take Photo</button>
        <button className="cancel-btn" onClick={handleBackButton}>Back</button>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <h2>{modalTitle}</h2>
        

        {scanStaus === 'scanning' &&
          <div className="button-panel">
            <span>Scanning Image....</span>
            <button className="cancel-btn" onClick={closeModal}>Abort</button>
          </div>
        }

        {scanStaus === 'checkdetected' &&
          <div className="button-panel">
            <span>Check Dectected</span>
            <span>{scanData}</span>
            <button className="primary-btn" onClick={closeModal}>Accept</button>
          </div>
        }

        {scanStaus === 'checknotdetected' &&
          <div className="button-panel">
            <span>Unable to recognize image..</span>
            <button className="cancel-btn" onClick={closeModal}>Try Again</button>
          </div>
        }

      </Modal>

    </div>
  );
}

