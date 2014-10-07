# TESTING

tooling:
mocha: runner
asserts: chai.assert
routes: supertest to simulate browser
karma: browser-based tests

## Server tests

Unit tests are in the same directory as files being tested.

find server -name "*spec.js" | xargs mocha
DEBUG=pook* mocha server/routes/photos.spec.js

## Browser tests

Unit tests are in test/browser

karma start test/karma.conf.js
