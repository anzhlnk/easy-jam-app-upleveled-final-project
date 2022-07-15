import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  addAUserToTheConversation,
  createNewConversation,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getValidSessionByToken,
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

  if (req.method === 'POST') {
    // to  get the user from the token
    const currentUser = await getUserByValidSessionToken(sessionToken);
    const currentUserdataId = await getPersonalDataIDByUserId(currentUser.id);
    const createdNewConversation = await createNewConversation();

    const usersConversationList = [
      {
        personal_data_id: currentUserdataId,
        conversation_id: createdNewConversation.id,
      },
      {
        personal_data_id: req.body.buddyPersonalDataId,
        conversation_id: createdNewConversation.id,
      },
    ];

    const addedUserToTheConversation = await addAUserToTheConversation(
      usersConversationList,
    );

    return res.status(200).json(createdNewConversation);
  }

  // if a method not allowed is used
  res.status(405).json({
    errors: [{ message: 'Method not allowed' }],
  });
}
