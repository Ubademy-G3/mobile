import {Endpoint} from "./Endpoint.js";

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

export class GetAllUsersInCourseEndpoint extends Endpoint {
    constructor(courseId, query) {
        super(courseId, query);
        console.log("entro al constructor:", courseId);
        this._course_id = courseId;
        this._query = query;
        console.log("salgo del constructor:", this._course_id);
    }
    url() {
        let url = `/courses/${this._course_id}/users`;

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