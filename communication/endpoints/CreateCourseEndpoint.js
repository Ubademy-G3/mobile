import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class CreateCourseEndpoint extends Endpoint {
    url() {
        return `/courses`
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