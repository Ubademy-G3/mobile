import {Endpoint} from "./Endpoint.js";

export class CreateNewModuleEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._courseId = props;
        console.log("salgo del constructor:", this._courseId);
    }

    url() {
        return `/courses/${this._courseId}/modules`
    }

    method() {
        return 'POST'
    }

    needsAuthorization() {
        return true;
    }
}