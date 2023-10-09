import { ISession } from "../types/context.types";

const getSession = async (token: string): Promise<ISession | null> => {
  try {
    let b = await fetch(`${process.env.BASE_URL}/api/auth/session`, {
      headers: {
        Cookie: `next-auth.session-token=${token}`,
      },
    });
    let c = await b.json();
    if (c["user"]) {
      return c as ISession;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default getSession;
