import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import { Redis } from '@upstash/redis';

// Initialize Pusher (Server-side)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
  useTLS: true,
});

// Initialize Redis (Server-side)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const LAMP_KEY = 'oil_lamp_state';

/**
 * GET: Fetches initial state for new visitors
 */
export async function GET() {
  try {
    const litWicks = (await redis.get<number[]>(LAMP_KEY)) || [];
    return NextResponse.json({ litWicks });
  } catch (error) {
    console.error('> API Error:', error);
    return NextResponse.json({ litWicks: [] });
  }
}

/**
 * POST: Handles lighting wicks and resetting
 */
export async function POST(req: Request) {
  try {
    const { type, wickId } = await req.json();
    let currentWicks = (await redis.get<number[]>(LAMP_KEY)) || [];

    if (type === 'LIGHT_WICK' && typeof wickId === 'number') {
      if (!currentWicks.includes(wickId)) {
        currentWicks.push(wickId);
        await redis.set(LAMP_KEY, currentWicks);
        // Broadcast the update via Pusher
        await pusher.trigger('lamp-channel', 'sync-event', { litWicks: currentWicks });
      }
    } else if (type === 'RESET') {
      currentWicks = [];
      await redis.set(LAMP_KEY, currentWicks);
      // Broadcast the reset via Pusher
      await pusher.trigger('lamp-channel', 'sync-event', { litWicks: currentWicks });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('> API Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
