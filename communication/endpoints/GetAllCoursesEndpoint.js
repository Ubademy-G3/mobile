import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class GetAllCoursesEndpoint extends Endpoint {
    url() {
        return `/courses/rated`
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