const Get = require("../api/Get");
const chalk = require("chalk");
const Table = require("cli-table");
const inquirer = require("inquirer");
const Setup = require("../api/Setup");

class Search {
    constructor(term) {
        this.term = term;
    }

    async execute() {
        try {
            const params = {
                scope: "blobs",
                search: this.term
            };
            const gitlabServerUrl = Setup.get().gitlabServerUrl;
            const searchEndpoint = "projects/10/search";
            const searchRequestUrl = gitlabServerUrl.endsWith("/") ? 
                gitlabServerUrl + searchEndpoint : 
                gitlabServerUrl + "/" + searchEndpoint;
            let request = new Get(searchRequestUrl, params);
            await request.execute();
            if (request.empty()) {
                console.log(`${chalk.red(`No results found for the ${chalk.white(`'${this.term}'`)} term!`)}`);
                return;
            }

            let loadNextPage;
            do {
                if (request.empty()) {
                    console.log(`${chalk.white(`No more results found!`)}`);
                    break;
                } else {
                    this.printResults(request.page, request.perPage, request.getData());
                }

                loadNextPage = await this.loadNextPage(request);
                if (loadNextPage) {
                    request.loadNextPage();
                }
            } while (loadNextPage);
        } catch (err) {
            console.error(err);
        }
    }

    async loadNextPage(request) {
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

    printResults(page, perPage, data) {
        const table = new Table({
            head: ["Row", "Branch", "Project", "File", "Start Line"],
            colWidths: [10, 20, 10, 90, 15]
        });
        data.map((result, index) =>
            table.push(
                [(page-1)*perPage + index, result.ref, result.project_id, result.basename, result.startline]
            )
        );
        console.log(table.toString());
    }
};

module.exports = Search;