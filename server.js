//import http, file system and url modules
const http = require('http'),
url = require('url'),
fs = require('fs');

//create server
http.createServer((request, response) => {
    
    let addr = request.url, //set variable for requested url
    q = new URL(addr, 'http://' + request.headers.host), //create new URL
    filePath = ''; //set filepath varible for redirect

    //implement logging on request
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {

        if (err) {
            console.log(err);
        } else {
            console.log('Log entry added!')
        }
    })

    //requested page redirect
    if (q.pathname.includes('documentation')) {
        filePath = __dirname + '/documentation.html' //if documentation is requested then route to documentation html
    } else {
        filePath = __dirname + '/index.html' //open index.html if requested file does nto exist
    }

    fs.readFile (filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead (200, {'Content-Type': + 'text/html'});
        response.write (data);
        response.end()
    })



}).listen(8080);
console.log('Sever running!');