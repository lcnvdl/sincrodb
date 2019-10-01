const { expect } = require("chai");
const ChangesDetector = require("../src/entities/changes-detector");
const SocketLayerStub = require("./stubs/socket-layer.stub");
const SessionStub = require("./stubs/session.stub");
const Session = require("../src/entities/session");
const DatabaseDriverStub = require("./stubs/database.driver.stub");
const ConnectionData = require("../src/entities/connection-data");
const VersionStatus = require("../src/entities/version-status.enum");

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
            let schema = { tables: ["users"] };

            session._communication = emptyServerCommunication();

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

        it("table with one deleted and two created should report two changes", async () => {
            let schema = { tables: ["users"] };

            let saveCalls = 0;

            session._communication = emptyServerCommunication();

            session.addSchema("s1", schema, "test");

            driver.tables["users"] = {
                all: () => Promise.resolve([
                    { id: "1", name: "User 1" },
                    { id: "3", name: "User 3" }
                ])
            };

            driver.tables["versions"] = {
                findAll: () => Promise.resolve([
                    { id: "1", version: 1, hash: "301f1fb7c28a67bcf51161bec1963bdec3ee3a2b9b6386b73557f66203ca4b0a", status: VersionStatus.NotSynchronized },
                    { id: "2", version: 2, hash: "0", status: VersionStatus.Deleted },
                    { id: "3", version: 3, hash: "cd8d517341e31cfd22f310a8a67ef66f84a5ad00aec89539075d60f9aad3fc67", status: VersionStatus.NotSynchronized }
                ]),
                save: (a, b) => {
                    onSave(a, b);
                    Promise.resolve();
                }
            };

            let result = await detector.heavySync(false);

            function onSave(a, b) {
                ++saveCalls;
            }

            expect(saveCalls).to.equal(0);

            expect(result).to.be.ok;
            expect(1).to.equal(result.length);
            expect(0).to.equal(result[0].local.length);
            expect(2).to.equal(result[0].server.length);
            expect("create").to.equal(result[0].server[0].action);
            expect("create").to.equal(result[0].server[1].action);
        });
    });
});

function emptyServerCommunication() {
    return {
        sendAndWait(a, b) {
            if (a === "get-all-versions") {
                return Promise.resolve([]);
            }
            console.log([a, b]);
            return Promise.resolve();
        }
    };
}