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
 */

const axios = require('axios');

// Base URL
const BASE_URL = 'https://69d2b6e35043d95be97220ac.mockapi.io/book/v1';

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
};

// 1. Happy Path
describe('Happy path — create and retrieve a book', () => {
  // Store the id so we can delete the book after the test finishes.
  let createdBookId;

  it('POST /books returns 201 and the created book data', async () => {
    const newBook = { title: 'The Hobbit', author: 'J. R. R. Tolkien' };

    const response = await axios.post(`${BASE_URL}/books`, newBook);

    // 201 = "Created"
    expect(response.status).toBe(201);

    // The API should echo back the data and id
    expect(response.data.title).toBe(newBook.title);
    expect(response.data.author).toBe(newBook.author);
    expect(response.data.id).toBeDefined();

    createdBookId = response.data.id;
  });

  it('GET /books shows the newly created book in the list', async () => {
    // We need createdBookId from the test above.
    // If the POST test failed, this test should also fail.
    expect(createdBookId).toBeDefined();

    const response = await axios.get(`${BASE_URL}/books`);

    // 200 = "OK"
    expect(response.status).toBe(200);

    // mockapi returns an array — we check it's actually an array
    expect(Array.isArray(response.data)).toBe(true);

    // Find the specific book in the list by the id from POSTed
    const found = response.data.find((book) => book.id === createdBookId);
    expect(found).toBeDefined();
    expect(found.title).toBe('The Hobbit');
    expect(found.author).toBe('J. R. R. Tolkien');
  });

  // "afterAll runs once after all tests in this describe block finish."
  // Clean up the created book.
  afterAll(async () => {
    if (createdBookId) {
      await safeRequest(() =>
        axios.delete(`${BASE_URL}/books/${createdBookId}`)
      );
    }
  });
});


// 3. Negative / Error Case
describe('Negative — delete a non-existent book', () => {
  it('DELETE /books/:id returns 404 for an id that does not exist', async () => {
    // "nonexistent-id-xyz" should never match a record.
    const response = await safeRequest(() =>
      axios.delete(`${BASE_URL}/books/nonexistent-id-xyz`)
    );

    // 404 = "Not Found"
    expect(response.status).toBe(404);
  });
});