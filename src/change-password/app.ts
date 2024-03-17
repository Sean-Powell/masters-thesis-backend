import { changePassword } from "../shared-services/AuthenticateUser";

export const handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const email: string = requestBody.email;
    const password: string = requestBody.password;
    const session: string = requestBody.session;
    console.info("email: " + email);
    console.info("password: " + password);
    console.info("session: " + session);
    return await changePassword(email, password, session);
}