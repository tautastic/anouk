window.fakeStorage = {
    _data: {},

    setItem: function (id, val) {
        return this._data[id] = String(val);
    },

    getItem: function (id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },

    removeItem: function (id) {
        return delete this._data[id];
    },

    clear: function () {
        return this._data = {};
    }
};

function LocalScoreManager() {
    this.key = "4096bestScore";

    const supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalScoreManager.prototype.localStorageSupported = function () {
    const testKey = "test";
    const storage = window.localStorage;

    try {
        storage.setItem(testKey, "1");
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

LocalScoreManager.prototype.get = function () {
    return this.storage.getItem(this.key) || 0;
};

LocalScoreManager.prototype.set = function (score) {
    this.storage.setItem(this.key, score);
};

