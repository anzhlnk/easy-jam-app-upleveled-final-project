import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import {
  getGenders,
  getInstruments,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
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
      !req.body.latitude ||
      !req.body.profilePicture
    ) {
      return res.status(400).json({
        errors: [{ message: 'Please add personal data' }],
      });
    }

    const currentUser = await getUserByValidSessionToken(sessionToken);
    const currentUserDataId = await getPersonalDataIDByUserId(currentUser.id);

    const defaultPreferredDistance = 100;
    const addedLocation = await insertLocation(
      req.body.location,
      req.body.longitude,
      req.body.latitude,
      defaultPreferredDistance, // standard value
    );
    const defaultPreferredStatus = 1; // standard value (1-visible, 0-not visible)

    const updatedProfileInfo = await updateProfileInfo(
      currentUserDataId,
      req.body.firstName,
      req.body.lastName,
      req.body.birthday,
      req.body.gender,
      req.body.profilePicture,
      addedLocation.id,
      defaultPreferredStatus,
    );

    // to be updated
    type InstrumentType = {
      label: string;
      value: number;
    };

    const listOfInstruments = req.body.usersInstruments.map(
      (instrument: InstrumentType) => {
        return instrument.value;
      },
    );
    type InstrumentTypeForDB = number;
    const usersInstruments = listOfInstruments.map(
      (instrument: InstrumentTypeForDB) => {
        return {
          personal_data_id: currentUserDataId,
          instrument_id: instrument,
          relation_type_id: 1,
        };
      },
    );

    type GenreType = {
      label: string;
      value: number;
    };

    const listOfGenres = req.body.usersGenres.map((genre: GenreType) => {
      return genre.value;
    });
    type GenreTypeForDB = number;
    const usersGenres = listOfGenres.map((genre: GenreTypeForDB) => {
      return { personal_data_id: currentUserDataId, genre_id: genre };
    });

    await insertInstruments(usersInstruments);
    await insertGenres(usersGenres);

    // standard value
    const defaultRequiredAge = [12, 100];
    await insertDefaultRequiredAge(
      currentUserDataId,
      defaultRequiredAge[0],
      defaultRequiredAge[1],
    );

    const listOfInstrumentsFromDb = await getInstruments();

    type Instrument = {
      id: number;
      instrumentName: string;
    };
    // standard value
    const defaultListOfInstruments = listOfInstrumentsFromDb.map(
      (instrument: Instrument) => {
        return {
          personal_data_id: currentUserDataId,
          instrument_id: instrument.id,
          relation_type_id: 2,
        };
      },
    );
    // standard value
    await insertDefaultRequiredInstruments(defaultListOfInstruments);

    type Gender = {
      id: number;
      genderName: string;
    };
    const listOfGenders = await getGenders();
    // standard value
    const defaultListOfGenders = listOfGenders.map((gender: Gender) => {
      return {
        personal_data_id: currentUserDataId,
        gender_id: gender.id,
      };
    });

    // standard value
    await insertDefaultRequiredGenders(defaultListOfGenders);

    return res.status(200).json(updatedProfileInfo);
    // res.status(200).json(addedLocation),
    // res.status(200).json(addedInstruments),
    // res.status(200).json(addedGenres)
  }

  // if a method not allowed is used
  res.status(405).json({
    errors: [{ message: 'Method not allowed' }],
  });
}
