import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  addRequiredGender,
  deleteRequiredGender,
  getValidSessionByToken,
} from '../../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('updating gender');

  if (!req.body.csrfToken) {
    return res.status(400).json({
      errors: [{ message: 'no csrf token Found' }],
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
      errors: [{ message: 'csrf is not valid' }],
    });
  }

  // if method Delete
  if (req.method === 'DELETE') {
    const deletedRequiredGenders = await deleteRequiredGender(
      req.body.dataId,
      req.body.removedItemId,
    );
    return res.status(200).json(deletedRequiredGenders);
  }

  if (req.method === 'PUT') {
    console.log('req.body in added requirements', JSON.stringify(req.body));

    const addedRequiredGenders = await addRequiredGender(req.body.addedItems);
    return res.status(200).json(addedRequiredGenders);
  }

  // if a method not allowed is used
  res.status(405).json({
    errors: [{ message: 'Method not allowed' }],
  });
}
