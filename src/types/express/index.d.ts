import { UserInterface } from "@src/modules/users/interfaces.users";

export { }

declare global {
    namespace Express {
        export interface Request {
            user?: UserInterface;
        }
    }
}