const { expect } = require("chai");
const VersionsManager = require("../src/entities/versions-manager");
const DbDriverStub = require("./stubs/database.driver.stub");

const db = new DbDriverStub();
/** @type {VersionsManager} */
let entity;

describe("VersionsManager", () => {
    describe("#constructor", () => {
        it("should work fine", () => {
            entity = new VersionsManager(db);
            expect(entity).to.be.ok;
        });
    });

    describe("#getVersion", () => {
        beforeEach(() => {
            entity = new VersionsManager(db);
        });

        it("should generate a new version if it doesn't exists", async () => {
            entity._versions = {
                findOne() {
                    return Promise.resolve(null);
                }
            };

            let version = await entity.getVersion("users", "u1");
            expect(version).to.be.ok;
            expect(version.version).to.equals(0);
        });

        it("should work fine", async () => {
            entity._versions = {
                findOne() {
                    return Promise.resolve({ version: 1 });
                }
            };

            let version = await entity.getVersion("users", "u1");
            expect(version).to.be.ok;
            expect(version.version).to.equals(1);
        });
    });
});