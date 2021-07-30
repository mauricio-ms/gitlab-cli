const Get = require("../api/Get");
const RequestUrl = require("../api/RequestUrl");

class GetProjects {
    constructor() {
        this._results = [];
    }

    async execute() {
        try {
            const searchRequestUrl = new RequestUrl("/projects").get();
            let request = Get.withMaxPerPage(searchRequestUrl);
            await request.execute();
            if (request.empty()) {
                return this._results;
            }

            let loadNextPage;
            do {
                if (request.empty()) {
                    console.log(`${chalk.white(`No more results found!`)}`);
                    break;
                } else {
                    this._addPageResults(request.getData().map(project => project.name));
                }

                if (request.hasNextPage()) {
                    request.loadNextPage();
                }
            } while (loadNextPage);

            return this._results;
        } catch (err) {
            console.error(err);
            return this._results;
        }
    }

    _addPageResults(pageResults) {
        this._results = this._results.concat(pageResults);
    }
}

module.exports = GetProjects;