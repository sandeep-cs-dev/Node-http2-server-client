const http2 = require('http2');
const fs = require('fs')
let res = [];
let postbody = JSON.stringify({
    message: "http2 client"
});
let baseurl = 'https://localhost:8080'
let path = '/'
let options = {
    ca: fs.readFileSync('server.crt'),
    rejectUnauthorized: false
}
const client = http2.connect(baseurl, options);

const req = client.request({
    ":method": "POST",
    ":path": path,
    "content-type": "application/json",
    "content-length": Buffer.byteLength(postbody),
});


client.on('error', (err) => console.error("error", err));

//console.log ("===================",req);

req.on("response", (headers, flags) => {
    console.log("============Response headers==============")
    for (const name in headers) {
        console.log(`-->  ${name}: ${headers[name]}`);
    }

});
req.on("data", chunk => {
    res.push(chunk);
});
req.on("end", () => {
    console.log("============Server Response==============)")
    console.log(Buffer.concat(res).toString())
    client.close();
});

req.write(postbody);
req.end()