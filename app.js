'use strict';

var http = require('http')
var bbhttpserver = require('bb-http-server')

const port = 8080
const address = '127.0.0.1'

/*/
bbhttpserver.run(__dirname, port, address)
/*/
// This equals 'run'; Use more low-level api.
var responder = bbhttpserver.createResponder(__dirname)
http.createServer((req, res) => {
  var body = []
  req.on('error', (err) => {
    console.log(err)
  }).on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    responder.respond(req, res, body)
  })
}).listen(port, address)
//*/

console.log('Available on:')
console.log(`  http://${address}:${port}/`)
