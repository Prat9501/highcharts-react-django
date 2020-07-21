const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');

const app = express();
const server = http.Server(app);
const PORT = process.env.PORT || 9000;


app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})