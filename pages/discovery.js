import { css } from '@emotion/react';
// import 'react-widgets/styles.css';
import Head from 'next/head';
import Link from 'next/link';
import {
  getPersonalDataIDByUserId,
  getProfilesByAge,
  getProfilesByGender,
  getProfilesByGenres,
  getProfilesByInstruments,
  getUserByValidSessionToken,
  getUsersPersonalData,
  getValidSessionByToken,
} from '../util/database';

const buddyAvatar = css`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const headerContainer = css`
  z-index: 0;
  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 50vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
  :first-child {
    z-index: 0;
    margin-right: 10em;
  }
`;

export const main = css`
  width: 100vw;
  height: 100vh;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: start;
  box-sizing: border-box;
`;
const allcontentContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-left: 24px;
  margin-right: 24px;
  box-sizing: border-box;
  @media (min-width: 900px) {
    width: 50em;
  }
  max-width: vw;
`;

const profileDataContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2em;
  box-sizing: border-box;
`;

const profileImage = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const buddyName = css`
  display: flex;
  flex-direction: row;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.25px;
  color: #1d232e;
  span {
    margin-right: 6px;
  }
`;

const nameInstrumentsContainer = css`
  min-width: 250px;
  display: flex;
  flex-direction: column;
  margin-left: 1em;
`;

const playinInstruments = css`
  display: flex;
  flex-direction: row;
`;

const profileButtonContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: none;
  border: none;

  a {
    text-decoration: none;
  }
  button {
    border: none;
    border-color: #ffffff;
    width: 35px;
    height: 35px;
    background: #ffffff;
    border-radius: 100px;

    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }
`;

const instrumentImageContainer = css`
  border: 1px solid #000000;
  border-radius: 25px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5em;
  margin-top: 0.5em;
`;

const instrumentImage = css`
  max-width: 20px;
  max-height: 25px;
`;

const horizontalLine = css`
  width: 50vw;
  border: 1px solid #e7ecf3;
  justify-content: right;
  margin-top: 12px;
`;

