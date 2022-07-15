import { css } from '@emotion/react';
import Link from 'next/link';

const profileDataContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2em;
  box-sizing: border-box;
`;

const profileButtonContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-color: none;
  border: none;

  .distance {
    width: 40px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    color: #a7b0c0;
    margin-bottom: 0.5em;
  }

  a {
    text-decoration: none;
  }
  button {
    border: none;
    border-color: #ffffff;
    width: 35px;
    height: 35px;
    background: #ffffff;
    border-radius: 100px;

    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }
`;
const profileImage = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const buddyAvatar = css`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const nameInstrumentsContainer = css`
  min-width: 250px;
  display: flex;
  flex-direction: column;
  margin-left: 1em;
`;

const buddyName = css`
  display: flex;
  flex-direction: row;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.25px;
  color: #1d232e;
  span {
    margin-right: 6px;
  }
`;

const playinInstruments = css`
  display: flex;
  flex-direction: row;
`;
const instrumentImageContainer = css`
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

const instrumentImage = css`
  max-width: 20px;
  max-height: 25px;
`;

export const horizontalLine = css`
  width: 60vw;
  border: 0.5px solid #e7ecf3;
  justify-content: right;
  margin-top: 1em;
`;

export default function FilterResults(props) {
  return (
    <div css={profileDataContainer}>
      <div css={profileImage}>
        <img
          src={props.profile.profilePictureUrl}
          alt="user avatar"
          css={buddyAvatar}
        />
      </div>
      <div css={nameInstrumentsContainer}>
        <div css={buddyName}>
          <span>{props.profile.firstName}</span>
          <span>{props.profile.lastName}</span>
        </div>
        <div css={playinInstruments}>
          {props.profile.playingInstrument.split(',').map((instrument) => {
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
        <hr css={horizontalLine} />
      </div>
      <div css={profileButtonContainer}>
        <div className="distance">
          {Math.ceil(
            props.buddiesWithinHundredDistance.find((buddy) => {
              return buddy.buddyPersonalDataId === props.profile.personalDataId;
            }).distanceToBuddyMeters / 1000,
          )}{' '}
          km
        </div>
        <Link href={`/users/usersbyid/${props.profile.personalDataId}`}>
          <button>{'>'}</button>
        </Link>
      </div>
    </div>
  );
}
