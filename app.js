"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ax25_server_1 = require("./app/server/ax25-server");
var server = new ax25_server_1.Ax25Server("F5LGJ", 5, {
    endOfLine: "\r",
});
