/**
 * validate.test.js
 *
 * Unit tests for the validateBook helper (src/validateBook.js).
 *
 * mockapi.io is a permissive mock service — it accepts any POST body
 * and does not return 400 for missing fields.
 *
 * #2: Edge / Validation.
 */

const validateBook = require('../src/validateBook');

describe('Edge / Validation — validateBook helper', () => {
  it('returns invalid when title is missing', () => {
    const result = validateBook({ author: 'J. R. R. Tolkien' });

    expect(result.valid).toBe(false);
    // .toMatch checks that the string contains a pattern (case-insensitive here)
    expect(result.error).toMatch(/title/i);
  });

  it('returns invalid when title is an empty string', () => {
    const result = validateBook({ title: '   ', author: 'J. R. R. Tolkien' });

    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/title/i);
  });

  it('returns invalid when author is missing', () => {
    const result = validateBook({ title: 'The Hobbit' });

    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/author/i);
  });

  it('returns valid when both title and author are present', () => {
    const result = validateBook({ title: 'The Hobbit', author: 'J. R. R. Tolkien' });

    expect(result.valid).toBe(true);
    // When valid, there should be no error message
    expect(result.error).toBeUndefined();
  });
});