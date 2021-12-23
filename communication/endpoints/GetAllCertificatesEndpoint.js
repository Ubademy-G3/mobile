import {Endpoint} from "./Endpoint.js";

export class GetAllCertificatesEndpoint extends Endpoint {
    constructor(userId) {
        super(userId);
        console.log("entro al constructor:", userId);
        this._user_id = userId;
        console.log("salgo del constructor:", this._user_id);
    }

    url() {
        return `/users/${this._user_id}/certificates`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}