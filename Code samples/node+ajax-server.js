var http = require('http');

http.createServer( function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    if(request.url === '/')
    {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('<h1>Hello World</h1>');
    }

 }).listen(8000);