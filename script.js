const socket=io();
let pendingAlertSource = null;

// Debug: Check connection
socket.on('connect', () => {
    console.log('✅ Guest connected to server, ID:', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection error:', err.message);
});

socket.on("alertConfirmed", ({ id }) => {
    const sourceLabel = pendingAlertSource || "request";
    document.getElementById("status").innerText =
        `Delivery confirmed (ID: ${id}) from ${sourceLabel}.`;
    pendingAlertSource = null;
});

function openPopup()   {
    document.getElementById("popup").style.display ="block";
}

function closePopup()  {
    document.getElementById("popup").style.display ="none";
}
 
function emitAlert(data, sourceLabel) {
    console.log(`📤 Sending alert (${sourceLabel}):`, data);
    pendingAlertSource = sourceLabel;
    document.getElementById("status").innerText = `Sending alert... (${sourceLabel})`;
    socket.emit("sendAlert", data);
    hideManualLocationForm();
}

function getOrCreateManualLocationForm() {
    let form = document.getElementById("manual-location-form");
    if (form) {
        return form;
    }

    const statusEl = document.getElementById("status");
    form = document.createElement("div");
    form.id = "manual-location-form";
    form.style.display = "none";
    form.style.marginTop = "10px";
    form.innerHTML = `
        <input id="manual-lat" type="number" step="any" placeholder="Latitude (e.g. 28.6139)" style="margin:4px; padding:6px; width:220px;" />
        <input id="manual-lng" type="number" step="any" placeholder="Longitude (e.g. 77.2090)" style="margin:4px; padding:6px; width:220px;" />
        <button id="manual-send-btn" type="button" style="margin:4px; padding:6px 10px;">Send Manual Alert</button>
    `;
    statusEl.insertAdjacentElement("afterend", form);

    const sendBtn = document.getElementById("manual-send-btn");
    sendBtn.addEventListener("click", () => {
        const latValue = document.getElementById("manual-lat").value;
        const lngValue = document.getElementById("manual-lng").value;
        const lat = Number.parseFloat(latValue);
        const lng = Number.parseFloat(lngValue);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            document.getElementById("status").innerText =
                "Invalid location. Enter numeric latitude and longitude.";
            return;
        }

        emitAlert({ lat, lng }, "manual location");
    });

    return form;
}

function showManualLocationForm() {
    const form = getOrCreateManualLocationForm();
    form.style.display = "block";
}

function hideManualLocationForm() {
    const form = document.getElementById("manual-location-form");
    if (!form) {
        return;
    }
    form.style.display = "none";
    document.getElementById("manual-lat").value = "";
    document.getElementById("manual-lng").value = "";
}

function sendAlert() {
    if (!navigator.geolocation) {
        console.error("❌ Geolocation API is not available in this browser/context.");
        document.getElementById("status").innerText =
            "Geolocation is unavailable. Enter manual location below.";
        showManualLocationForm();
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const data = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        emitAlert(data, "device GPS");
    }, (err) => {
        console.error('❌ Geolocation error:', err.message);
        document.getElementById("status").innerText =
            "Geolocation failed. Enter manual location below.";
        showManualLocationForm();
    });
});


