const refetch = (url, options = {}) => {
  const {
    maxRetry = 3,
    retryDelay = 1000,
    retryStrategy = 'default'
  } = options;

  const acceptedStatusCodes = /(2|3){1}[0-9]{1}[0-9]{1}/;

  const retryStrategies = {
    default: _ => retryDelay,
    backoff: attempts => Math.pow(2, attempts) * retryDelay
  };

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const _refetch = () => {
      attempts += 1;
      fetch(url, options)
        .then(response => {
          if (acceptedStatusCodes.test(response.status)) {
            resolve(response);
          } else {
            reject(
              new Error(`Request failed with status code ${response.status}`)
            );
          }
        })
        .catch(error => {
          if (attempts < maxRetry) {
            setTimeout(_refetch, retryStrategies[retryStrategy](attempts));
          } else {
            reject(
              new Error(`Refetch failed after ${maxRetry} attempts: ${error}`)
            );
          }
        });
    };

    _refetch();
  });
};

module.exports = refetch;
