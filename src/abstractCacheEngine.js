"use strict";

const Promise = require('bluebird');
const Boom = require('boom');

class abstactCacheEngine {

    notImplemented(name) {
        return Promise.reject(Boom.notImplemented('Method ' + name + ' not implemented in subclass of AbstractCacheEngine'));
    }

    constructor() {
        if (this.get === undefined) {
            notImplemented('get');
        }

        if (this.set === undefined) {
            notImplemented('set');
        }

        if (this.getMulti === undefined) {
            notImplemented('getMulti');
        }

        if (this.setMulti === undefined) {
            notImplemented('setMulti');
        }

        if (this.delete === undefined) {
            notImplemented('delete');
        }

        if (this.clear === undefined) {
            notImplemented('clear');
        }

        if (this.size === undefined) {
            notImplemented('size');
        }
    }

}

module.exports = abstactCacheEngine;
