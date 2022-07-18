import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { createCsrfToken } from '../../util/auth';
import {
  getLatestChatsInfo,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getValidSessionByToken,
} from '../../util/database';
import {
  contentContainer,
  headerContainer,
  title,
} from '../users/usersbyid/[userId]';

const userChat = css`
  display: flex;
  flex-direction: row;
  justify-content: start;
  a {
    text-decoration: none;
  }
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;
const avatar = css`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const nameTextContainer = css`
  display: flex;
  flex-direction: column;
  margin-left: 1em;

  .nameTimestamp {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #1d232e;
  }
  .message {
    margin-top: 6px;
    inline-size: 18em;
    font-family: 'Inter';
    font-style: normal;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 70vw;
    color: #1d232e;
  }
  .name {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.25px;
    color: #1d232e;
  }
`;

const horizontalLine = css`
  width: 70vw;
  border: 0.5px solid #e7ecf3;
  justify-content: right;
  margin-top: 1em;
  margin-bottom: 0.5em;
`;
const errorsStyle = css`
  width: 90vw;
  height: 80vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* align-items: center; */
  font-family: 'Michroma';
  word-spacing: 4px;
  font-size: 14px;
  line-height: 40px;
  text-transform: uppercase;
`;

export default function UserDetail(props) {
  if ('errors' in props) {
    return (
      <>
        <Head>
          <title>{props.errors}</title>
          <meta name="description" content="User not found" />
        </Head>
        <div css={headerContainer}>
          <Link href="/discovery">
            <img
              src="/back-icon.png"
              alt="back button"
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <h1 css={title}>Chats</h1>
        </div>
        <div css={contentContainer}>
          <p css={errorsStyle}>{props.errors}</p>
        </div>
      </>
    );
  }
  return (
    <div>
      <main>
        <Head>
          <title>Chat</title>
          <meta name="description" content="About the app" />
        </Head>
        <div css={headerContainer}>
          <Link href="/discovery">
            <img
              src="/back-icon.png"
              alt="back button"
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <h1 css={title}>Chats</h1>
        </div>
        <div css={contentContainer}>
          {props.latestChatsInfo.map((user) => {
            return (
              <div
                key={`'user-chat-info' - ${user.buddyFirstName}`}
                css={userChat}
              >
                <img
                  src={user.profilePictureUrl}
                  alt="buddy avatar"
                  css={avatar}
                />
                <Link href={`/chats/${user.conversationId}`}>
                  <a>
                    <div css={nameTextContainer}>
                      <div className="nameTimestamp">
                        <p className="name">{user.buddyFirstName}</p>
                        <div>{user.timestamp}</div>
                      </div>
                      <p className="message">{user.content}</p>
                      <hr css={horizontalLine} />
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = await context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const csrfToken = await createCsrfToken(session.csrfSecret);
  const dataId = await getPersonalDataIDByUserId(user.id);

  // 1. get all conversation number and buddy personal data id
  // 2. get the last message and its timestamp of this conversation
  // 3. get name,image of the buddy by its id
  // overall: personal id, name, image url, last message, timestamp

  const today = new Date().toDateString();
  const chatsInfoDateNotParsed = await getLatestChatsInfo(dataId);
  const latestChatsInfo = chatsInfoDateNotParsed.map((chat) => {
    return {
      buddyFirstName: chat.buddyFirstName,
      profilePictureUrl: chat.profilePictureUrl,
      conversationId: chat.conversationId,
      content: chat.content,
      timestamp:
        new Date(Date.parse(chat.timestamp)).toDateString() === today
          ? new Date(Date.parse(chat.timestamp)).toTimeString().slice(0, 5)
          : new Date(Date.parse(chat.timestamp)).toDateString().slice(3),
      buddyPersonalDataId: chat.buddyPersonalDataId,
    };
  });

  if (latestChatsInfo.length === 0) {
    return {
      props: { errors: 'You currently have no messages.' },
    };
  }

  if (user) {
    return {
      props: {
        csrfToken: csrfToken,
        latestChatsInfo: latestChatsInfo,
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTo=/users/private-profile`,
      permanent: false,
    },
  };
}
