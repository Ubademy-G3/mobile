import {Endpoint} from "./Endpoint.js";

export class UpdateExamEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._exam_id = props;
        console.log("salgo del constructor:", this._exam_id);
    }

    url() {
        return `/exams/${this._exam_id}`
    }
    
    method() {
        return 'PATCH'
    }

    needsAuthorization() {
        return true;
    }
}