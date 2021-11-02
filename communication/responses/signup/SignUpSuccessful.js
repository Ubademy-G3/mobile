import {SuccessfulApiResponse} from "../generalResponses/SuccessfulApiResponse.js";

export class SignUpSuccessful extends SuccessfulApiResponse {
    static defaultResponse() {
        return {
            "id": 4,
            "token": "QpwL5tke4Pnpja7X4"
        }
    }
}