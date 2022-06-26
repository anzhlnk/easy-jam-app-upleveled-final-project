import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createCSRFSecret } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  getUserWithPasswordHashByUsername,
} from '../../util/database';

export type LoginResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number; username: string } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseBody>,
) {
  // check the method to be post
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.username ||
      !req.body.password
    ) {
      res
        .status(400)
        .json({ errors: [{ message: 'username or password not provided' }] });
      return;
    }

    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      req.body.username,
    );

    if (!userWithPasswordHash) {
      res
        .status(401)
        .json({ errors: [{ message: 'Username or password does not match' }] });
      return;
    }

    // compare  the hashed  password with the entered one
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userWithPasswordHash.passwordHash,
    );

    if (!passwordMatches) {
      res
        .status(401)
        .json({ errors: [{ message: 'Username or password does not match' }] });
      return;
    }
    const userId = userWithPasswordHash.id;
    const username = userWithPasswordHash.username;

    // create a token
    const token = crypto.randomBytes(80).toString('base64');

    // create a secret

    const csrfSecret = createCSRFSecret();

    const session = await createSession(token, userId, csrfSecret);

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    res
      .status(200)
      // for cookies to be created
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: userId, username: username } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
