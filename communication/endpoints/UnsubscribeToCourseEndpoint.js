import {Endpoint} from "./Endpoint.js";

export class UnsubscribeToCourseEndpoint extends Endpoint {
    constructor(courseId, userId) {
        super(courseId, userId);
        console.log("entro al constructor:", courseId, userId);
        this._courseid = courseId;
        this._userid = userId;
        console.log("salgo del constructor:", this._courseid, this._userid);
    }
    url() {
        return `/courses/${this._courseid}/users/${this._userid}`
    }

    /*ownResponses() {
        //return [GetProfileSuccessful];
    }*/

    method() {
        return 'DELETE'
    }

    needsAuthorization() {
        return true;
    }
}