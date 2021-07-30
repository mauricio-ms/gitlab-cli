const chalk = require("chalk");
const Table = require("cli-table");

class PrintSearchResultsListener {

    onNewPage(request) {
        const table = new Table({
            head: ["Row", "Branch", "Project", "File", "Start Line"],
            colWidths: [10, 20, 10, 90, 15]
        });
        request.getData().map((result, index) =>
            table.push(
                [(request.page-1)*request.perPage + index, result.ref, result.project_id, result.basename, result.startline]
            )
        );
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