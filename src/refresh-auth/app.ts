import { ReAuthUser } from "../shared-services/AuthenticateUser";

export const handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const refreshToken: string = requestBody.refreshToken;
    const uuid: string = requestBody.uuid;
    console.info("refreshToken: " + refreshToken);
    console.info("email: " + uuid);
    return await ReAuthUser(uuid, refreshToken);
}