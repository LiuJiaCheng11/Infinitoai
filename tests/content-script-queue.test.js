const test = require('node:test');
const assert = require('node:assert/strict');

const { getContentScriptQueueTimeout } = require('../shared/content-script-queue.js');

test('getContentScriptQueueTimeout disables the ready timeout for TMailor mailbox generation', () => {
  assert.equal(getContentScriptQueueTimeout('tmailor-mail', 'FETCH_TMAILOR_EMAIL'), 0);
});

test('getContentScriptQueueTimeout disables the ready timeout for TMailor inbox polling', () => {
  assert.equal(getContentScriptQueueTimeout('tmailor-mail', 'POLL_EMAIL'), 0);
});

test('getContentScriptQueueTimeout keeps the default timeout for other content scripts', () => {
  assert.equal(getContentScriptQueueTimeout('signup-page', 'EXECUTE_STEP'), 15000);
  assert.equal(getContentScriptQueueTimeout('duck-mail', 'FETCH_DUCK_EMAIL'), 15000);
});
