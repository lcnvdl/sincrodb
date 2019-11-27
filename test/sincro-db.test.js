const { expect } = require("chai");
const SincroDB = require("../src/sincro-db");
const SocketClientLayerStub = require("./stubs/socket-client-layer.stub");

describe("sincro-db", () => {
    beforeEach(() => {
        output = {};
        SincroDB.configure({ SocketClientLayer: SocketClientLayerStub });
    });

    it("create session should fail if protocol is not valid", () => {
        let error = null;

        try {
            SincroDB.createSession("http://www.google.com");
        }
        catch (err) {
            error = err;
        }

        expect(error).to.be.ok;
    });

    it("create session should work fine", () => {
        let session = SincroDB.createSession("sincrodb://www.google.com");
        expect(session).to.be.ok;
    });
});