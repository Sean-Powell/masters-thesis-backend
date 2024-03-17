import dynanmodb from 'aws-sdk/clients/dynamodb'
import { UserDataResponse } from './dtos/UserDataResponse';

export async function getNextImageForUser(uuid: string): Promise<UserDataResponse>{
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
        console.log("Last Image: " + JSON.stringify(result));
        var response: UserDataResponse = {
            lastImage: result.Item.lastImage.S,
            totalDone: result.Item.totalDone.S,
        };
        return response;
    }catch(err){
        console.error("There was an error getting the user for " + uuid + " | " + err);
        throw err;
    }
}