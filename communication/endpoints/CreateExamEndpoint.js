import {Endpoint} from "./Endpoint.js";

export class CreateExamEndpoint extends Endpoint {
    url() {
        return `/exams/`
    }

    /*ownResponses() {
        //return [GetProfileSuccessful];
    }*/

    method() {
        return 'POST'
    }

    needsAuthorization() {
        return true;
    }
}