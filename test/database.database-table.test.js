const { expect } = require("chai");
const DatabaseTable = require("../src/database/database-table");

describe("DatabaseTable", () => {
    it("constructor should work fine", () => {
        let entity = new DatabaseTable("name");
        expect(entity).to.be.ok;
    });
});