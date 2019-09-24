const SocketLayer = require("../../src/sockets/socker-client-layer");

class SocketLayerStub extends SocketLayer {
    constructor() {
        super();
        this.isConnected = false;
        this.url = "";
    }

    get name() {
        return "SocketLayerStub";
    }
    
    connect(url, _timeout) {
        this.isConnected = true;
        this.url = url;
    }

    send(msg) {
    }

    close() {
        this.isConnected = false;
    }
}

module.exports = SocketLayerStub;