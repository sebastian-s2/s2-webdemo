class NetworkVisualizer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.isAnimating = false;
    }

    initializeElements() {
        this.tcpButton = document.getElementById('tcpButton');
        this.pingButton = document.getElementById('pingButton');
        this.ipInput = document.getElementById('ip');
        this.portInput = document.getElementById('port');
        this.statusLog = document.getElementById('statusLog');
        this.packets = {
            syn: document.querySelector('.packet.syn'),
            synAck: document.querySelector('.packet.syn-ack'),
            ack: document.querySelector('.packet.ack'),
            ping: document.querySelector('.packet.ping'),
            pong: document.querySelector('.packet.pong')
        };
    }

    bindEvents() {
        this.tcpButton.addEventListener('click', () => this.startTcpHandshake());
        this.pingButton.addEventListener('click', () => this.startPing());
    }

    async startTcpHandshake() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const ip = this.ipInput.value;
        const port = this.portInput.value;

        this.log(`Starting TCP handshake with ${ip}:${port}`);

        try {
            // Step 1: SYN
            await this.animatePacket('syn', 'right');
            this.log('→ Sending SYN packet');
            
            const response = await fetch(`/api/tcp-connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, port })
            });

            if (!response.ok) throw new Error('Connection failed');

            // Step 2: SYN-ACK
            await this.animatePacket('synAck', 'left');
            this.log('← Received SYN-ACK');

            // Step 3: ACK
            await this.animatePacket('ack', 'right');
            this.log('→ Sending ACK');
            
            this.log('✓ TCP connection established!');
        } catch (error) {
            this.log(`✗ Error: ${error.message}`);
        } finally {
            this.resetPackets();
            this.isAnimating = false;
        }
    }

    async startPing() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const ip = this.ipInput.value;
        
        this.log(`Pinging ${ip}`);

        try {
            await this.animatePacket('ping', 'right');
            this.log('→ Sending ICMP Echo Request');

            const response = await fetch(`/api/ping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip })
            });

            if (!response.ok) throw new Error('Ping failed');

            await this.animatePacket('pong', 'left');
            const data = await response.json();
            this.log(`← Received ICMP Echo Reply (${data.time}ms)`);
        } catch (error) {
            this.log(`✗ Error: ${error.message}`);
        } finally {
            this.resetPackets();
            this.isAnimating = false;
        }
    }

    animatePacket(packetType, direction) {
        return new Promise(resolve => {
            const packet = this.packets[packetType];
            packet.classList.remove('hidden');
            
            // Force reflow
            void packet.offsetWidth;
            
            if (direction === 'right') {
                packet.style.transform = 'translateX(100%)';
            } else {
                packet.style.transform = 'translateX(0)';
            }

            setTimeout(resolve, 1000);
        });
    }

    resetPackets() {
        Object.values(this.packets).forEach(packet => {
            packet.classList.add('hidden');
            packet.style.transform = '';
        });
    }

    log(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${timestamp}] ${message}`;
        this.statusLog.appendChild(logEntry);
        this.statusLog.scrollTop = this.statusLog.scrollHeight;
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NetworkVisualizer();
}); 