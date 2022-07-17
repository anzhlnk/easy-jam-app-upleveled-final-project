import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  getLocationIdByPersonalDataID,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getValidSessionByToken,
  updatePersonalDataFromAccount,
} from '../../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

  if (req.method === 'PUT') {
    // to  get the user from the token
    const user = await getUserByValidSessionToken(sessionToken);
    const dataId = await getPersonalDataIDByUserId(user.id);
    if (
      typeof req.body.firstName !== 'string' ||
      typeof req.body.lastName !== 'string' ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.birthday ||
      !req.body.location
    ) {
      res.status(400).json({ errors: [{ message: 'form is not complete' }] });
      return;
    }

    const locationID = await getLocationIdByPersonalDataID(dataId);
    const updatedPersonalData = await updatePersonalDataFromAccount(
      dataId,
      req.body.firstName,
      req.body.lastName,
      req.body.birthday,
      locationID,
      req.body.location,
      req.body.longitude,
      req.body.latitude,
    );

    return res.status(200).json(updatedPersonalData);
  }

  // if a method not allowed is used
  res.status(405).json({
    errors: [{ message: 'Method not allowed' }],
  });
}
