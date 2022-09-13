import * as http from 'http'

const server = http.createServer((req, res) => {
    console.log(req);
    process.send();
});

server.listen(3003);