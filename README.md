persona-interceptor
===================

Rest.js interceptor for persona login

__Warning__ - This module is still a work in progress, use at your own risk

## Usage

```js
var persona = require('persona-interceptor');

var client = persona({
  verifyUrl: 'https://verifier.login.persona.org/verify'
  audience: 'http://localhost/'
});

client({
  entity: {
    assertion: 'ASSERTION_RETURNED_FROM_PERSONA_LOGIN'
  }
}).then(function(response){
  // Successful response
}, function(err){
  // Failed response
});
```