export default function UserProfile(props) {
  return (
    <div>
      <Head>
        <title>Discovery page</title>
        <meta name="search for jamming" content="look for you jamming buddy" />
      </Head>
      <main css={main}>
        <div css={headerContainer}>
          <Link href="/filters">
            <img
              src="/filter_icon.png"
              alt="filter"
              style={{ width: 20, height: 19 }}
            />
          </Link>
          <div>
            <Link href="/discover-playmode">
              <img
                src="/play_icon.png"
                alt="filter"
                style={{ width: 11, height: 14 }}
              />
            </Link>
          </div>
        </div>
        <div css={allcontentContainer}>
          <div css={contentContainer}>
            <span> 100%</span>
            {props.personalDataUsersFull &&
              props.personalDataUsersFull.map((profile) => {
                return (
                  <div key={`personal-id-${profile.personalDataId}`}>
                    <div css={profileDataContainer}>
                      <div css={profileImage}>
                        <img
                          src={profile.profilePictureUrl}
                          alt="user avatar"
                          css={buddyAvatar}
                        />
                      </div>
                      <div css={nameInstrumentsContainer}>
                        <div css={buddyName}>
                          <span>{profile.firstName}</span>
                          <span>{profile.lastName}</span>
                        </div>
                        <div css={playinInstruments}>
                          {profile.playingInstrument
                            .split(',')
                            .map((instrument) => {
                              return (
                                <div
                                  key={`instrument-${instrument}`}
                                  css={instrumentImageContainer}
                                >
                                  <img
                                    src={`/icons/${instrument}.png`}
                                    alt="playing instrument"
                                    css={instrumentImage}
                                  />
                                </div>
                              );
                            })}
                        </div>
                        <hr css={horizontalLine} />
                      </div>
                      <div css={profileButtonContainer}>
                        <Link
                          href={`/users/usersbyid/${profile.personalDataId}`}
                        >
                          <button>{'>'}</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div css={contentContainer}>
            <span> 75%</span>
            {props.personalDataUsersSeventyFive &&
              props.personalDataUsersSeventyFive.map((profile) => {
                return (
                  <div key={`personal-id-${profile.personalDataId}`}>
                    <div css={profileDataContainer}>
                      <div css={profileImage}>
                        <img
                          src={profile.profilePictureUrl}
                          alt="user avatar"
                          css={buddyAvatar}
                        />
                      </div>
                      <div css={nameInstrumentsContainer}>
                        <div css={buddyName}>
                          <span>{profile.firstName}</span>
                          <span>{profile.lastName}</span>
                        </div>
                        <div css={playinInstruments}>
                          {profile.playingInstrument
                            .split(',')
                            .map((instrument) => {
                              return (
                                <div
                                  key={`instrument-${instrument}`}
                                  css={instrumentImageContainer}
                                >
                                  <img
                                    src={`/icons/${instrument}.png`}
                                    alt="playing instrument"
                                    css={instrumentImage}
                                  />
                                </div>
                              );
                            })}
                        </div>
                        <hr css={horizontalLine} />
                      </div>
                      <div css={profileButtonContainer}>
                        <Link
                          href={`/users/usersbyid/${profile.personalDataId}`}
                        >
                          <button>{'>'}</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div css={contentContainer}>
            <span> 50%</span>
            {props.personalDataUsersHalfMatch &&
              props.personalDataUsersHalfMatch.map((profile) => {
                return (
                  <div key={`personal-id-${profile.personalDataId}`}>
                    <div css={profileDataContainer}>
                      <div css={profileImage}>
                        <img
                          src={profile.profilePictureUrl}
                          alt="user avatar"
                          css={buddyAvatar}
                        />
                      </div>
                      <div css={nameInstrumentsContainer}>
                        <div css={buddyName}>
                          <span>{profile.firstName}</span>
                          <span>{profile.lastName}</span>
                        </div>
                        <div css={playinInstruments}>
                          {profile.playingInstrument
                            .split(',')
                            .map((instrument) => {
                              return (
                                <div
                                  key={`instrument-${instrument}`}
                                  css={instrumentImageContainer}
                                >
                                  <img
                                    src={`/icons/${instrument}.png`}
                                    alt="playing instrument"
                                    css={instrumentImage}
                                  />
                                </div>
                              );
                            })}
                        </div>
                        <hr css={horizontalLine} />
                      </div>
                      <div css={profileButtonContainer}>
                        <Link
                          href={`/users/usersbyid/${profile.personalDataId}`}
                        >
                          <button>{'>'}</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div css={contentContainer}>
            <span> 25%</span>
            {props.personalDataUsersQuaterMatch &&
              props.personalDataUsersQuaterMatch.map((profile) => {
                return (
                  <div key={`personal-id-${profile.personalDataId}`}>
                    <div css={profileDataContainer}>
                      <div css={profileImage}>
                        <img
                          src={profile.profilePictureUrl}
                          alt="user avatar"
                          css={buddyAvatar}
                        />
                      </div>
                      <div css={nameInstrumentsContainer}>
                        <div css={buddyName}>
                          <span>{profile.firstName}</span>
                          <span>{profile.lastName}</span>
                        </div>
                        <div css={playinInstruments}>
                          {profile.playingInstrument
                            .split(',')
                            .map((instrument) => {
                              return (
                                <div
                                  key={`instrument-${instrument}`}
                                  css={instrumentImageContainer}
                                >
                                  <img
                                    src={`/icons/${instrument}.png`}
                                    alt="playing instrument"
                                    css={instrumentImage}
                                  />
                                </div>
                              );
                            })}
                        </div>
                        <hr css={horizontalLine} />
                      </div>
                      <div css={profileButtonContainer}>
                        <Link
                          href={`/users/usersbyid/${profile.personalDataId}`}
                        >
                          <button>{'>'}</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }

  const dataId = await getPersonalDataIDByUserId(user.id);

  const profilesByAge = await getProfilesByAge(dataId);
  console.log('profilesByAge', profilesByAge);
  const profilesByGender = await getProfilesByGender(dataId);
  console.log('profilesByGender', profilesByGender);
  const profilesByInstrument = await getProfilesByInstruments(dataId);
  console.log('profilesByInstrument', profilesByInstrument);
  const profilesByGenres = await getProfilesByGenres(dataId);
  console.log('profilesByGenres', profilesByGenres);

  const profileList = [
    profilesByAge.map((profile) => profile.buddyPersonalDataId),
    profilesByGender.map((profile) => profile.buddyPersonalDataId),
    profilesByInstrument.map((profile) => profile.buddyPersonalDataId),
    profilesByGenres.map((profile) => profile.buddyPersonalDataId),
  ].flat();

  let counts = {};
  profileList.forEach((e) => {
    if (!(e in counts)) {
      counts[e] = 0;
    }
    counts[e]++;
    // return ((e: count) += 1);
  });
  console.log('list', counts);

  const fullMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 4),
    Number,
  );
  const seventyFiveMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 3),
    Number,
  );
  const halfMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 2),
    Number,
  );
  const quaterMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 1),
    Number,
  );
  console.log('fullMatch', fullMatch);
  console.log('seventyFiveMatch', seventyFiveMatch);
  console.log('halfMatch', halfMatch);
  console.log('quaterMatch', quaterMatch);

  const personalDataUsersFull = await getUsersPersonalData(fullMatch);
  console.log('personalDataUsersFull', personalDataUsersFull);
  const personalDataUsersSeventyFive = await getUsersPersonalData(
    seventyFiveMatch,
  );
  console.log('personalDataUsersSeventyFive', personalDataUsersSeventyFive);
  const personalDataUsersHalfMatch = await getUsersPersonalData(halfMatch);
  console.log('personalDataUsersHalfMatch', personalDataUsersHalfMatch);
  const personalDataUsersQuaterMatch = await getUsersPersonalData(quaterMatch);
  console.log('personalDataUsersQuaterMatch', personalDataUsersQuaterMatch);
  return {
    props: {
      profileList: profileList,
      personalDataUsersFull: personalDataUsersFull,
      personalDataUsersSeventyFive: personalDataUsersSeventyFive,
      personalDataUsersHalfMatch: personalDataUsersHalfMatch,
      personalDataUsersQuaterMatch: personalDataUsersQuaterMatch,
    },
  };
}
