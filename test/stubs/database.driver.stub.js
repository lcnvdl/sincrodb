const DatabaseDriver = require("../../src/database/database.driver");
const DatabaseTable = require("./database-table.stub");

class DatabaseDriverStub extends DatabaseDriver {
    constructor(tables) {
        super();
        this.tables = tables || {};
        this.url = null;
    }

    connect(url) {
        this.url = url;
    }

    get(tableName) {
        return this.tables[tableName] || (this.tables[tableName] = new DatabaseTable(tableName));
    }
}

module.exports = DatabaseDriverStub;