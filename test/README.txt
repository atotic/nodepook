# TESTING

## Tooling
mocha: runner
asserts: chai.assert
routes: supertest to simulate browser

## Server tests

Unit tests are in the same directory as files being tested.

find server -name "*spec.js" | xargs mocha # run all tests
DEBUG=pook* mocha server/routes/photos.spec.js # run one test

## Browser tests

Using Polymer's test runner

Unit tests are in browser/tests/

test by going to http://localhost:3000/test/index.html
