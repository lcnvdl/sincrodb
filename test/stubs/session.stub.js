const DatabaseDriverStub = require("./database.driver.stub");

class SessionStub {
    constructor() {
        this.schemas = {};
        this.communication = null;
    }

    /**
     * @param {string} id Id
     * @param {string} driverId Driver ID
     * @param {any} schema Schema
     */
    addSchema(id, schema, driverId) {
        this.schemas[id] = schema;
        return this;
    }

    getDb() {
        return new DatabaseDriverStub();
    }
}

module.exports = SessionStub;