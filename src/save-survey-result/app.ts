import {v4 as uuidV4} from 'uuid'
import { saveToS3 } from '../shared-services/saveToS3';
import { saveToDyanmo } from '../shared-services/saveToDynamo';
import { createErrorResponse, createSuccessResponse } from '../shared-services/CreateResponseStatus';
import { updateSurveyDone } from './services/updateSurveyStatus';

export const handler = async (event) => {
    const { uuid } = event.queryStringParameters;
    const body = event.body;

    try{
        const key = uuidV4();
        const s3params = {
            Bucket: process.env.SURVEYBUCKET_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: 'application/json'
        }
        await saveToS3(body, s3params);

        const dyamoParams = {
            TableName: process.env.SURVEYTABLE_TABLE_NAME,
            Item: {
                UUID: { S: uuid },
                Key: { S: key }
            }
        };
        await saveToDyanmo(key, uuid, dyamoParams);
        await updateSurveyDone(uuid);
        return createSuccessResponse("Response Saved");
    }catch(err){
        console.error("Error saving survey result: " + JSON.stringify(event) + " | " + err);
        return createErrorResponse(500, "Error saving survey repsonse");
    }
}