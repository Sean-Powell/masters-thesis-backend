import dynanmodb from 'aws-sdk/clients/dynamodb'

export async function getImageInfo(imageId: string): Promise<string>{
    const dynamo = new dynanmodb();
    const params = {
        TableName: process.env.IMAGETABLE_TABLE_NAME,
        Key: {
            ImageId: { S: imageId} 
        }
    }

    try
    {
        const result = await dynamo.getItem(params).promise();
        return result.Item.key.S;
    }catch(err){
        console.error("There was an error getting the user for " + imageId + " | " + err);
        throw err;
    }
}