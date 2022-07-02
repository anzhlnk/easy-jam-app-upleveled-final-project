import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createCSRFSecret } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  addEmailToDatabase,
  createSession,
  createUser,
  getUserByUsername,
} from '../../util/database';

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
  // check the method to be post
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email
    ) {
      res.status(400).json({
        errors: [{ message: 'email, username or password not provided' }],
      });
      return;
    }

    // further checks are to be added here

    if (await getUserByUsername(req.body.username)) {
      res.status(401).json({ errors: [{ message: 'username already taken' }] });
      return;
    }
    // to hash the password
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    // to create the user
    const newUser = await createUser(req.body.username, passwordHash);

    // to create a token
    const token = crypto.randomBytes(80).toString('base64');

    // to create a secret

    const csrfSecret = createCSRFSecret();

    const session = await createSession(token, newUser.id, csrfSecret);

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    const addEmail = await addEmailToDatabase(req.body.email, newUser.id);

    res
      .status(200)
      // to create cookies
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: newUser.id, username: newUser.username } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
