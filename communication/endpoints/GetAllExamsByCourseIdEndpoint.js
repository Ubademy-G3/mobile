import {Endpoint} from "./Endpoint.js";

export class GetAllExamsByCourseIdEndpoint extends Endpoint {
    constructor(courseId) {
        super(courseId);
        console.log("entro al constructor:", courseId);
        this._course_id = courseId;
        console.log("salgo del constructor:", this._course_id);
    }
    url() {
        return `/exams/courses/${this._course_id}`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}