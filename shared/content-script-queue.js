(function(root, factory) {
  const exports = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  root.ContentScriptQueue = exports;
})(typeof globalThis !== 'undefined' ? globalThis : self, function() {
  function getContentScriptQueueTimeout(source, messageType) {
    const normalizedSource = String(source || '').trim();
    const normalizedType = String(messageType || '').trim();

    if (normalizedSource === 'tmailor-mail') {
      if (normalizedType === 'FETCH_TMAILOR_EMAIL') {
        return 0;
      }
      if (normalizedType === 'POLL_EMAIL') {
        return 0;
      }
      return 0;
    }

    return 15000;
  }

  return {
    getContentScriptQueueTimeout,
  };
});
