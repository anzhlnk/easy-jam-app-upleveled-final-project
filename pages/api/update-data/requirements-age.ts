import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  getValidSessionByToken,
  updateAgeRequirements,
} from '../../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.body.csrfToken) {
    return res.status(400).json({
      error: 'no csrf token Found',
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
      error: 'unauthorized user',
    });
  }
  // 4.  validate the csrf token against the seed we have in the database
  if (!(await verifyCsrfToken(session.csrfSecret, csrfToken))) {
    return res.status(403).json({
      error: 'csrf is not valid',
    });
  }

  if (req.method === 'PUT') {
    const updatedAge = await updateAgeRequirements(
      req.body.dataId,
      req.body.updatedRequiredAgeMin,
      req.body.updatedRequiredAgeMax,
    );

    return res.status(200).json(updatedAge);
  }

  // if a method not allowed is used
  res.status(405).json({
    error: 'Method not allowed',
  });
}
