import * as Updates from "expo-updates";

const ENV = {
    dev: {
        apiUrl: 'https://staging-api-gateway-app-v2.herokuapp.com',
        usingFakeApi: false,
    },
    staging: {
        apiUrl: 'https://staging-api-gateway-app-v2.herokuapp.com',
    },
    production: {
        apiUrl: 'https://staging-api-gateway-app-v2.herokuapp.com',
    }
};

export function getEnvVars(env = Updates.releaseChannel) {
    // Release channels: https://docs.expo.dev/distribution/release-channels/
    if (env.startsWith('staging')) {
        return ENV.staging;
    } else if (env.startsWith('production')) {
        return ENV.production;
    } else {
        return ENV.dev;
    }
}