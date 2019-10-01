const { expect } = require("chai");
const ChangesDetector = require("../src/entities/changes-detector");
const SocketLayerStub = require("./stubs/socket-layer.stub");
const SessionStub = require("./stubs/session.stub");
const Session = require("../src/entities/session");
const DatabaseDriverStub = require("./stubs/database.driver.stub");
const ConnectionData = require("../src/entities/connection-data");

describe("ChangesDetector", () => {
    describe("#constructor", () => {
        it("constructor should work fine", () => {
            let session = new SessionStub();
            let entity = new ChangesDetector(session);
            expect(entity).to.be.ok;
        });
    });

    describe("#heavySync - read only", () => {
        let session;
        let detector;
        let driver;
        let socket;

        beforeEach(() => {
            const cdata = new ConnectionData();

            socket = new SocketLayerStub();
            driver = new DatabaseDriverStub();
            session = new Session(cdata, socket);
            detector = new ChangesDetector(session);

            session.addDbDriver("test", driver);
        });

        it("should return an empty list if session doesn't have schemas", async () => {
            let result = await detector.heavySync();
            expect(result).to.be.ok;
            expect(0).to.equal(result.length);
        });

        it("empty table should not report changes", async () => {
            let schema = {
                tables: ["users"]
            };

            session._communication = {
                sendAndWait(a, b) {
                    if (a === "get-all-versions") {
                        return Promise.resolve([]);
                    }
                    console.log([a, b]);
                    return Promise.resolve();
                }
            };

            session.addSchema("s1", schema, "test");

            driver.tables["users"] = {
                all: () => Promise.resolve([])
            };

            driver.tables["versions"] = {
                findAll: () => Promise.resolve([])
            };

            let result = await detector.heavySync(false);
            expect(result).to.be.ok;
            expect(1).to.equal(result.length);
            expect(0).to.equal(result[0].local.length);
            expect(0).to.equal(result[0].server.length);
        });
    });
});