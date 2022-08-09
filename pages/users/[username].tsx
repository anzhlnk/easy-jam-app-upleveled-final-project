import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getUserByUsername, getValidSessionByToken } from '../../util/database';
import { authenticationError } from '../discovery';

const headerStyle = css`
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
  width: 100vw;
`;

type Props = {
  user?: {
    id: number;
    username: string;
  };
  errors?: string;
};

export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="user profile" content="other user profile" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  }
  if ('errors' in props) {
    return (
      <>
        <Head>
          <title>Not authenticated </title>
          <meta name="Not authenticated" content="Not authenticated" />
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
        <title>{props.user.id}</title>
        <meta name="user profile" content="other user profile" />
      </Head>

      <main>
        <h1 css={headerStyle}>Coming soon...</h1>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userIdFromUrl = context.query.username;
  if (!userIdFromUrl || Array.isArray(userIdFromUrl)) {
    return {
      props: {},
    };
  }
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const user = await getUserByUsername(userIdFromUrl);
  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }
  return {
    props: { user: user },
  };
}
