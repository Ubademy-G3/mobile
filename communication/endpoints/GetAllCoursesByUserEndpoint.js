import {Endpoint} from "./Endpoint.js";

export class GetAllCoursesByUserEndpoint extends Endpoint {
    constructor(userId, aprobalState, userType) {
        super(userId, aprobalState);
        console.log("entro al constructor:", userId, aprobalState, userType);
        this._user_id = userId;
        this._aprobal_state = aprobalState;
        this._user_type = userType;
        console.log("salgo del constructor:", this._user_id, this._aprobal_state, this._user_type);
    }
    url() {
        if((this._aprobal_state === undefined) && (this._user_type === undefined)){
            return `/users/${this._user_id}/courses`
        } else if(this._user_type === undefined) {
            return `/users/${this._user_id}/courses?aprobal_state=${this._aprobal_state}`
        } else if(this._aprobal_state === undefined) {
            return `/users/${this._user_id}/courses?user_type=${this._user_type}`
        } else {
            return `/users/${this._user_id}/courses?user_type=${this._user_type}&aprobal_state=${this._aprobal_state}`
        }
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