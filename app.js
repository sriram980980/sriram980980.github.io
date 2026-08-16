import { initAuth, requestAuth, getToken, clearToken } from './modules/auth.js'
import { createClient } from './modules/gemini.js'
import { initSpeech } from './modules/speech.js'
import { initFaceTracking } from './modules/facetrack.js'

const PRESETS = {
  'IOS Engineeer': `You are a Principal Enterprise Architect conducting a rigorous Java Full-Stack and Systems Architecture mock interview. Topics include Java, Spring Boot, distributed systems, caching, DB consistency, concurrency, and performance tuning. 
Process:
1. Ask one targeted technical question at a time.
2. After the candidate answers, immediately rate their answer (e.g., Optimal, Suboptimal, or Critical Fail), explain the rating briefly, and suggest how they could provide a better or more detailed answer.
3. Then, ask a follow-up or next technical question.
4. Loop this process. Continue asking questions until the candidate explicitly says "stop".
5. If the candidate says "stop", conclude the interview, summarize their performance, and stop asking questions.
Start by asking the candidate to introduce themselves briefly.`,
  'Frontend Engineer': `You are a senior frontend engineer conducting a rigorous technical mock interview. Topics include JavaScript, React, CSS layout, browser internals, web performance, and state management.
Process:
1. Ask one targeted frontend question at a time.
2. After the candidate answers, immediately rate their answer (e.g., Excellent, Good, Needs Improvement, or Poor), explain why, and suggest how they could provide a better, more robust answer.
3. Then, ask a follow-up or next frontend question.
4. Loop this process. Continue asking questions until the candidate explicitly says "stop".
5. If the candidate says "stop", conclude the interview, summarize their performance, and stop asking questions.
Start by asking the candidate to introduce themselves briefly.`,
  'Backend Engineer': `You are a senior backend engineer conducting a rigorous technical mock interview. Topics include system design, APIs, databases (SQL/NoSQL), concurrency, caching, and distributed systems.
Process:
1. Ask one targeted backend question at a time.
2. After the candidate answers, immediately rate their answer (e.g., Excellent, Good, Needs Improvement, or Poor), explain why, and suggest how they could provide a better, more scalable answer.
3. Then, ask a follow-up or next backend question.
4. Loop this process. Continue asking questions until the candidate explicitly says "stop".
5. If the candidate says "stop", conclude the interview, summarize their performance, and stop asking questions.
Start by asking the candidate to introduce themselves briefly.`,
  'Product Manager': `You are a VP of Product conducting a rigorous product management case mock interview. Topics include product sense, design, estimation, strategy, and metrics.
Process:
1. Ask one targeted PM case question at a time.
2. After the candidate answers, immediately rate their answer (e.g., Strong, Average, Weak), push back on weak reasoning, and suggest how they could improve or structure their response better.
3. Then, ask a follow-up or next PM question.
4. Loop this process. Continue asking questions until the candidate explicitly says "stop".
5. If the candidate says "stop", conclude the interview, summarize their performance, and stop asking questions.
Start by asking the candidate to introduce themselves briefly.`,
  'Data Scientist': `You are a data science lead conducting a rigorous technical mock interview. Topics include statistics, probability, machine learning models, SQL, Python, experiment design (A/B testing), and data intuition.
Process:
1. Ask one targeted data science question at a time.
2. After the candidate answers, immediately rate their answer (e.g., Excellent, Good, Needs Improvement, or Poor), explain why, and suggest how they could improve their technical reasoning or math explanation.
3. Then, ask a follow-up or next data science question.
4. Loop this process. Continue asking questions until the candidate explicitly says "stop".
5. If the candidate says "stop", conclude the interview, summarize their performance, and stop asking questions.
Start by asking the candidate to introduce themselves briefly.`,
  'Behavioral (STAR)': `You are an HR director conducting a behavioral mock interview using the STAR method (Situation, Task, Action, Result).
Process:
1. Ask one targeted behavioral question at a time.
2. After the candidate answers, immediately rate their answer based on how well it maps to the STAR method, point out any missing components (e.g., missing metrics/results), and suggest how they could structure the answer better.
3. Then, ask a follow-up or next behavioral question.
4. Loop this process. Continue asking questions until the candidate explicitly says "stop".
5. If the candidate says "stop", conclude the interview, summarize their performance, and stop asking questions.
Start by asking the candidate to introduce themselves briefly.`,
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id)

