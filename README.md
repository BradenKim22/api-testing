# BookBazaar QA Challenge — README

## Track Chosen
API

## Prereqs
- Node 18+
- npm

## How to Run

Install dependencies once:
```
npm install
```

Run all tests:
```
npm test
```


## Endpoints / Mapping

The public mockapi.io:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /books | Returns an array of all books |
| POST | /books | Creates a book. Body: `{ title, author }`. |
| DELETE | /books/:id | Deletes a book by id. Returns 200/204 if deleted, 404 if not found. |

The Book model on mockapi.io:
```json
{
  "id": "1",
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien"
}
```


## Tests Implemented

- **POST /books returns 201 and the created book data** — happy path; sends a valid book and asserts the response status and body match what was sent.
- **GET /books shows the newly created book in the list** — follows up the POST by fetching all books and confirming the new book appears.
- **DELETE /books/:id returns 404 for an id that does not exist** — negative case; sends a delete request for a made-up id and asserts 404.
- **validateBook returns invalid when title is missing** — edge/validation; unit tests the client-side validator with a payload missing the title field.
- **validateBook returns invalid when title is an empty string** — same validator, whitespace-only title.
- **validateBook returns invalid when author is missing** — same validator, missing author.
- **validateBook returns valid when both fields are present** — confirms the happy path of the validator itself.

## Design Rationale

Tests are split into two files: `books.test.js` for integration tests that hit the live API, and `validate.test.js` for unit tests that run in memory. This separation matters because integration tests are slow (network round-trips) and occasionally flaky (the API might be down), while unit tests are instant and always reliable. The `validateBook` helper exists because mockapi.io doesn't enforce required fields — it accepts any payload. Rather than pretend a 400 comes from the mock, the validation logic lives in the client layer and is tested directly there, which is how real apps work anyway. One weakness: the happy-path tests depend on each other (the GET test needs the id from the POST test). Given more time, I'd refactor these into a single atomic test that does POST → GET → cleanup in one `it` block, which would make the dependency explicit and remove the shared state.

## Fallback Instructions

If the mockapi.io endpoint goes down:

1. Install `json-server` globally:
   ```
   npm install -g json-server
   ```

2. Create a `db.json` file in the project root:
   ```json
   { "books": [] }
   ```

3. Start the local mock:
   ```
   json-server --watch db.json --port 3001
   ```

4. Change `BASE_URL` in `tests/books.test.js` from:
   ```
   https://69d2b6e35043d95be97220ac.mockapi.io/book/v1
   ```
   to:
   ```
   http://localhost:3001
   ```

5. Run `npm test` as normal.

`json-server` automatically provides GET, POST, and DELETE on any resource defined in `db.json`, so all three tests will work without any other changes.
