import { Endpoint } from "./Endpoint.js";

function serializeQuery(params, prefix) {
    const query = Object.keys(params).map((key) => {
      const value  = params[key];

      if (params.constructor === Array)
        key = `${prefix}`;
      else if (params.constructor === Object)
        key = (prefix ? `${prefix}[${key}]` : key);
  
      if (typeof value === 'object')
        return serializeQuery(value, key);
      else
        return `${key}=${encodeURIComponent(value)}`;
    });
  
    return [].concat.apply([], query).join('&');
}


export class GetAllCoursesFromListEndpoint extends Endpoint {
    constructor(ids) {
        super(ids);
        console.log("entro al constructor:", ids);
        this._ids = ids;
        console.log("salgo del constructor:", this._ids);
    }
    url() {
        let url = `/courses/list/`;
        const params = serializeQuery(this._ids, "id");
        if (params.length > 0) {
            url = url.concat(`?${params}`);
        }
        console.log("URL")
        console.log(url)
        return url;
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}