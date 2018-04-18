# willful
A Fetch wrapper with retry strategies

## Installation
`npm install willful --save`

## Example
```javascript
const willful = require('willful');

const reponse = await willful(url, {
    maxRetry: 3,
    retryDelay: 1000,
    retryStrategy: 'backoff'
});
```

Second parameter is optional. Default values are:
 - maxRetry: 3
 - retryDelay: 1000
 - retryStrategy: 'default'

The default `retryStrategy` retry the http call after `retryDelay` millisecond
