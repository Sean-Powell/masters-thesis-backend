import dynanmodb from 'aws-sdk/clients/dynamodb'

export async function getSurveyStatusForUser(uuid: string): Promise<boolean>{
    const dynamo = new dynanmodb();
    const params = {
        TableName: process.env.USERTABLE_TABLE_NAME,
        Key: {
            UUID: { S: uuid} 
        }
    }

    try
    {
        const result = await dynamo.getItem(params).promise();
        return result.Item.surveyComplete.BOOL;
    }catch(err){
        console.error("There was an error getting the user for " + uuid + " | " + err);
        throw err;
    }
}