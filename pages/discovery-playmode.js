/* eslint-disable import/no-unresolved */
import 'swiper/css';
import 'swiper/css/effect-creative';
import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { EffectCreative } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import FilterResultsPlaymode from '../components/FilterResultsPlaymode';
import { createCsrfToken } from '../util/auth';
import {
  getConversationIdsbyUsersDataId,
  getDistance,
  getLocationIdByPersonalDataID,
  getPersonalDataIDByUserId,
  getProfilesByAge,
  getProfilesByDistance,
  getProfilesByGender,
  getProfilesByGenres,
  getProfilesByInstruments,
  getUserByValidSessionToken,
  getUsersGenreByPersonalDataID,
  getUsersPersonalData,
  getValidSessionByToken,
} from '../util/database';
import {
  allContentContainer,
  emptyResult,
  headerContainer,
  main,
} from './discovery';

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

  .swiper {
    /* margin: 100px auto; */
    width: 80vw;
    height: 85vh;
    @media (min-width: 900px) {
      width: 50vw;
    }
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
`;

export default function UserProfile(props) {
  // if (!props.personalData || 'errors' in props) {
  //   return (
  //     <>
  //       <Head>
  //         <title>User not found</title>
  //         <meta name="description" content="User not found" />
  //       </Head>
  //       <h1>404 - User not found</h1>
  //     </>
  //   );
  // }

  const matchingProfiles = [
    { percentage: '100% match', users: props.personalDataUsersFull },
    { percentage: '80% match', users: props.personalDataUsersEighty },
    { percentage: '60% match', users: props.personalDataUsersSixty },
    { percentage: '40% match', users: props.personalDataUsersFourty },
    { percentage: '20% match', users: props.personalDataUsersTwenty },
  ];
  return (
    <div css={main}>
      <Head>
        <title>Discovery page</title>
        <meta name="search for jamming" content="look for you jamming buddy" />
      </Head>
      <main>
        <div css={headerContainer}>
          <Link href="/filters">
            <img
              src="/filter_icon.png"
              alt="filter"
              style={{ width: 20, height: 19 }}
            />
          </Link>
          <Link href="/discovery">
            <img
              className="filter"
              src="/filterMode.png"
              alt="filter"
              style={{ width: 24, height: 24 }}
            />
          </Link>
        </div>
        <div css={allContentContainer}>
          <div css={contentContainer}>
            {matchingProfiles.every((group) => group.users === null) && (
              <p css={emptyResult}>
                Sorry, there are currently no matches. <br /> <br />
                Please, check your visibility status.
              </p>
            )}
            <Swiper
              grabCursor={true}
              effect="creative"
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ['-120%', 0, -500],
                },
                next: {
                  shadow: true,
                  translate: ['120%', 0, -500],
                },
              }}
              modules={[EffectCreative]}
              className="mySwiper2"
            >
              {matchingProfiles.map((personalDataMatchingGroup) => {
                return (
                  personalDataMatchingGroup.users &&
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
                          <SwiperSlide
                            key={`personal-id-${profile.personalDataId}`}
                          >
                            <FilterResultsPlaymode
                              profile={profile}
                              buddiesWithinHundredDistance={
                                props.buddiesWithinHundredDistance
                              }
                              personalDataUsersFull={
                                props.personalDataUsersFull
                              }
                              conversations={props.conversations}
                              userGenresArray={props.userGenresArray}
                              percentage={personalDataMatchingGroup.percentage}
                              csrfToken={props.csrfToken}
                            />
                          </SwiperSlide>
                        </div>
                      );
                    })
                );
              })}
            </Swiper>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const csrfToken = await createCsrfToken(session.csrfSecret);
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

  const conversations = await getConversationIdsbyUsersDataId(
    dataId,
    profileList,
  );

  const counts = {};
  profileList.forEach((e) => {
    if (!(e in counts)) {
      counts[e] = 0;
    }
    counts[e]++;
    // return ((e: count) += 1);
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
  const userGenres = await getUsersGenreByPersonalDataID(profileList);
  return {
    props: {
      profileList: profileList,
      buddiesWithinHundredDistance: buddiesWithinHundredDistance,
      personalDataUsersFull: personalDataUsersFull,
      personalDataUsersEighty: personalDataUsersEighty,
      personalDataUsersSixty: personalDataUsersSixty,
      personalDataUsersFourty: personalDataUsersFourty,
      personalDataUsersTwenty: personalDataUsersTwenty,
      userGenresArray: userGenres,
      conversations: conversations,
      csrfToken: csrfToken,
    },
  };
}
