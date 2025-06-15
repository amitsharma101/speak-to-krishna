import { Conversation } from '@elevenlabs/client';

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const waveContainer = document.getElementById('waveContainer');
const audio = document.getElementById('player');

let conversation;

function updateWave(mode) {
  if (!mode) {
    waveContainer.style.display = 'none';
    waveContainer.classList.remove('listening', 'speaking');
    return;
  }

  waveContainer.style.display = 'flex';
  waveContainer.classList.remove('listening', 'speaking');
  waveContainer.classList.add(mode);
}

audio.onplay = () => updateWave('speaking');
audio.onended = () => updateWave('listening');

async function startConversation() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });

    conversation = await Conversation.startSession({
      agentId: 'agent_01jxs6hq1sfgqsr9z9vh44ze8p',
      onConnect: () => {
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        updateWave('listening');
      },
      onDisconnect: () => {
        stopButton.style.display = 'none';
        startButton.style.display = 'inline-block';
        updateWave(null);
      },
      onError: (error) => {
        console.error('Error:', error);
        updateWave(null);
      },
      onModeChange: (mode) => {
        updateWave(mode.mode); // "speaking" or "listening"
      }
    });
  } catch (error) {
    console.error('Failed to start conversation:', error);
  }
}

async function stopConversation() {
  if (conversation) {
    await conversation.endSession();
    conversation = null;
    stopButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    updateWave(null);
  }
}

startButton.addEventListener('click', startConversation);
stopButton.addEventListener('click', stopConversation);