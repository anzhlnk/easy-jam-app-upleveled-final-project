// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';
import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
// import 'react-widgets/styles.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
// import required modules
import { EffectCreative } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
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
import { genreList, genreListContainer } from './users/usersbyid/[userId]';

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

const profileDataContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2em;
  background-color: white;
`;

const userInfoContainer = css`
  max-width: 65vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const profileImage = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const buddyAvatar = css`
  width: 12em;
  height: 12em;
  border-radius: 350px;
`;

const buddyName = css`
  margin-top: 1.5em;
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: left;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.25px;
  color: #1d232e;
`;

const instrumentContainer = css`
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

const playingInstruments = css`
  display: flex;
  flex-direction: row;
  margin-top: 1.5em;
`;

const instrumentImage = css`
  max-width: 20px;
  max-height: 25px;
`;

const viewProfileContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-color: #ffffff;
  min-width: 116px;
  min-height: 32px;
  background: #ffffff;
  border-radius: 100px;
  margin-right: 12px;
  margin-top: -24px;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    color: #000000;
  }
`;

const shortDescription = css`
  span {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;

    color: #1d232e;
  }
`;

const addUserContainer = css`
  display: flex;
  width: 100%;
  justify-content: right;
  align-items: right;
  margin-bottom: -24px;
`;

const addUser = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;

  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(45deg, #f7ff26, #4dfb34, #18fdef) border-box;
  border: 2px solid transparent;
  border-radius: 50px;

  box-shadow: 1px 1px 4px rgba(93, 107, 130, 0.44);
  button {
    border: none;
  }
`;
export default function UserProfile(props) {
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  async function createChat(buddyId) {
    const buddyConversationId = await props.conversations.filter(
      (conversation) => {
        return conversation.buddyPersonalDataId === buddyId;
      },
    );
    console.log('buddyConversationId', buddyConversationId);
    if (buddyConversationId?.length > 0) {
      console.log(
        'buddyConversationId[0].conversationId',
        buddyConversationId[0].conversationId,
      );
      await router.push(`/chats/${buddyConversationId[0].conversationId}`);
    } else {
      console.log(
        JSON.stringify({
          buddyPersonalDataId: buddyId,
          csrfToken: props.csrfToken,
        }),
      );
      const response = await fetch(`./api/chats/new-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buddyPersonalDataId: buddyId,
          csrfToken: props.csrfToken,
        }),
      });

      const createdChat = await response.json();

      if ('errors' in createdChat) {
        setErrors(createdChat.errors);
        await router.push('/discovery');
      } else {
        await router.push(`/chats/${createdChat.id}`);
      }
    }
  }

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
              {props.personalDataUsersEighty &&
                props.personalDataUsersEighty.map((profile) => {
                  return (
                    <SwiperSlide key={`personal-id-${profile.personalDataId}`}>
                      <div>
                        <div css={profileDataContainer}>
                          <div css={addUserContainer}>
                            <div css={addUser}>
                              <button
                                onClick={() => {
                                  createChat(profile.personalDataId).catch(
                                    () => {
                                      console.log('error');
                                    },
                                  );
                                }}
                              >
                                <img
                                  src="/message.png"
                                  alt="message the user"
                                  style={{ width: 17, height: 14 }}
                                />
                              </button>
                            </div>
                          </div>
                          <div css={profileImage}>
                            <img
                              src={profile.profilePictureUrl}
                              alt="user avatar"
                              css={buddyAvatar}
                            />
                          </div>
                          <div css={viewProfileContainer}>
                            <Link
                              href={`/users/usersbyid/${profile.personalDataId}`}
                            >
                              View Profile
                            </Link>
                          </div>
                          <div css={userInfoContainer}>
                            <div css={buddyName}>
                              <span>{profile.firstName}</span>
                            </div>
                            <div css={shortDescription}>
                              <span>{profile.shortDescription}</span>
                            </div>
                            <div css={playingInstruments}>
                              {profile.playingInstrument
                                .split(',')
                                .map((instrument) => {
                                  return (
                                    <div
                                      key={`instrument-${instrument}`}
                                      css={instrumentContainer}
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
                            <div css={genreListContainer}>
                              {props.userGenresArray
                                .filter((genre) => {
                                  return (
                                    genre.personalDataId ===
                                    profile.personalDataId
                                  );
                                })
                                .map((genre) => {
                                  return genre.genreName
                                    .split(',')
                                    .map((singleGenre) => {
                                      return (
                                        <div
                                          key={`genre-${singleGenre}`}
                                          css={genreList}
                                        >
                                          <span>{singleGenre}</span>
                                        </div>
                                      );
                                    });
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
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
