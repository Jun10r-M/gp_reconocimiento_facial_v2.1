let currentSection = 'resumen';
let allData = { attendance: [], employees: [] };
let learnedKnowledge = {};
let learningMode = false;
let lastUnknownQuestion = "";
let mainChart = null;

async function loadData() {
    try {
        const [dataRes, knowledgeRes] = await Promise.all([
            fetch('/data'),
            fetch('/knowledge')
        ]);
        allData = await dataRes.json();
        learnedKnowledge = await knowledgeRes.json();

        if (currentSection === 'resumen') renderResumen();
        renderTable();
    } catch (err) {
        console.error("Error cargando datos:", err);
    }
}

function renderResumen() {
    const processed = getProcessedAttendance();
    document.getElementById('stat-total-att').innerText = processed.length;
    const totalPay = processed.reduce((sum, item) => sum + (item.pago || 0), 0);
    document.getElementById('stat-total-pay').innerText = `S/ ${totalPay.toFixed(2)}`;

    updateChart(processed);
}

function updateChart(processed) {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Agrupar asistencias procesadas por fecha con nombres
    const dataByDate = {};
    processed.forEach(att => {
        if (!dataByDate[att.fecha]) dataByDate[att.fecha] = { count: 0, names: [] };
        dataByDate[att.fecha].count++;
        dataByDate[att.fecha].names.push(att.nombre);
    });

    const labels = Object.keys(dataByDate).sort();
    const counts = labels.map(l => dataByDate[l].count);
    const names = labels.map(l => dataByDate[l].names);

    if (mainChart) mainChart.destroy();

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Empleados',
                data: counts,
                borderColor: '#c62828',
                backgroundColor: 'rgba(198, 40, 40, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#c62828',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#aaa',
                    borderColor: '#c62828',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            const dayNames = names[context.dataIndex];
                            return [
                                `Total: ${context.raw} empleados`,
                                `Asistieron: ${dayNames.join(', ')}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#222' },
                    ticks: { color: '#888', stepSize: 1 }
                },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            }
        }
    });
}

// Procesar datos brutos (punches) a días laborales (Entrada/Salida)
function getProcessedAttendance() {
    const grouped = {};

    allData.attendance.forEach(att => {
        const name = att.nombre.toLowerCase();
        // Soportar formato antiguo (entrada/salida) y nuevo (timestamp)
        const ts = att.timestamp || att.entrada;
        if (!ts) return;

        const [date, time] = ts.split(' ');
        const key = `${name}_${date}`;

        if (!grouped[key]) {
            grouped[key] = { nombre: att.nombre, fecha: date, timestamps: [] };
        }
        grouped[key].timestamps.push(new Date(ts));
    });

    return Object.values(grouped).map(group => {
        group.timestamps.sort((a, b) => a - b);
        const first = group.timestamps[0];
        const last = group.timestamps.length > 1 ? group.timestamps[group.timestamps.length - 1] : null;

        let horas = 0;
        let pago = 0;

        if (last) {
            horas = (last - first) / (1000 * 60 * 60);

            // Buscar pago/hora
            const emp = allData.employees.find(e => e.nombre.toLowerCase() === group.nombre.toLowerCase());
            const rate = emp ? emp.pago_hora : 30;
            pago = horas * rate;
            if (horas >= 8.5) pago *= 1.10;
        }

        return {
            nombre: group.nombre,
            fecha: group.fecha,
            entrada: first.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            salida: last ? last.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Pendiente',
            horas: horas.toFixed(2),
            pago: pago,
            rawDate: group.fecha
        };
    });
}

function renderTable() {
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');
    const title = document.getElementById('section-title');
    const filterInput = document.getElementById('filter-input');
    const filterVal = filterInput ? filterInput.value.toLowerCase() : '';

    if (!tableHead || !tableBody) return;
    tableBody.innerHTML = '';

    // Controlar visibilidad de filtros y gráficos
    document.getElementById('section-resumen').classList.toggle('hidden', currentSection !== 'resumen');
    document.getElementById('section-table').classList.toggle('hidden', currentSection === 'resumen');

    // Mostrar la barra superior (búsqueda/botón) solo en asistencia y empleados
    const showFilterBar = ['asistencia', 'empleados'].includes(currentSection);
    document.getElementById('filter-container').classList.toggle('hidden', !showFilterBar);

    // Visibilidad del input de búsqueda vs botón
    const filterInputElem = document.getElementById('filter-input');
    if (filterInputElem) {
        filterInputElem.classList.toggle('hidden', currentSection !== 'asistencia');
    }

    // Visibilidad del botón Nuevo Empleado
    document.getElementById('btn-new-emp').classList.toggle('hidden', currentSection !== 'empleados');

    const processed = getProcessedAttendance();

    if (currentSection === 'asistencia') {
        title.innerText = "Historial de Asistencia (Entrada/Salida)";
        tableHead.innerHTML = `<th>Nombre</th><th>Fecha</th><th>Entrada</th><th>Salida</th><th>Horas</th>`;

        const filtered = processed.filter(a => a.nombre.toLowerCase().includes(filterVal));
        filtered.slice().reverse().forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.nombre}</td><td>${row.fecha}</td><td>${row.entrada}</td><td>${row.salida}</td><td>${row.horas} hrs</td>`;
            tableBody.appendChild(tr);
        });
    } else if (currentSection === 'empleados') {
        title.innerText = "Empleados";
        tableHead.innerHTML = `<th>Nombre</th><th>Puesto</th><th>Sueldo Base</th><th>Pago/H</th><th>Doc</th>`;
        allData.employees.forEach(row => {
            const tr = document.createElement('tr');
            const sueldoStr = row.sueldo ? row.sueldo.toFixed(2) : "0.00";
            tr.innerHTML = `<td>${row.nombre}</td><td>${row.puesto}</td><td>S/ ${sueldoStr}</td><td>S/ ${row.pago_hora}</td><td>${row.documento}</td>`;
            tableBody.appendChild(tr);
        });
    } else if (currentSection === 'planilla') {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const currentMonth = `${y}-${m}`;

        title.innerText = `Planilla Acumulada (${currentMonth})`;
        tableHead.innerHTML = `<th>Empleado</th><th>Sueldo Base</th><th>Horas Registradas</th><th>Pago por Horas</th><th>Próximo Mes (Simulación)</th>`;

        const summary = {};
        processed.forEach(att => {
            if (att.rawDate.startsWith(currentMonth)) {
                if (!summary[att.nombre]) summary[att.nombre] = { hours: 0, pay: 0 };
                summary[att.nombre].hours += parseFloat(att.horas);
                summary[att.nombre].pay += att.pago;
            }
        });

        allData.employees.forEach(emp => {
            const name = emp.nombre;
            const data = summary[name] || { hours: 0, pay: 0 };
            const sueldo = emp.sueldo || 0;

            const daysInMonth = new Date(y, now.getMonth() + 1, 0).getDate();
            const daysPassed = now.getDate();
            const avgHoursPerDay = daysPassed > 0 && data.hours > 0 ? data.hours / daysPassed : 8;
            const projectedHours = avgHoursPerDay * daysInMonth;
            const projectedPay = projectedHours * (emp.pago_hora || 0);

            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${name}</td><td>S/ ${sueldo.toFixed(2)}</td><td>${data.hours.toFixed(1)} hrs</td><td>S/ ${data.pay.toFixed(2)}</td><td>S/ ${projectedPay.toFixed(2)} (~${projectedHours.toFixed(0)} hrs)</td>`;
            tableBody.appendChild(tr);
        });
    } else if (currentSection === 'faltas') {
        title.innerText = "Reporte de Faltas (Mes Actual)";
        tableHead.innerHTML = `<th>Empleado</th><th>Días Laborables</th><th>Asistencias</th><th>Faltas Totales</th>`;

        const workDays = getWorkDaysUntilToday();

        allData.employees.forEach(emp => {
            const empAttDates = new Set(processed
                .filter(a => a.nombre.toLowerCase() === emp.nombre.toLowerCase())
                .map(a => a.rawDate));

            let absences = 0;
            workDays.forEach(day => {
                if (!empAttDates.has(day)) absences++;
            });

            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${emp.nombre}</td><td>30</td><td>${empAttDates.size}</td><td style="color: ${absences > 0 ? '#ff5252' : '#10b981'}; font-weight: 600;">${absences}</td>`;
            tableBody.appendChild(tr);
        });
    }
}

