const axios = require("axios");
const Setup = require("./Setup");

class Get {
    constructor(url, params) {
        this.url = url;
        this.params = params;
        this.page = 1;
        this.perPage = 20;
    }

    async execute() {
        this.response = await this._execute();
    }

    async _execute() {
        const config = {
            headers: {
                "PRIVATE-TOKEN": Setup.get().personalAccessToken
            },

            params: {
                ...this.params,
                page: this.page,
                per_page: this.perPage
            }
        };

        try {
            return await axios.get(this.url, config);
        } catch (err) {
            console.error("Error performing the request: ", err);
        }
    }

    async loadNextPage() {
        if (this.hasNextPage()) {
            this.page++;
            await this.execute();
        }
    }
    
    hasNextPage() {
        return !!this.response.headers["x-next-page"];
    }

    empty() {
        return this.response.data.length === 0;
    }

    getData() {
        return this.response.data;
    }
};

module.exports = Get;