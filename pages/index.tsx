import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const main = css`
  background-image: url('/landing-page.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const contentContainer = css`
  margin-top: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  @media (min-width: 900px) {
    justify-content: start;
  }
`;

const logoText = css`
  position: relative;
  margin-top: 2em;
  font-family: 'Michroma';
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 57px;
  text-transform: uppercase;
  color: #ffffff;
`;
const linkOne = css`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;

  position: relative;
  width: 20em;
  margin-top: 5em;

  background: #e8e8e8;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 60px;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  text-align: center;
  letter-spacing: -0.25px;
  color: #000000;
  border: none;
  :hover {
    outline-color: #1b3d5f;
  }
`;
const linkTwo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;

  position: relative;
  width: 20em;
  margin-top: 2em;

  background: #467434;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 60px;
  border: none;

  text-decoration: none;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.25px;
  color: #ffffff;
`;
const lowerText = css`
  position: absolute;
  bottom: 8em;
  font-family: 'Michroma';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 23px;
  text-transform: uppercase;
  color: #a9943c;
`;

export default function Home() {
  return (
    <div css={main}>
      <Head>
        <title>EasyJam</title>
        <meta name="EasyJam Home page" content="EasyJam Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div css={contentContainer}>
          <div css={logoText}> EasyJam</div>
          <Link href="/register" passHref>
            <button css={linkOne}>Sign Up </button>
          </Link>
          <Link href="/login" passHref>
            <button css={linkTwo} data-test-id="login-index">
              Log In
            </button>
          </Link>
          <div css={lowerText}> Start jamming now</div>
        </div>
      </main>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  // if there is a token, redirect to discovery
  if (token) {
    return {
      redirect: {
        destination: `/discovery`,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
