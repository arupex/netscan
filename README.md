# netscan
a pure javascript - ip and port scanner

[![npm version](https://badge.fury.io/js/netscan.svg)](https://badge.fury.io/js/netscan) [![dependencies](https://david-dm.org/arupex/netscan.svg)](http://github.com/arupex/netscan) ![Build Status](https://api.travis-ci.org/arupex/netscan.svg?branch=master) <a href='https://pledgie.com/campaigns/31873'><img alt='Pledge To Arupex!' src='https://pledgie.com/campaigns/31873.png?skin_name=chrome' border='0' ></a> ![lifetimeDownloadCount](https://img.shields.io/npm/dt/netscan.svg?maxAge=2592000)


Install:

    npm install netscan --save


Usage:

  octets / ports / codes can be represented any number of ways

    [{ min : 7, max : 8 },{ min : 9, max : 10 }]

    { min : 7, max : 10 }

    [7, 8, 9, 10]

    7

Code :

    var scanner = new require('netscan')(); //may eventually take in options

    // this would scan ip in the range of 192.168.1.[3-163]
    // with ports of [80, 90, 443, 1337]
    // and accept response codes of [200, 201, 202, 400, 401, 402, 403]

    scanner.scan({

        protocol : ['http'],

        octet0: [192],
        octet1: [168],
        octet2: [1],
        octet3: [{min: 3, max: 163}], //range of 7 to 10 inclusive

        ports: [80, 90, 443, 1337],

        codes: [200, 201, 202, 400, 401, 402, 403], //only count it if a 200 comes back,

        errors : [], //like 'ETIMEDOUT'

        paths: '/' || [string], // optional to have it hit a specific endpoint

        headers: {}, // include the following headers in all request so you can do auth or something,

        timeout: 10000, //10 seconds timeout)

        ignoreResponse : true //tells it to not return the body as part of the results


    }, function callback(results){

      /*
        results will contain response
        {
          uri : string,
          code : httpResponseCode ie. [200],
          body : httpResponseBody
        }

      */
    });
