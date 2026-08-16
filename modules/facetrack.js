export async function initFaceTracking(videoEl, canvasEl, onStatus) {
  const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights'

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)

  let stream = null
  let rafId = null
  let lastDetectTime = 0

  const ctx = canvasEl.getContext('2d')

  const loop = async () => {
    const now = Date.now()

    if (now - lastDetectTime > 66) {
      lastDetectTime = now

      try {
        const detection = await faceapi
          .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
          .withFaceLandmarks()

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

        if (detection) {
          faceapi.draw.drawDetections(canvasEl, [detection])
          faceapi.draw.drawFaceLandmarks(canvasEl, [detection])

          const box = detection.detection.box
          const boxCenterX = box.x + box.width / 2
          const canvasWidth = canvasEl.width
          const canvasHeight = canvasEl.height

          const isHorizontallyCentered = boxCenterX > canvasWidth * 0.3 && boxCenterX < canvasWidth * 0.7
          const isFaceCloseEnough = box.height > canvasHeight * 0.25

          const eyeContact = isHorizontallyCentered && isFaceCloseEnough

          onStatus({ faceDetected: true, eyeContact })
        } else {
          onStatus({ faceDetected: false, eyeContact: false })
        }
      } catch (err) {
        console.error('Face detection error:', err)
      }
    }

    rafId = requestAnimationFrame(loop)
  }

  const start = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' }
    })

    videoEl.srcObject = stream

    await new Promise(resolve => {
      videoEl.onloadedmetadata = resolve
    })

    canvasEl.width = videoEl.videoWidth
    canvasEl.height = videoEl.videoHeight

    loop()
  }

  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }

    if (stream) {
      stream.getTracks().forEach(t => t.stop())
    }

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    videoEl.srcObject = null
  }

  return { start, stop }
}
