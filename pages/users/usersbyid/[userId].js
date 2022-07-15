import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createCsrfToken } from '../../../util/auth';
import {
  getConversationIdbyUsersDataId,
  getPersonalDataIDByUserId,
  getUserById,
  getUserByValidSessionToken,
  getUserGenreByPersonalDataID,
  getUserPersonalData,
  getValidSessionByToken,
} from '../../../util/database';

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
`;

export const title = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  text-align: center;
  letter-spacing: -1px;
  color: #1d232e;
`;

export const contentContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  align-items: center;
  padding-left: 64px;
  padding-right: 64px;
`;

export const userName = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  letter-spacing: -1.5px;

  color: #1d232e;
`;

export const ageLocation = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.25px;

  color: #5d6470;

  opacity: 0.29;
`;

export const playingInstruments = css`
  display: flex;
  flex-direction: row;
`;
export const instrumentImageContainer = css`
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

export const instrumentImage = css`
  max-width: 20px;
  max-height: 25px;
`;

export const genreListContainer = css`
  margin-top: 0.5em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 80vw;
`;
export const genreList = css`
  display: flex;
  flex-flow: wrap;
  align-items: center;
  justify-content: center;
  border: none;
  border-color: #ffffff;
  min-width: 67px;
  min-height: 32px;
  background: #ffffff;
  border-radius: 100px;
  margin-right: 12px;
  margin-top: 8px;
  color: #000000;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  span {
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

const horizontalLine = css`
  width: 50vw;
  border: 1px solid #e7ecf3;
  justify-content: right;
  margin-top: 5em;
`;

export const textSections = css`
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;

  h2 {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.25px;
    color: #1d232e;
    margin-bottom: 12px;
  }
  span {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #1d232e;
  }
  .secondHeader {
    margin-top: 36px;
  }
`;
export const sendRequestButton = css`
  width: 21em;
  margin-top: 1em;
  box-sizing: border-box;
  border-radius: 25px;
  padding: 16px 32px;
  gap: 12px;
  border: none;

  background: #92969a;
  border-radius: 25px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.25px;
  color: #ffffff;
  :active {
    outline: #68107a;
  }
`;

export default function UserProfile(props) {
  const router = useRouter();
  // create a new chat}
  const [errors, setErrors] = useState([]);

  async function createAChat() {
    if (props.conversationID) {
      await router.push(`/chats/${props.conversationID}`);
    } else {
      const response = await fetch(`../../api/chats/new-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buddyPersonalDataId: props.personalData.personalDataId,
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

  if (!props.personalData || 'errors' in props) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  }
  return (
    <div>
      <Head>
        <title>{props.personalData.firstName}</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <div css={headerContainer}>
          <Link href="/discovery">
            <img
              src="/back-icon.png"
              alt="back button"
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <h1 css={title}>Profile</h1>
        </div>
        <div css={contentContainer}>
          <div>
            <img
              src={props.personalData.profilePictureUrl}
              alt="user avatar"
              style={{ width: 72, height: 72, borderRadius: 100 }}
            />
          </div>
          <div css={userName}> {props.personalData.firstName} </div>
          <div css={ageLocation}>
            {props.personalData.age}, from{' '}
            {props.personalData.address.split(',')[0]}
          </div>
          <div css={playingInstruments}>
            {props.personalData.playingInstrument
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
          <div css={genreListContainer}>
            {props.userGenresArray.map((genre) => (
              <div key={`genre-${genre}`} css={genreList}>
                <span>{genre}</span>
              </div>
            ))}
          </div>
          <div css={textSections}>
            <h2>Short message</h2>
            <span>{props.personalData.shortDescription}</span>
            <h2 className="secondHeader">About me</h2>
            <span>{props.personalData.aboutMe}</span>
          </div>
          <hr css={horizontalLine} />
          <button css={sendRequestButton} onClick={createAChat}>
            Send a message
          </button>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const userIdFromUrl = await context.query.userId;
  if (!userIdFromUrl || Array.isArray(userIdFromUrl)) {
    return {
      props: {},
    };
  }

  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const csrfToken = await createCsrfToken(session.csrfSecret);
  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }

  const currentUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const currentUserDataId = await getPersonalDataIDByUserId(currentUser.id);

  if (!currentUser) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  const buddyUser = await getUserById(parseInt(userIdFromUrl));
  const buddyDataId = await getPersonalDataIDByUserId(buddyUser.id);
  const userGenres = await getUserGenreByPersonalDataID(buddyDataId);
  const userGenresArray = userGenres.map((genre) => genre.genreName);
  const personalData = await getUserPersonalData(buddyDataId);

  // get conversation id if exists to be able to redirect to it later

  const conversationID = await getConversationIdbyUsersDataId(
    currentUserDataId,
    buddyDataId,
  );

  if (!conversationID) {
    return {
      props: {
        personalData: personalData,
        userGenresArray: userGenresArray,
        csrfToken: csrfToken,
        conversationID: null,
      },
    };
  }

  return {
    props: {
      personalData: personalData,
      userGenresArray: userGenresArray,
      csrfToken: csrfToken,
      conversationID: conversationID.conversationId,
    },
  };
}
