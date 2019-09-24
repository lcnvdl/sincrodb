const { expect } = require("chai");
const VersionsManager = require("../src/entities/versions-manager");
const DbDriverStub = require("./stubs/database.driver.stub");

const db = new DbDriverStub();

describe("VersionsManager", () => {
    it("constructor should work fine", () => {
        let entity = new VersionsManager(db);
        expect(entity).to.be.ok;
    });
});