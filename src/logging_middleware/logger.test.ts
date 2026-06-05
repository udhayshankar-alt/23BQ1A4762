// logging_middleware/logger.test.ts
import { Log } from './logger';

// Mock fetch globally
global.fetch = jest.fn();

describe('Logger Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LOG_TOKEN = 'test-token-12345';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Log function', () => {
    it('should send a log request with correct structure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await Log('backend', 'info', 'auth-service', 'User logged in');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://4.224.186.213/evaluation-service/logs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token-12345',
          },
          body: JSON.stringify({
            stack: 'backend',
            level: 'info',
            package: 'auth-service',
            message: 'User logged in',
          }),
        }
      );
    });

    it('should handle different log levels', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      const logLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

      for (const level of logLevels) {
        await Log('backend', level, 'test-pkg', 'Test message');
      }

      expect(global.fetch).toHaveBeenCalledTimes(5);
      expect(global.fetch).toHaveBeenNthCalledWith(1, expect.anything(), {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({
          stack: 'backend',
          level: 'debug',
          package: 'test-pkg',
          message: 'Test message',
        }),
      });
    });

    it('should handle different stack names', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      const stacks = ['backend', 'frontend', 'mobile', 'api'];

      for (const stack of stacks) {
        await Log(stack, 'info', 'test-pkg', 'Test message');
      }

      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('should catch fetch errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(error);

      await Log('backend', 'error', 'test-pkg', 'Failed request');

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });

    it('should use LOG_TOKEN from environment', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      process.env.LOG_TOKEN = 'custom-token-xyz';

      await Log('backend', 'info', 'test-pkg', 'Test message');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBe('Bearer custom-token-xyz');
    });

    it('should handle missing LOG_TOKEN', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      delete process.env.LOG_TOKEN;

      await Log('backend', 'info', 'test-pkg', 'Test message');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      // When LOG_TOKEN is missing, it falls back to 'test-token'
      expect(callArgs.headers.Authorization).toBe('Bearer test-token');
    });

    it('should handle long messages', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      const longMessage = 'A'.repeat(10000);
      await Log('backend', 'info', 'test-pkg', longMessage);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      expect(body.message).toBe(longMessage);
    });

    it('should handle special characters in message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      const specialMessage = 'Error: "null reference" & <injection> \n\t\r';
      await Log('backend', 'error', 'test-pkg', specialMessage);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      expect(body.message).toBe(specialMessage);
    });

    it('should not throw on timeout errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Request timeout')
      );
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        Log('backend', 'info', 'test-pkg', 'Test')
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should make async calls properly', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100))
      );

      const startTime = Date.now();
      await Log('backend', 'info', 'test-pkg', 'Async test');
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('API endpoint validation', () => {
    it('should use correct API URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await Log('backend', 'info', 'test-pkg', 'Test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://4.224.186.213/evaluation-service/logs',
        expect.anything()
      );
    });

    it('should use POST method', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await Log('backend', 'info', 'test-pkg', 'Test');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.method).toBe('POST');
    });

    it('should include Content-Type header', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await Log('backend', 'info', 'test-pkg', 'Test');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers['Content-Type']).toBe('application/json');
    });

    it('should include Authorization header', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await Log('backend', 'info', 'test-pkg', 'Test');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.headers.Authorization).toMatch(/^Bearer /);
    });
  });
});
