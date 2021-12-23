import {Endpoint} from "./Endpoint.js";

export class SubscribeToCourseEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._id = props;
        console.log("salgo del constructor:", this._id);
    }
    url() {
        return `/courses/${this._id}/users`
    }

    method() {
        return 'POST'
    }

    needsAuthorization() {
        return true;
    }
}