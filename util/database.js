import camelcaseKeys from 'camelcase-keys';
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

export async function updatePassword(username, passwordHash) {
  const [password] = await sql`
  UPDATE
  users
      SET
      password_hash = ${passwordHash}
      WHERE
        username = ${username}
      RETURNING id, username
    `;
  return camelcaseKeys(password);
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

export async function getUserGenreByPersonalDataID(dataId) {
  if (!dataId) return undefined;
  const userGenres = await sql`
  SELECT
  genres.genre_name AS genre_name,
  genres.id AS genre_id
  FROM
  genres,
  users_genres
  WHERE
   users_genres.personal_data_id = ${dataId} AND
   users_genres.genre_id = genres.id
`;
  return userGenres && camelcaseKeys(userGenres);
}

export async function getUsersGenreByPersonalDataID(dataId) {
  if (dataId.length === 0 || !dataId) return null;
  const userGenres = await sql`
  SELECT
  users_genres.personal_data_id,
  string_agg("genre_name", ',') as genre_name
  FROM
  genres,
  users_genres
  WHERE
   users_genres.personal_data_id in ${sql(dataId)} AND
   users_genres.genre_id = genres.id
   group by 1
`;
  return userGenres && camelcaseKeys(userGenres);
}

export async function getUserPersonalData(userId) {
  if (!userId) return undefined;

  const [personalData] = await sql`
    SELECT
    personal_data.id as personal_data_id,
    personal_data.first_name AS first_name,
    personal_data.last_name AS last_name,
    extract(year from age(personal_data.birthday))  AS age,
    locations.address AS address,
    locations.longitude as longitude,
    locations.latitude as  latitude,
    personal_data.short_description AS short_description,
    personal_data.about_me AS about_me,
    personal_data.profile_picture_url AS profile_picture_url,
string_agg("instrument_name", ',')  as playing_instrument
    FROM
    personal_data,
    locations,
    users_instruments,
    instruments
    WHERE
    personal_data.id = ${userId} AND
    personal_data.location_id = locations.id AND
    personal_data.id = users_instruments.personal_data_id AND
    users_instruments.relation_type_id = 1 AND
    users_instruments.instrument_id = instruments.id

    group by 1, 2, 3, 4, 5, 6, 7, 8
  `;
  return personalData && camelcaseKeys(personalData);
}

export async function getUserBirthday(userId) {
  if (!userId) return undefined;

  const [userBirthday] = await sql`
    SELECT
  personal_data.birthday AS birthday
    FROM
    personal_data
    WHERE
    personal_data.id = ${userId}
  `.values();
  return userBirthday && camelcaseKeys(userBirthday);
}

export async function getUserInstrument(userdataID) {
  if (!userdataID) return undefined;

  const userInstruments = await sql`
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
 users_instruments.personal_data_id = ${userdataID} AND
users_instruments_relation.id  = 1 AND
 users_instruments.relation_type_id = 1  AND
instruments.id =  users_instruments.instrument_id`;
  return userInstruments && camelcaseKeys(userInstruments);
}

// multiple  profile info
export async function getUsersPersonalData(userId) {
  if (userId.length === 0 || !userId) return null;

  const profilesPersonalData = await sql`
    SELECT
    personal_data.id as personal_data_id,
    personal_data.first_name AS first_name,
    personal_data.last_name AS last_name,
    extract(year from age(personal_data.birthday))  AS age,
    locations.address AS address,
    personal_data.short_description AS short_description,
    personal_data.about_me AS about_me,
    personal_data.profile_picture_url AS profile_picture_url,
string_agg("instrument_name", ',')  as playing_instrument
    FROM
    personal_data,
    locations,
    users_instruments,
    instruments
    WHERE
    personal_data.id in ${sql(userId)} AND
    personal_data.location_id = locations.id AND
    personal_data.id = users_instruments.personal_data_id AND
    users_instruments.relation_type_id = 1 AND
    users_instruments.instrument_id = instruments.id
    group by 1, 2, 3, 4, 5, 6, 7, 8;
  `;

  return profilesPersonalData && camelcaseKeys(profilesPersonalData);
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

export async function updateDescription(dataID, shortDescription, aboutMe) {
  const updatedDescription = await sql`
UPDATE
personal_data
    SET
      short_description = ${shortDescription},
      about_me = ${aboutMe}
      WHERE personal_data.id = ${dataID}
    RETURNING *;
  `;
  return camelcaseKeys(updatedDescription);
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
  const addedUsersInstruments = await sql`
  INSERT INTO users_instruments ${sql(
    usersInstruments,
    'personal_data_id',
    'instrument_id',
    'relation_type_id',
  )}`;
  return camelcaseKeys(addedUsersInstruments);
}

export async function insertGenres(usersGenres) {
  const addedUsersGenres = await sql`
  INSERT INTO users_genres ${sql(usersGenres, 'personal_data_id', 'genre_id')}`;
  return camelcaseKeys(addedUsersGenres);
}

export async function insertDefaultRequiredAge(dataId, minAge, maxAge) {
  const usersDefaultAgeRequirements = await sql`
insert into age_requirements(personal_data_id,buddy_age_min, buddy_age_max)
values(${dataId}, ${minAge},${maxAge})
RETURNING *`;
  return camelcaseKeys(usersDefaultAgeRequirements);
}

export async function insertDefaultRequiredInstruments(
  defaultRequiredInstruments,
) {
  const addedDefaultInstruments = await sql`
  INSERT INTO users_instruments ${sql(
    defaultRequiredInstruments,
    'personal_data_id',
    'instrument_id',
    'relation_type_id',
  )}`;
  return camelcaseKeys(addedDefaultInstruments);
}

export async function insertDefaultRequiredGenders(defaultListOfGenders) {
  const addedDefaultGenders = await sql`
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

export async function deleteUserInstrument(dataId, removeOption) {
  const deletedUserInstrument = await sql`
        DELETE FROM
        users_instruments

      WHERE
      personal_data_id = ${dataId} AND
      relation_type_id = 1 AND
      instrument_id = ${removeOption}
        RETURNING *;
      `;
  return deletedUserInstrument && camelcaseKeys(deletedUserInstrument);
}

export async function deleteUserGenre(dataId, removeOption) {
  const deletedUserGenre = await sql`
        DELETE FROM
        users_genres

      WHERE
      personal_data_id = ${dataId} AND
      genre_id = ${removeOption}
        RETURNING *;
      `;
  return deletedUserGenre && camelcaseKeys(deletedUserGenre);
}

export async function addRequiredInstrument(addedItems) {
  const addedUserRequiredInstruments = await sql`
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

export async function addUserInstrument(addedItems) {
  const addedUserRequiredInstruments = await sql`
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

export async function addUserGenre(addedItems) {
  const addedUserGenders = await sql`
    INSERT INTO  users_genres ${sql(addedItems, 'personal_data_id', 'genre_id')}
    ON CONFLICT (personal_data_id,  genre_id) DO NOTHING
    RETURNING genre_id`;

  return camelcaseKeys(addedUserGenders);
}

export async function deleteRequiredGender(dataId, removeOption) {
  const deletedRequiredGender = await sql`
        DELETE FROM
        gender_requirements

      WHERE
      personal_data_id = ${dataId} AND
      gender_id = ${removeOption}
        RETURNING *;
      `;
  return deletedRequiredGender && camelcaseKeys(deletedRequiredGender);
}

export async function deleteUser(id) {
  const deletedUser = await sql`
        DELETE FROM
       users
      WHERE
    id = ${id}
      `;
  return deletedUser && camelcaseKeys(deletedUser);
}

export async function addRequiredGender(addedItems) {
  const addedUserRequiredGenders = await sql`
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

export async function getGenresIdByUserId(personal_data_id) {
  if (!personal_data_id) return undefined;
  const genresIdByUserId = await sql`
SELECT genre_id
FROM users_genres
WHERE
users_genres.personal_data_id = ${personal_data_id}
`;
  return genresIdByUserId && camelcaseKeys(genresIdByUserId);
}

// Matching profiles

export async function getProfilesByGender(personal_data_id) {
  if (!personal_data_id) return undefined;
  const profilesByGender = await sql`
WITH
gender_interested as(
SELECT
r.personal_data_id as personal_data_id,
p.id as buddy_personal_data_id,
p.status as visibility_status
 FROM
personal_data p,
gender_requirements r
WHERE
p.status =1 AND
p.gender_id = r.gender_id AND
p.id != r.personal_data_id),

gender_matches as (
SELECT
A.visibility_status,
A.personal_data_id,
A.buddy_personal_data_id
FROM
gender_interested as A,
gender_interested as B
WHERE
        A.buddy_personal_data_id = B.personal_data_id AND
        A.personal_data_id = B.buddy_personal_data_id AND
        A.personal_data_id != A.buddy_personal_data_id

)
SELECT DISTINCT buddy_personal_data_id FROM gender_matches
WHERE  personal_data_id= ${personal_data_id}
`;
  return profilesByGender && camelcaseKeys(profilesByGender);
}

/* genres = > pass genre ids, current user personal id as parameter   */

export async function getProfilesByGenres(personal_data_id) {
  if (!personal_data_id) return undefined;
  const profilesByGenres = await sql`

with
users_genres_active as(
SELECT u.*
FROM users_genres u, personal_data p
where u.personal_data_id = p.id
and p.status = 1
),
genre_interested as (
SELECT
u1.personal_data_id as personal_data_id,
u2.personal_data_id as buddy_personal_data_id
FROM
users_genres_active u1,
users_genres_active u2
where u1.genre_id = u2.genre_id
and u1.personal_data_id != u2.personal_data_id
),

genre_matches as(
SELECT
A.personal_data_id,
A.buddy_personal_data_id
FROM
genre_interested A, genre_interested B
WHERE
        A.buddy_personal_data_id = B.personal_data_id AND
        A.personal_data_id = B.buddy_personal_data_id AND
        A.personal_data_id != A.buddy_personal_data_id
)
SELECT distinct buddy_personal_data_id FROM
genre_matches
WHERE personal_data_id = ${personal_data_id}`;
  return profilesByGenres && camelcaseKeys(profilesByGenres);
}

// SELECT
// DISTINCT users_genres.personal_data_id as personal_data_id
// FROM
// personal_data,
// users_genres
// WHERE
// personal_data.status = 1 AND
// personal_data_id = users_genres.personal_data_id AND
// users_genres.genre_id in ${sql(genre_ids)} AND
// users_genres.personal_data_id != ${personal_data_id}`;

/* age = > pas the current user id */

export async function getProfilesByAge(personal_data_id) {
  if (!personal_data_id) return undefined;
  const profilesByAge = await sql`
with
age_interested as(
SELECT
age_requirements.personal_data_id as personal_data_id,
age_requirements.buddy_age_min as required_age_min,
age_requirements.buddy_age_max as required_age_max,
personal_data.id as buddy_personal_data_id,
personal_data.status as visibility_status,
extract(year from age(personal_data.birthday)) as buddy_age
 FROM
personal_data,
age_requirements
WHERE
personal_data.status=1 AND
extract(year from age(personal_data.birthday)) >= age_requirements.buddy_age_min AND
extract(year from age(personal_data.birthday)) <= age_requirements.buddy_age_max AND
personal_data.id != age_requirements.personal_data_id),

age_matches as(
SELECT
A.personal_data_id,
A.buddy_personal_data_id,
A.visibility_status
FROM
age_interested as A,
age_interested as B
WHERE
A.personal_data_id = B.buddy_personal_data_id AND
A.buddy_personal_data_id = B.personal_data_id AND
A.buddy_personal_data_id != A.personal_data_id)


SELECT DISTINCT buddy_personal_data_id FROM age_matches
WHERE  personal_data_id= ${personal_data_id}

`;
  return profilesByAge && camelcaseKeys(profilesByAge);
}

export async function getProfilesByInstruments(personal_data_id) {
  if (!personal_data_id) return undefined;
  const profilesByInstrument = await sql`
with
playing as
(SELECT
users_instruments.personal_data_id as personal_data_id,
users_instruments.instrument_id as instrument_id,
personal_data.status as visibility_status
 FROM
users_instruments,
personal_data
WHERE

personal_data.status = 1 AND
users_instruments.personal_data_id = personal_data.id AND
relation_type_id = 1
),

looking as
(SELECT
users_instruments.personal_data_id as personal_data_id,
users_instruments.instrument_id as instrument_id,
personal_data.status as visibility_status
FROM
users_instruments,
personal_data
WHERE personal_data.status = 1 AND
users_instruments.personal_data_id = personal_data.id AND
relation_type_id = 2
),

instruments_interested as (
select
looking.personal_data_id as personal_data_id,
looking.instrument_id as required_instrument_id,
playing.personal_data_id as buddy_personal_data_id,
playing.instrument_id as buddy_instrument_id
FROM
playing,
looking
WHERE
looking.instrument_id = playing.instrument_id
),

instruments_match as (
SELECT
A.personal_data_id,
A.buddy_personal_data_id
from
instruments_interested as A,
instruments_interested as B
WHERE
  A.buddy_personal_data_id = B.personal_data_id AND
  A.personal_data_id = B.buddy_personal_data_id  AND
  A.personal_data_id != A.buddy_personal_data_id

)
SELECT DISTINCT buddy_personal_data_id
from instruments_match
WHERE  personal_data_id= ${personal_data_id}
`;
  return profilesByInstrument && camelcaseKeys(profilesByInstrument);
}

// update user profile from the account settings

export async function updatePersonalDataFromAccount(
  dataID,
  firstName,
  lastName,
  birthday,
  locationId,
  location,
  longitude,
  latitude,
) {
  const profileData = await sql`
UPDATE
personal_data
    SET
      first_name = ${firstName},
      last_name = ${lastName},
      birthday = ${birthday}
    WHERE
      id = ${dataID}
    RETURNING *;
  `;
  const updatedLocation = await sql`
UPDATE
locations
    SET
      address = ${location},
      longitude = ${longitude},
      latitude = ${latitude}
    WHERE
      id = ${locationId}
    RETURNING *;
`;
  return camelcaseKeys(updatedLocation, profileData);
}
