// Crisis Response System - Guest Script
console.log("✅ Script loaded successfully!");

function goToStaff() {
  window.location.href = "staff.html";
}

function openPopup() {
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function sendAlert() {
  console.log("🔴 sendAlert() called");
  
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser!");
    return;
  }

  // Show loading message
  const btn = event.target;
  const originalText = btn.innerText;
  btn.innerText = "Sending...";
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("📍 Location obtained:", position.coords);
      
      const alertData = {
        message: "Emergency SOS!",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      console.log("📤 Sending alert:", alertData);

      // Use relative URL
    fetch("http://localhost:3000/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(alertData)
      })
      .then(res => {
        console.log("📬 Response status:", res.status);
        if (!res.ok) {
          throw new Error("Network response was not ok: " + res.statusText);
        }
        return res.json();
      })
      .then(data => {
        console.log("📋 Response data:", data);
        alert("🚨 SOS Alert Sent!\n\nLocation: " + alertData.lat.toFixed(5) + ", " + alertData.lng.toFixed(5) + "\nAccuracy: " + Math.round(alertData.accuracy) + "m");
        btn.innerText = originalText;
        btn.disabled = false;
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        alert("Error sending alert! Check console for details.");
        btn.innerText = originalText;
        btn.disabled = false;
      });
    },
    (error) => {
      console.error("❌ Location error:", error);
      let errorMsg = "Could not get location: ";
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += "Location permission denied. Please allow location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMsg += "Location request timed out.";
          break;
        default:
          errorMsg += error.message;
      }
      alert(errorMsg);
      btn.innerText = originalText;
      btn.disabled = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}