const setupModal = $('setup-modal')
const gsiSigninBtn = $('gsi-signin-btn')
const modalError = $('modal-error')
const signInBtn = $('sign-in-btn')
const resetBtn = $('reset-btn')
const authStatus = $('auth-status')
const startBtn = $('start-btn')
const recordBtn = $('record-btn')
const submitBtn = $('submit-btn')
const presetSelect = $('preset-select')
const chatHistory = $('chat-history')
const transcriptBox = $('transcript-box')
const faceDot = $('face-dot')
const eyeDot = $('eye-dot')
const faceLabel = $('face-label')
const eyeLabel = $('eye-label')
const webcamVideo = $('webcam-video')
const faceCanvas = $('face-canvas')
const submittingBar = $('submitting-bar')
const submittingStatus = $('submitting-status')
const ttsToggle = $('tts-toggle')

// ── State ────────────────────────────────────────────────────────────────────
let geminiClient = null
let speechController = null
let faceController = null
let pendingTranscript = ''
let isRecording = false
let isSubmitting = false

let silenceTimeoutId = null
let animationFrameId = null
let lastSpeechTime = 0
const SILENCE_TIMEOUT = 10000 // 10 seconds

// ── Auth ──────────────────────────────────────────────────────────────────────
function onTokenReceived(token) {
  geminiClient = createClient(getToken)
  setupModal.classList.add('hidden')
  authStatus.textContent = 'Signed in ✓'
  authStatus.style.color = '#3fb950'
  signInBtn.textContent = 'Sign Out'
  startBtn.disabled = false
}

function onAuthError(msg) {
  modalError.textContent = msg
  modalError.style.display = 'block'
}

gsiSigninBtn.addEventListener('click', () => {
  modalError.style.display = 'none'
  try {
    requestAuth()
  } catch (e) {
    onAuthError(e.message)
  }
})

signInBtn.addEventListener('click', () => {
  clearToken()
  geminiClient = null
  authStatus.textContent = 'Not signed in'
  authStatus.style.color = ''
  signInBtn.textContent = 'Sign Out'
  startBtn.disabled = true
  setupModal.classList.remove('hidden')
})

// ── Face tracking ─────────────────────────────────────────────────────────────
async function startFaceTracking() {
  try {
    faceController = await initFaceTracking(webcamVideo, faceCanvas, onFaceStatus)
    await faceController.start()
  } catch (e) {
    faceLabel.textContent = `Face: ${e.message}`
    faceDot.className = 'status-dot inactive'
  }
}

function onFaceStatus({ faceDetected, eyeContact }) {
  faceDot.className = faceDetected ? 'status-dot active' : 'status-dot inactive'
  faceLabel.textContent = faceDetected ? 'Face: Detected' : 'Face: Not detected'
  eyeDot.className = eyeContact ? 'status-dot active' : 'status-dot inactive'
  eyeLabel.textContent = eyeContact ? 'Eye Contact: Good' : 'Eye Contact: Look at camera'
}

// ── Silence Timer & Autocommit ────────────────────────────────────────────────
function resetSilenceTimer() {
  if (silenceTimeoutId) {
    clearTimeout(silenceTimeoutId)
    silenceTimeoutId = null
  }

  const text = pendingTranscript.trim()
  if (text.length > 0 && isRecording) {
    lastSpeechTime = Date.now()
    silenceTimeoutId = setTimeout(() => {
      autoSubmit()
    }, SILENCE_TIMEOUT)

    if (!animationFrameId) {
      updateProgressBar()
    }
  } else {
    stopProgressBar()
  }
}

function autoSubmit() {
  stopProgressBar()
  submitBtn.click()
}

function stopProgressBar() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (submittingBar) submittingBar.style.width = '0%'
  if (submittingStatus) {
    submittingStatus.style.visibility = 'hidden'
    submittingStatus.textContent = ''
  }
}

function updateProgressBar() {
  if (!isRecording || pendingTranscript.trim().length === 0) {
    stopProgressBar()
    return
  }

  const elapsed = Date.now() - lastSpeechTime
  const remaining = Math.max(0, SILENCE_TIMEOUT - elapsed)
  const percentage = Math.min(100, (elapsed / SILENCE_TIMEOUT) * 100)

  if (submittingBar) {
    submittingBar.style.width = `${percentage}%`
  }

  if (submittingStatus) {
    submittingStatus.style.visibility = 'visible'
    const secondsLeft = (remaining / 1000).toFixed(1)
    submittingStatus.textContent = `⏳ Submitting in ${secondsLeft}s...`
  }

  if (remaining > 0) {
    animationFrameId = requestAnimationFrame(updateProgressBar)
  } else {
    animationFrameId = null
  }
}

