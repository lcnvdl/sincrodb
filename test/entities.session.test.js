const { expect } = require("chai");
const Session = require("../src/entities/session");
const SocketLayerStub = require("./stubs/socket-layer.stub");

/** @type {SocketLayerStub} */
let socket = null;

describe("Session", () => {
    beforeEach(() => {
        socket = new SocketLayerStub();
    });

    it("constructor should work fine", () => {
        let entity = new Session({}, socket);
        expect(entity).to.be.ok;
    });
});