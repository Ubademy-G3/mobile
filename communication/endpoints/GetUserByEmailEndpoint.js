import {Endpoint} from "./Endpoint.js";
import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class GetUserByEmailEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._email = props;
        console.log("salgo del constructor:", this._email);
    }
    url() {
        return `/users?email=${encodeURIComponent(this._email)}`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}