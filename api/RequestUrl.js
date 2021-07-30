const Setup = require("./Setup");

class RequestUrl {
    constructor(endpoint) {
        const gitlabServerUrl = Setup.get().gitlabServerUrl;
        this._requestUrl = gitlabServerUrl + "/api/v4/" + endpoint;
    }

    get() {
        return this._requestUrl;
    }
}

module.exports = RequestUrl;