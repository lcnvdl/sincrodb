const { expect } = require("chai");

describe("sincro-db", () => {
    it("should import fine", () => {
        expect(require("../src/sincro-db")).to.be.ok;
    });
});