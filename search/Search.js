const Get = require("../api/Get");
const inquirer = require("inquirer");
const RequestUrl = require("../api/RequestUrl");

class Search {
    constructor(projects, term) {
        this._projects = projects.slice();
        this.term = term;
        this._listeners = [];
        this._foundSomeData = false;
    }

    addListener(listener) {
        this._listeners = this._listeners.concat(listener);
    }

    async execute() {
        while (this._projects.length > 0) {
            await this._execute(this._projects.shift());
        }
    }

    async _execute(project) {
        try {
            const params = {
                scope: "blobs",
                search: this.term
            };
            const searchRequestUrl = new RequestUrl(`/projects/${project.id}/search`).get();
            let request = Get.of(searchRequestUrl, params);
            await request.execute();
            if (this._projects.length === 0 && request.empty() && !this._foundSomeData) {
                this._dispatchOnEndWithoutResults();
                return;
            }
            
            this._foundSomeData = true;

            let loadNextPage;
            do {
                if (request.empty()) {
                    if (this._projects.length === 0) {
                        this._dispatchOnNoMoreResults();
                    }
                    break;
                } else {
                    this._dispatchOnNewPageListeners(request);
                }

                loadNextPage = await this._loadNextPage(request);
                if (loadNextPage) {
                    request.loadNextPage();
                }
            } while (loadNextPage);
        } catch (err) {
            console.error(err);
        }
    }

    _dispatchOnNewPageListeners(request) {
        this._listeners.forEach(l => l.onNewPage(request));
    }

    _dispatchOnNoMoreResults() {
        this._listeners.forEach(l => l.onNoMoreResults());
    }

    _dispatchOnEndWithoutResults() {
        this._listeners.forEach(l => l.onEndWithoutResults(this.term));
    }

    async _loadNextPage(request) {
        if (!request.hasNextPage()) {
            return false;
        }

        const answers = await inquirer.prompt([
            {
                name: "loadNextPage",
                type: "confirm",
                message: "-- MORE --",
            },
        ]);
        if (!answers.loadNextPage) {
            this._projects = [];
        }

        return answers.loadNextPage;
    }
}

module.exports = Search;