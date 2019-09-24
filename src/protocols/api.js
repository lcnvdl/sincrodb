class Api {
    constructor(session) {
        this._session = session;
    }

    get _communication() {
        return this._session.communication;
    }

    /**
     * @param {string} tableName Table name
     */
    async getAllVersions(tableName) {
        return await this._communication.sendAndWait("get-all-versions", tableName);
    }

    async getModifications(currentStatus) {
        return await this._communication.sendAndWait("get-modifications", currentStatus);
    }
}

module.exports = Api;