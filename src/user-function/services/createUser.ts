import {v4 as uuid} from 'uuid';
import cognitoProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'

export async function createUser(email: string, cognito: cognitoProvider): Promise<string> {
    const params = {
        UserPoolId: process.env.USERPOOL_USER_POOL_ID,
        Username: email,
        DesiredDeliveryMediums: [
            "EMAIL"
        ],
        TemporaryPassword: makePassword(8), 
    }

    try{
        const response = await cognito.adminCreateUser(params).promise();
        console.log("cognito repsonse: " + JSON.stringify(response));
        const UUID = response.User?.Username;
        return UUID;
    }catch(err){
        console.error("There was an error creating the missing user: " + err);
        return undefined;
    }
}

function makePassword(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}