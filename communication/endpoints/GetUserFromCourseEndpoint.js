import {Endpoint} from "./Endpoint.js";

export class GetUserFromCourseEndpoint extends Endpoint {
    constructor(courseId, userId) {
        super(courseId, userId);
        console.log("entro al constructor:", courseId, userId);
        this._course_id = courseId;
        this._user_id = userId;
        console.log("salgo del constructor:", this._course_id, this._user_id);
    }
    url() {
        return `/courses/${this._course_id}/users/${this._user_id}`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}