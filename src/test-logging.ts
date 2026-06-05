// Test script to verify logging works
import { Log } from './logging_middleware/logger';

async function testLogging() {
  console.log('Testing logging middleware...\n');

  try {
    console.log('Sending test log: "Application initialized"');
    await Log(
      "frontend",
      "info",
      "page",
      "Application initialized"
    );
    console.log('✅ Log sent successfully to API\n');
    
    console.log('Sending test log: "User session started"');
    await Log(
      "frontend",
      "info",
      "auth",
      "User session started"
    );
    console.log('✅ Log sent successfully\n');

    console.log('Sending test log: "Form validation completed"');
    await Log(
      "frontend",
      "info",
      "form",
      "Form validation completed"
    );
    console.log('✅ Log sent successfully\n');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testLogging();
