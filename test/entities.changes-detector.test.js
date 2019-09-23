const { expect } = require("chai");
const ChangesDetector = require("../src/entities/changes-detector");
const SessionStub = require("./stubs/session.stub");

describe("ChangesDetector", () => {
    it("constructor should work fine", () => {
        let session = new SessionStub();
        let entity = new ChangesDetector(session);
        expect(entity).to.be.ok;
    });
});