function getWorkDaysUntilToday() {
    const days = [];
    const now = new Date();
    // Calcular días desde el 1 del mes hasta HOY
    for (let i = 1; i <= now.getDate(); i++) {
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(i).padStart(2, '0');
        days.push(`${y}-${m}-${d}`);
    }
    return days;
}

function getNextMonthSimulation() {
    const processed = getProcessedAttendance();
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${y}-${m}`;
    const nextMonthDate = new Date(y, now.getMonth() + 1, 1);
    const nextMonthName = nextMonthDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const daysInNextMonth = new Date(y, now.getMonth() + 2, 0).getDate();
    const daysPassed = now.getDate();

    let lines = [`Simulación de planilla para ${nextMonthName}:\n`];
    let totalProjected = 0;

    allData.employees.forEach(emp => {
        const empAtts = processed.filter(a =>
            a.nombre.toLowerCase() === emp.nombre.toLowerCase() &&
            a.rawDate.startsWith(currentMonth));
        const totalHours = empAtts.reduce((s, a) => s + parseFloat(a.horas), 0);
        const avgHoursPerDay = daysPassed > 0 && totalHours > 0 ? totalHours / daysPassed : 8;
        const projectedHours = avgHoursPerDay * daysInNextMonth;
        const projectedPay = projectedHours * (emp.pago_hora || 0);
        totalProjected += projectedPay;

        lines.push(`• ${emp.nombre}: ~${projectedHours.toFixed(0)} hrs → S/ ${projectedPay.toFixed(2)}`);
    });

    lines.push(`\nTotal proyectado: S/ ${totalProjected.toFixed(2)}`);
    return lines.join('\n');
}

// Navegación Sidebar
document.querySelectorAll('.nav-links li').forEach(li => {
    li.addEventListener('click', () => {
        document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        currentSection = li.dataset.section;
        if (currentSection === 'resumen') renderResumen();
        renderTable();
    });
});

// Secciones colapsables del sidebar
document.querySelectorAll('.nav-section-header').forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.dataset.toggle;
        const target = document.getElementById(targetId);
        if (target) {
            target.classList.toggle('collapsed');
            const chevron = header.querySelector('.chevron');
            if (chevron) {
                chevron.innerHTML = target.classList.contains('collapsed') ? '&#8250;' : '&#8744;';
            }
        }
    });
});

// Dropdown de Usuario
document.getElementById('admin-user-btn').addEventListener('click', () => {
    document.getElementById('admin-dropdown').classList.toggle('hidden');
});

document.getElementById('btn-scanner').addEventListener('click', () => {
    window.location.href = "/";
});

document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm("¿Cerrar sistema?")) fetch('/shutdown', { method: 'POST' }).then(() => alert("Cerrado"));
});

// Filtro
document.getElementById('filter-input').addEventListener('input', renderTable);

// --- Modal Nuevo Empleado ---
const modalEmp = document.getElementById('modal-emp');
const btnNewEmp = document.getElementById('btn-new-emp');
const btnCloseModal = document.querySelector('.close-modal');
const formEmp = document.getElementById('form-emp');

btnNewEmp.addEventListener('click', () => modalEmp.classList.remove('hidden'));
btnCloseModal.addEventListener('click', () => modalEmp.classList.add('hidden'));
window.addEventListener('click', (e) => {
    if (e.target === modalEmp) modalEmp.classList.add('hidden');
});

formEmp.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formEmp);

    try {
        const res = await fetch('/empleados', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            alert('Empleado registrado y modelo actualizado exitosamente.');
            modalEmp.classList.add('hidden');
            formEmp.reset();
            loadData(); // Recargar datos para mostrar en tabla
        } else {
            alert('Error al registrar empleado.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error de conexión al registrar.');
    }
});

// --- Smart Chat Logic ---
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => chatWindow.classList.toggle('hidden'));

chatSend.addEventListener('click', processChat);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processChat(); });

async function processChat() {
    const rawText = chatInput.value.trim();
    const text = rawText.toLowerCase();
    if (!text) return;

    addMsg(rawText, 'user');
    chatInput.value = '';

    if (learningMode) {
        if (text === 'cancelar' || text === 'no' || text === 'salir') {
            learningMode = false;
            addMsg("Modo aprendizaje cancelado.", 'bot');
            return;
        }
        await saveNewKnowledge(lastUnknownQuestion, rawText);
        learningMode = false;
        return;
    }

    setTimeout(() => {
        let reply = null;
        const processed = getProcessedAttendance();

        const greetings = ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'que tal'];
        if (greetings.some(g => text.includes(g))) {
            reply = "¡Hola! Soy el asistente de RRHH. Puedes preguntarme sobre asistencias, faltas, planilla, horas trabajadas o datos de un empleado.";
        }

        if (!reply && (text === 'ayuda' || text === 'help' || text.includes('que puedes hacer'))) {
            reply = "Puedo responder sobre: horas trabajadas, faltas, planilla/pagos, asistencias de hoy, datos de un empleado, simulación de planilla del próximo mes. Escribe el nombre del empleado junto con tu consulta.";
        }

        // 1. Buscar en conocimiento aprendido (búsqueda parcial)
        if (!reply) {
            for (const [key, val] of Object.entries(learnedKnowledge)) {
                if (text.includes(key) || key.includes(text)) {
                    reply = val;
                    break;
                }
            }
        }

        // 2. Lógica de Integración de Datos
        if (!reply) {
            const emp = allData.employees.find(e => text.includes(e.nombre.toLowerCase()));

            if (emp) {
                const name = emp.nombre;
                const empAtts = processed.filter(a => a.nombre.toLowerCase() === name.toLowerCase());
                const totalHours = empAtts.reduce((s, a) => s + parseFloat(a.horas), 0);
                const totalPay = empAtts.reduce((s, a) => s + (a.pago || 0), 0);
                const workDays = getWorkDaysUntilToday();
                const attDates = new Set(empAtts.map(a => a.rawDate));
                let absences = 0;
                workDays.forEach(day => { if (!attDates.has(day)) absences++; });

                if (text.includes("faltas")) {
                    reply = `El empleado ${name} tiene ${absences} faltas en el periodo actual.`;
                } else if (text.includes("horas") || text.includes("asistencia")) {
                    reply = `${name} ha registrado ${empAtts.length} asistencias con un total de ${totalHours.toFixed(1)} horas trabajadas.`;
                } else if (text.includes("planilla") || text.includes("cuanto") || text.includes("pago") || text.includes("saldo")) {
                    reply = `A ${name} le corresponde un pago acumulado de S/ ${totalPay.toFixed(2)} por las horas registradas este mes.`;
                } else if (text.includes("datos") || text.includes("quien es") || text === name.toLowerCase()) {
                    reply = `Perfil de ${name}: ${emp.puesto}, DNI: ${emp.documento}. Este mes: ${totalHours.toFixed(1)}h trabajadas, ${empAtts.length} asistencias y ${absences} faltas.`;
                }
            } else if (text.includes("total planilla") || text.includes("monto total")) {
                const total = processed.reduce((s, a) => s + (a.pago || 0), 0);
                reply = `El monto total de la planilla acumulada para todos los empleados es de S/ ${total.toFixed(2)}.`;
            } else if (text.includes("asistencias de hoy") || text.includes("quienes vinieron")) {
                const today = new Date().toLocaleDateString('en-CA');
                const todayAtts = processed.filter(a => a.rawDate === today);
                if (todayAtts.length > 0) {
                    const namesList = todayAtts.map(a => a.nombre).join(", ");
                    reply = `Hoy han asistido ${todayAtts.length} empleados: ${namesList}.`;
                } else {
                    reply = "Hoy aún no se han registrado asistencias.";
                }
            } else if (text.includes("simulacion") || text.includes("simulación") || text.includes("proximo mes") || text.includes("próximo mes") || text.includes("siguiente mes")) {
                reply = getNextMonthSimulation();
            }
        }

        // 3. Modo aprendizaje si no hay respuesta
        if (!reply) {
            reply = "No tengo esa información. ¿Podrías indicarme la respuesta para aprenderla? (Escribe 'cancelar' para salir del modo aprendizaje)";
            learningMode = true;
            lastUnknownQuestion = text;
        }

        addMsg(reply, 'bot');
    }, 500);
}

async function saveNewKnowledge(question, answer) {
    try {
        await fetch('/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer })
        });
        learnedKnowledge[question] = answer;
        addMsg("¡Conocimiento actualizado! He guardado esa información en mi base de procesos y la recordaré.", 'bot');
    } catch (err) {
        console.error("Error guardando conocimiento:", err);
        addMsg("Hubo un error al intentar actualizar mi conocimiento.", 'bot');
    }
}

function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = type === 'bot' ? 'bot-msg' : 'user-msg';
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

loadData();
