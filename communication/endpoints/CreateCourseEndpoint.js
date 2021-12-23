import {Endpoint} from "./Endpoint.js";

export class CreateCourseEndpoint extends Endpoint {
    url() {
        return `/courses`
    }

    method() {
        return 'POST'
    }

    needsAuthorization() {
        return true;
    }
}