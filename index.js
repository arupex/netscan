/**
 * Created by daniel.irwin on 8/31/16.
 */

module.exports = (function(){

    var request = require('request');

    var util = require('./util');

    return function scanner(){


        function scan(opts, callback){

            var cleanupScanOpts = util.cleanupScanOpts(opts);
            var uris = util.generateURIs(cleanupScanOpts);

            var codesArray = cleanupScanOpts.codes && Array.isArray(cleanupScanOpts.codes);

            var promises = [];

            uris.forEach(function(uri) {

                //console.log('uri', uri);

                promises.push(new Promise(function(resolve){


                    //console.log('uri', uri);
                    request(uri, {
                        agent: false,
                        pool: false,
                        forever: true,
                        time: true,
                        headers: cleanupScanOpts.headers,
                        auth: cleanupScanOpts.auth,
                        timeout: cleanupScanOpts.timeout
                    }, function httpResponse(err, resp, body) {

                        if (!err) {
                            if ((codesArray && cleanupScanOpts.codes.indexOf(resp.statusCode) > -1) || (!codesArray)) {
                                return resolve({
                                    uri: uri,
                                    code: resp.statusCode,
                                    body: cleanupScanOpts.ignoreResponse?undefined:body,
                                    elapsed: resp.elapsedTime
                                });
                            }
                        }
                        else {
                            if (Array.isArray(cleanupScanOpts.errors) && cleanupScanOpts.errors.indexOf(err.code) > -1) {
                                return resolve({
                                    uri: uri,
                                    code: err.code
                                });
                            }
                        }
                        resolve(undefined);

                    });

                }));

            });

            Promise.all(promises).then(function(responses){

                callback(responses.filter(function(resp){
                    return resp;//truthy
                }));

            });

        }

        return {
            scan : scan
        };
    };

})();