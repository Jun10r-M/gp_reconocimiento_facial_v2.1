import cv2
import os
import json
import numpy as np
from datetime import datetime

# ==========================
# Configuración de Rutas (Compatibles con la nueva estructura de datos)
# ==========================
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
KNOWN_FACES_DIR = os.path.join(DATA_DIR, "known_faces")
ATTENDANCE_FILE = os.path.join(DATA_DIR, "db", "asistencia.json")

# Asegurar directorios
os.makedirs(KNOWN_FACES_DIR, exist_ok=True)
os.makedirs(os.path.dirname(ATTENDANCE_FILE), exist_ok=True)

# ==========================
# Detector facial
# ==========================
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# ==========================
# Reconocedor facial
# ==========================
recognizer = cv2.face.LBPHFaceRecognizer_create()

faces = []
labels = []
names = {}

current_id = 0
registered = []
last_detection = {}
COOLDOWN_SECONDS = 10

# ==========================
# Cargar rostros
# ==========================
print("Cargando rostros...")

# En la estructura nueva, cada empleado tiene su carpeta en known_faces
for root, dirs, files in os.walk(KNOWN_FACES_DIR):
    for filename in files:
        if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        path = os.path.join(root, filename)
        if root == KNOWN_FACES_DIR:
            name = os.path.splitext(filename)[0]
        else:
            name = os.path.basename(root)

        img = cv2.imread(path)
        if img is None:
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        detected = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5
        )

        for (x, y, w, h) in detected:
            face = gray[y:y+h, x:x+w]
            face = cv2.resize(face, (200, 200))
            faces.append(face)
            labels.append(current_id)
            names[current_id] = name
            print(f"Rostro cargado: {name}")
            current_id += 1

# ==========================
# Entrenar modelo
# ==========================
if len(faces) > 0:
    recognizer.train(faces, np.array(labels))
    print("Sistema de escritorio iniciado correctamente")
else:
    print("ADVERTENCIA: No se encontraron rostros en 'data/known_faces'. Agregue fotos en el panel web para entrenar el modelo.")

# ==========================
# Guardar asistencia
# ==========================
def save_attendance(name):
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")
    contenido = []

    try:
        if os.path.exists(ATTENDANCE_FILE):
            with open(ATTENDANCE_FILE, "r", encoding="utf-8") as f:
                contenido = json.load(f)
                if not isinstance(contenido, list):
                    contenido = []
    except Exception as e:
        print(f"Error al leer asistencia: {e}")
        contenido = []

    # Guardar como registro simple (punches) en la estructura web nueva
    nuevo = {
        "nombre": name,
        "timestamp": current_time
    }
    contenido.append(nuevo)
    print(f"Marcación de asistencia registrada para: {name} a las {current_time}")

    with open(ATTENDANCE_FILE, "w", encoding="utf-8") as f:
        json.dump(contenido, f, indent=4, ensure_ascii=False)

# ==========================
# Cámara
# ==========================
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: No se pudo leer de la cámara.")
        break

    # Simular modo espejo
    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    detected = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    for (x, y, w, h) in detected:
        face = gray[y:y+h, x:x+w]
        face = cv2.resize(face, (200, 200))
        
        if len(faces) > 0:
            label, confidence = recognizer.predict(face)
            if confidence < 90:  # Ajustado al mismo umbral del backend web (90)
                name = names[label]
                color = (0, 255, 0)
                now = datetime.now()
                if name not in last_detection or (now - last_detection[name]).total_seconds() > COOLDOWN_SECONDS:
                    save_attendance(name)
                    last_detection[name] = now
            else:
                name = "Desconocido"
                color = (0, 0, 255)
        else:
            name = "Sin entrenar"
            color = (255, 255, 0)

        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    cv2.imshow("Sistema Facial IA - Presiona 'q' para salir", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
