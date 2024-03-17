import { forgotPassword } from "../shared-services/AuthenticateUser";

export const handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const email: string = requestBody.email;
    return await forgotPassword(email);
}