const socket=io();
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
            lng:
  position.coords.longitude         
        };
    socket.emit("sendAlert",data);
    document.getElementById("status").innerText ="Alert Sent!";

    });
}

socket.on("receiveAlert",(data) => {
    alert("Emergency Alert!\nLocation: " + data.lat +" , " + data.lng);
});

