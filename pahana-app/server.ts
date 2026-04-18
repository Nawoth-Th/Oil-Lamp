import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

// Path to persist state
const STATE_FILE = path.join(process.cwd(), 'state.json');

// Load state from file on startup
function loadState(): Set<number> {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      if (Array.isArray(data)) {
        return new Set<number>(data);
      }
    } catch (err) {
      console.error('> Error loading state.json:', err);
    }
  }
  return new Set<number>();
}

// Persist state to file
function saveState(litWicks: Set<number>) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(Array.from(litWicks), null, 2));
  } catch (err) {
    console.error('> Error saving state.json:', err);
  }
}

// Initialize state
const litWicks = loadState();

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  // Send current state to newly connected client
  ws.send(JSON.stringify({ type: 'SYNC', litWicks: Array.from(litWicks) }));

  ws.on('message', (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'LIGHT_WICK' && typeof msg.wickId === 'number') {
        litWicks.add(msg.wickId);
        saveState(litWicks);
        
        const payload = JSON.stringify({ type: 'SYNC', litWicks: Array.from(litWicks) });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }

      if (msg.type === 'RESET') {
        litWicks.clear();
        saveState(litWicks);
        
        const payload = JSON.stringify({ type: 'SYNC', litWicks: [] });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }
    } catch {
      // ignore malformed messages
    }
  });
});

const WS_PORT = parseInt(process.env.WS_PORT || '3001', 10);
server.listen(WS_PORT, () => {
  console.log(`> WebSocket server ready on ws://localhost:${WS_PORT}`);
  console.log(`> State persistence enabled: ${STATE_FILE}`);
});
