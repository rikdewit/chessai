const express = require('express')
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express()
const port = 3000

app.use(express.static(__dirname + '/public/'))
app.use(express.static('public'));

let io;

if (process.env.NODE_ENV === "development") {
  let port = process.env.PORT || 3000
  let server = app.listen(port, listen);

  function listen() {
    console.log(`Example app listening at: "localhost:${port}"`);
  }
  io = require('socket.io')(server);
}


exports.io = io;