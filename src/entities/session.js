/** @typedef {import("./connection-data")} ConnectionData */
/** @typedef {import("../sockets/socker-client-layer")} SocketClientLayer */
/** @typedef {import("../entities/versions-manager")} VersionsManager */
/** @typedef {import("../database/database.driver")} DatabaseDriver */

const EventEmitter = require("events");

class Session {
    /**
     * @param {ConnectionData} connectionData Connection data
     * @param {SocketClientLayer} socketLayer Socket layer
     */
    constructor(connectionData, socketLayer) {
        this._emitter = new EventEmitter();
        this._connectionData = connectionData;
        this._socketLayer = socketLayer;
        this._schemas = {};
        this._schemasConnections = {};
        this._dbDrivers = {};

        this._connect();
    }

    get schemas() {
        return JSON.parse(JSON.stringify(this._schemas));
    }

    /**
     * @param {string} id Id
     * @param {string} driverId Driver ID
     * @param {any} schema Schema
     */
    addSchema(id, schema, driverId) {
        this._schemas[id] = schema;
        this._schemasConnections[id] = driverId;
        return this;
    }

    addDbDriver(id, driver) {
        this._dbDrivers[id] = driver;
    }

    /**
     * @param {string} id Schema ID
     * @returns {DatabaseDriver}
     */
    getDb(id) {
        return this._dbDrivers[this._schemasConnections[id]];
    }

    /**
     * @returns 
     */
    getCommunication() {
        throw new Error("Not implemented");
    }

    /**
     * @returns {VersionsManager} VersionsManager
     */
    getVersionsManager() {
        throw new Error("Not implemented");
    }

    _connect() {
        this._socketLayer.onConnect(() => {
        });

        this._socketLayer.connect(this._connectionData.protocol + "://" + this._connectionData.url);
    }
}

module.exports = Session;