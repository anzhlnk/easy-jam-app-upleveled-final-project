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
  /* background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(45deg, #f7ff26, #4dfb34, #18fdef) border-box; */
  padding-bottom: 1em;
  border-bottom: 4px solid transparent;
`;

export const headerContainer = css`
  z-index: 0;
  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 45vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
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

export default function Discovery(props) {
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
            <Link href="/discovery-playmode">
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
            {props.personalDataUsersFull &&
              props.personalDataUsersFull.filter((profile) => {
                return props.buddiesWithinHundredDistance.some(
                  (buddy) =>
                    buddy.buddyPersonalDataId === profile.personalDataId,
                );
              }).length > 0 && (
                <span css={matchPercentage}>
                  Mutual match: 4 out of 5 categories
                </span>
              )}
            {props.personalDataUsersFull &&
              props.personalDataUsersFull
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
                        personalDataUsersFull={props.personalDataUsersFull}
                        personalDataUsersEighty={props.personalDataUsersEighty}
                        personalDataUsersSixty={props.personalDataUsersSixty}
                        personalDataUsersFourty={props.personalDataUsersFourty}
                        personalDataUsersTwenty={props.personalDataUsersTwenty}
                      />
                    </div>
                  );
                })}
          </div>
          <div css={contentContainer}>
            {props.personalDataUsersEighty &&
              props.personalDataUsersEighty.filter((profile) => {
                return props.buddiesWithinHundredDistance.some(
                  (buddy) =>
                    buddy.buddyPersonalDataId === profile.personalDataId,
                );
              }).length > 0 && (
                <span css={matchPercentage}>
                  Mutual match: 4 out of 5 categories
                </span>
              )}
            {props.personalDataUsersEighty &&
              props.personalDataUsersEighty
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
                        personalDataUsersFull={props.personalDataUsersFull}
                        personalDataUsersEighty={props.personalDataUsersEighty}
                        personalDataUsersSixty={props.personalDataUsersSixty}
                        personalDataUsersFourty={props.personalDataUsersFourty}
                        personalDataUsersTwenty={props.personalDataUsersTwenty}
                      />
                    </div>
                  );
                })}
          </div>
          <div css={contentContainer}>
            {props.personalDataUsersSixty &&
              props.personalDataUsersSixty.filter((profile) => {
                return props.buddiesWithinHundredDistance.some(
                  (buddy) =>
                    buddy.buddyPersonalDataId === profile.personalDataId,
                );
              }).length > 0 && (
                <span css={matchPercentage}>
                  Mutual match: 3 out of 5 categories
                </span>
              )}
            {props.personalDataUsersSixty &&
              props.personalDataUsersSixty
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
                        personalDataUsersFull={props.personalDataUsersFull}
                        personalDataUsersEighty={props.personalDataUsersEighty}
                        personalDataUsersSixty={props.personalDataUsersSixty}
                        personalDataUsersFourty={props.personalDataUsersFourty}
                        personalDataUsersTwenty={props.personalDataUsersTwenty}
                      />
                    </div>
                  );
                })}
          </div>
          <div css={contentContainer}>
            {props.personalDataUsersFourty &&
              props.personalDataUsersFourty.filter((profile) => {
                return props.buddiesWithinHundredDistance.some(
                  (buddy) =>
                    buddy.buddyPersonalDataId === profile.personalDataId,
                );
              }).length > 0 && (
                <span css={matchPercentage}>
                  Mutual match: 2 out of 5 categories
                </span>
              )}

            {props.personalDataUsersFourty &&
              props.personalDataUsersFourty
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
                        personalDataUsersFull={props.personalDataUsersFull}
                        personalDataUsersEighty={props.personalDataUsersEighty}
                        personalDataUsersSixty={props.personalDataUsersSixty}
                        personalDataUsersFourty={props.personalDataUsersFourty}
                        personalDataUsersTwenty={props.personalDataUsersTwenty}
                      />
                    </div>
                  );
                })}
          </div>
          <div css={contentContainer}>
            {props.personalDataUsersTwenty &&
              props.personalDataUsersTwenty.filter((profile) => {
                return props.buddiesWithinHundredDistance.some(
                  (buddy) =>
                    buddy.buddyPersonalDataId === profile.personalDataId,
                );
              }).length > 0 && (
                <span css={matchPercentage}>
                  Mutual match: 1 out of 5 categories
                </span>
              )}

            {props.personalDataUsersTwenty &&
              props.personalDataUsersTwenty
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
                        personalDataUsersFull={props.personalDataUsersFull}
                        personalDataUsersEighty={props.personalDataUsersEighty}
                        personalDataUsersSixty={props.personalDataUsersSixty}
                        personalDataUsersFourty={props.personalDataUsersFourty}
                        personalDataUsersTwenty={props.personalDataUsersTwenty}
                      />
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
  const locationId = await getLocationIdByPersonalDataID(dataId);
  console.log('locationId', locationId);

  const profilesByAge = await getProfilesByAge(dataId);
  console.log('profilesByAge', profilesByAge);
  const profilesByGender = await getProfilesByGender(dataId);
  console.log('profilesByGender', profilesByGender);
  const profilesByInstrument = await getProfilesByInstruments(dataId);
  console.log('profilesByInstrument', profilesByInstrument);
  const profilesByGenres = await getProfilesByGenres(dataId);
  console.log('profilesByGenres', profilesByGenres);
  const profilesByDistance = await getProfilesByDistance(locationId);
  console.log('profilesByDistance', profilesByDistance);

  const profileList = [
    profilesByAge.map((profile) => profile.buddyPersonalDataId),
    profilesByGender.map((profile) => profile.buddyPersonalDataId),
    profilesByInstrument.map((profile) => profile.buddyPersonalDataId),
    profilesByGenres.map((profile) => profile.buddyPersonalDataId),
    profilesByDistance.map((profile) => profile.buddyPersonalDataId),
  ].flat();
  console.log('profileList', profileList);

  let counts = {};
  profileList.forEach((e) => {
    if (!(e in counts)) {
      counts[e] = 0;
    }
    counts[e]++;
    // return ((e: count) += 1);
  });
  console.log('counts', counts);

  const distanceToBuddies = await getDistance(locationId, profileList);
  console.log('distanceToBuddies', distanceToBuddies);
  const buddiesWithinHundredDistance = distanceToBuddies.filter((distance) => {
    return Math.ceil(distance.distanceToBuddyMeters / 1000) <= 100;
  });

  console.log('buddiesWithinHundredDistance', buddiesWithinHundredDistance);

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
  console.log('fullMatch', fullMatch);
  console.log('eightyMatch', eightyMatch);
  console.log('sixtyMatch', sixtyMatch);
  console.log('fourtyMatch', fourtyMatch);
  console.log('twentyMatch', twentyMatch);

  const personalDataUsersFull = await getUsersPersonalData(fullMatch);
  console.log('personalDataUsersFull', personalDataUsersFull);
  const personalDataUsersEighty = await getUsersPersonalData(eightyMatch);
  console.log('personalDataUsersEighty', personalDataUsersEighty);
  const personalDataUsersSixty = await getUsersPersonalData(sixtyMatch);
  console.log('personalDataUsersSixty', personalDataUsersSixty);
  const personalDataUsersFourty = await getUsersPersonalData(fourtyMatch);
  console.log('personalDataUsersFourty', personalDataUsersFourty);
  const personalDataUsersTwenty = await getUsersPersonalData(twentyMatch);
  console.log('personalDataUsersTwenty', personalDataUsersTwenty);

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
