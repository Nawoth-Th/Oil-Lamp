'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Pusher from 'pusher-js';

interface LampState {
  litWicks: Set<number>;
  lightWick: (id: number) => void;
  resetWicks: () => void;
  isConnected: boolean;
}

export function useLampState(totalWicks: number): LampState {
  const [litWicks, setLitWicks] = useState<Set<number>>(new Set());
  const [isConnected, setIsConnected] = useState(false);

  // Initialize and Fetch Initial State
  useEffect(() => {
    // 1. Fetch current state from API on load
    fetch('/api/lamp')
      .then(res => res.json())
      .then(data => {
        if (data.litWicks) {
          setLitWicks(new Set(data.litWicks));
        }
      })
      .catch(err => console.error('> Failed to fetch initial state:', err));

    // 2. Setup Pusher for real-time updates
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !cluster) {
      console.warn('> Pusher keys missing. Real-time sync disabled.');
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: cluster,
    });

    const channel = pusher.subscribe('lamp-channel');
    
    pusher.connection.bind('connected', () => setIsConnected(true));
    pusher.connection.bind('disconnected', () => setIsConnected(false));

    channel.bind('sync-event', (data: { litWicks: number[] }) => {
      setLitWicks(new Set(data.litWicks));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // Update via API
  const lightWick = useCallback(async (id: number) => {
    // Optimistic local update
    setLitWicks(prev => new Set([...prev, id]));

    try {
      await fetch('/api/lamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'LIGHT_WICK', wickId: id }),
      });
    } catch (err) {
      console.error('> Failed to light wick via API:', err);
    }
  }, []);

  const resetWicks = useCallback(async () => {
    // Optimistic local update
    setLitWicks(new Set());

    try {
      await fetch('/api/lamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'RESET' }),
      });
    } catch (err) {
      console.error('> Failed to reset wicks via API:', err);
    }
  }, []);

  return { litWicks, lightWick, resetWicks, isConnected };
}
