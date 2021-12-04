import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

export class SearchCoursesEndpoint extends Endpoint {
    constructor(searchKey, keyType) {
        super(searchKey, keyType);
        console.log("entro al constructor:", searchKey, keyType);
        this._searchkey = searchKey;
        this._keytype = keyType;
        console.log("salgo del constructor:", this._searchkey, this._keytype);
    }
    url() {
        switch(this._keytype){
            case "text":                
                this._searchkey = this._searchkey.replace(/ /g, "%20");
                console.log("url para busqueda con texto", this._searchkey);
                return `/courses?text=${this._searchkey}`;
            case "category":
                return `/courses?category=${this._searchkey}`;
            case "subscription":
                return `/courses?subscription_type=${this._searchkey}`;
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