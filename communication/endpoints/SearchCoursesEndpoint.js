import { Endpoint } from "./Endpoint.js";

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
        this._query = query;
    }
    url() {
        let url = "/courses";
        const params = serializeQuery(this._query);
        if (params.length > 0) {
            url = url.concat(`?${params}`);
        }
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