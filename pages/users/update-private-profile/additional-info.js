import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { createCsrfToken } from '../../../util/auth';
import {
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getUserGenreByPersonalDataID,
  getUserPersonalData,
  getValidSessionByToken,
} from '../../../util/database';
import {
  genreList,
  genreListContainer,
  instrumentImage,
  instrumentImageContainer,
  title,
  userName,
} from '../usersbyid/[userId]';

const contentAll = css`
  padding-left: 12px;
  width: 100vw;
  height: 85vh;
`;

export const contentContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 120px;
  align-items: center;
  padding-left: 64px;
  padding-right: 64px;
`;

const alignWithPencil = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const playinInstruments = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 80vw;
`;

export const headerContainer = css`
  z-index: 1;
  @media (min-width: 500px) {
    width: 50vw;
  }
  position: fixed;
  width: 50vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -84px;
`;

export const ageLocation = css`
  display: flex;
  justify-content: left;
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

export const textSections = css`
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  width: 80vw;

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

  input:enabled {
    background: none;
    width: 70vw;
    height: 8em;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #1d232e;
    background: linear-gradient(#fff, #fff) padding-box, #ffce00 border-box;
    border: 2px solid transparent;
  }
  span {
    height: 8em;
    max-width: 100%;
    width: 70vw;
    height: 8em;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    color: #1d232e;
  }
  input:focus,
  input:active {
    outline: none !important;
    border-color: #1b3d5f;
  }

  .secondHeader {
    margin-top: 16px;
  }
`;

const transparentButton = css`
  width: 35;
  height: 35;
  background: none;
  border: none;
`;

export default function UserDetail(props) {
  // TODO: We use || '' because the default values after registration are NULL and that causes an issue, when the user first changes
  // their shortDesc/aboutMe sections. In the future, we replace the default values to be sent to the database with a string
  const [shortDescription, setShortDescription] = useState(
    props.personalData.shortDescription || '',
  );
  const [aboutMe, setAboutMe] = useState(props.personalData.aboutMe || '');

  const [editShortDescription, setEditShortDescription] = useState('');
  const [editAboutMe, setEditAboutMe] = useState('');

  const [active, setActive] = useState(false);

  async function updateDescriptionHandler() {
    const response = await fetch(`../../api/update-data/user-description`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shortDescription: editShortDescription,
        aboutMe: editAboutMe,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedInfo = await response.json();
    setShortDescription(updatedInfo[0].shortDescription);
    setAboutMe(updatedInfo[0].aboutMe);
  }

  if (!props.personalData) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="additional user info" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  }

  return (
    <div css={contentAll}>
      <Head>
        <title>{props.personalData.firstName}</title>
        <meta name="additional user info" content="Additional user info" />
      </Head>

      <main>
        <div css={headerContainer} style={{ marginLeft: 12 }}>
          <Link href="/users/private-profile">
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
          <div css={userName}>{props.personalData.firstName} </div>
          <div css={ageLocation}>
            {props.personalData.age}, from Vienna
            {/* {props.personalData.address.split(',').slice(0, 2)} */}
          </div>
          <div css={alignWithPencil}>
            <div css={playinInstruments} style={{ justifyContent: 'center' }}>
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
            <Link href="/users/update-private-profile/instruments-update">
              <img
                alt="to adapting personal info"
                src="/edit.png"
                style={{ width: 35, height: 35 }}
              />
            </Link>
          </div>
          <div css={alignWithPencil}>
            <div css={genreListContainer}>
              {props.userGenresArray.map((genre) => (
                <div key={`genre-${genre}`} css={genreList}>
                  <span>{genre}</span>
                </div>
              ))}
            </div>
            <Link href="/users/update-private-profile/genres-update">
              <img
                alt="to adapting personal info"
                src="/edit.png"
                style={{ width: 35, height: 35 }}
              />
            </Link>
          </div>

          {active ? (
            <div css={alignWithPencil}>
              <div css={textSections}>
                <h2>Short message</h2>
                <input
                  className="box"
                  value={editShortDescription}
                  onChange={(event) =>
                    setEditShortDescription(event.currentTarget.value)
                  }
                />
                <h2 className="secondHeader">About me</h2>
                <input
                  className="box"
                  value={editAboutMe}
                  onChange={(event) =>
                    setEditAboutMe(event.currentTarget.value)
                  }
                />
              </div>
              <button
                css={transparentButton}
                onClick={() => {
                  setActive(false);
                  updateDescriptionHandler().catch((e) => {
                    console.error('Error in updateDescriptionHandler: ', e);
                  });
                }}
              >
                <img
                  alt="confirm the change"
                  src="/confirm.png"
                  style={{ width: 35, height: 35 }}
                />
              </button>
            </div>
          ) : (
            <div css={alignWithPencil}>
              <div css={textSections}>
                <h2>Short message</h2>
                <span>{shortDescription} </span>
                <h2 className="secondHeader">About me</h2>
                <span>{aboutMe} </span>
              </div>
              <button
                css={transparentButton}
                onClick={() => {
                  setActive(true);
                  setEditShortDescription(shortDescription);
                  setEditAboutMe(aboutMe);
                }}
              >
                <img
                  alt="to adapting personal info"
                  src="/edit.png"
                  style={{ width: 35, height: 35 }}
                />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const csrfToken = await createCsrfToken(session.csrfSecret);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const dataId = await getPersonalDataIDByUserId(user.id);
  const userGenres = await getUserGenreByPersonalDataID(dataId);
  const userGenresArray = userGenres.map((genre) => genre.genreName);
  const personalData = await getUserPersonalData(dataId);

  if (user) {
    return {
      props: {
        personalData: personalData,
        userGenresArray: userGenresArray,
        csrfToken: csrfToken,
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
