import camelcaseKeys from 'camelcase-keys';
import { ADDRCONFIG } from 'dns';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();

function connectOneTimeToDatabase() {
  if (!globalThis.postgresSqlClient) {
    globalThis.postgresSqlClient = postgres();
  }
  const sql = globalThis.postgresSqlClient;

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

// SignUp process

// Create a user

export async function createUser(username, passwordHash) {
  const [user] = await sql`
  INSERT INTO users
    (username, password_hash)
  VALUES
    (${username}, ${passwordHash})
  RETURNING
    id,
    username
  `;

  return camelcaseKeys(user);
}

export async function addEmailToDatabase(email, id) {
  const emailInPersonalData = await sql`
  INSERT INTO personal_data
    (email, user_id)
  VALUES
    (${email}, ${id})
  RETURNING
    id, user_id
  `;

  return camelcaseKeys(emailInPersonalData);
}

export async function deleteExpiredSessions() {
  const sessions = await sql`
  DELETE FROM
    sessions
  WHERE
    expiry_timestamp < now()
  RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

export async function getUserByUsername(username) {
  if (!username) return undefined;

  const [user] = await sql`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserProfileImageByUserID(id) {
  if (!id) return undefined;

  const [userPhoto] = await sql`
    SELECT
    profile_picture_url
    FROM
    personal_data
    WHERE
      user_id = ${id}
  `;
  return userPhoto && camelcaseKeys(userPhoto);
}

export async function getUserPersonalData(userId) {
  if (!userId) return undefined;

  const [personalData] = await sql`
    SELECT
    personal_data.first_name AS first_name,
    personal_data.last_name AS last_name,
    personal_data.birthday AS birthday,
    locations.address AS address,
    personal_data.short_description AS short_description,
    personal_data.about_me AS about_me,
    personal_data.profile_picture_url AS profile_picture_url
    FROM
    personal_data,
    locations
    WHERE
    personal_data.user_id = ${userId} AND
    personal_data.location_id = locations.id
  `;
  return personalData && camelcaseKeys(personalData);
}

export async function getUserById(userId) {
  if (!userId) return undefined;

  const [user] = await sql`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${userId}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username) {
  if (!username) return undefined;

  const [user] = await sql`
    SELECT
     *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function createSession(token, userId, CSRFSecret) {
  const [session] = await sql`
  INSERT INTO sessions
    (token, user_id, csrf_secret)
  VALUES
    (${token}, ${userId}, ${CSRFSecret})
  RETURNING
    id,
    token
  `;

  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

export async function getValidSessionByToken(token) {
  if (!token) return undefined;

  const [session] = await sql`
  SELECT
    sessions.id,
    sessions.token,
    sessions.csrf_secret
  FROM
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

export async function getUserByValidSessionToken(token) {
  if (!token) return undefined;

  const [user] = await sql`
  SELECT
    users.id,
    users.username
  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.user_id = users.id AND
    sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return user && camelcaseKeys(user);
}

export async function deleteSessionByToken(token) {
  const [session] = await sql`
  DELETE FROM
    sessions
  WHERE
    sessions.token = ${token}
  RETURNING *
  `;

  return session && camelcaseKeys(session);
}

// Insert profile info

export async function getPersonalDataIDByUserId(userId) {
  if (!userId) return undefined;

  const [dataId] = await sql`
    SELECT
      id
    FROM
    personal_data
    WHERE
      user_id = ${userId}
  `;
  // return dataId && camelcaseKeys(dataId);
  return dataId.id;
}

// const users_instrument = [
//   {
//     name: 'Murray',
//     age: 68,
//     garbage: 'ignore',
//   },
//   {
//     name: 'Walter',
//     age: 80,
//   },
// ];

// sql`insert into users ${sql(users, 'name', 'age')}`;

export async function insertLocation(
  location,
  longitude,
  latitude,
  preferredDistance,
) {
  const [addedLocation] = await sql`
INSERT INTO locations
(longitude,
latitude,
address,
preferred_distance)
VALUES
(${longitude}, ${latitude}, ${location}, ${preferredDistance})
RETURNING *;
`;
  return camelcaseKeys(addedLocation);
}

export async function updateProfileInfo(
  dataID,
  firstName,
  lastName,
  birthday,
  gender,
  profilePicture,
  locationId,
  defaultPreferredStatus,
) {
  const [profileData] = await sql`
UPDATE
personal_data
    SET
      first_name = ${firstName},
      last_name = ${lastName},
      birthday = ${birthday},
      profile_picture_url = ${profilePicture},
      gender_id = ${gender},
      location_id = ${locationId},
      status  = ${defaultPreferredStatus}
    WHERE
      id = ${dataID}
    RETURNING *;
  `;
  return camelcaseKeys(profileData);
}

export async function insertInstruments(usersInstruments) {
  const [addedUsersInstruments] = await sql`
  INSERT INTO users_instruments ${sql(
    usersInstruments,
    'personal_data_id',
    'instrument_id',
    'relation_type_id',
  )}`;
  return camelcaseKeys(addedUsersInstruments);
}

export async function insertGenres(usersGenres) {
  const [addedUsersGenres] = await sql`
  INSERT INTO users_genres ${sql(usersGenres, 'personal_data_id', 'genre_id')}`;
  return camelcaseKeys(addedUsersGenres);
}

export async function insertDefaultRequiredAge(dataId, minAge, maxAge) {
  const [usersDefaultAgeRequirements] = await sql`
insert into age_requirements(personal_data_id,buddy_age_min, buddy_age_max)
values(${dataId}, ${minAge},${maxAge})
RETURNING *`;
  return camelcaseKeys(usersDefaultAgeRequirements);
}

export async function insertDefaultRequiredInstruments(
  defaultRequiredInstruments,
) {
  const [addedDefaultInstruments] = await sql`
  INSERT INTO users_instruments ${sql(
    defaultRequiredInstruments,
    'personal_data_id',
    'instrument_id',
    'relation_type_id',
  )}`;
  return camelcaseKeys(addedDefaultInstruments);
}

export async function insertDefaultRequiredGenders(defaultListOfGenders) {
  const [addedDefaultGenders] = await sql`
  INSERT INTO gender_requirements  ${sql(
    defaultListOfGenders,
    'personal_data_id',
    'gender_id',
  )}`;
  return camelcaseKeys(addedDefaultGenders);
}

// Select/Add/Update user Requirements

export async function getLocationIdByPersonalDataID(PersonalDataId) {
  if (!PersonalDataId) return undefined;

  const [locationId] = await sql`
    SELECT
    location_id
    FROM
    personal_data
    WHERE
      id = ${PersonalDataId}`;
  // return locationId && camelcaseKeys(locationId);
  return locationId.location_id;
}

export async function updateRequiredDistance(distance, locationID) {
  const [requiredDistance] = await sql`
UPDATE locations
SET preferred_distance = ${distance}
WHERE id = ${locationID};
`;
  return camelcaseKeys(requiredDistance);
}

export async function upsertRequiredAge(dataId, minAge, maxAge) {
  const [requiredAge] = await sql`
UPDATE age_requirements
SET buddy_age_min = ${minAge},
buddy_age_max = ${maxAge}
WHERE personal_data_id = ${dataId}
RETURNING  *
`;

  return camelcaseKeys(requiredAge);
}

export async function getInstruments() {
  const instruments = await sql`
  SELECT * FROM instruments
  `;
  return instruments && camelcaseKeys(instruments);
}

export async function getGenres() {
  const genres = await sql`
  SELECT * FROM genres
  `;
  return genres && camelcaseKeys(genres);
}

export async function getGenders() {
  const genders = await sql`
  SELECT * FROM genders
  `;
  return genders && camelcaseKeys(genders);
}

export async function getRequiredGenders(dataId) {
  const requiredGenders = await sql`
 SELECT
 gender_requirements.personal_data_id AS personal_data_id,
 gender_requirements.gender_id AS gender_id,
 genders.gender_name AS  gender_name
 FROM
gender_requirements,
genders
WHERE
gender_requirements.personal_data_id = ${dataId} AND
 genders.id = gender_requirements.gender_id
  `;
  return requiredGenders && camelcaseKeys(requiredGenders);
}

export async function getUserStatus(dataId) {
  const userStatus = await sql`
  SELECT
  id,
  status
  FROM
  personal_data
  WHERE
  id = ${dataId}
  `;
  return userStatus && camelcaseKeys(userStatus);
}

export async function getRequiredAge(dataId) {
  const requiredAgeByUser = await sql`
  SELECT
  age_requirements.personal_data_id,
  buddy_age_min,
  buddy_age_max
  FROM
age_requirements
WHERE
personal_data_id=${dataId}
  `;
  return requiredAgeByUser && camelcaseKeys(requiredAgeByUser);
}

export async function getRequiredDistance(locationId) {
  const requiredAgeByUser = await sql`
  SELECT
preferred_distance
  FROM
  locations
WHERE
locations.id=${locationId}
  `;
  return requiredAgeByUser && camelcaseKeys(requiredAgeByUser);
}

export async function getRequiredInstrument(dataId) {
  const requiredInstruments = await sql`
  SELECT
  instruments.id AS instrument_id,
  users_instruments.personal_data_id AS personal_data_id,
  users_instruments_relation.id AS relation_type_id,
  instruments.instrument_name AS instrument_name
  FROM
  users_instruments,
  instruments,
  users_instruments_relation

WHERE
 users_instruments.personal_data_id = ${dataId} AND
users_instruments_relation.id  = 2 AND
 users_instruments.relation_type_id = 2  AND
instruments.id =  users_instruments.instrument_id
  `;
  return requiredInstruments && camelcaseKeys(requiredInstruments);
}

export async function deleteRequiredInstrument(dataId, removeOption) {
  const deletedrequiredInstrument = await sql`
        DELETE FROM
        users_instruments

      WHERE
      personal_data_id = ${dataId} AND
      relation_type_id = 2 AND
      instrument_id = ${removeOption}
        RETURNING *;
      `;
  return deletedrequiredInstrument && camelcaseKeys(deletedrequiredInstrument);
}

export async function addRequiredInstrument(addedItems) {
  const [addedUserRequiredInstruments] = await sql`
    INSERT INTO users_instruments ${sql(
      addedItems,
      'personal_data_id',
      'instrument_id',
      'relation_type_id',
    )}
    ON CONFLICT (personal_data_id, instrument_id,  relation_type_id) DO NOTHING
    RETURNING instrument_id`;

  return camelcaseKeys(addedUserRequiredInstruments);
}

export async function deleteRequiredGender(dataId, removeOption) {
  const deletedrequiredGender = await sql`
        DELETE FROM
        gender_requirements

      WHERE
      personal_data_id = ${dataId} AND
      gender_id = ${removeOption}
        RETURNING *;
      `;
  return deletedrequiredGender && camelcaseKeys(deletedrequiredGender);
}

export async function addRequiredGender(addedItems) {
  const [addedUserRequiredGenders] = await sql`
    INSERT INTO  gender_requirements ${sql(
      addedItems,
      'personal_data_id',
      'gender_id',
    )}
    ON CONFLICT (personal_data_id,  gender_id) DO NOTHING
    RETURNING gender_id`;

  return camelcaseKeys(addedUserRequiredGenders);
}

export async function updateStatus(dataId, updatedStatus) {
  const updatedStatusByUser = await sql`
UPDATE personal_data
SET status = ${updatedStatus}
WHERE id = ${dataId};
`;
  return camelcaseKeys(updatedStatusByUser);
}

export async function updateDistance(updatedDistance, locationID) {
  const updatedDistanceByUser = await sql`
UPDATE locations
SET preferred_distance = ${updatedDistance}
WHERE
id = ${locationID}
`;
  return camelcaseKeys(updatedDistanceByUser);
}

export async function updateAgeRequirements(
  dataId,
  updatedRequiredAgeMin,
  updatedRequiredAgeMax,
) {
  const updatedRequiredAge = await sql`
UPDATE age_requirements
SET  buddy_age_min  = ${updatedRequiredAgeMin},
buddy_age_max  = ${updatedRequiredAgeMax}
WHERE personal_data_id = ${dataId};
`;
  return camelcaseKeys(updatedRequiredAge);
}

// Matching profiles

// --Solution N1

// with genre_buddy_candidates as (
// Select
// distinct users_genres.personal_data_id AS buddy_personal_data_id
// FROM
// users_genres
// WHERE
// personal_data_id != 1 AND
// genre_id in (2, 3,5)),

// gender_buddy_candidates as(
// Select
// personal_data.id AS buddy_personal_data_id
// FROM
// personal_data
// WHERE
// personal_data.id != 1 AND
// personal_data.gender_id in (1, 2)
// )

// SELECT * FROM gender_buddy_candidates, genre_buddy_candidates
// WHERE genre_buddy_candidates.buddy_personal_data_id = gender_buddy_candidates.buddy_personal_data_id

// -- Solution 2

// with gender_interested as
// (SELECT r.personal_data_id as personal_data_id, p.id as buddy_user_id FROM
// personal_data p, gender_requirements r
// WHERE p.gender_id = r.gender_id
// AND p.id != r.personal_data_id
// ),
// gender_matches as (
// SELECT A.personal_data_id, A.buddy_user_id
// FROM gender_interested as A, gender_interested as B
// WHERE
//         A.buddy_user_id = B.personal_data_id AND
//         A.personal_data_id = B.buddy_user_id

// -- ORDER BY A.personal_data_id
// ),

// SELECT * FROM users_genres, gender_matches
// WHERE users_genres.personal_data_id = gender_matches.buddy_user_id
