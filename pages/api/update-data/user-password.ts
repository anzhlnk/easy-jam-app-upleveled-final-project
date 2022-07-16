import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  getUserWithPasswordHashByUsername,
  getValidSessionByToken,
  updatePassword,
} from '../../../util/database';

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number; username: string } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (!req.body.csrfToken) {
    return res.status(400).json({
      errors: [{ message: 'no csrf token found' }],
    });
  }

  // 1. get the csrfToken from the body
  const csrfToken = req.body.csrfToken;
  // 2. get the sessionToken from the cookies
  const sessionToken = req.cookies.sessionToken;

  // 3. get the session for this session Token
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return res.status(403).json({
      errors: [{ message: 'unauthorized user' }],
    });
  }
  // 4.  validate the csrf token against the seed we have in the database
  if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
    return res.status(403).json({
      errors: [{ message: 'csrf not valid' }],
    });
  }

  // check the method to be PUT
  if (req.method === 'PUT') {
    if (
      typeof req.body.oldPassword !== 'string' ||
      typeof req.body.newPassword !== 'string' ||
      typeof req.body.confirmedNewPassword !== 'string' ||
      !req.body.oldPassword ||
      !req.body.newPassword ||
      !req.body.confirmedNewPassword
    ) {
      res.status(400).json({
        errors: [{ message: 'password not provided' }],
      });
      return;
    }

    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      req.body.user.username,
    );
    const username = userWithPasswordHash.username;

    // compare  the hashed  password with the entered one
    const passwordMatches = await bcrypt.compare(
      req.body.oldPassword,
      userWithPasswordHash.passwordHash,
    );

    if (!passwordMatches) {
      res
        .status(401)
        .json({ errors: [{ message: 'Password does not match' }] });
      return;
    }

    if (req.body.newPassword !== req.body.confirmedNewPassword) {
      res.status(400).json({
        errors: [{ message: 'Password does not match' }],
      });
      return;
    }

    // to hash the password
    const passwordHash = await bcrypt.hash(req.body.newPassword, 12);

    // to update the password
    await updatePassword(username, passwordHash);

    res.status(200);
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
