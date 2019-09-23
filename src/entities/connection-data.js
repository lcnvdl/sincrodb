class ConnectionData {
    /**
     * @param {string} protocol Protocol (sincrodb, sincrodbs)
     * @param {string} url URL
     * @param {string} username Username
     * @param {string} password Password
     */
    constructor(protocol, url, username, password) {
        this.protocol = protocol;
        this.url = url;
        this.username = username;
        this.password = password;
    }
}

module.exports = ConnectionData;