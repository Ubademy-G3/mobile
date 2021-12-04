import {Endpoint} from "./Endpoint.js";

export class GetQuestionByIdEndpoint extends Endpoint {
    constructor(questionId, examId) {
        super(questionId, examId);
        console.log("entro al constructor:", questionId, examId);
        this._question_id = questionId;
        this._exam_id = examId;
        console.log("salgo del constructor:", this._question_id, this._exam_id);
    }
    url() {
        return `/exams/${this._exam_id}/questions/${this._question_id}`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}