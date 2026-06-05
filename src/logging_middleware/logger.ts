// logging_middleware/logger.ts

const API_URL =
  "http://4.224.186.213/evaluation-service/logs";

function getLogToken() {
  const nodeProcess = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;

  if (nodeProcess && nodeProcess.env) {
    return nodeProcess.env.LOG_TOKEN || nodeProcess.env.VITE_LOG_TOKEN || 'test-token';
  }

  if (typeof window !== 'undefined') {
    const globalAny = window as any;
    return globalAny.VITE_LOG_TOKEN || globalAny.LOG_TOKEN || 'test-token';
  }

  return 'test-token';
}

export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
) {
  const isNodeEnv = typeof process !== 'undefined' && process.versions && process.versions.node;
  const nodeToken = isNodeEnv
    ? process.env?.LOG_TOKEN || process.env?.VITE_LOG_TOKEN
    : undefined;
  const browserToken = typeof window !== 'undefined'
    ? ((window as any).VITE_LOG_TOKEN as string | undefined) || ((window as any).LOG_TOKEN as string | undefined)
    : undefined;
  const token = nodeToken || browserToken || 'test-token';

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (err) {
    console.error(err);
  }
}
