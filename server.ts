import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for live weather endpoints to provide sub-second responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

async function fetchWithCache<T>(url: string, ttlMs = CACHE_TTL_MS): Promise<T> {
  const cached = cache.get(url);
  const now = Date.now();
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data as T;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Umbrella-Totoro-SG/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Data.gov.sg returned HTTP ${response.status} for ${url}`);
    }

    const data = await response.json() as T;
    cache.set(url, { data, timestamp: now });
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (cached) {
      // Return stale cache if live network fails
      return cached.data as T;
    }
    throw err;
  }
}

// Keyless live data.gov.sg v2 endpoints
const ENDPOINTS = {
  twentyFourHr: 'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast',
  fourDay: 'https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook',
  rainfall: 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
  psi: 'https://api-open.data.gov.sg/v2/real-time/api/psi',
  pm25: 'https://api-open.data.gov.sg/v2/real-time/api/pm25',
  uv: 'https://api-open.data.gov.sg/v2/real-time/api/uv',
};

// Raw / Specific Proxy Endpoints
app.get('/api/weather/twenty-four-hr-forecast', async (_req, res) => {
  try {
    const data = await fetchWithCache(ENDPOINTS.twentyFourHr);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: 'Failed to fetch 24-hr forecast', details: message });
  }
});

app.get('/api/weather/four-day-outlook', async (_req, res) => {
  try {
    const data = await fetchWithCache(ENDPOINTS.fourDay);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: 'Failed to fetch 4-day outlook', details: message });
  }
});

app.get('/api/weather/rainfall', async (_req, res) => {
  try {
    const data = await fetchWithCache(ENDPOINTS.rainfall);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: 'Failed to fetch rainfall stations', details: message });
  }
});

app.get('/api/weather/psi', async (_req, res) => {
  try {
    const data = await fetchWithCache(ENDPOINTS.psi);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: 'Failed to fetch PSI', details: message });
  }
});

app.get('/api/weather/pm25', async (_req, res) => {
  try {
    const data = await fetchWithCache(ENDPOINTS.pm25);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: 'Failed to fetch PM2.5', details: message });
  }
});

app.get('/api/weather/uv', async (_req, res) => {
  try {
    const data = await fetchWithCache(ENDPOINTS.uv);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: 'Failed to fetch UV index', details: message });
  }
});

// Consolidated Live Weather Intelligence Endpoint
app.get('/api/weather/live', async (_req, res) => {
  try {
    const [twentyFourHrResult, fourDayResult, rainfallResult, psiResult, pm25Result, uvResult] =
      await Promise.allSettled([
        fetchWithCache(ENDPOINTS.twentyFourHr),
        fetchWithCache(ENDPOINTS.fourDay),
        fetchWithCache(ENDPOINTS.rainfall),
        fetchWithCache(ENDPOINTS.psi),
        fetchWithCache(ENDPOINTS.pm25),
        fetchWithCache(ENDPOINTS.uv),
      ]);

    const liveData = {
      twentyFourHr: twentyFourHrResult.status === 'fulfilled' ? twentyFourHrResult.value : null,
      fourDay: fourDayResult.status === 'fulfilled' ? fourDayResult.value : null,
      rainfall: rainfallResult.status === 'fulfilled' ? rainfallResult.value : null,
      psi: psiResult.status === 'fulfilled' ? psiResult.value : null,
      pm25: pm25Result.status === 'fulfilled' ? pm25Result.value : null,
      uv: uvResult.status === 'fulfilled' ? uvResult.value : null,
      timestamp: new Date().toISOString(),
      source: 'data.gov.sg v2 live API',
    };

    res.json({
      success: true,
      data: liveData,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: 'Live aggregation failed', details: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Umbrella Totoro', service: 'live-weather-v2' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Umbrella Totoro backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
