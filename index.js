#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");

const package = require("./package.json");

const Search = require("./search/Search");

program.version(package.version);

console.log(chalk.cyan(figlet.textSync("GitLab CLI")));

// TODO CRIAR COMANDO SETUP PARA CONFIGURAR TOKEN E SERVIDOR
// TODO BUSCAR LISTA DE PROJETOS

program
    .command("search [term]")
    .description("Search for an term across all your Gitlab repositories")
    //.option('-s, --status [status]', 'Status inicial do to-do')
    .action(async (term, options) => {
        if (!term) {
            answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "term",
                    message: "What is the search term?",
                    validate: value => value ? true : "An empty search term is not allowed!"
                }
            ]);
            term = answers.term;
        }
        new Search(term).execute();
    });

program.parse(process.argv);