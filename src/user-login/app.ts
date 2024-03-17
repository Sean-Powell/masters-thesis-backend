import { AuthenticateUser } from "../shared-services/AuthenticateUser";

export const handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const email: string = requestBody.email;
    const password: string = requestBody.password;
    return await AuthenticateUser(email, password);
}