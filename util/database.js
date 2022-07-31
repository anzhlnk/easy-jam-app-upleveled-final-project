import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();
config();

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }

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

/* Second solution for filtering
with user_gender_interested_in as(
  SELECT
  r.personal_data_id as buddy_personal_data_id,
  p.id as personal_data_id,
  p.status as visibility_status
   FROM
  personal_data p,
  gender_requirements r
  WHERE
  p.status =1 AND
  p.gender_id = r.gender_id AND
  p.id != r.personal_data_id AND
  p.id = 3),

  other_users_intersted_in_current_user as (select gender_requirements.personal_data_id as personal_data_id_intersted_in_user
  from gender_requirements, personal_data p
  where gender_requirements.gender_id = p.gender_id
  and p.id = 3),

  other_users_intersted_in_current_user_visible as (
  select other_users_intersted_in_current_user.personal_data_id_intersted_in_user as personal_data_id from other_users_intersted_in_current_user, personal_data
  where other_users_intersted_in_current_user.personal_data_id_intersted_in_user = personal_data.id
  AND personal_data.status = 1
  ),

  matches as (
  select buddy_personal_data_id
  from user_gender_interested_in, other_users_intersted_in_current_user_visible
  where user_gender_interested_in.buddy_personal_data_id = other_users_intersted_in_current_user_visible.personal_data_id
  )

  select * from matches
  */

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

