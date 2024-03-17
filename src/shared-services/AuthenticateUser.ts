import cognitoProvider, { AttributeListType, AuthenticationResultType, GetUserRequest, GetUserResponse, InitiateAuthRequest, ListUsersRequest, ListUsersResponse, RespondToAuthChallengeRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { getSecretValues } from './GetSecret';
import { CognitoClient } from './dtos/ClientSecret'
import { createErrorResponse, createSuccessResponse } from './CreateResponseStatus';
import { AuthResponse } from './dtos/AuthenticationResponse';

const crypto = require('crypto');

export async function AuthenticateUser(username: string, passowrd: string) {
    var cognito = new cognitoProvider();
    var secretName = process.env.COGNITO_CLIENT_SECRET_NAME;
    var secretData = await getSecretValues(secretName);

    var congitoClientSecret: CognitoClient = JSON.parse(secretData)

    var authenticationRequest: InitiateAuthRequest = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: congitoClientSecret.id,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: passowrd,
            SECRET_HASH: createSecretHash(congitoClientSecret.id, congitoClientSecret.secret, username)
        },
    };
    try{
        var authenticationDetails = await cognito.initiateAuth(authenticationRequest).promise();

        if (authenticationDetails.ChallengeName == "NEW_PASSWORD_REQUIRED"){
            return {
                statusCode: 201,
                body: authenticationDetails.Session,
                headers: {
                    "Access-Control-Allow-Headers" : "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST,GET"
                }
            }
        }
    }catch(error){
        console.error('Error message: ' + JSON.stringify(error));
        if (error.code == "NotAuthorizedException"){
            return createErrorResponse(401, "Incorrect username or password");
        }else if (error.code == "TooManyRequestsException"){
            return createErrorResponse(401, "too many requests");
        }else if (error.code == "PasswordResetRequiredException"){
            return createErrorResponse(201, "Password reset is required");
        }
        return createErrorResponse(500, "Something went wrong");
    }

    console.log(JSON.stringify(authenticationDetails));
        
    var userParams: GetUserRequest = {
        AccessToken: authenticationDetails.AuthenticationResult.AccessToken
    }
    var userResponse: GetUserResponse = await cognito.getUser(userParams).promise();
    return createSuccessResponse(JSON.stringify(createAuthResponse(authenticationDetails.AuthenticationResult, userResponse)))
}

export async function forgotPassword(email){
    const cognito = new cognitoProvider();
    var secretName = process.env.COGNITO_CLIENT_SECRET_NAME;
    var secretData = await getSecretValues(secretName);
    var congitoClientSecret: CognitoClient = JSON.parse(secretData)

    var resetPasswordRequest = {
        Username: email,
        ClientId: congitoClientSecret.id,
        SECRET_HASH: createSecretHash(congitoClientSecret.id, congitoClientSecret.secret, email)
    }
    var response = await cognito.forgotPassword(resetPasswordRequest);
    return createSuccessResponse(JSON.stringify(response));
}

export async function ReAuthUser(uuid, refreshToken){
    const cognito = new cognitoProvider();
    var username = await getEmailFromUUID(uuid)
    var secretName = process.env.COGNITO_CLIENT_SECRET_NAME;
    var secretData = await getSecretValues(secretName);

    var congitoClientSecret: CognitoClient = JSON.parse(secretData)
    var authenticationRequest: InitiateAuthRequest = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: congitoClientSecret.id,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
            SECRET_HASH: createSecretHash(congitoClientSecret.id, congitoClientSecret.secret, username)
        },
    };

    var authenticationDetails = await cognito.initiateAuth(authenticationRequest).promise();
    return createSuccessResponse(JSON.stringify(createAuthResponse(authenticationDetails.AuthenticationResult)))
}

export async function changePassword(username, newPassword, session){
    var cognito = new cognitoProvider();
    var secretName = process.env.COGNITO_CLIENT_SECRET_NAME;
    console.log(secretName);
    var secretData = await getSecretValues(secretName);
    var congitoClientSecret: CognitoClient = JSON.parse(secretData)

    var challengeParams: RespondToAuthChallengeRequest = {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: congitoClientSecret.id,
        ChallengeResponses: {
            USERNAME: username,
            NEW_PASSWORD: newPassword,
            SECRET_HASH: createSecretHash(congitoClientSecret.id, congitoClientSecret.secret, username)
        },
        Session: session
    }

    var response = await cognito.respondToAuthChallenge(challengeParams).promise();
    var userParams: GetUserRequest = {
        AccessToken: response.AuthenticationResult.AccessToken
    }
    var userResponse: GetUserResponse = await cognito.getUser(userParams).promise();
    return createSuccessResponse(JSON.stringify(createAuthResponse(response.AuthenticationResult, userResponse)));
}

function createSecretHash(clientId, clientSecret, username){
    const data = username + clientId;
    const key = clientSecret;
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    const hash = hmac.digest('base64');
    return hash;
}

function createAuthResponse(authResult: AuthenticationResultType, userResponse?: GetUserResponse): AuthResponse{
    console.log('User Info: ' + userResponse);
    let uuid: string = undefined;
    if(userResponse !== undefined){
        const userAttributes: AttributeListType = userResponse.UserAttributes;
        userAttributes.forEach(x => {
            if(x.Name == 'sub'){
                uuid = x.Value;
                return;
            }
        });
    }

    const response: AuthResponse = {
        AccessKey: authResult.AccessToken,
        RefreshToken: authResult.RefreshToken,
        IdToken: authResult.IdToken,
        UUID: uuid 
    }

    return response;
}

function getEmailFromUUID(uuid){
    var cognito = new cognitoProvider();
    var filter = "sub = \"" + uuid + "\"";
    const params: ListUsersRequest = {
        UserPoolId: 'eu-central-1_KF4vBlchS',
        Filter: filter
    }

    cognito.listUsers(params, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (data.Users.length === 1){ //as far as we search by sub, should be only one user.
                console.log(JSON.stringify(data));
                return "outlaw1198@gmail.com";
            } else {
                console.log("Something wrong.");
            }
        }
    });
}