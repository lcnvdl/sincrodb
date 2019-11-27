/* istanbul ignore file */

class DatabaseTable {
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {*} query Query
     * @returns {Promise<*>} Result
     */
    findOne(query) {
        return Promise.reject("Not implemented");
    }

    /**
     * @param {*} query Query
     * @returns {Promise<[]>} Result
     */
    findAll(query) {
        return Promise.reject("Not implemented");
    }

    /**
     * @returns {Promise<[]>} Result
     */
    all() {
        return Promise.reject("Not implemented");
    }

    /**
     * @returns {Promise<*>} Result
     */
    save(entity, query) {
        return Promise.reject("Not implemented");
    }
}

module.exports = DatabaseTable;