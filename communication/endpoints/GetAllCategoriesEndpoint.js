import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class GetAllCategoriesEndpoint extends Endpoint {
    url() {
        return `/categories`
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