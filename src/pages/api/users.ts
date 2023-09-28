import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../backend/users";
import defaultHandler from "@/pages/_defaultHandler";
import { authenticateUser } from "@/web/token";

const handler = defaultHandler<NextApiRequest, NextApiResponse>().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await createUser(req.body);

    authenticateUser(res, user);
    res.json(user);
  }
);

export default handler;
