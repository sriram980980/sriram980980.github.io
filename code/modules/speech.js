export function initSpeech(onInterim, onFinal) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      start() {
        throw new Error('Speech recognition not supported in this browser. Use Chrome or Edge.');
      },
      stop() {},
      isRecording() {
        return false;
      }
    };
  }

  const recognition = new SpeechRecognition();
  let recording = false;
  let accumulatedTranscript = '';

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let interimText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        accumulatedTranscript += transcript + ' ';
      } else {
        interimText += transcript;
      }
    }

    onInterim(accumulatedTranscript + interimText);
  };

  recognition.onend = () => {
    if (recording) {
      // Browser auto-stopped, restart to maintain continuous recording
      recognition.start();
    } else {
      // User called stop, finalize transcript
      onFinal(accumulatedTranscript.trim());
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') {
      // Ignore silence errors; onend will restart
      return;
    }

    recording = false;
    onFinal(accumulatedTranscript.trim());
  };

  return {
    start() {
      if (recording) return;
      recording = true;
      accumulatedTranscript = '';
      recognition.start();
    },
    stop() {
      if (!recording) return;
      recording = false;
      recognition.stop();
    },
    isRecording() {
      return recording;
    }
  };
}
