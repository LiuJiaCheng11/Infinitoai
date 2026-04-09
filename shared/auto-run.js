(function(root, factory) {
  const exports = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  root.AutoRun = exports;
})(typeof globalThis !== 'undefined' ? globalThis : self, function() {
  const STOP_ERROR_MESSAGE = 'Flow stopped by user.';
  const AUTO_RUN_HANDOFF_MESSAGE = 'Auto run handed off to manual continuation.';

  function getErrorMessage(error) {
    return typeof error === 'string' ? error : error?.message || '';
  }

  function sanitizeRunCounter(value) {
    const numeric = Number.parseInt(String(value ?? '').trim(), 10);
    if (!Number.isFinite(numeric) || numeric < 0) {
      return 0;
    }
    return numeric;
  }

  function shouldContinueAutoRunAfterError(error) {
    const message = getErrorMessage(error);
    return message !== STOP_ERROR_MESSAGE && message !== AUTO_RUN_HANDOFF_MESSAGE;
  }

  function buildAutoRunStatusPayload({
    phase,
    currentRun,
    totalRuns,
    infiniteMode = false,
    successfulRuns = 0,
    failedRuns = 0,
    summaryMessage = '',
    summaryToast = '',
  }) {
    return {
      phase,
      currentRun,
      totalRuns,
      infiniteMode: Boolean(infiniteMode),
      successfulRuns: sanitizeRunCounter(successfulRuns),
      failedRuns: sanitizeRunCounter(failedRuns),
      summaryMessage,
      summaryToast,
    };
  }

  function summarizeAutoRunResult({
    totalRuns,
    successfulRuns,
    failedRuns,
    lastAttemptedRun,
    stopRequested,
    handedOffToManual,
    infiniteMode = false,
  }) {
    if (handedOffToManual) {
      return {
        phase: 'stopped',
        message: '=== Auto run paused and handed off to manual continuation ===',
        toastMessage: '',
      };
    }

    if (stopRequested) {
      const completedRunsBeforeStop = Math.max(0, lastAttemptedRun - 1);
      if (infiniteMode) {
        return {
          phase: 'stopped',
          message: `=== Infinite auto run stopped after ${completedRunsBeforeStop} runs (${successfulRuns} succeeded, ${failedRuns} failed) ===`,
          toastMessage: `无限自动运行已停止：成功 ${successfulRuns} 次，失败 ${failedRuns} 次`,
        };
      }
      return {
        phase: 'stopped',
        message: `=== Stopped after ${completedRunsBeforeStop}/${totalRuns} runs (${successfulRuns} succeeded, ${failedRuns} failed) ===`,
        toastMessage: `自动运行已停止：成功 ${successfulRuns} 次，失败 ${failedRuns} 次`,
      };
    }

    return {
      phase: 'complete',
      message: `=== Auto run finished: ${successfulRuns} succeeded, ${failedRuns} failed, ${totalRuns} total ===`,
      toastMessage: `自动运行完成：成功 ${successfulRuns} 次，失败 ${failedRuns} 次`,
    };
  }

  return {
    buildAutoRunStatusPayload,
    shouldContinueAutoRunAfterError,
    summarizeAutoRunResult,
  };
});
