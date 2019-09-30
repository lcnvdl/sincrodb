/** @typedef {import("./connection-data")} ConnectionData */
/** @typedef {import("../sockets/socker-client-layer")} SocketClientLayer */
/** @typedef {import("../database/database.driver")} DatabaseDriver */

const EventEmitter = require("events");
const Communication = require("../protocols/communication");
const VersionsManager = require("../entities/versions-manager");

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
        this._communication = null;

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
     * @returns {DatabaseDriver} DatabaseDriver
     */
    getDb(id) {
        return this._dbDrivers[this._schemasConnections[id]];
    }

    /**
     * @returns {Communication} Communication
     */
    get communication() {
        if (this._communication === null) {
            this._communication = new Communication(this._socketLayer);
        }

        return this._communication;
    }

    /**
     * @param {string} id Schema ID
     * @returns {VersionsManager} VersionsManager
     */
    getVersionsManager(id) {
        if (!id) {
            throw new Error("Schema ID is required");
        }

        return new VersionsManager(this.getDb(id));
    }

    _connect() {
        this._socketLayer.connect(this._connectionData.protocol + "://" + this._connectionData.url);
    }
}

module.exports = Session;