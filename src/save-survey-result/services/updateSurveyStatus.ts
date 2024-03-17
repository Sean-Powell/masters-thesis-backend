import dynamoDb, { UpdateItemInput } from 'aws-sdk/clients/dynamodb';

export async function updateSurveyDone (uuid: string): Promise<void> {
    const dynamo = new dynamoDb();

    const params: UpdateItemInput = {
        TableName: process.env.USERTABLE_TABLE_NAME,
        Key: {
          UUID: {'S': uuid }
        },
        UpdateExpression: 'SET surveyComplete = :newValue',
        ExpressionAttributeValues: {
          ':newValue': { 'BOOL': true }
        }
    };

    try{
        await dynamo.updateItem(params).promise();
    }catch(err){
        console.error("failled to update " + uuid + ' | '+ err);
    }
}