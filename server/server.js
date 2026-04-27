const express = require('express');
const cors = require('cors');
let alertHistory = [];
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// This "catches" your sendAlert() request
app.post('/alert', (req, res) => {
    const alertData = req.body;
    alertData.id = Date.now(); 
    alertData.time = new Date().toLocaleTimeString();

    // হিস্ট্রিতে সেভ করা হচ্ছে
    alertsHistory.push(alertData); 

    // রিয়েল-টাইম পাঠানোর জন্য
    if (typeof io !== 'undefined') {
        io.emit('new-alert', alertData);
    }

    console.log("New alert saved:", alertData);
    res.status(200).json({ status: "success", message: "Alert saved!" });
});
app.get('/fetch-alerts', (req, res) => {
    res.json(alertsHistory);
});

    // Here you could add code to send an SMS or Email
    
    res.status(200).json({ 
        status: "success", 
        message: "Alert received by the server!" 
    });


app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});