import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class GetAllUsersInCourseEndpoint extends Endpoint {
    constructor(courseId, userType) {
        super(courseId, userType);
        console.log("entro al constructor:", courseId, userType);
        this._course_id = courseId;
        this._usertype = userType
        console.log("salgo del constructor:", this._course_id, this._usertype);
    }
    url() {
        if(!this._usertype) return `/courses/${this._course_id}/users`;
        return `/courses/${this._course_id}/users?user_type=${this._usertype}`
    }

    /*ownResponses() {
        //return [GetProfileSuccessful];
    }*/

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}