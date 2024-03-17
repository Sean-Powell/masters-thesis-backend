import dynamoDbClient from 'aws-sdk/clients/dynamodb';

export async function saveToDyanmo(key: string, uuid: string, params){
    const dynamo = new dynamoDbClient();

    try{
        await dynamo.putItem(params).promise();
    }catch(err){
        console.error("Failed to save " + key + " to dyanmo for " + uuid + " | " + err);
        throw err;
    }
}