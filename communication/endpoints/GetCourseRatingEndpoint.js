import {Endpoint} from "./Endpoint.js";

export class GetCourseRatingEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._id = props;
        console.log("salgo del constructor:", this._id);
    }
    
    url() {
        return `/courses/${this._id}/ratings`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}