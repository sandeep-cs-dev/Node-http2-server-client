const http2 = require('http2');
const fs = require('fs')
let options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    allowHTTP1: true
}

const server = http2.createSecureServer(options, function(req, res) {

    //console.log("Request Headers:",req.headers);
    let data = [];
    let responseData = {};

    console.log("Request url-->", req.url)
    responseData.requestedpath = req.url
    console.log("Request httpVersion-->", req.httpVersion)
    responseData.httpVersion = req.httpVersion
    console.log("Request method-->", req.method)
    responseData.httpMethod = req.method

    req.on('data', function(chunk) {
        data.push(chunk)
    })
    req.on('end', function() {
       // console.log("Buffer array length", data.length)
        console.log("Request Data-->", Buffer.concat(data).toString());
        //res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.end("<html><body><h1>Hello HTTP2 !</h1></body></html")
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200
        res.end(JSON.stringify(responseData))
    })

})

server.listen(8080, () => {
    console.log(`http2 server running at https://localhost:8080`)
});
server.on('error', (err) => {
    console.error(err)
});