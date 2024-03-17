import dynamoDbClient from 'aws-sdk/clients/dynamodb';
import { createErrorResponse, createSuccessResponse } from '../../shared-services/CreateResponseStatus';

export async function updateNextImage (uuid: string, previousImage: string, totalDoneStr: string) {
    const dynamo = new dynamoDbClient();
    let nextImageNum = parseInt(previousImage);
    nextImageNum += 1;
    if (nextImageNum > 2000){
        nextImageNum = 1;
    }

    let totalDoneNum = parseInt(totalDoneStr);
    totalDoneNum += 1;

    console.log("Next image is: " + nextImageNum);
    let params = {
        TableName: process.env.RESULTTABLE_TABLE_NAME,
        Key: {
            UUIID: { S: uuid },
            ImageId: { S: nextImageNum.toString() }
        }
    }

    try{
        const data = await dynamo.getItem(params).promise();
        console.log('Next Image Data: ' + JSON.stringify(data));
        if(isEmptyObject(data)){
            //get next image and return it
            const userParams = {
                TableName: process.env.USERTABLE_TABLE_NAME,
                Item: {
                    UUID: { S: uuid },
                    lastImage: { S : nextImageNum.toString() },
                    totalDone: { S : totalDoneNum.toString() }
                }
            };
            
            try{
                const result = await dynamo.putItem(userParams).promise();
                return createSuccessResponse("Response saved");
            }
            catch(updateErr){
                console.log("Failed to update item " + uuid + " with next image " + nextImageNum);
                return createErrorResponse(500, "Failed to update next image");
            }
        }else{
            //next image is already done, user has done all images
            console.log("User " + uuid + " has finished all images");
            return createErrorResponse(201, "All Images Done");
        }
    }catch(err){
        
    }
}

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}