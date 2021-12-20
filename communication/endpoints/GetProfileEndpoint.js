import { Endpoint } from "./Endpoint.js";
import { GetProfileSuccessful } from "../responses/profiles/GetProfileSuccessful.js";

export class GetProfileEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._id = props;
        console.log("salgo del constructor:", this._id);
    }
    url() {
        return `/users/${this._id}`
    }

    ownResponses() {
        return [GetProfileSuccessful];
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}