/** @typedef {import("./session")} Session */

const VersionStatus = require("./version-status.enum");
const Api = require("../protocols/api");

class ChangesDetector {
    /**
     * @param {Session} session Session
     */
    constructor(session) {
        this._session = session;
        this._api = new Api(session);
    }

    async heavySync(applyChanges) {
        let schemas = this._session.schemas;
        let schemasIds = Object.keys(schemas);
        let allChanges = [];

        if (typeof applyChanges === "undefined") {
            applyChanges = true;
        }

        for (let i = 0; i < schemasIds.length; i++) {
            const schemaId = schemasIds[i];
            const schema = schemas[schemasIds[i]];

            for (let ti = 0; ti < schema.tables.length; ti++) {
                const table = schema.tables[ti];
                const changes = await this._heavySyncTable(schemaId, table, applyChanges);
                allChanges.push(changes);
            }
        }

        return allChanges;
    }

    async _heavySyncTable(schemaId, tableName, applyChanges) {
        let serverVersions = await this._api.getAllVersions(tableName);
        let table = this._session.getDb(schemaId).get(tableName);

        let allEntities = await table.all();
        let versionsManager = this._session.getVersionsManager(schemaId);
        await versionsManager.updateEntitiesHash(tableName, allEntities);

        let localVersions = await versionsManager.getAll(tableName);

        let changes = this._getTableChanges(localVersions, serverVersions);

        if (applyChanges) {
            this._apply(changes.local);
            this._applyInServer(changes.server);
        }

        return changes;
    }

    _getTableChanges(localVersions, serverVersions) {
        let local = [];
        let server = [];

        localVersions.forEach(l => {
            let s = serverVersions.find(m => m.id === l.id);
            if (!s) {
                if (l.status !== VersionStatus.Deleted) {
                    server.push({ action: "create", version: l });
                }
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

    async _apply(changes) {
        if (changes.length === 0) {
            return;
        }

        const currentStatus = changes.map(m => ({ id: m.version.id, table: m.version.table }));
        const modifications = await this._api.getModifications(currentStatus);
        throw new Error("Not implemented");
    }

    _applyInServer(changes) {
        if (changes.length === 0) {
            return;
        }

        throw new Error("Not implemented");
    }
}

module.exports = ChangesDetector;