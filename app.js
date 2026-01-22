// --- AUDIO PLAYER LOGIC ---
// Since we are hard coding, we are faking the play button for now.
// If you have MP3 files, you would add: var audio = new Audio('song.mp3'); audio.play();
let audioCtx = null;
let analyser = null;
let source = null;
let animationId = null;

let currentBtn = null;
let audio = new Audio("audio/ac12uhd.mp3");
audio.preload = "metadata";
document.addEventListener("contextmenu", (e) => e.preventDefault());

// --- Progress Bar ---
const progress = document.getElementById("progress");

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// --- Volume Control ---
const volume = document.getElementById("volume");

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

function startVisualizer() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  drawVisualizer();
}

function drawVisualizer() {
  const canvas = document.getElementById("visualizer");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  analyser.getByteFrequencyData(dataArray);

  const barWidth = canvas.width / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      i * barWidth,
      canvas.height - barHeight,
      barWidth - 1,
      barHeight
    );
  }

  animationId = requestAnimationFrame(drawVisualizer);
}

function togglePlay(btn) {
  // Reset previous button
  if (currentBtn && currentBtn !== btn) {
    currentBtn.innerHTML = "▶";
    audio.pause();
    audio.currentTime = 0;
  }

  if (audio.paused) {
    btn.innerHTML = "⏸";
    audio.play();
    currentBtn = btn;
    console.log("Playing track...");
    startVisualizer();
  } else {
    btn.innerHTML = "▶";
    audio.pause();
    console.log("Paused track...");
    cancelAnimationFrame(animationId);
  }
}

// --- NEWSLETTER LOGIC ---
// function handleSubscribe(e) {
//   e.preventDefault();
//   const form = e.target;
//   const successMsg = document.getElementById("success-msg");

//   // Here you would normally send data to Mailchimp/ConvertKit
//   // For now, we simulate success
//   form.style.display = "none";
//   successMsg.style.display = "block";
// }
