const http = require("http"); // built-in pakage in nodejs
const fs = require("fs");  // fs module
const url = require("url"); // for url parsing (external module)

const PORT = 8080;

const myServer = http.createServer((req, res) => {
    // console.log("New request recieve");   
    const log = `${Date.now()}: ${req.method} ${req.url} New request Recieved\n` // we can give path using url(url is the userfriendly name for IP address)

    //console.log(myUrl);
    //console.log(req.headers); // headers have some extra imformations(in very big object)
    // res.end("Welcome to my Server!");  //handler which process incoming request

    fs.appendFile('log.txt', log, (err, data) => {
        if (err) {
            console.eoor('Error writing log', err);
            res.end(err);
        }
        const myUrl = url.parse(req.url, true);
        //Here always do non-blocking task, otherwise user have to wait

        //Helper to send response with header
        function sendResponese(statusCode, body, contentType = "text/Plain") {
            res.writeHead(statusCode, {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(body),
                "Date": new Date().toUTCString(),
                "Connection": "close"
            });
            res.end(body);
        }

        //Helper to read request body (JSON expected)
        function readRequestBody(callback) {
            let body = '';
            req.on("data", chunk => { body += chunk; });
            req.on("end", () => {
                try {
                    const parsed = JSON.parse(body);
                    callback(null, parsed);
                }
                catch (e) {
                    callback(e);
                }
            });
        }


        switch (myUrl.pathname) {
            case '/':
                if (req.method === 'GET') {
                    sendResponese(200, "Welcomme to the HomePage");
                }
                break;

            case '/about':
                const username = myUrl.query.myname || "Guest";
                sendResponese(200, `Hey, I am ${username}`);
                break;

            case '/Signup':
                if (req.method === 'GET') {
                    sendResponese(200, 'This is a signUp Form');
                }
                else if (req.method === 'POST') {//Data-base Query
                    readRequestBody((err, data) => {
                        if (err) {
                            sendResponese(400, 'Request Failed');//Invallid JSON
                        }
                        else {
                            sendResponese(200, 'Success');
                        }
                    });

                }
                else {
                    sendResponese(405, "Method Not Allowed");
                }
                break;

            case '/update':
                if (req.method === 'PUT') {
                    res.end('Data Updated Successfully');
                }
                break;

            case '/modify':
                if (req.method === 'PATCH') {
                    res.end("Data modified successfully");
                }
                break;

            case '/delete':
                if (req.method === 'DELETE') {
                    res.end('Data removed Successfully');
                }
                break;

            default:
                res.statusCode = 404; // Set respone status code for not found
                res.end("404 Not Found");
        }

    });

}); // this function create webserver ,its have wo arguments-> request and response

// To run the serevr we need Port number
//Ek port pr ek hi server chal skta he
myServer.listen(8080, () => console.log(`Server Started on port ${PORT}`));


// GET = To get the data from the server
// POST = To send the data to the server
// PUT = When we have to put something in our data(update entire resouce)
// PAtch = when we wants to change/edit
// Delete = when we wnts to delete from DB