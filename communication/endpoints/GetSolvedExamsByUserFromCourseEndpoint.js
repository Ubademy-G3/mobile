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

export class GetSolvedExamsByUserFromCourseEndpoint extends Endpoint {
    constructor(courseId, userId, query) {
        super(query);
        this._query = query;
        this._user_id = userId;
        this._course_id = courseId;
    }

    url() {
        let url = `/users/${this._user_id}/solved-exams/${this._course_id}`;
        const params = serializeQuery(this._query);
        if (params.length > 0) {
            url = url.concat(`?${params}`);
        }
        return url;
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}