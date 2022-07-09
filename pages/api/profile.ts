import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserByValidSessionToken,
  getUserProfileImageByUserID,
} from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // to  get the cookie from the request
    const token = req.cookies.sessionToken;

    if (!token) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }

    // to  get the user from the token

    const user = await getUserByValidSessionToken(token);
    const profileImage = await getUserProfileImageByUserID(user.id);

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ message: 'Session token not valid' }] });
      return;
    }

    // to return the user
    res.status(200).json({ user: user, profileImage: profileImage });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
