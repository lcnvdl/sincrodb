const SocketClientLayer = require("./socket-client-layer");

const connectToServer = require("socket.io-client");

class ClientSocketIOLayer extends SocketClientLayer {

    constructor() {
        super();
        this.socket = null;
    }

    get name() {
        return "client socket.io layer";
    }

    connect(url) {
        let p = new Promise((resolve, reject) => {
            let socket = new connectToServer(url);

            socket.once("connect", () => {
                this._attach(socket);
                this.triggerOnConnect(socket);
                resolve();
            });
        });

        return p;
    }

    send(msg) {
        this.socket.emit("message", msg);
    }

    close() {
        this.socket.close();
        this.socket = null;
    }

    _attach(socket) {

        this.socket = socket;

        socket.on("connect", () => {
            this.triggerOnConnect(this.socket);
        });

        socket.on("reconnect", () => {
            this.triggerOnReconnect(this.socket);
        });

        socket.on("message", msg => {
            if (msg) {
                this.triggerOnMessage(msg);
            }
        });

        socket.on("disconnect", () => {
            this.triggerOnClose();
        });
    }
}

module.exports = ClientSocketIOLayer;
