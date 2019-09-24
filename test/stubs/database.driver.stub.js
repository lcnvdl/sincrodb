const DatabaseDriver = require("../../src/database/database.driver");

class DatabaseDriverStub extends DatabaseDriver {
    get(tableName) {
        return {};
    }
}

module.exports = DatabaseDriverStub;