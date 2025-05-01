const express = require('express');
const cors = require('cors');
const net = require('net');
const ping = require('ping');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend/public directory
const staticPath = path.join(__dirname, '../frontend/public');
console.log('Static path:', staticPath);
app.use(express.static(staticPath));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// TCP Connection endpoint
app.post('/api/tcp-connect', async (req, res) => {
    const { ip, port } = req.body;
    
    const socket = new net.Socket();
    let connectionSuccess = false;

    try {
        await new Promise((resolve, reject) => {
            socket.connect(port, ip, () => {
                connectionSuccess = true;
                resolve();
            });

            socket.on('error', (error) => {
                reject(error);
            });

            // Set timeout for connection attempt
            setTimeout(() => {
                if (!connectionSuccess) {
                    reject(new Error('Connection timeout'));
                }
            }, 5000);
        });

        res.json({ success: true, message: 'Connection successful' });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: `Connection failed: ${error.message}` 
        });
    } finally {
        socket.destroy();
    }
});

// ICMP Ping endpoint
app.post('/api/ping', async (req, res) => {
    const { ip } = req.body;

    try {
        const result = await ping.promise.probe(ip, {
            timeout: 5,
            extra: ['-c', '1']
        });

        if (result.alive) {
            res.json({ 
                success: true, 
                time: result.time,
                message: 'Host is reachable' 
            });
        } else {
            throw new Error('Host is unreachable');
        }
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: `Ping failed: ${error.message}` 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Serving static files from: ${staticPath}`);
}); 