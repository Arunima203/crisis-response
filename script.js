const socket=io();

// Debug: Check connection
socket.on('connect', () => {
    console.log('✅ Guest connected to server, ID:', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection error:', err.message);
});

function openPopup()   {
    document.getElementById("popup").style.display ="block";
}

function closePopup()  {
    document.getElementById("popup").style.display ="none";
}
 
function sendAlert() {
    navigator.geolocation.getCurrentPosition((position) => {
        const data = {
            lat: position.coords.latitude,
            lng: position.coords.longitude         
        };
        console.log('📤 Sending alert:', data);
        socket.emit("sendAlert",data);
        document.getElementById("status").innerText ="Alert Sent!";

    }, (err) => {
        console.error('❌ Geolocation error:', err.message);
        document.getElementById("status").innerText = "Error: " + err.message;
    });
}

// Inside staff.html script
socket.on('new-alert', (data) => {
    console.log("Alert received on Dashboard:", data);
    // Logic to increment your 'Incoming Alerts' counter goes here
    let countElement = document.getElementById('pending-count'); 
    countElement.innerText = parseInt(countElement.innerText) + 1;
});


