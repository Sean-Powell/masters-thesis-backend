import { createErrorResponse, createSuccessResponse } from "../shared-services/CreateResponseStatus";
import { getSurveyStatusForUser } from "../shared-services/getSurveyStatusForUser";

export const handler = async (event) => {
    const { uuid } = event.queryStringParameters;
    try{
        const surveyStatus = await getSurveyStatusForUser(uuid);
        return createSuccessResponse(surveyStatus.toString());
    }catch(err){
        return createErrorResponse(400, err.message);
    }
}