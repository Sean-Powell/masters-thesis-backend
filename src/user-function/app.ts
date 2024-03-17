import cognitoProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { createUser } from './services/createUser';
import { saveUser } from './services/saveUser';
import { createErrorResponse, createSuccessResponse } from '../shared-services/CreateResponseStatus';

export const handler = async (event) => {
    console.log("event: " + JSON.stringify(event));
    console.log("parameters: " + JSON.stringify(event.queryStringParameters));
    const { email } = event.queryStringParameters;

    if (email == undefined || email == ""){
        return createErrorResponse(400, "No email was provided");
    }

    const cognito = new cognitoProvider();
    const params = {
        UserPoolId: process.env.USERPOOL_USER_POOL_ID,
        Filter: `email = "${email}"`
    }


    try{
        const response = await cognito.listUsers(params).promise();
        if (response.Users && response.Users.length > 0){
            console.log("user exists");
            return createErrorResponse(400, "User Already Exists");
        }else{
            console.log("user does not exist");
            const uuid = await createUser(email, cognito);
            await saveUser(uuid);
            return createSuccessResponse("User created");
        }
    }catch(err){
        console.error("There was an error getting the user: " + err);
        return createErrorResponse(500, err.message);
    }
}