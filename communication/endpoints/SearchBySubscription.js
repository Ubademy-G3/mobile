import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class SearchBySubscriptionEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._subscription_type = props;
        console.log("salgo del constructor:", this._subscription_type);
    }
    url() {
        return `/courses/?subscription_type=${this._subscription_type}`
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