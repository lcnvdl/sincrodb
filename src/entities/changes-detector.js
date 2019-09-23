/** @typedef {import("./session")} Session */

const VersionStatus = require("./version-status.enum");

class ChangesDetector {
    /**
     * @param {Session} session Session
     */
    constructor(session) {
        this._session = session;
    }

    get _communication() {
        return this._session.getCommunication();
    }

    async heavySync() {
        let schemas = this._session.schemas;
        let schemasIds = Object.keys(schemas);

        for (let i = 0; i < schemasIds.length; i++) {
            const schemaId = schemasIds[i];
            const schema = schemas[schemasIds[i]];

            for (let ti = 0; ti < schema.tables.length; ti++) {
                let table = schema.tables[ti];
                await this._heavySyncTable(schemaId, table);
            }
        }
    }

    async _heavySyncTable(schemaId, tableName) {
        let serverVersions = await this._communication.sendAndWait("get-all-versions", table);
        let table = this._session.getDb(schemaId).get(tableName);

        let allEntities = await table.all();
        let versionsManager = this._session.getVersionsManager();
        await versionsManager.updateEntitiesHash(tableName, allEntities);

        let localVersions = await versionsManager.getAll(tableName);

        let changes = this._getTableChanges(localVersions, serverVersions);
        this._apply(changes.local);
        this._applyInServer(changes.server);
    }

    _getTableChanges(localVersions, serverVersions) {
        let local = [];
        let server = [];

        localVersions.forEach(l => {
            let s = serverVersions.find(m => m.id === l.id);
            if (!s) {
                server.push({ action: "create", version: l });
            }
            else if (s.hash !== l.hash) {
                if (l.status === VersionStatus.Deleted && s.status !== l.status) {
                    server.push({ action: "delete", version: l });
                }
                else if (s.status === VersionStatus.Deleted && s.status !== l.status) {
                    local.push({ action: "delete", version: s });
                }
                else if (l.version <= s.version) {
                    local.push({ action: "update", version: s });
                }
                else {
                    server.push({ action: "update", version: l });
                }
            }
        });

        serverVersions.filter(s => !localVersions.some(l => l.id === s.id)).forEach(s => {
            local.push({ action: "create", version: s });
        });

        return { local, server };
    }

    _apply(changes) {
        let modifications = await this._communication.sendAndWait("get-modifications", changes.map(m => ({ id: m.version.id, table: m.version.table })));
        throw new Error("Not implemented");
    }

    _applyInServer(changes) {
        throw new Error("Not implemented");
    }
}

module.exports = ChangesDetector;