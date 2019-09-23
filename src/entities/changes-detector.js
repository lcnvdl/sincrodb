/** @typedef {import("./session")} Session */

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

        let localVersions = null;

        let changes = this._getTableChanges(localVersions, serverVersions);
    }

    _getTableChanges(localVersions, serverVersions) {
        let actions = [];

        localVersions.forEach(l => {
            let s = serverVersions.find(m => m.id === l.id);

        });
    }
}

module.exports = ChangesDetector;