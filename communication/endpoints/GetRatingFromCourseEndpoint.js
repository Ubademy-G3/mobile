import {Endpoint} from "./Endpoint.js";

export class GetRatingFromCourseEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._courseId = props;
        console.log("salgo del constructor:", this._courseId);
    }

    url() {
        return `/courses/${this._courseId}/ratings`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}