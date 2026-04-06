/**
 * books.test.js
 * 
 * Integration tests for the "BookBazaar" API hosted on mockapi.io
 * 
 * Run with npm test
 * 
 * 1. Happy Path
 * 2. Edge / Validation is in ./validate.test.js
 * 3. Negative / Error Case
 * 
 */

const axios = require('axios');

// Base URL
const BASE_URL = '';

// axios response error extraction
async function safeRequest(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.response) {
      // The server replied with an error status (4xx / 5xx).
      // Return the response object.
      return err.response;
    }
    // Something else went wrong (network, DNS failure, etc.).
    throw err;
  }
}

// 1. Happy Path

// 3. Negative / Error Case