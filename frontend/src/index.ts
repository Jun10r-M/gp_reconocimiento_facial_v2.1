
const video = document.getElementById('webcam') as HTMLVideoElement | null;
const circle = document.getElementById('scanner-circle') as SVGCircleElement | null;
const dateDisplay = document.getElementById('date-display') as HTMLElement | null;
const floatingLabel = document.getElementById('floating-label') as HTMLElement | null;

let circumference = 0;
if (circle) {
  const radius = circle.r.baseVal.value;
  circumference = radius * 2 * Math.PI;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
}

let isProcessing = false;
let stabilityCount = 0;
const STABILITY_THRESHOLD = 3; // Segundos requeridos de permanencia del rostro

// Reloj local en tiempo real
setInterval(() => {
  if (dateDisplay) {
    const now = new Date();
    dateDisplay.innerText = now.toLocaleString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
}, 1000);

async function startWebcam() {
  if (!video) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
    video.srcObject = stream;
  } catch (err) {
    console.error("Error al iniciar cámara:", err);
  }
}

function setProgress(percent: number) {
  if (!circle) return;
  const offset = circumference - (percent / 100 * circumference);
  circle.style.strokeDashoffset = `${offset}`;
}

async function autoScan() {
  if (isProcessing || !video) return;

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    try {
      const formData = new FormData();
      formData.append('file', blob, 'scan.jpg');

      const response = await fetch('/recognize', { method: 'POST', body: formData });
      const data = await response.json();

      if (data.status === 'system_empty') {
        triggerSystemError(data);
      } else if (data.status === 'success' || data.status === 'unknown') {
        updateVisuals(data, canvas.width, canvas.height);
        checkStability(data);
      } else {
        resetScanner();
      }
    } catch (err) {
      console.error("Error en escaneo automático:", err);
    }
  }, 'image/jpeg', 0.5);
}

function updateVisuals(data: any, cw: number, ch: number) {
  if (!data.coords || !floatingLabel) return;
  const wrapper = document.querySelector('.video-wrapper');
  if (!wrapper) return;
  const rect = wrapper.getBoundingClientRect();

  const x_factor = rect.width / cw;
  const y_factor = rect.height / ch;

  const posX = (cw - data.coords.x - data.coords.w / 2) * x_factor;
  const posY = data.coords.y * y_factor;

  floatingLabel.style.left = `${posX}px`;
  floatingLabel.style.top = `${posY}px`;
}

function checkStability(data: any) {
  stabilityCount += 0.5;
  const progress = (stabilityCount / STABILITY_THRESHOLD) * 100;
  setProgress(progress);

  if (stabilityCount >= STABILITY_THRESHOLD) {
    if (data.status === 'success') {
      triggerSuccess(data);
    } else {
      triggerError(data);
    }
  }
}

function resetScanner() {
  stabilityCount = 0;
  setProgress(0);
  if (circle) circle.classList.remove('error');
  if (floatingLabel) {
    floatingLabel.classList.add('hidden');
    floatingLabel.classList.remove('error');
    floatingLabel.style.background = "";
  }
  document.getElementById('success-card')?.classList.add('hidden');
  document.getElementById('error-card')?.classList.add('hidden');
}

function triggerSystemError(data: any) {
  isProcessing = true;
  setProgress(0);

  if (circle) circle.classList.remove('error');
  floatingLabel?.classList.add('hidden');
  document.getElementById('success-card')?.classList.add('hidden');

  const errorCard = document.getElementById('error-card');
  const msgElement = document.getElementById('error-message');
  if (msgElement && data.message) {
    msgElement.innerText = data.message.toUpperCase();
  }
  errorCard?.classList.remove('hidden');

  setTimeout(() => {
    isProcessing = false;
    resetScanner();
  }, 5000);
}

function triggerSuccess(data: any) {
  isProcessing = true;
  setProgress(100);

  const cardName = document.getElementById('card-name');
  const cardDoc = document.getElementById('card-doc');
  const cardRole = document.getElementById('card-role');
  const cardTime = document.getElementById('card-time');
  const cardAction = document.getElementById('card-action');

  if (cardName) cardName.innerText = data.name.toUpperCase();
  if (cardDoc) cardDoc.innerText = data.documento;
  if (cardRole) cardRole.innerText = data.puesto.toUpperCase();
  if (cardTime) {
    // Extraer hora si contiene fecha y hora
    const parts = data.time.split(' ');
    cardTime.innerText = parts.length > 1 ? parts[1] : parts[0];
  }
  if (cardAction) cardAction.innerText = `${data.action.toUpperCase()} REGISTRADA`;

  document.getElementById('success-card')?.classList.remove('hidden');
  floatingLabel?.classList.add('hidden');

  setTimeout(() => {
    isProcessing = false;
    resetScanner();
  }, 5000);
}

function triggerError(data: any) {
  isProcessing = true;
  if (circle) circle.classList.add('error');
  if (floatingLabel) {
    floatingLabel.innerText = (data && data.message) ? data.message.toUpperCase() : "USUARIO NO RECONOCIDO";
    floatingLabel.classList.remove('hidden');
    floatingLabel.classList.add('error');
  }

  setTimeout(() => {
    isProcessing = false;
    resetScanner();
  }, 3000);
}

startWebcam();
setInterval(autoScan, 500);

let lastProcessedLogId: any = null;

async function pollFingerprintPunches() {
  // Evitar solapamiento si el escáner está en proceso de mostrar una marcación exitosa
  if (isProcessing) return;

  try {
    const res = await fetch('/attendance/latest-public');
    if (!res.ok) return;

    const data = await res.json();
    if (!data) return;

    if (data.id !== lastProcessedLogId) {
      const isNew = lastProcessedLogId !== null;
      lastProcessedLogId = data.id;

      if (isNew && data.method === 'fingerprint') {
        triggerSuccess({
          name: data.name,
          documento: data.documento,
          puesto: data.puesto,
          time: data.time,
          action: data.action
        });
      }
    }
  } catch (err) {
    console.error("Error al consultar última marcación por huella:", err);
  }
}

// Polling cada 1.5 segundos para capturar marcaciones de huella dactilar automáticas
setInterval(pollFingerprintPunches, 1500);
