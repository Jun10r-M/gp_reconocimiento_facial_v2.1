import cv2
import os
import json
import numpy as np
from datetime import datetime

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

known_faces_dir = "known_faces"
attendance_file = "asistencia.json"

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

if not os.path.exists(known_faces_dir):
    os.makedirs(known_faces_dir)

for filename in os.listdir(known_faces_dir):
    if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    path = os.path.join(known_faces_dir, filename)
    name = os.path.splitext(filename)[0]
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
    print("Sistema iniciado correctamente")
else:
    print("ADVERTENCIA: No se encontraron rostros en 'known_faces'. Agrega fotos para entrenar el modelo.")

# ==========================
# Guardar asistencia
# ==========================
def save_attendance(name):
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")
    contenido = []

    # Leer JSON
    try:
        if os.path.exists(attendance_file):
            with open(attendance_file, "r", encoding="utf-8") as f:
                contenido = json.load(f)
                if not isinstance(contenido, list):
                    contenido = []
    except Exception as e:
        print(f"Error al leer asistencia: {e}")
        contenido = []

    registro_abierto = None
    for registro in contenido:
        if registro["nombre"] == name and registro["salida"] is None:
            registro_abierto = registro
            break

    if registro_abierto is None:
        nuevo = {
            "nombre": name,
            "entrada": current_time,
            "salida": None,
            "horas": 0,
            "pago": 0
        }
        contenido.append(nuevo)
        print(f"Entrada registrada: {name}")
    else:
        registro_abierto["salida"] = current_time
        entrada = datetime.strptime(registro_abierto["entrada"], "%Y-%m-%d %H:%M:%S")
        salida = datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S")
        diferencia = salida - entrada
        horas = diferencia.total_seconds() / 3600
        registro_abierto["horas"] = round(horas, 2)

        pago_hora = 50 / 8
        pago = horas * pago_hora
        if horas >= 8.5:
            pago = pago * 1.10
        registro_abierto["pago"] = round(pago, 2)

        print(f"Salida registrada: {name}")
        print(f"Horas trabajadas: {horas:.2f}")
        print(f"Pago calculado: S/ {pago:.2f}")

    with open(attendance_file, "w", encoding="utf-8") as f:
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
            if confidence < 110:
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