import { useState, useRef, useEffect } from 'react'

// On mobile: opens camera directly. On desktop: file picker.
export default function MediaCapture({ onCapture, onClose }) {
  const [mode, setMode]       = useState('choose') // choose | camera | preview
  const [stream, setStream]   = useState(null)
  const [recording, setRecording] = useState(false)
  const [captured, setCaptured]   = useState(null) // { url, type }
  const [facingMode, setFacingMode] = useState('environment')
  const videoRef   = useRef(null)
  const mediaRef   = useRef(null)
  const chunksRef  = useRef([])
  const fileRef    = useRef(null)
  const isMobile   = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

  useEffect(() => () => stopStream(), [])

  function stopStream() {
    stream?.getTracks().forEach(t => t.stop())
  }

  async function startCamera(type) {
    stopStream()
    try {
      const constraints = {
        video: { facingMode },
        audio: type === 'video',
      }
      const s = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(s)
      setMode('camera')
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play() } }, 100)
    } catch { alert('Could not access camera. Please allow camera permissions.') }
  }

  function flipCamera() {
    setFacingMode(f => f === 'environment' ? 'user' : 'environment')
    if (mode === 'camera') startCamera(recording ? 'video' : 'photo')
  }

  function takePhoto() {
    const canvas = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      stopStream()
      setCaptured({ url, type:'image', blob })
      setMode('preview')
    }, 'image/jpeg', 0.92)
  }

  function startRecording() {
    chunksRef.current = []
    const mr = new MediaRecorder(stream)
    mediaRef.current = mr
    mr.ondataavailable = e => chunksRef.current.push(e.data)
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type:'video/mp4' })
      const url  = URL.createObjectURL(blob)
      stopStream()
      setCaptured({ url, type:'video', blob })
      setMode('preview')
    }
    mr.start()
    setRecording(true)
  }

  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
  }

  function handleFileInput(e) {
    const file = e.target.files[0]
    if (!file) return
    const url  = URL.createObjectURL(file)
    const type = file.type.startsWith('video') ? 'video' : 'image'
    setCaptured({ url, type, blob: file })
    setMode('preview')
  }

  function confirmCapture() {
    onCapture(captured)
    onClose()
  }

  function retake() {
    setCaptured(null)
    setMode('choose')
  }

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:300, background:'#000',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    }}>
      {/* close */}
      <button onClick={() => { stopStream(); onClose() }}
        style={{ position:'absolute', top:16, left:16, background:'rgba(255,255,255,.15)', border:'none', borderRadius:'50%', width:40, height:40, color:'white', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
        ✕
      </button>

      {/* CHOOSE screen */}
      {mode === 'choose' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14, alignItems:'center', padding:30 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📷</div>
          <div style={{ color:'white', fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, marginBottom:16 }}>add media</div>
          {isMobile && (
            <>
              <button onClick={() => startCamera('photo')} style={capBtn}>📸 take a photo</button>
              <button onClick={() => startCamera('video')} style={capBtn}>🎥 record a video</button>
            </>
          )}
          <button onClick={() => fileRef.current.click()} style={{ ...capBtn, background:'rgba(255,255,255,.1)' }}>
            🖼️ {isMobile ? 'choose from camera roll' : 'choose from computer'}
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*,image/gif" style={{ display:'none' }} onChange={handleFileInput} />
        </div>
      )}

      {/* CAMERA screen */}
      {mode === 'camera' && (
        <div style={{ width:'100%', height:'100%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <video ref={videoRef} style={{ width:'100%', height:'100%', objectFit:'cover' }} playsInline muted />

          {/* flip camera */}
          <button onClick={flipCamera} style={{ position:'absolute', top:16, right:16, background:'rgba(0,0,0,.5)', border:'none', borderRadius:'50%', width:44, height:44, fontSize:20, cursor:'pointer', color:'white' }}>🔄</button>

          {/* bottom controls */}
          <div style={{ position:'absolute', bottom:40, left:0, right:0, display:'flex', justifyContent:'center', gap:24 }}>
            {!recording ? (
              <>
                <button onClick={takePhoto} style={shutterBtn}>📸</button>
                <button onClick={startRecording}
                  style={{ ...shutterBtn, background:'#ef4444', fontSize:22 }}>⏺</button>
              </>
            ) : (
              <button onClick={stopRecording}
                style={{ ...shutterBtn, background:'#ef4444', width:72, height:72, animation:'pulse 1s infinite', fontSize:24 }}>
                ⏹
              </button>
            )}
          </div>
          {recording && (
            <div style={{ position:'absolute', top:20, left:'50%', transform:'translateX(-50%)', background:'#ef4444', color:'white', padding:'4px 14px', borderRadius:20, fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'white', animation:'pulse 1s infinite' }} />
              REC
            </div>
          )}
        </div>
      )}

      {/* PREVIEW screen */}
      {mode === 'preview' && captured && (
        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#111' }}>
          {captured.type === 'image'
            ? <img src={captured.url} style={{ maxWidth:'100%', maxHeight:'75vh', objectFit:'contain', borderRadius:12 }} alt="preview" />
            : <video src={captured.url} controls style={{ maxWidth:'100%', maxHeight:'75vh', borderRadius:12 }} />}
          <div style={{ display:'flex', gap:14, marginTop:24 }}>
            <button onClick={retake} style={{ padding:'11px 26px', borderRadius:12, border:'1px solid rgba(255,255,255,.2)', background:'transparent', color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, cursor:'pointer' }}>
              retake
            </button>
            <button onClick={confirmCapture} style={{ padding:'11px 26px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#c084fc,#f472b6)', color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 4px 18px rgba(192,132,252,.5)' }}>
              use this ✦
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const capBtn = {
  width: 260, padding:'14px 20px', borderRadius:14, border:'none',
  background:'linear-gradient(135deg,rgba(192,132,252,.25),rgba(244,114,182,.2))',
  color:'white', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16,
  cursor:'pointer', border:'1px solid rgba(192,132,252,.3)',
}

const shutterBtn = {
  width:64, height:64, borderRadius:'50%', border:'4px solid white',
  background:'rgba(255,255,255,.2)', color:'white', fontSize:26,
  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
  backdropFilter:'blur(4px)',
}
