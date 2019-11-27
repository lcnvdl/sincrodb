const { expect } = require("chai");
const ProtocolV1 = require("../src/protocols/protocol-v1");

/** @type {SocketLayerStub} */
let socket = null;

describe("Protocol V1", () => {
    it("should process base64 messages", () => {
        let msg = ProtocolV1.prepare("tst", { value: true });
        let { cmd, msgID, data } = ProtocolV1.parse(msg);
        expect(msgID).to.be.undefined;
        expect(cmd).to.equals("tst");
        expect(data.value).to.be.true;
    });

    it("should fail if package is invalid", () => {
        let error;

        try {
            ProtocolV1.parse("hola mundo");
        }
        catch (err) {
            error = err;
        }

        expect(error).to.be.ok;
    });
});