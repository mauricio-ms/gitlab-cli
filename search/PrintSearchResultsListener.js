const _ = require("lodash");
const chalk = require("chalk");
const Table = require("cli-table");

class PrintSearchResultsListener {

    constructor(projects) {
        this.projects = projects;
    }

    onNewPage(request) {
        const table = new Table({
            head: ["Row", "Branch", "Project", "File", "Start Line"],
            colWidths: [10, 15, 20, 90, 15]
        });
        request.getData().forEach((result, index) => {
            const projectName = this.projects[_.findIndex(this.projects, project => project.id == result.project_id)].name
            table.push(
                [(request.page - 1) * request.perPage + index, result.ref, projectName, result.basename, result.startline]
            )
        });
        console.log(table.toString());
    }

    onNoMoreResults() {
        console.log(`${chalk.white(`No more results found!`)}`);
    }

    onEndWithoutResults(searchTerm) {
        console.log(`${chalk.red(`No results found for the ${chalk.white(`'${searchTerm}'`)} term!`)}`);
    }
}

module.exports = PrintSearchResultsListener;