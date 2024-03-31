import { createDateRespoinse, createErrorResponse } from "../shared-services/CreateResponseStatus";
import { getImage } from "./services/getImage";
import { getImageInfo } from "./services/getImageInfo";
import { getNextImageForUser } from "../shared-services/getNextImageForUser";
import { UserDataResponse } from "../shared-services/dtos/UserDataResponse";
import { NextImageResponse } from "../shared-services/dtos/NextImageResponse"

export const handler = async (event) => {
    const { uuid } = event.queryStringParameters;
    try{
        const userDate: UserDataResponse = await getNextImageForUser(uuid);
        const imageKey = await getImageInfo(userDate.lastImage);
        const imageData = await getImage(imageKey);

        const response: NextImageResponse = {
            image: imageData,
            count: userDate.totalDone
        }
        return createDateRespoinse(response);
    }catch(err){
        return createErrorResponse(400, err.message);
    }
}