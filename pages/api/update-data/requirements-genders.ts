import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  addRequiredGender,
  deleteRequiredGender,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
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
  // 5. to  get the user from the token
  const currentUser = await getUserByValidSessionToken(sessionToken);
  const currentUserDataId = await getPersonalDataIDByUserId(currentUser.id);

  // if method Delete
  if (req.method === 'DELETE') {
    const deletedRequiredGenders = await deleteRequiredGender(
      currentUserDataId,
      req.body.removedItemId,
    );
    return res.status(200).json(deletedRequiredGenders);
  }

  if (req.method === 'PUT') {
    const addedGenders = req.body.addedItems.map((gender: number) => {
      return {
        personal_data_id: currentUserDataId,
        gender_id: gender,
      };
    });

    const addedRequiredGenders = await addRequiredGender(addedGenders);
    return res.status(200).json(addedRequiredGenders);
  }

  // if a method not allowed is used
  res.status(405).json({
    errors: [{ message: 'Method not allowed' }],
  });
}