// ── TTS (Text-to-Speech) ──────────────────────────────────────────────────────
function speakText(text, onEnd) {
  window.speechSynthesis.cancel()

  if (!ttsToggle.checked) {
    onEnd?.()
    return
  }

  // Clean the text from markdown or characters that sound weird when spoken (like symbols/backticks/emoji)
  const cleanText = text
    .replace(/[*_`#]/g, '') // remove markdown symbols
    .replace(/⏳|⚠|✓/g, '') // remove emojis
    .trim()

  const utterance = new SpeechSynthesisUtterance(cleanText)
  
  utterance.onend = () => {
    onEnd?.()
  }
  
  utterance.onerror = (e) => {
    console.error('SpeechSynthesisUtterance error:', e)
    onEnd?.()
  }

  window.speechSynthesis.speak(utterance)
}

// ── Speech ────────────────────────────────────────────────────────────────────
function initSpeechController() {
  speechController = initSpeech(
    (interim) => {
      if (isSubmitting) return
      pendingTranscript = interim
      transcriptBox.textContent = interim || ''
      transcriptBox.classList.toggle('transcript-placeholder', !interim)
      if (interim.trim()) {
        submitBtn.disabled = false
      } else {
        submitBtn.disabled = true
      }
      resetSilenceTimer()
    },
    (final) => {
      if (isSubmitting) return
      pendingTranscript = final
      transcriptBox.textContent = final || ''
      isRecording = false
      updateRecordBtn()
      if (final.trim()) {
        submitBtn.disabled = false
      }
      resetSilenceTimer()
    }
  )
}

recordBtn.addEventListener('click', () => {
  if (!speechController || isSubmitting) return
  if (isRecording) {
    speechController.stop()
    isRecording = false

    // Clear silence timer and progress bar when paused
    stopProgressBar()
    if (silenceTimeoutId) {
      clearTimeout(silenceTimeoutId)
      silenceTimeoutId = null
    }
  } else {
    pendingTranscript = ''
    transcriptBox.textContent = 'Listening...'
    transcriptBox.classList.remove('transcript-placeholder')
    submitBtn.disabled = true
    try {
      speechController.start()
      isRecording = true
    } catch (e) {
      showError(e.message)
      return
    }
  }
  updateRecordBtn()
})

function updateRecordBtn() {
  recordBtn.textContent = isRecording ? '⏹ Stop' : '🎤 Record'
  recordBtn.classList.toggle('recording', isRecording)
}

// ── Interview flow ────────────────────────────────────────────────────────────
startBtn.addEventListener('click', async () => {
  if (!geminiClient || isSubmitting) return

  isSubmitting = true

  // Cancel any active TTS playback
  window.speechSynthesis.cancel()

  // Clear silence timer
  if (silenceTimeoutId) {
    clearTimeout(silenceTimeoutId)
    silenceTimeoutId = null
  }
  stopProgressBar()

  if (speechController && isRecording) {
    speechController.stop()
    isRecording = false
    updateRecordBtn()
  }

  chatHistory.innerHTML = ''
  geminiClient.resetHistory()
  pendingTranscript = ''
  transcriptBox.textContent = 'Waiting for interviewer...'
  transcriptBox.classList.add('transcript-placeholder')
  submitBtn.disabled = true
  recordBtn.disabled = true
  startBtn.textContent = 'Restart Interview'

  let reply = null
  try {
    reply = await sendToGemini('Hello, I am ready to begin the interview.', PRESETS[presetSelect.value])
  } finally {
    isSubmitting = false
  }

  // Play the interviewer's opening statement and start listening after it ends
  if (reply) {
    if (ttsToggle.checked) {
      transcriptBox.textContent = 'Interviewer is speaking...'
      transcriptBox.classList.add('transcript-placeholder')
      recordBtn.disabled = true
      submitBtn.disabled = true
    }

    speakText(reply, () => {
      if (speechController) {
        try {
          pendingTranscript = ''
          transcriptBox.textContent = 'Listening...'
          transcriptBox.classList.remove('transcript-placeholder')
          speechController.start()
          isRecording = true
          updateRecordBtn()
        } catch (e) {
          console.error(e)
        }
      }
      recordBtn.disabled = false
    })
  } else {
    recordBtn.disabled = false
  }
})

submitBtn.addEventListener('click', async () => {
  const text = pendingTranscript.trim()
  if (!text || !geminiClient || isSubmitting) return

  isSubmitting = true

  // Cancel any active TTS playback
  window.speechSynthesis.cancel()

  // Stop silence timer immediately
  if (silenceTimeoutId) {
    clearTimeout(silenceTimeoutId)
    silenceTimeoutId = null
  }
  stopProgressBar()

  // Stop recording so speech recognition doesn't listen during Gemini processing
  if (speechController && isRecording) {
    speechController.stop()
    isRecording = false
    updateRecordBtn()
  }

  addBubble('candidate', text)
  pendingTranscript = ''
  transcriptBox.textContent = 'Interviewer is thinking...'
  transcriptBox.classList.add('transcript-placeholder')
  submitBtn.disabled = true
  recordBtn.disabled = true

  let reply = null
  try {
    reply = await sendToGemini(text, PRESETS[presetSelect.value])
  } finally {
    isSubmitting = false
  }

  // Play the interviewer's reply and resume listening after it ends
  if (reply) {
    if (ttsToggle.checked) {
      transcriptBox.textContent = 'Interviewer is speaking...'
      transcriptBox.classList.add('transcript-placeholder')
      recordBtn.disabled = true
      submitBtn.disabled = true
    }

    speakText(reply, () => {
      if (speechController) {
        try {
          pendingTranscript = ''
          transcriptBox.textContent = 'Listening...'
          transcriptBox.classList.remove('transcript-placeholder')
          speechController.start()
          isRecording = true
          updateRecordBtn()
        } catch (e) {
          console.error('Failed to restart speech controller:', e)
        }
      }
      recordBtn.disabled = false
    })
  } else {
    recordBtn.disabled = false
  }
})

async function sendToGemini(userMessage, systemPrompt) {
  const thinking = document.createElement('div')
  thinking.className = 'thinking'
  thinking.innerHTML = '<span></span><span></span><span></span>'
  chatHistory.appendChild(thinking)
  chatHistory.scrollTop = chatHistory.scrollHeight

  try {
    const reply = await geminiClient.chat(userMessage, systemPrompt)
    thinking.remove()
    addBubble('interviewer', reply)
    return reply
  } catch (e) {
    thinking.remove()
    showError(e.message)
    return null
  }
}

function addBubble(role, text) {
  const wrapper = document.createElement('div')
  wrapper.className = 'bubble-wrapper'

  const label = document.createElement('div')
  label.className = 'bubble-label'
  label.textContent = role === 'interviewer' ? 'Interviewer' : 'You'
  wrapper.appendChild(label)

  const bubble = document.createElement('div')
  bubble.className = `chat-bubble ${role}`
  bubble.textContent = text
  wrapper.appendChild(bubble)

  chatHistory.appendChild(wrapper)
  chatHistory.scrollTop = chatHistory.scrollHeight
}

// ── Reset ─────────────────────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  // Cancel any active TTS playback
  window.speechSynthesis.cancel()

  // Clear silence timer
  if (silenceTimeoutId) {
    clearTimeout(silenceTimeoutId)
    silenceTimeoutId = null
  }
  stopProgressBar()

  if (speechController && isRecording) {
    speechController.stop()
    isRecording = false
    updateRecordBtn()
  }

  if (geminiClient) geminiClient.resetHistory()
  chatHistory.innerHTML = '<div class="chat-empty-state">Sign in and click "Start Interview" to begin.</div>'
  pendingTranscript = ''
  transcriptBox.textContent = 'Click Record to speak...'
  transcriptBox.classList.add('transcript-placeholder')
  submitBtn.disabled = true
  recordBtn.disabled = true
  startBtn.textContent = 'Start Interview'
})

function showError(msg) {
  const errEl = document.createElement('div')
  errEl.className = 'chat-bubble error-bubble'
  errEl.textContent = `⚠ ${msg}`
  chatHistory.appendChild(errEl)
  chatHistory.scrollTop = chatHistory.scrollHeight
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function boot() {
  // GIS may not be loaded yet (async script); wait for it
  await new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) return resolve()
    const script = document.querySelector('script[src*="gsi/client"]')
    script?.addEventListener('load', resolve)
    setTimeout(resolve, 3000) // fallback
  })

  initAuth(onTokenReceived, onAuthError)
  setupModal.classList.remove('hidden')

  initSpeechController()
  await startFaceTracking()

  // Load and apply TTS (Read Aloud) setting
  const savedTts = localStorage.getItem('tts-enabled')
  if (savedTts !== null) {
    ttsToggle.checked = savedTts === 'true'
  }

  // Handle TTS toggle changes
  ttsToggle.addEventListener('change', () => {
    localStorage.setItem('tts-enabled', ttsToggle.checked)
    if (!ttsToggle.checked) {
      window.speechSynthesis.cancel()
    }
  })
}

boot()
