import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const main = css`
  background: linear-gradient(
    164.33deg,
    #f7ff26 17.89%,
    #4dfb34 55.72%,
    #18fdef 95.17%
  );
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
  color: #2d2e1d;
`;
const linkOne = css`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;

  position: relative;
  /* bottom: 16em; */
  width: 20em;
  margin-top: 8em;

  background: #f5f5f5;
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
    outline-color: #68107a;
  }
`;
const linkTwo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;

  position: relative;
  /* bottom: 10em; */
  width: 20em;
  margin-top: 2em;

  background: #949494;
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
  bottom: 3em;

  font-family: 'Michroma';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 23px;
  /* identical to box height */

  text-transform: uppercase;

  /* Black */

  color: #2d2e1d;
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
            <button css={linkTwo}>Log In</button>
          </Link>
          <div css={lowerText}> Start jamming now</div>
        </div>
      </main>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  // if there is a token, redirect to discovert
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
