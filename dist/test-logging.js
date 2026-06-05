"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Test script to verify logging works
const logger_1 = require("./logging_middleware/logger");
async function testLogging() {
    console.log('Testing logging middleware...\n');
    try {
        console.log('Sending test log: "Application initialized"');
        await (0, logger_1.Log)("frontend", "info", "page", "Application initialized");
        console.log('✅ Log sent successfully to API\n');
        console.log('Sending test log: "User session started"');
        await (0, logger_1.Log)("frontend", "info", "auth", "User session started");
        console.log('✅ Log sent successfully\n');
        console.log('Sending test log: "Form validation completed"');
        await (0, logger_1.Log)("frontend", "info", "form", "Form validation completed");
        console.log('✅ Log sent successfully\n');
    }
    catch (err) {
        console.error('❌ Error:', err);
    }
}
testLogging();
//# sourceMappingURL=test-logging.js.map