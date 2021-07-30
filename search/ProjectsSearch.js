const Get = require("../api/Get");
const RequestUrl = require("../api/RequestUrl");

class ProjectsSearch {
    constructor(projects, term) {
        this._projects = projects.slice();
        this.projectsWithTerm = [];
        this.term = term;
    }

    async execute() {
        while (this._projects.length > 0) {
            await this._execute(this._projects.shift());
        }
        return this.projectsWithTerm;
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
            if (!request.empty()) {
                this.projectsWithTerm = this.projectsWithTerm.concat(project);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = ProjectsSearch;