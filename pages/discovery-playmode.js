// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';
import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
// import 'react-widgets/styles.css';
import { useState } from 'react';
// import required modules
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

export const headerContainer = css`
  @media (min-width: 500px) {
    width: 60vw;
  }
  width: 50vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
  img,
  a {
    margin-right: 9em;
  }
`;

export const main = css`
  width: 100vw;
  height: 100vh;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: start;
`;
const allContentContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  justify-content: center;
  align-items: center;
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

  .swiper {
    /* margin: 100px auto; */
    width: 80vw;
    height: 85vh;
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
  // async function createChat(buddyId) {
  //   const buddyConversationId = await props.conversations.filter(
  //     (conversation) => {
  //       return conversation.buddyPersonalDataId === buddyId;
  //     },
  //   );
  //   console.log('buddyConversationId', buddyConversationId);
  //   if (buddyConversationId?.length > 0) {
  //     console.log(
  //       'buddyConversationId[0].conversationId',
  //       buddyConversationId[0].conversationId,
  //     );
  //     await router.push(`/chats/${buddyConversationId[0].conversationId}`);
  //   } else {
  //     console.log(
  //       JSON.stringify({
  //         buddyPersonalDataId: buddyId,
  //         csrfToken: props.csrfToken,
  //       }),
  //     );
  //     const response = await fetch(`./api/chats/new-chat`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         buddyPersonalDataId: buddyId,
  //         csrfToken: props.csrfToken,
  //       }),
  //     });

  //     const createdChat = await response.json();

  //     if ('errors' in createdChat) {
  //       setErrors(createdChat.errors);
  //       await router.push('/discovery');
  //     } else {
  //       await router.push(`/chats/${createdChat.id}`);
  //     }
  //   }
  // }

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
              src="/filterMode.png"
              alt="filter"
              style={{ width: 24, height: 24 }}
            />
          </Link>
        </div>
        <div css={allContentContainer}>
          <div css={contentContainer}>
            {/* <span>100%</span> */}
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
                        <SwiperSlide>
                          <FilterResultsPlaymode
                            profile={profile}
                            buddiesWithinHundredDistance={
                              props.buddiesWithinHundredDistance
                            }
                            personalDataUsersFull={props.personalDataUsersFull}
                            conversations={props.conversations}
                            userGenresArray={props.userGenresArray}
                          />
                        </SwiperSlide>
                      </div>
                    );
                  })}
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
                        <SwiperSlide
                          key={`personal-id-${profile.personalDataId}`}
                        >
                          <FilterResultsPlaymode
                            profile={profile}
                            buddiesWithinHundredDistance={
                              props.buddiesWithinHundredDistance
                            }
                            personalDataUsersEighty={
                              props.personalDataUsersEighty
                            }
                            conversations={props.conversations}
                            userGenresArray={props.userGenresArray}
                          />
                        </SwiperSlide>
                      </div>
                    );
                  })}
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
                        <SwiperSlide
                          key={`personal-id-${profile.personalDataId}`}
                        >
                          <FilterResultsPlaymode
                            profile={profile}
                            buddiesWithinHundredDistance={
                              props.buddiesWithinHundredDistance
                            }
                            personalDataUsersSixty={
                              props.personalDataUsersSixty
                            }
                            conversations={props.conversations}
                            userGenresArray={props.userGenresArray}
                          />
                        </SwiperSlide>
                      </div>
                    );
                  })}
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
                        <SwiperSlide
                          key={`personal-id-${profile.personalDataId}`}
                        >
                          <FilterResultsPlaymode
                            profile={profile}
                            buddiesWithinHundredDistance={
                              props.buddiesWithinHundredDistance
                            }
                            personalDataUsersFourty={
                              props.personalDataUsersFourty
                            }
                            conversations={props.conversations}
                            userGenresArray={props.userGenresArray}
                          />
                        </SwiperSlide>
                      </div>
                    );
                  })}
              {props.personalDataUsersTwenty &&
                props.personalDataUsersTwenty
                  .filter((profile) => {
                    return props.buddiesWithinHundredDistance.some(
                      (buddy) =>
                        buddy.buddyPersonalDataId === profile.personalDataId,
                    );
                  })
                  .map((profile) => {
                    console.log(
                      'profile.personalDataId personalDataUsersTwenty',
                      profile.personalDataId,
                    );
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
                            personalDataUsersTwenty={
                              props.personalDataUsersTwenty
                            }
                            conversations={props.conversations}
                            userGenresArray={props.userGenresArray}
                          />
                        </SwiperSlide>
                      </div>
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
  console.log('profileList', profileList);

  const conversations = await getConversationIdsbyUsersDataId(
    dataId,
    profileList,
  );
  console.log('conversations', conversations);

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
