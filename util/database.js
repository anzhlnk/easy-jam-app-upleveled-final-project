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
