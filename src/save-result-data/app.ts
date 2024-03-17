import {v4 as uuidV4} from 'uuid'
import { saveToS3 } from '../shared-services/saveToS3';
import { saveToDyanmo } from '../shared-services/saveToDynamo';
import { createErrorResponse, createSuccessResponse } from '../shared-services/CreateResponseStatus';
import { getNextImageForUser } from '../shared-services/getNextImageForUser';
import { updateNextImage } from './services/updateNextImage';
import { UserDataResponse } from '../shared-services/dtos/UserDataResponse';

export const handler = async (event) => {
    const { uuid } = event.queryStringParameters;
    const body = event.body;

    try{
        const key = uuidV4();
        const s3params = {
            Bucket: process.env.RESULTBUCKET_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: 'application/json'
        }
        await saveToS3(body, s3params);

        const userData: UserDataResponse = await getNextImageForUser(uuid);

        const dyamoParams = {
            TableName: process.env.RESULTTABLE_TABLE_NAME,
            Item: {
                UUIID: { S: uuid },
                ImageId: { S: userData.lastImage },
                Key: { S: key }
            }
        };
        await saveToDyanmo(key, uuid, dyamoParams);
        return await updateNextImage(uuid, userData.lastImage, userData.totalDone)
    }catch(err){
        console.error("Error saving tracking result: " + JSON.stringify(event) + " | " + err);
        return createErrorResponse(500, "Error saving tracking result");
    }
}