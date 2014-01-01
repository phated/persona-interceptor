(function(define){
  'use strict';

  define(function(require){

    var when = require('when');
    var rest = require('rest');
    var interceptor = require('rest/interceptor');
    var mime = require('rest/interceptor/mime');
    var errorCode = require('rest/interceptor/errorCode');

    var defaultClient = rest
      .chain(mime, { mime: 'application/json' })
      .chain(errorCode);

    function onInit(config){
      config.verifyUrl = config.verifyUrl || 'https://verifier.login.persona.org/verify';
      config.audience = config.audience || 'http://localhost/';
      return config;
    }

    function onRequest(request, config){
      request.path = config.verifyUrl;
      request.method = 'POST';

      var entity = request.entity || (request.entity = {});
      entity.assertion = entity.assertion || '';
      entity.audience = entity.audience || config.audience;

      var headers = request.headers || (request.headers = {});
      headers['Content-Length'] = JSON.stringify(entity).length;
      return request;
    }

    function onSuccess(response){
      var entity = response.entity;
      if(!entity || typeof entity !== 'object'){
        return when.reject(new Error(entity));
      }

      if(entity.status !== 'okay'){
        return when.reject(new Error(entity.reason));
      }

      // give the entity back (avoid entity interceptor)
      return entity;
    }

    function onError(response){
      // TODO: check that this works against an error code sent from persona
      return when.reject(new Error(response.entity.reason));
    }

    var persona = interceptor({
      client: defaultClient,
      init: onInit,
      request: onRequest,
      success: onSuccess,
      error: onError
    });

    return persona;

  });

}(
  typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
  // Boilerplate for AMD and Node
));
