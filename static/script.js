const video = document.getElementById('webcam');
const circle = document.getElementById('scanner-circle');
const dateDisplay = document.getElementById('date-display');
const floatingLabel = document.getElementById('floating-label');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let isProcessing = false;
let stabilityCount = 0;
const STABILITY_THRESHOLD = 3; // Segundos para confirmar

// Reloj
setInterval(() => {
    const now = new Date();
    dateDisplay.innerText = now.toLocaleString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}, 1000);

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error:", err);
    }
}

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
}

async function autoScan() {
    if (isProcessing) return;

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        try {
            const formData = new FormData();
            formData.append('file', blob, 'scan.jpg');

            const response = await fetch('/recognize', { method: 'POST', body: formData });
            const data = await response.json();

            if (data.status === 'system_empty') {
                triggerSystemError(data);
            } else if (data.status === 'cooldown') {
                resetScanner();
            } else if (data.status === 'success' || data.status === 'unknown') {
                updateVisuals(data, canvas.width, canvas.height);
                checkStability(data);
            } else {
                resetScanner();
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, 'image/jpeg', 0.5);
}

function updateVisuals(data, cw, ch) {
    if (!data.coords) return;
    const wrapper = document.querySelector('.video-wrapper');
    const rect = wrapper.getBoundingClientRect();

    const x_factor = rect.width / cw;
    const y_factor = rect.height / ch;

    const posX = (cw - data.coords.x - data.coords.w / 2) * x_factor;
    const posY = data.coords.y * y_factor;

    floatingLabel.style.left = `${posX}px`;
    floatingLabel.style.top = `${posY}px`;
}

function checkStability(data) {
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
    circle.classList.remove('error');
    floatingLabel.classList.add('hidden');
    document.getElementById('success-card').classList.add('hidden');
    document.getElementById('error-card').classList.add('hidden');
    floatingLabel.classList.remove('error');
    floatingLabel.style.background = "";
}

function triggerSystemError(data) {
    isProcessing = true;
    setProgress(0);

    // Ocultar cualquier otra interfaz
    circle.classList.remove('error');
    floatingLabel.classList.add('hidden');
    document.getElementById('success-card').classList.add('hidden');

    // Mostrar la tarjeta de error
    const errorCard = document.getElementById('error-card');
    const msgElement = document.getElementById('error-message');
    if (msgElement && data.message) {
        msgElement.innerText = data.message.toUpperCase();
    }
    errorCard.classList.remove('hidden');

    setTimeout(() => {
        isProcessing = false;
        resetScanner();
    }, 5000);
}

function triggerSuccess(data) {
    console.log("Success data received:", data);
    isProcessing = true;
    setProgress(100);

    // Llenar datos de la card
    document.getElementById('card-name').innerText = data.name.toUpperCase();
    document.getElementById('card-doc').innerText = data.documento;
    document.getElementById('card-role').innerText = data.puesto.toUpperCase();
    document.getElementById('card-time').innerText = data.time.split(' ')[1];
    document.getElementById('card-action').innerText = `${data.action.toUpperCase()} REGISTRADA`;

    // Mostrar card
    document.getElementById('success-card').classList.remove('hidden');
    floatingLabel.classList.add('hidden');

    setTimeout(() => {
        isProcessing = false;
        resetScanner();
    }, 5000);
}

function triggerError(data) {
    isProcessing = true;
    circle.classList.add('error');
    floatingLabel.innerText = (data && data.message) ? data.message.toUpperCase() : "USUARIO NO RECONOCIDO";
    floatingLabel.classList.remove('hidden');
    floatingLabel.classList.add('error');

    setTimeout(() => {
        isProcessing = false;
        resetScanner();
    }, 3000);
}

startWebcam();
setInterval(autoScan, 500);
