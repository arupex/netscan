/**
 * Created by daniel.irwin on 8/31/16.
 */

describe('netscan', function(){

    var deepEqual = require('assert-diff').deepEqual;

    var netscan = require('../index')();

    it('scan that finds only errors', function(done){

        this.timeout(50000);

        netscan.scan({

            protocol : ['http'],

            octet0: [192],
            octet1: [168],
            octet2: [0],
            octet3: [{min: 100, max: 110}], //range of 7 to 10 inclusive

            ports: [80],

            codes: [200], //only count it if a 200 comes back,

            errors : ['ETIMEDOUT'],

            paths: '', // optional to have it hit a specific endpoint

            headers: {}, // include the following headers in all request so you can do auth or something,

            timeout: 1000 //10 seconds timeout)
        }, function(results){

            deepEqual(results, [{ uri: 'http://192.168.0.100:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.101:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.102:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.103:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.104:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.105:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.106:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.107:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.108:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.109:80', code: 'ETIMEDOUT' },
                { uri: 'http://192.168.0.110:80', code: 'ETIMEDOUT' }]);

            done();
        });

    });

    it('scan that finds none', function(done){
        this.timeout(50000);

        netscan.scan({

            protocol : ['http'],

            octet0: [192],
            octet1: [168],
            octet2: [0],
            octet3: [{min: 100, max: 110}], //range of 7 to 10 inclusive

            ports: [80],

            codes: [200], //only count it if a 200 comes back,

            paths: '', // optional to have it hit a specific endpoint

            headers: {}, // include the following headers in all request so you can do auth or something,

            timeout: 1000 //10 seconds timeout)
        }, function(results){

            deepEqual(results, []);

            done();
        });
    });


    it('scan that finds something good', function (done) {
        this.timeout(10000);

        netscan.scan({

            protocol: ['http'],

            octet0: [192],
            octet1: [168],
            octet2: [1],
            octet3: [{min: 162, max: 163}], //range of 7 to 10 inclusive

            ports: [1337],

            codes: [200], //only count it if a 200 comes back,

            errors: [],

            paths: '/', // optional to have it hit a specific endpoint

            headers: {}, // include the following headers in all request so you can do auth or something,

            timeout: 5000 //10 seconds timeout)
        }, function (results) {

            if(process.env.TRAVIS || process.env.CI) {
                console.log('results', results);
                return done();
            }

            if (results.length === 1) {
                done()
            }
            else {
                done('failed');
            }
        });
    });


    it('high performance scan', function(done){
        this.timeout(500000);

        netscan.scan({

            protocol : ['http'],

            octet0: [192],
            octet1: [168],
            octet2: [1],
            octet3: [{min: 3, max: 163}], //range of 7 to 10 inclusive

            ports: [80, 90, 443, 1337],

            codes: [200, 201, 202, 400, 401, 402, 403], //only count it if a 200 comes back,

            errors : [],

            paths: '/', // optional to have it hit a specific endpoint

            headers: {}, // include the following headers in all request so you can do auth or something,

            timeout: 10000, //10 seconds timeout)

            ignoreResponse : true
        }, function(results){

            console.log('results', results);

            done();
        });
    });

});