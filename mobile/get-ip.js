// get-ip.js
const os = require("os");

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`http://${net.address}:8000`);
        return;
      }
    }
  }
}

getLocalIP();
