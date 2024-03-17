import dynamoDb from 'aws-sdk/clients/dynamodb';

export async function saveUser (uuid: string): Promise<void> {
    const dynamo = new dynamoDb();
    const sliceSize: number = parseInt(process.env.SLICE_SIZE);
    const slices = Math.ceil(2000 / sliceSize);

    const startingSlice = Math.floor(Math.random() * ((slices + 1) - 0) + 0) 
    const startingImage = startingSlice * sliceSize;
    const params = {
        TableName: process.env.USERTABLE_TABLE_NAME,
        Item: {
            'UUID': { S: uuid },
            'lastImage': { S: startingImage.toString() },
            'surveyComplete': { BOOL: false },
            'totalDone': { S: "1" }
        }
    }

    try{
        await dynamo.putItem(params).promise();
    }catch(err){
        console.error("failled to store " + uuid + ", " + startingSlice + " | " + err);
    }
}