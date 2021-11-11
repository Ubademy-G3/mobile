import Requester from "../communication/requester/Requester";
import ApiClient from "../communication/client/ApiClient";
import {getSetting} from "../Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

class App {
    constructor() {
        this._apiClient = undefined;
    }

    apiClient() {
        if (this._apiClient === undefined) {
            this._setUpApiClient();
        }

        return this._apiClient;
    }

    _setUpApiClient() {
        const requester = new Requester( getSetting("apiUrl"));
        this._apiClient = new ApiClient(requester);
    }

    loginUser = async (token) => {
        const jsonValue = JSON.stringify(token)
        try {
            await AsyncStorage.setItem("@storageMobile:token", jsonValue);
            console.log("Guardo token: ", token);
          } catch(e) {
                console.warn("Local store error", error);
          }
        /*AsyncStorage.setItem("@storageMobile:token", jsonValue)
        .then(() => {
            console.log("Guardo token: ", token);
        })
        .catch((error) => {
            console.warn("Local store error", error);
        });*/
    }

    getToken = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@storageMobile:token")
            return jsonValue != null ? JSON.parse(jsonValue) : null;
          } catch(e) {
            console.warn("Local store error", error);
          }
        
        /*AsyncStorage.getItem("@storageMobile:token")
            .then((jsonString) => {
                return jsonString != null ? JSON.parse(jsonString) : null;
                //return ({token: jsonResponse.toString()});
            })
            .catch((error) => {
                console.warn("Local fetch error", error);
            }); */
    }
}

export let app = new App();