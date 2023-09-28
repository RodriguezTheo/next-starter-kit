import { NextApiRequest, NextApiResponse } from "next";
import defaultHandler from "@/pages/_defaultHandler";
import { authenticateUser, clearUser } from "@/web/token";
import { login } from "../../../backend/auth";

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await login(req.body);

    if (user) {
      authenticateUser(res, user);
      res.json(user);
    } else {
      res.status(404).send("");
    }
  })
  .delete((_req: NextApiRequest, res: NextApiResponse) => {
    clearUser(res);

    res.send("");
  });

export default handler;
