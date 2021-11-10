export class ApiResponse {
    static understandThis(jsonResponse) {
        throw new Error("You have to implement the method");
    }

    constructor(jsonResponse) {
        this._jsonResponse = jsonResponse;
    }

    hasError() {
        console.log("[ApiResponse] response error: ", this._jsonResponse.error)
        return this._jsonResponse.error !== false;
    }

    errors() {
        console.log("[ApiResponse] response message: ", this._jsonResponse.message)
        return this._jsonResponse.message;
    }

    content() {
        return this._jsonResponse;
    }
}