import {Endpoint} from "./Endpoint.js";

export class CreateExamEndpoint extends Endpoint {
    url() {
        return `/exams/`
    }
    
    method() {
        return 'POST'
    }

    needsAuthorization() {
        return true;
    }
}