import {Endpoint} from "./Endpoint.js";

export class GetAllCoursesEndpoint extends Endpoint {
    url() {
        return `/courses/rated`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}