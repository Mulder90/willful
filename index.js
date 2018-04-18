const fetch = require('isomorphic-fetch');

const willful = (url, options = {}) => {
  const {
    maxRetry = 3,
    retryDelay = 1000,
    retryStrategy = 'default'
  } = options;

  const acceptedStatusCodes = /(2|3){1}[0-9]{1}[0-9]{1}/;
  const retryStatusCodes = /(5){1}[0-9]{1}[0-9]{1}/

  const retryStrategies = {
    default: _ => retryDelay,
    backoff: attempts => Math.pow(2, attempts) * retryDelay
  };

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const _willful = () => {
      attempts += 1;
      fetch(url, options)
        .then(response => {
          if (acceptedStatusCodes.test(response.status)) {
            resolve(response);
          } else {
            if (retryStatusCodes.test(response.status)) {
              setTimeout(_willful, retryStrategies[retryStrategy](attempts));
            } else {
              reject(
                new Error(`Request failed with status code ${response.status}`)
              );
            }
          }
        })
        .catch(error => {
          if (attempts < maxRetry) {
            setTimeout(_willful, retryStrategies[retryStrategy](attempts));
          } else {
            reject(
              new Error(`Willful failed after ${maxRetry} attempts: ${error}`)
            );
          }
        });
    };

    _willful();
  });
};

module.exports = willful;
