const Setup = require("./Setup");

class RequestUrl {
    constructor(endpoint) {
        const gitlabServerUrl = Setup.get().gitlabServerUrl;
        this._requestUrl = gitlabServerUrl.endsWith("/") ?
            gitlabServerUrl + endpoint :
            gitlabServerUrl + "/" + endpoint;
    }

    get() {
        return this._requestUrl;
    }
}

module.exports = RequestUrl;