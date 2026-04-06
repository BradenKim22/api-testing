/**
 * validateBook
 *
 * Validates a book object before it would be sent to the API.
 *
 * Returns { valid: true } if the book is valid.
 * Returns { valid: false, error: '<reason>' } if it is not.
 */
function validateBook(book) {
  if (!book || typeof book !== 'object') {
    return { valid: false, error: 'book must be an object' };
  }

  if (!book.title || book.title.trim() === '') {
    return { valid: false, error: 'title is required' };
  }

  if (!book.author || book.author.trim() === '') {
    return { valid: false, error: 'author is required' };
  }

  return { valid: true };
}

module.exports = validateBook;
