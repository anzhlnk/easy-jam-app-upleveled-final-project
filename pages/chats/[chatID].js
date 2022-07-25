import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { createCsrfToken } from '../../util/auth';
import {
  getbuddyName,
  getConversationById,
  getConversationsUser,
  getMessagesByConversationId,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getValidSessionByToken,
} from '../../util/database';
import { main } from '../discovery';
import { title } from '../users/usersbyid/[userId]';

const notAuthenticated = css`
  width: 90vw;
  height: 80vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-family: 'Michroma';
  font-size: 14px;
  line-height: 40px;
  text-transform: uppercase;
`;

const headerContainer = css`
  z-index: 1;
  position: fixed;
  @media (min-width: 500px) {
    width: 50vw;
  }
  height: 35px;
  width: 60vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -29px;
  .nameLocation {
    display: flex;
    flex-direction: row;
    img {
      margin-left: 1em;
    }
  }
`;

const contentContainer = css`
  margin-top: 60px;
  margin-left: 24px;
  margin-right: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AblyChatComponent = dynamic(
  () => import('../../components/AblyChatComponent'),
  { ssr: false },
);

export default function TestChat(props) {
  return 'errors' in props ? (
    <>
      <Head>
        <meta name="description" content="Chats" />
      </Head>
      <div css={headerContainer}>
        <Link href="/discovery">
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </Link>
        <h1 css={title}>Chat</h1>
      </div>{' '}
      <h2 css={notAuthenticated}>Not authenticated</h2>;
    </>
  ) : (
    <>
      <Head>
        <meta name="description" content="Chats" />
      </Head>
      <main css={main}>
        <div css={headerContainer}>
          <Link href="/discovery">
            <img
              src="/back-icon.png"
              alt="back button"
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <div className="nameLocation">
            <h1 css={title}>{props.buddyName}</h1>
            <Link href={`/chats/studios-map/${props.conversation}`}>
              <img
                src="/location.png"
                alt="back button"
                style={{ width: 17, height: 27 }}
                data-test-id="location-image"
              />
            </Link>
          </div>
        </div>
        <div css={contentContainer}>
          <AblyChatComponent
            conversation={props.conversation}
            conversationHistory={props.conversationHistory}
            csrfToken={props.csrfToken}
            personalDataId={props.dataId}
          />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const csrfToken = await createCsrfToken(session.csrfSecret);
  const dataId = await getPersonalDataIDByUserId(user.id);
  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }

  if (user) {
    // get the conversation via the id from the url
    const conversation = await getConversationById(context.query.chatID);

    if (!conversation) {
      return {
        redirect: {
          destination: '/discovery',
          permanent: false,
        },
      };
    }

    const participantsOfTheConversation = await getConversationsUser(
      conversation.id,
    );

    const currentUserParticipant = participantsOfTheConversation
      .map((participant) => {
        return participant.personalDataId;
      })
      .includes(dataId);

    if (!currentUserParticipant) {
      return {
        props: { errors: 'Not authenticated' },
      };
    }

    const buddyDataId = participantsOfTheConversation
      .filter((participant) => {
        return participant.personalDataId !== dataId;
      })
      .map((participant) => {
        return participant.personalDataId;
      })[0];
    const buddyName = await getbuddyName(buddyDataId);
    const today = new Date().toDateString();

    const conversationHistoryTimestampNotParsed =
      await getMessagesByConversationId(conversation.id);

    const conversationHistory = conversationHistoryTimestampNotParsed.map(
      (chat) => {
        return {
          id: chat.id,
          personalDataId: chat.personalDataId,
          conversationId: chat.conversationId,
          content: chat.content,
          timestampAdapted:
            new Date(Date.parse(chat.timestamp)).toDateString() === today
              ? new Date(Date.parse(chat.timestamp)).toTimeString().slice(0, 5)
              : new Date(Date.parse(chat.timestamp)).toDateString().slice(3),
          timestamp: new Date(Date.parse(chat.timestamp)).toString(),
        };
      },
    );

    // if there is a logged in user who is part of this chat

    return {
      props: {
        conversation: conversation.id,
        conversationHistory: conversationHistory,
        csrfToken: csrfToken,
        dataId: dataId,
        buddyName: buddyName.firstName,
        participantsOfTheConversation: participantsOfTheConversation,
      },
    };
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
