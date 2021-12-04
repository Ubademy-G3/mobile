import {Endpoint} from "./Endpoint.js";

export class UpdateQuestionEndpoint extends Endpoint {
    constructor(examId, questionId) {
        super(examId, questionId);
        console.log("entro al constructor:", examId, questionId);
        this._exam_id = examId;
        this._question_id = questionId;
        console.log("salgo del constructor:", this._exam_id, this._question_id);
    }

    url() {
        return `/exams/${this._exam_id}/questions/${this._question_id}`
    }
    
    method() {
        return 'PATCH'
    }

    needsAuthorization() {
        return true;
    }
}