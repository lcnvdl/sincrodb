/** @typedef {import("../database/database.driver")} DatabaseDriver */

const SHA256 = require("crypto-js/sha256");
const VersionStatus = require("../entities/version-status.enum");

class VersionsManager {
    /**
     * @param {DatabaseDriver} databaseDriver Driver
     */
    constructor(databaseDriver) {
        if (!databaseDriver) {
            throw new Error("Database driver is required");
        }

        this._db = databaseDriver;
        this._versions = this._db.get("versions");
    }

    _calculateHash(entity) {
        let entityJson = JSON.stringify(entity);
        return SHA256(entityJson).toString();
    }

    async getAll(table) {
        return await this._versions.findAll({ table });
    }

    async getVersion(table, id) {
        let version = await this._versions.findOne({ id, table });
        if (!version) {
            return { id, table, version: 0, hash: "", status: VersionStatus.NotSynchronized };
        }

        return version;
    }

    async markAsDeleted(table, id) {
        let version = await this._versions.findOne({ id, table });

        if (version.status !== VersionStatus.Deleted) {
            this._markVersionAsDeleted(version);
            await this._versions.save(version, { id, table });
        }
    }

    async updateEntitiesHash(table, all) {
        let allVersions = await this._versions.findAll({
            $and: [{ table }, { $neq: { status: VersionStatus.Deleted } }]
        });

        for (let i = 0; i < allVersions.length; i++) {
            let version = allVersions[i];
            let entity = all.find(m => m.id === version.id);

            if (!entity) {
                if (version.status !== VersionStatus.Deleted) {
                    this._markVersionAsDeleted(version);
                    await this._versions.save(version, { id: version.id, table: version.table });
                }
            }
            else {
                let hash = this._calculateHash(entity);
                if (version.hash !== hash && version.status !== VersionStatus.Deleted) {
                    this._changeVersionHash(version, hash);
                    await this._versions.save(version, { id: version.id, table: version.table });
                }
            }
        }

        let newEntities = all.filter(m => !allVersions.some(v => v.id === m.id));
        for (let i = 0; i < newEntities.length; i++) {
            let entity = newEntities[i];
            let version = this.getVersion(table, entity.id);
            let hash = this._calculateHash(entity);
            this._changeVersionHash(version, hash);
            await this._versions.save(version, { id: version.id, table: version.table });
        }
    }

    async addRevision(table, id, entity) {
        const hash = this._calculateHash(entity);
        let version = await this.getVersion(table, id);

        if (version.hash !== hash && version.status !== VersionStatus.Deleted) {
            this._changeVersionHash(version, hash);
            await this._versions.save(version, { id, table });
        }
    }

    _changeVersionHash(version, newHash) {
        version.version++;
        version.hash = newHash;
        version.status = VersionStatus.NotSynchronized;
    }

    _markVersionAsDeleted(version) {
        version.version++;
        version.status = VersionStatus.Deleted;
        version.hash = "";
    }
}

module.exports = VersionsManager;