import {Endpoint} from "./Endpoint.js";

export class UpdateCourseEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._course_id = props;
        console.log("salgo del constructor:", this._course_id);
    }

    url() {
        return `/courses/${this._course_id}`
    }
    
    method() {
        return 'PATCH'
    }

    needsAuthorization() {
        return true;
    }
}