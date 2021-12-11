import {Endpoint} from "./Endpoint.js";

export class GetAllAnswersByExamIdEndpoint extends Endpoint {
    constructor(examId, solutionId) {
        super(examId, solutionId);
        console.log("entro al constructor:", examId, solutionId);
        this._exam_id = examId;
        this._solution_id = solutionId;
        console.log("salgo del constructor:", this._exam_id, this._solution_id);
    }

    url() {
        return `/exams/${this._exam_id}/solutions/${this._solution_id}/answers`
    }
    
    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}