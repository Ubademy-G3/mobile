import { Endpoint } from "./Endpoint.js";

export class GetAllUsersFromListEndpoint extends Endpoint {
    constructor(ids) {
        super(ids);
        console.log("entro al constructor:", ids);
        this._ids = ids;
        console.log("salgo del constructor:", this._ids);
    }
    url() {
        let url = `/users`;
        const idList = this._ids.join(',');
        url = url.concat(`?idList=${idList}`);

        return url;
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}