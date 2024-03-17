import secretClient, { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager'

export async function getSecretValues (secretName) : Promise<string> {
    const client = new secretClient();

    const params = {
        SecretId: secretName
    }

    try
    {
        const response = await client.getSecretValue(params).promise();
        return response.SecretString;
    }catch(err){
        console.error('Was unable to get secret ' + secretName + ' got error ' + err);
        return '';
    }
}