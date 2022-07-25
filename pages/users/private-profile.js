/* eslint-disable import/no-unresolved */
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { createCsrfToken } from '../../util/auth';
import {
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getUserGenreByPersonalDataID,
  getUserPersonalData,
  getValidSessionByToken,
} from '../../util/database';
import { errorMessage } from '../login';
import {
  contentContainer,
  genreList,
  genreListContainer,
  instrumentImage,
  instrumentImageContainer,
  playingInstruments,
  textSections,
  title,
  userName,
} from './usersbyid/[userId]';

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
  margin-top: 36px;
`;

const contentAll = css`
  .swiper {
    width: 100vw;
    height: 85vh;
    z-index: 0;
  }
`;
const settingContentContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  align-items: left;
  padding-left: 32px;
  padding-right: 32px;

  @media (min-width: 500px) {
    width: 50vw;
  }
`;
const editOptionsContainer = css`
  a {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 2px solid #e7ecf3;
    padding-top: 12px;
    text-decoration: none;
  }
  button {
    width: 100%;
    padding-top: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: none;
    border: none;
  }
  h2 {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.25px;
    color: #1d232e;
  }
`;

const personalInfoEditorContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 36px;
`;
const nameAgeLocationContainer = css`
  display: flex;
  flex-direction: column;
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

const userNameEditPage = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  letter-spacing: -1.5px;

  color: #1d232e;
`;

const deleteBanner = (isOpen) => css`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 20em;
  @media screen and (min-width: 900px) {
    width: 42em;
  }
  position: fixed;
  bottom: 5em;
  background: linear-gradient(#fff, #fff) padding-box, #ffce00 border-box;
  border: 2px solid transparent;
  border-radius: 25px;
  height: ${isOpen ? '300px' : 0};
  overflow: hidden;
  transition: all 200ms ease-in;
  z-index: 1;
  h2 {
    margin-top: 12px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;

    color: #1b3d5f;
  }
  p {
    width: 18em;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;

    color: #5d6470;
  }
`;

const buttonOne = css`
  margin-top: 32px;
  button {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    letter-spacing: -0.25px;
    color: #1b3d5f;
  }
`;

const buttonTwo = css`
  margin-top: 12px;
  button {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    letter-spacing: -0.25px;
  }
`;

const sliderContainer = css`
  @media (min-width: 500px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function UserDetail(props) {
  const [popUp, setPopUp] = useState(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  async function deleteAccountHandler() {
    const response = await fetch(`../api/update-data/delete-user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        csrfToken: props.csrfToken,
      }),
    });
    const deletedUser = await response.json();
    if ('errors' in deletedUser) {
      setErrors(deletedUser.errors);
      return;
    }
    await router.push(`/logout`);
    await props.refreshUserProfile();
  }

  if (!props.personalData || 'errors' in props) {
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
    <div css={contentAll}>
      <main>
        <Head>
          <title>{props.personalData.firstName}</title>
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
          <h1 css={title}>Profile</h1>
        </div>
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
          <SwiperSlide>
            <div css={contentContainer}>
              <div>
                <img
                  src={props.personalData.profilePictureUrl}
                  alt="user avatar"
                  style={{ width: 72, height: 72, borderRadius: 100 }}
                />
              </div>
              <div css={userName}>
                {props.personalData.firstName} {props.personalData.lastName}
              </div>
              <div css={ageLocation}>
                {props.personalData.age}, from{' '}
                {/* {props.personalData.address.split(',').slice(0, 2)} */}
                Vienna
              </div>
              <div css={playingInstruments}>
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
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div css={sliderContainer}>
              <div css={settingContentContainer}>
                <div>
                  <img
                    src={props.personalData.profilePictureUrl}
                    alt="user avatar"
                    style={{ width: 72, height: 72, borderRadius: 100 }}
                  />
                </div>
                <div css={personalInfoEditorContainer}>
                  <div css={nameAgeLocationContainer}>
                    <div css={userNameEditPage}>
                      {props.personalData.firstName}{' '}
                      {props.personalData.lastName}
                    </div>
                    <div css={ageLocation}>
                      {props.personalData.age}, from Vienna
                      {/* {props.personalData.address.split(',').slice(0, 2)} */}
                    </div>
                  </div>
                  <Link href="/users/update-private-profile/personal-info">
                    <img
                      alt="to adapting personal info"
                      src="/edit.png"
                      style={{ width: 35, height: 35 }}
                      data-test-id="update-user-info"
                    />
                  </Link>
                </div>
                <div css={textSections}>
                  <div css={editOptionsContainer}>
                    <Link href="/users/update-private-profile/additional-info">
                      <a>
                        <h2>Profile</h2>
                        <img
                          src="/right_icon.png"
                          alt="continue button"
                          style={{ width: 24, height: 24 }}
                        />
                      </a>
                    </Link>
                  </div>
                  <div css={editOptionsContainer}>
                    <Link href="/users/update-private-profile/password-update">
                      <a>
                        <h2>Change password</h2>{' '}
                        <img
                          src="/right_icon.png"
                          alt="continue button"
                          style={{ width: 24, height: 24 }}
                        />
                      </a>
                    </Link>
                  </div>
                  <div css={editOptionsContainer}>
                    <Anchor href="/logout">
                      <h2>Log out</h2>{' '}
                      <img
                        src="/right_icon.png"
                        alt="continue button"
                        style={{ width: 24, height: 24 }}
                      />
                    </Anchor>
                  </div>
                  <div css={editOptionsContainer}>
                    <button onClick={() => setPopUp(true)}>
                      <h2>Delete account</h2>{' '}
                      <img
                        src="/right_icon.png"
                        alt="continue button"
                        style={{ width: 24, height: 24 }}
                      />
                    </button>
                    {popUp && (
                      <div css={deleteBanner(popUp)}>
                        <h2>Are you sure?</h2>
                        <p>
                          If you delete your account, you will lose your profile
                          data and matches.
                        </p>
                        <p>Would you like to delete your account?</p>
                        <div css={buttonOne}>
                          <button onClick={deleteAccountHandler}>
                            Delete My Account
                          </button>
                        </div>
                        <div>
                          <button
                            css={buttonTwo}
                            onClick={() => {
                              setPopUp(false);
                            }}
                          >
                            Cancel
                          </button>
                          {errors.map((error) => (
                            <div
                              key={`error-${error.message}`}
                              css={errorMessage}
                            >
                              {error.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
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
  const userGenres = await getUserGenreByPersonalDataID(dataId);
  const userGenresArray = userGenres.map((genre) => genre.genreName);
  const personalData = await getUserPersonalData(dataId);

  if (user) {
    return {
      props: {
        csrfToken: csrfToken,
        personalData: personalData,
        userGenresArray: userGenresArray,
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
