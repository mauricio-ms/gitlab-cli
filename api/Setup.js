const { join } = require("path");
const fs = require("fs");
const { ROOT_PATH } = require("..");

const PATH = join(ROOT_PATH, ".gitlabsetup");

class Setup {

    static of(gitlabServerUrl, personalAccessToken) {
        return new Setup(gitlabServerUrl, personalAccessToken);
    }

    constructor(gitlabServerUrl, personalAccessToken) {
        if (!gitlabServerUrl) {
            throw new Error("Gitlab Server Url must be provided.");
        }
        if (!personalAccessToken) {
            throw new Error("Personal Access Token must be provided.");
        }
        this.gitlabServerUrl = gitlabServerUrl;
        this.personalAccessToken = personalAccessToken;
    }

    save() {
        fs.writeFileSync(PATH, JSON.stringify({
            gitlabServerUrl: this.gitlabServerUrl,
            personalAccessToken: this.personalAccessToken
        }));
    }
}

module.exports = Setup;