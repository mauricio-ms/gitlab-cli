const { join } = require("path");
const fs = require("fs");
const { ROOT_PATH } = require("..");

const PATH = join(ROOT_PATH, ".gitlabsetup");

let instance;

class Setup {

    static of(gitlabServerUrl, personalAccessToken) {
        return new Setup(gitlabServerUrl, personalAccessToken);
    }

    static get() {
        if (instance) {
            return instance;
        }

        if (!fs.existsSync(PATH)) {
            throw new Error("Setup needs to be done before using other commands!");
        }

        try {
            const setupData = JSON.parse(fs.readFileSync(PATH));
            instance = new Setup(setupData.gitlabServerUrl, setupData.personalAccessToken)
            return instance;
        } catch (e) {
            throw new Error("The setup data is corrupt, run the 'setup' command again!");
        }
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
        instance = null;
    }
}

module.exports = Setup;