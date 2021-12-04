import {Endpoint} from "./Endpoint.js";

export class CreateNewExamSolutionEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._examId = props;
        console.log("salgo del constructor:", this._examId);
    }

    url() {
        return `/exams/${this._examId}/solutions`
    }
    
    method() {
        return 'POST'
    }

    needsAuthorization() {
        return true;
    }
}