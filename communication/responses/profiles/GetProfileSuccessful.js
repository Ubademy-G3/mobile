import {SuccessfulApiResponse} from "../generalResponses/SuccessfulApiResponse.js";

export class GetProfileSuccessful extends SuccessfulApiResponse {
    userPersonalData() {
        const personalData = this.content()['data'];
        return {
            id: personalData['id'],
            email: personalData['email'],
            firstName: personalData['first_name'],
            lastName: personalData['last_name'],
            avatarUrl: personalData['avatar'],
        }
    }
}