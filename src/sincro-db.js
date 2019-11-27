let s = {};
const Session = require("./entities/session");
const ConnectionData = require("./entities/connection-data");

class SincroDB {
    static configure({ SocketClientLayer, PromiseClass = null }) {
        s.SocketClientLayer = SocketClientLayer;
        s.Promise = PromiseClass || Promise;
    }

    /**
     * @param {string} url Connection url
     * @returns {Session}
     */
    static createSession(url) {
        if (url.indexOf("sincrodb://") === -1 && url.indexOf("sincrodbs://") === -1) {
            throw new Error("Invalid protocol");
        }

        let username = "";
        let password = "";

        let protocol = url.substr(0, url.indexOf("://"));
        protocol = protocol.replace("sincrodb", "ws");

        url = url.substr(url.indexOf("://") + "://".length);

        if (url.indexOf("@") !== -1 && url.indexOf(":") !== -1) {
            let spl = url.split("@");
            username = spl[0].split(":")[0];
            password = spl[0].split(":")[1];
            url = spl[1];
        }

        const connectionData = new ConnectionData(protocol, url, username, password);
        const session = new Session(connectionData, new s.SocketClientLayer());
        return session;
    }
}

module.exports = SincroDB;