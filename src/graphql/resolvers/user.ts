import { IGraphQLContext } from "../../utils/types/context.types";
import { ICreateUsernameReturn } from "../../utils/types/user.types";

const resolvers = {
  Query: {
    searchUser: () => {},
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: IGraphQLContext,
    ): Promise<ICreateUsernameReturn> => {
      const { username } = args;
      const { session, prisma } = context;

      if (!session) {
        return { success: false, error: "Not Authorized" };
      }
      const { id: userId } = session.user;

      try {
        // Step 1: Check if the username available
        const existingUsers = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (existingUsers) {
          return {
            success: false,
            error: "Username already taken.Try another username",
          };
        }
        // Step 2: Update user

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });
        return { success: true };
      } catch (err: any) {
        console.log("createUsername error ", err);
        return { success: false, error: err?.message };
      }
    },
  },
};

export default resolvers;
