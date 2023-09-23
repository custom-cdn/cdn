class JinaResponse {
    constructor(data) {
        this._data = data
    }

    get first_tags() {
        return this._data.data[0].tags
    }


}

class KGHelper {
    static BASE_URL = "http://localhost:8080"

    static async jina_req(endpoint, docs = []) {
        const url = this.BASE_URL + endpoint

        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "data": docs,
                "targetExecutor": "",
                "parameters": {}
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return JinaResponse(await res.json())        
    }

    static async get_schema() {
        return await this.jina_req('/schema/get')
    }
}