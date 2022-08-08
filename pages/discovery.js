import { css } from '@emotion/react';
// import 'react-widgets/styles.css';
import Head from 'next/head';
import Link from 'next/link';
import FilterResults from '../components/FilterResults';
import {
  getDistance,
  getLocationIdByPersonalDataID,
  getPersonalDataIDByUserId,
  getProfilesByAge,
  getProfilesByDistance,
  getProfilesByGender,
  getProfilesByGenres,
  getProfilesByInstruments,
  getUserByValidSessionToken,
  getUsersPersonalData,
  getValidSessionByToken,
} from '../util/database';

const matchPercentage = css`
  display: flex;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  border-bottom: 4px solid transparent;
`;

export const headerContainer = css`
  position: fixed;
  z-index: 1;

  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 48vw;
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
  .filter {
    margin-top: 4px;
  }
  margin-bottom: 2em;
`;

export const main = css`
  margin-top: 60px;
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
export const allContentContainer = css`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  margin-top: 32px;
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 24px;
  margin-right: 24px;
  @media (min-width: 900px) {
    width: 50em;
  }
`;

export const emptyResult = css`
  width: 90vw;
  height: 80vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-family: 'Michroma';
  word-spacing: 4px;
  font-size: 14px;
  line-height: 40px;
  text-transform: uppercase;
`;

export const authenticationError = css`
  @media (min-width: 900px) {
    width: 100vw;

    a {
      margin-right: 8px;
      margin-left: 8px;
    }
  }
  position: absolute;
  bottom: 50%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-family: 'Michroma';
  word-spacing: 4px;
  font-size: 14px;
  line-height: 40px;
  text-transform: uppercase;
  a {
    margin-right: 8px;
    margin-left: 8px;
  }
  a {
    text-decoration: none;
    color: #1b3d5f;
  }
`;

export default function Discovery(props) {
  const matchingProfiles = [
    { numberOfMatchingCategories: 5, users: props.personalDataUsersFull },
    { numberOfMatchingCategories: 4, users: props.personalDataUsersEighty },
    { numberOfMatchingCategories: 3, users: props.personalDataUsersSixty },
    { numberOfMatchingCategories: 2, users: props.personalDataUsersFourty },
    { numberOfMatchingCategories: 1, users: props.personalDataUsersTwenty },
  ];
  if ('errors' in props) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="user not found" content="User not found" />
        </Head>
        <div css={authenticationError}>
          {props.errors} Please, <Link href="/register"> Sign up </Link> or{' '}
          <Link href="/login">Log in</Link>
        </div>
      </>
    );
  }
  return (
    <div>
      <Head>
        <title>Discovery page</title>
        <meta name="search results" content="look for you jamming buddy" />
      </Head>
      <main css={main}>
        <div css={headerContainer}>
          <Link href="/filters">
            <img
              src="/filter_icon.png"
              alt="filter"
              style={{ width: 20, height: 19 }}
              data-test-id="filters"
            />
          </Link>
          <div>
            <Link href="/discovery-playmode">
              <img
                src="/play_icon.png"
                alt="filter"
                style={{ width: 24, height: 24 }}
              />
            </Link>
          </div>
        </div>
        <div css={allContentContainer}>
          {matchingProfiles.map((personalDataMatchingGroup) => {
            // content container for header (how much matching)
            return (
              <div
                key={personalDataMatchingGroup.percentage}
                css={contentContainer}
              >
                {personalDataMatchingGroup.users &&
                  personalDataMatchingGroup.users.filter((profile) => {
                    return props.buddiesWithinHundredDistance.some(
                      (buddy) =>
                        buddy.buddyPersonalDataId === profile.personalDataId,
                    );
                  }).length > 0 && (
                    <span css={matchPercentage}>
                      {`Mutual match: ${personalDataMatchingGroup.numberOfMatchingCategories} out of 5 categories`}
                    </span>
                  )}
                {personalDataMatchingGroup.users &&
                  personalDataMatchingGroup.users
                    .filter((profile) => {
                      return props.buddiesWithinHundredDistance.some(
                        (buddy) =>
                          buddy.buddyPersonalDataId === profile.personalDataId,
                      );
                    })
                    .map((profile) => {
                      return (
                        <div key={`personal-id-${profile.personalDataId}`}>
                          <FilterResults
                            profile={profile}
                            buddiesWithinHundredDistance={
                              props.buddiesWithinHundredDistance
                            }
                          />
                        </div>
                      );
                    })}
              </div>
            );
          })}
          {matchingProfiles.every((group) => group.users === null) && (
            <p css={emptyResult}>
              Sorry, there are currently no matches. <br /> <br />
              Please, check your visibility status.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      props: { errors: 'Not authenticated.' },
    };
  }
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const dataId = await getPersonalDataIDByUserId(user.id);
  const locationId = await getLocationIdByPersonalDataID(dataId);

  const profilesByAge = await getProfilesByAge(dataId);
  const profilesByGender = await getProfilesByGender(dataId);
  const profilesByInstrument = await getProfilesByInstruments(dataId);
  const profilesByGenres = await getProfilesByGenres(dataId);
  const profilesByDistance = await getProfilesByDistance(locationId);

  const profileList = [
    profilesByAge.map((profile) => profile.buddyPersonalDataId),
    profilesByGender.map((profile) => profile.buddyPersonalDataId),
    profilesByInstrument.map((profile) => profile.buddyPersonalDataId),
    profilesByGenres.map((profile) => profile.buddyPersonalDataId),
    profilesByDistance.map((profile) => profile.buddyPersonalDataId),
  ].flat();

  const counts = {};
  profileList.forEach((e) => {
    if (!(e in counts)) {
      counts[e] = 0;
    }
    counts[e]++;
  });

  const distanceToBuddies = await getDistance(locationId, profileList);
  const buddiesWithinHundredDistance = distanceToBuddies.filter((distance) => {
    return Math.ceil(distance.distanceToBuddyMeters / 1000) <= 100;
  });

  const fullMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 5),
    Number,
  );
  const eightyMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 4),
    Number,
  );
  const sixtyMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 3),
    Number,
  );
  const fourtyMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 2),
    Number,
  );
  const twentyMatch = Array.from(
    Object.keys(counts).filter((key) => counts[key] === 1),
    Number,
  );
  const personalDataUsersFull = await getUsersPersonalData(fullMatch);
  const personalDataUsersEighty = await getUsersPersonalData(eightyMatch);
  const personalDataUsersSixty = await getUsersPersonalData(sixtyMatch);
  const personalDataUsersFourty = await getUsersPersonalData(fourtyMatch);
  const personalDataUsersTwenty = await getUsersPersonalData(twentyMatch);

  return {
    props: {
      profileList: profileList,
      buddiesWithinHundredDistance: buddiesWithinHundredDistance,
      personalDataUsersFull: personalDataUsersFull,
      personalDataUsersEighty: personalDataUsersEighty,
      personalDataUsersSixty: personalDataUsersSixty,
      personalDataUsersFourty: personalDataUsersFourty,
      personalDataUsersTwenty: personalDataUsersTwenty,
    },
  };
}
