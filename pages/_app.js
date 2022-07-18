import { css, Global } from '@emotion/react';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState();
  const [profileImage, setProfileImage] = useState();

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');

    const profileResponseBody = await profileResponse.json();

    if (!('errors' in profileResponseBody)) {
      setUser(profileResponseBody.user);
      setProfileImage(profileResponseBody.profileImage);
    } else {
      profileResponseBody.errors.forEach((error) =>
        console.error(error.message),
      );
      setUser(undefined);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.error('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/icon-apple-touch.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Global
        styles={css`
          html,
          body {
            padding: 0;
            font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI,
              Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
          }

          * {
            box-sizing: border-box;
            margin: 0px;
            padding: 0px;
          }
        `}
      />
      <Layout user={user} profileImage={profileImage}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout>
    </>
  );
}
