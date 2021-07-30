const Get = require("../api/Get");
const inquirer = require("inquirer");
const RequestUrl = require("../api/RequestUrl");

class Search {
    constructor(term) {
        this.term = term;
        this._listeners = [];
    }

    addListener(listener) {
        this._listeners = this._listeners.concat(listener);
    }

    async execute() {
        try {
            const params = {
                scope: "blobs",
                search: this.term
            };
            const searchRequestUrl = new RequestUrl("/projects/10/search").get();
            let request = Get.of(searchRequestUrl, params);
            await request.execute();
            if (request.empty()) {
                this._dispatchOnEndWithoutResults();
                return;
            }

            let loadNextPage;
            do {
                if (request.empty()) {
                    this._dispatchOnNoMoreResults();
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

        return answers.loadNextPage;
    }
}

module.exports = Search;