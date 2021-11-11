import {Endpoint} from "./Endpoint.js";
import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class GetProfileEndpoint extends Endpoint {
    constructor(id) {
        this._userId = id;
    }
    static url() {
        return `/users/${this._userId}`
    }

    ownResponses() {
        return [GetProfileSuccessful];
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return false;
    }
}