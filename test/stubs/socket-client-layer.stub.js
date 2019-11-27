const SocketClientLayer = require("../../src/sockets/socker-client-layer");

class SocketClientLayerStub extends SocketClientLayer {
    constructor() {
        super();
        this.$ = {};
    }

    connect(url, timeout) {
        this.$.connect = { url, timeout };
        return Promise.resolve();
    }
}

module.exports = SocketClientLayerStub;