import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  getPersonalDataIDByUserId,
  getUserById,
  getUserGenreByPersonalDataID,
  getUserPersonalData,
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
  :first-child {
    z-index: 0;
    margin-right: 10em;
  }
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

export const playinInstruments = css`
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
  margin-top: 10em;
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
type Props = {
  personalData?: {
    id: number;
    username: string;
    profilePictureUrl: string;
  };
};
export default function UserProfile(props: Props) {
  if (!props.personalData) {
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
          <div css={playinInstruments}>
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
          <button css={sendRequestButton}>Send request</button>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userIdFromUrl = await context.query.userId;
  if (!userIdFromUrl || Array.isArray(userIdFromUrl)) {
    return {
      props: {},
    };
  }
  const user = await getUserById(parseInt(userIdFromUrl));

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }
  const dataId = await getPersonalDataIDByUserId(user.id);
  const userGenres = await getUserGenreByPersonalDataID(dataId);
  const userGenresArray = userGenres.map((genre) => genre.genreName);
  const personalData = await getUserPersonalData(dataId);
  console.log('personalData', personalData);
  console.log('userGenres', userGenres);
  return {
    props: { personalData: personalData, userGenresArray: userGenresArray },
  };
}
