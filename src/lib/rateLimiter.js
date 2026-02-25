const hits = new Map();

export function rateLimit({ windowMs = 60000, max = 10 }) {
  return (key) => {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!hits.has(key)) {
      hits.set(key, []);
    }

    const timestamps = hits.get(key).filter((ts) => ts > windowStart);

    if (timestamps.length >= max) {
      return false;
    }

    timestamps.push(now);
    hits.set(key, timestamps);

    return true;
  };
}