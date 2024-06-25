import { prismaClient } from "../src/application/database";

export class UserTest {
    static async delete() {
        await prismaClient.user.delete({
            where:{
                username: "Test"
            }
        })
    }
}