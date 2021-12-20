import {Endpoint} from "./Endpoint.js";

export class UpdateAnswerEndpoint extends Endpoint {
    constructor(examId, solutionId, answerId) {
        super(examId, solutionId);
        console.log("entro al constructor:", examId, solutionId, answerId);
        this._exam_id = examId;
        this._solution_id = solutionId;
        this._answer_id = answerId;
        console.log("salgo del constructor:", this._exam_id, this._solution_id, this._answer_id);
    }

    url() {
        return `/exams/${this._exam_id}/solutions/${this._solution_id}/answers/${this._answer_id}`
    }
    
    method() {
        return 'PATCH'
    }

    needsAuthorization() {
        return true;
    }
}