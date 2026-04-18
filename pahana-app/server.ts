import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// In-memory lamp state: set of lit wick IDs
const litWicks = new Set<number>();

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
        const payload = JSON.stringify({ type: 'SYNC', litWicks: Array.from(litWicks) });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }

      if (msg.type === 'RESET') {
        litWicks.clear();
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
});
