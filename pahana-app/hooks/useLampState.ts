'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface LampState {
  litWicks: Set<number>;
  lightWick: (id: number) => void;
  resetWicks: () => void;
  isConnected: boolean;
}

export function useLampState(totalWicks: number): LampState {
  const [litWicks, setLitWicks] = useState<Set<number>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    const wsPort = process.env.NEXT_PUBLIC_WS_PORT || '3001';
    const url = `${protocol}://${host}:${wsPort}`;
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 2000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'SYNC' && Array.isArray(msg.litWicks)) {
            setLitWicks(new Set<number>(msg.litWicks as number[]));
          }
        } catch { /* ignore */ }
      };
    };

    connect();
    return () => {
      clearTimeout(reconnectTimeout);
      ws.close();
    };
  }, []);

  const lightWick = useCallback((id: number) => {
    // Optimistic local update: add immediately
    setLitWicks(prev => new Set([...prev, id]));

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'LIGHT_WICK', wickId: id }));
    }
  }, []);

  const resetWicks = useCallback(() => {
    // Optimistic local update: clear immediately
    setLitWicks(new Set());

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'RESET' }));
    }
  }, []);

  return { litWicks, lightWick, resetWicks, isConnected };
}
