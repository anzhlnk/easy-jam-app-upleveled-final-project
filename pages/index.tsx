import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';

const main = css`
  background: linear-gradient(
    164.33deg,
    #f7ff26 17.89%,
    #4dfb34 55.72%,
    #18fdef 95.17%
  );
  //to be adapted
  width: 375px;
  height: 812px;
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const logoText = css`
  position: absolute;
  width: 290px;
  height: 57px;
  left: 41px;
  top: 324px;

  font-family: 'Michroma';
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 57px;
  /* identical to box height */

  text-transform: uppercase;

  /* Black */

  color: #2d2e1d;
`;
const linkContainerOne = css`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;

  position: absolute;
  height: 56px;
  left: 24px;
  right: 24px;
  bottom: 229px;

  background: #f5f5f5;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 60px;
  a {
    text-decoration: none;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    text-align: center;
    letter-spacing: -0.25px;

    color: #000000;
  }
`;
const linkContainerTwo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;

  position: absolute;
  height: 56px;
  left: 24px;
  right: 24px;
  bottom: 139px;

  background: #949494;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 60px;
  a {
    text-decoration: none;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;
    color: #ffffff;
  }
`;
const lowerText = css`
  position: absolute;
  width: 262px;
  height: 23px;
  left: 56px;
  top: 748px;

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
          <div css={linkContainerOne}>
            <Link href="/register">Sign Up</Link>
          </div>
          <div css={linkContainerTwo}>
            <Link href="/login">Log In</Link>
          </div>
          <div css={lowerText}> Start jamming now</div>
        </div>
      </main>
    </div>
  );
}
