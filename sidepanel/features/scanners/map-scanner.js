/* Map scan queue. The DOM scanner implementation remains available as scanMapNow. */

function scanMap(scope = 'all') {
  const task = scanMapQueue.then(() => scanMapNow(scope));
  scanMapQueue = task.catch((error) => {
    logActionError(error?.message || 'Quét Map gặp lỗi không xác định.');
    return false;
  });
  return task;
}
