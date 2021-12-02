import {Endpoint} from "./Endpoint.js";

export class GetAllQuestionsByExamIdEndpoint extends Endpoint {
    constructor(examId) {
        super(examId);
        console.log("entro al constructor:", examId);
        this._exam_id = examId;
        console.log("salgo del constructor:", this._exam_id);
    }
    url() {
        return `/exams/${this._exam_id}/questions`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}