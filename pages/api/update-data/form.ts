import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  getGenders,
  getInstruments,
  getValidSessionByToken,
  insertDefaultRequiredAge,
  insertDefaultRequiredGenders,
  insertDefaultRequiredInstruments,
  insertGenres,
  insertInstruments,
  insertLocation,
  updateProfileInfo,
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

  // if method PUT
  if (req.method === 'PUT') {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.birthday ||
      !req.body.usersInstruments ||
      !req.body.usersGenres ||
      !req.body.gender ||
      !req.body.location ||
      !req.body.longitude ||
      !req.body.latitude
    ) {
      return res.status(400).json({
        errors: [{ message: 'Please add personal data' }],
      });
    }

    const defaultPreferredDistance = 100;
    const addedLocation = await insertLocation(
      req.body.location,
      req.body.longitude,
      req.body.latitude,
      defaultPreferredDistance, // standard value
    );

    const defaultPreferredStatus = 1; // standard value (1-visible, 0-not visible)

    const updatedProfileInfo = await updateProfileInfo(
      req.body.dataId,
      req.body.firstName,
      req.body.lastName,
      req.body.birthday,
      req.body.gender,
      req.body.profilePicture,
      addedLocation.id,
      defaultPreferredStatus,
    );

    const addedInstruments = await insertInstruments(req.body.usersInstruments);
    const addedGenres = await insertGenres(req.body.usersGenres);

    const dataId = req.body.dataId;
    // standard value
    const defaultRequiredAge = [0, 100];
    await insertDefaultRequiredAge(
      dataId,
      defaultRequiredAge[0],
      defaultRequiredAge[1],
    );

    const listOfInstruments = await getInstruments();

    type Instrument = {
      id: string;
      instrumentName: string;
    };
    // standard value
    const defaultListOfInstruments = listOfInstruments.map(
      (instrument: Instrument) => {
        return {
          personal_data_id: dataId,
          instrument_id: instrument.id,
          relation_type_id: 2,
        };
      },
    );
    // standard value
    await insertDefaultRequiredInstruments(defaultListOfInstruments);

    type Gender = {
      id: string;
      genderName: string;
    };
    const listOfGenders = await getGenders();
    // standard value
    const defaultListOfGenders = listOfGenders.map((gender: Gender) => {
      return {
        personal_data_id: dataId,
        gender_id: gender.id,
      };
    });

    // standard value
    await insertDefaultRequiredGenders(defaultListOfGenders);

    return (
      res.status(200).json(updatedProfileInfo),
      res.status(200).json(addedLocation),
      res.status(200).json(addedInstruments),
      res.status(200).json(addedGenres)
    );
  }

  // if a method not allowed is used
  res.status(405).json({
    errors: [{ message: 'Method not allowed' }],
  });
}
