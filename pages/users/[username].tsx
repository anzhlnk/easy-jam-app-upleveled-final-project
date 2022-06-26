import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByUsername } from '../../util/database';

type Props = {
  user?: {
    id: number;
    username: string;
  };
};
export default function UserProfile(props: Props) {
  if (!props.user) {
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
        <title>{props.user.id}</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <h1>User # {props.user.id}</h1>
        <div>username: {props.user.username} </div>
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
  const user = await getUserByUsername(userIdFromUrl);
  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }
  return {
    props: { user: user },
  };
}
