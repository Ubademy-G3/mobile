import {Endpoint} from "./Endpoint.js";
//import {GetProfileSuccessful} from "../responses/profiles/GetProfileSuccessful.js";

function serializeQuery(params, prefix) {
    const query = Object.keys(params).map((key) => {
      const value  = params[key];
  
      if (params.constructor === Array)
        key = `${prefix}[]`;
      else if (params.constructor === Object)
        key = (prefix ? `${prefix}[${key}]` : key);
  
      if (typeof value === 'object')
        return serializeQuery(value, key);
      else
        return `${key}=${encodeURIComponent(value)}`;
    });
  
    return [].concat.apply([], query).join('&');
  }

export class SearchCoursesEndpoint extends Endpoint {
    constructor(query) {
        super(query);
        console.log("entro al constructor:", query);
        this._query = query;
        console.log("salgo del constructor:", this._query);
    }
    url() {
        /*switch(this._keytype){
            case "text":                
                this._searchkey = this._searchkey.replace(/ /g, "%20");
                console.log("url para busqueda con texto", this._searchkey);
                return `/courses?text=${this._searchkey}`;
            case "category":
                return `/courses?category=${this._searchkey}`;
            case "subscription":
                return `/courses?subscription_type=${this._searchkey}`;
        }*/
        let url = "/courses";
        /*let params = [];
        if (this._query.text) {
            url.concat(this._query.text)
        }
        if (this._query.category) {
            url = this._query.category.map((cat) => {
                return url.concat(`categories[]=${cat}&`);
            });
        }
        if (this._query.subscription) {
            url = this._query.subscription.map((subs) => {
                return url.concat(`subscription_type[]=${subs}&`);
            });
        }*/

        const params = serializeQuery(this._query);
        console.log("PARAMS");
        console.log(params);
        if (params.length > 0) {
            url = url.concat(`?${params}`);
        }
        console.log(url);
        return url;
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