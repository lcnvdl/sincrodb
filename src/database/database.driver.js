const DatabaseTable = require("./database-table");

class DatabaseDriver {
    connect(url) {
        return Promise.reject("Not implemented");
    }

    get(tableName) {
        return new DatabaseTable(tableName);
    }
}

module.exports = DatabaseDriver;