export async function getProfilesByDistance(location_id) {
  if (!location_id) return undefined;

  const profilesByDistance = await sql`
with location_current_user as (
  select locations.id, latitude, longitude, preferred_distance * 1000 as maximum_buddy_distance_meters
  from locations, personal_data
  where locations.id = ${location_id}
  and personal_data.location_id = locations.id
  and personal_data.status = 1
),
distances_to_buddies as (
  select
  personal_data.id as buddy_personal_data_id,
  locations.id as buddy_location_id,
  earth_distance(
    ll_to_earth(locations.latitude, locations.longitude),
    ll_to_earth(location_current_user.latitude, location_current_user.longitude)
  ) as distance_to_buddy_meters,
  location_current_user.maximum_buddy_distance_meters as distance_requirements_current_user
  from locations, location_current_user, personal_data
  where locations.id != location_current_user.id
  and personal_data.location_id = locations.id
  and personal_data.status = 1
  order by distance_to_buddy_meters
),

locations_interested as (
  select
  *
  from distances_to_buddies
  WHERE distance_to_buddy_meters  <= distance_requirements_current_user
),

buddy_distance_requirements as (
  select
  locations_interested.*,
   preferred_distance * 1000 as distance_requirements_buddy
  from
  locations_interested,
  locations
  where locations.id = locations_interested.buddy_location_id
),
locations_matches as(
  select
  *
  from
  buddy_distance_requirements
  where
  distance_to_buddy_meters <= distance_requirements_buddy
)
select
DISTINCT buddy_personal_data_id,
distance_to_buddy_meters
from
locations_matches

`;
  return profilesByDistance && camelcaseKeys(profilesByDistance);
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

// get distance to the current user for the list of users

export async function getDistance(location_id, buddy_data_ids) {
  if (!location_id) return undefined;
  if (buddy_data_ids.length === 0) return [];

  const distanceToBuddies = await sql`

with location_current_user as (
SELECT
id, latitude, longitude, preferred_distance * 1000 as maximum_buddy_distance_meters
FROM
locations
where id = ${location_id}
),

distances_to_buddies as (
SELECT
  personal_data.id as buddy_personal_data_id,
  locations.id as buddy_location_id,
  earth_distance(
    ll_to_earth(locations.latitude, locations.longitude),
    ll_to_earth(location_current_user.latitude, location_current_user.longitude)
  ) as distance_to_buddy_meters,
  location_current_user.maximum_buddy_distance_meters as distance_requirements_current_user
FROM
locations, location_current_user, personal_data
WHERE
locations.id != location_current_user.id AND
personal_data.id in ${sql(buddy_data_ids)}  AND
 personal_data.location_id = locations.id)

SELECT
buddy_personal_data_id, distance_to_buddy_meters
from
distances_to_buddies
`;

  return camelcaseKeys(distanceToBuddies);
}

// chat-related queries

export async function createNewConversation() {
  const [chat] = await sql`
  INSERT INTO conversations
  (id)
  VALUES
  (DEFAULT)
  RETURNING
    *
  `;
  return camelcaseKeys(chat);
}

export async function addAUserToTheConversation(listOfusers) {
  const addedUserToTheConversation = await sql`
  INSERT INTO conversation_users
  ${sql(listOfusers, 'personal_data_id', 'conversation_id')}`;
  return camelcaseKeys(addedUserToTheConversation);
}

// to be deleted
export async function getConversationById(conversationId) {
  const [conversation] = await sql`
  SELECT
  *
  FROM
 conversations
WHERE
id = ${conversationId}
  `;
  return camelcaseKeys(conversation);
}

export async function getMessagesByConversationId(conversationId) {
  const history = await sql`
  SELECT
    id, personal_data_id, conversation_id , timestamp as timestamp, content
  FROM
 messages
WHERE
conversation_id = ${conversationId}
  `;
  return camelcaseKeys(history);
}

export async function getConversationsUser(conversationId) {
  const conversationParticipants = await sql`
  SELECT
  *
  FROM
  conversation_users
WHERE
conversation_id = ${conversationId}
  `;
  return camelcaseKeys(conversationParticipants);
}

export async function createNewMessage(
  conversationvId,
  currentUserdataId,
  content,
) {
  const [message] = await sql`
  INSERT INTO messages
  (personal_data_id, conversation_id, content )
  VALUES
  (${currentUserdataId},${conversationvId},${content})
  RETURNING
    *
  `;
  return camelcaseKeys(message);
}

export async function getConversationIdbyUsersDataId(
  currentUserDataId,
  buddyDataId,
) {
  const [conversationId] = await sql`
  with user_chats as (
SELECT
*
FROM
conversation_users
WHERE
personal_data_id = ${currentUserDataId}
)
SELECT
conversation_users.personal_data_id as buddy_personal_data_id,
conversation_users.conversation_id as conversation_id
FROM
conversation_users,
user_chats
WHERE
user_chats.conversation_id = conversation_users.conversation_id AND
conversation_users.personal_data_id = ${buddyDataId}
  `;
  return conversationId && camelcaseKeys(conversationId);
}

export async function getbuddyName(dataId) {
  const [buddyName] = await sql`
  SELECT
   first_name
  FROM
personal_data
WHERE
id = ${dataId}
  `;
  return camelcaseKeys(buddyName);
}

export async function getLatestChatsInfo(dataId) {
  const chats = await sql`
with user_conversations as (

SELECT
*
FROM
conversation_users
WHERE
personal_data_id = ${dataId}
),
buddy_conversation as(
SELECT
conversation_users.personal_data_id as buddy_personal_data_id,
conversation_users.conversation_id as conversation_id
FROM
conversation_users,
user_conversations
WHERE
user_conversations.conversation_id = conversation_users.conversation_id AND
conversation_users.personal_data_id != ${dataId}),

latest_timestamp as(
SELECT
messages.conversation_id as conversation_id,
max(messages.timestamp) as timestamp
from
buddy_conversation,
messages
WHERE
messages.conversation_id= buddy_conversation.conversation_id
group by messages.conversation_id),

second_step as(
SELECT
messages.conversation_id as conversation_id,
messages.content as content,
messages.timestamp as timestamp,
buddy_conversation.buddy_personal_data_id as buddy_personal_data_id
FROM
latest_timestamp,
messages,
buddy_conversation
WHERE
buddy_conversation.conversation_id = latest_timestamp.conversation_id AND
latest_timestamp.conversation_id = messages.conversation_id AND
latest_timestamp.timestamp = messages.timestamp)

SELECT
personal_data.first_name as buddy_first_name,
personal_data.profile_picture_url as profile_picture_url,
second_step.*
FROM
personal_data,
second_step
where
personal_data.id = second_step.buddy_personal_data_id
ORDER by second_step.timestamp desc

  `;
  return camelcaseKeys(chats);
}

// studios

export async function getStudios() {
  const studios = await sql`
  SELECT
locations.longitude as longitude,
locations.latitude  as latitude,
locations.address as address,
rehearsal_studios.studio_name as studio_name,
rehearsal_studios.id as rehearsal_studios_id
  FROM
  rehearsal_studios,
  locations
WHERE
locations.id =rehearsal_studios.location_id
  `;
  return camelcaseKeys(studios);
}

export async function getClosestStudio(participantsDataId) {
  const [closestStudio] = await sql`
with buddies_locations_geo as(
  SELECT
  personal_data.id as personal_data_id,
  locations.latitude as latitude,
  locations.longitude as longitude
  FROM
  personal_data,
  locations
  WHERE
  personal_data.id in ${sql(participantsDataId)} AND
  personal_data.location_id = locations.id),

  rehearsal_studios_geo as (
  SELECT
  locations.id as location_id,
  rehearsal_studios.studio_name as studio_name,
  locations.latitude as latitude,
  locations.longitude as longitude
  FROM locations,
  rehearsal_studios
  WHERE
  rehearsal_studios.location_id = locations.id),


  distances_from_user_to_studios as (
  select personal_data_id, rehearsal_studios_geo.location_id,
          earth_distance(
            ll_to_earth(buddies_locations_geo.latitude, buddies_locations_geo.longitude),
            ll_to_earth(rehearsal_studios_geo.latitude, rehearsal_studios_geo.longitude)
          ) as distance_meters
           from
  buddies_locations_geo,
  rehearsal_studios_geo
  order by distance_meters
  ),

  distances_from_users_to_studios_one_line as (
  select
  a.distance_meters as distance_meters_user1,
  b.distance_meters as distance_meters_user2,
  a.location_id as location_id_studio,
  a.personal_data_id as personal_data_id_user1,
  b.personal_data_id as personal_data_id_user2
  from
  distances_from_user_to_studios a,
  distances_from_user_to_studios b
  where a.location_id = b.location_id
  and a.personal_data_id <> b.personal_data_id
  ),

  sum_distances as (
  select
  *, distance_meters_user1 + distance_meters_user2 as sum_of_user_distances_to_studio
  from
  distances_from_users_to_studios_one_line
  ),

  mindist as (select min(sum_of_user_distances_to_studio) min_sum_distance_between_users_and_studio
  from sum_distances),

  closest_studio as(
select location_id_studio from sum_distances
where sum_of_user_distances_to_studio <= (select min_sum_distance_between_users_and_studio from mindist)
limit 1)
SELECT
locations.*,
rehearsal_studios.studio_name as studio_name
from locations,
rehearsal_studios,
closest_studio
WHERE locations.id = closest_studio.location_id_studio AND
locations.id = rehearsal_studios.location_id

`;
  return camelcaseKeys(closestStudio);
}

// get conversations

export async function getConversationIdsbyUsersDataId(
  currentUserDataId,
  buddyDataIds,
) {
  if (buddyDataIds.length === 0) return [];
  const conversationId = await sql`
  with user_chats as (
    SELECT
    *
    FROM
    conversation_users
    WHERE
    personal_data_id = ${currentUserDataId}
    )
    SELECT
    conversation_users.personal_data_id as buddy_personal_data_id,
    conversation_users.conversation_id as conversation_id
    FROM
    conversation_users,
    user_chats
    WHERE
    user_chats.conversation_id = conversation_users.conversation_id AND
    conversation_users.personal_data_id in ${sql(buddyDataIds)}
  `;
  return conversationId && camelcaseKeys(conversationId);
}
