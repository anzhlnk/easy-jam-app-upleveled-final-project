import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  genreList,
  genreListContainer,
} from '../pages/users/usersbyid/[userId]';

const profileDataContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2em;
  background-color: white;
`;

const userInfoContainer = css`
  max-width: 65vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const profileImage = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const buddyAvatar = css`
  width: 12em;
  height: 12em;
  border-radius: 350px;
`;

const buddyName = css`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: left;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.25px;
  color: #1d232e;
`;

const instrumentContainer = css`
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

const playingInstruments = css`
  display: flex;
  flex-direction: row;
  margin-top: 1.5em;
`;

const instrumentImage = css`
  max-width: 20px;
  max-height: 25px;
`;

const viewProfileContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-color: #ffffff;
  min-width: 116px;
  min-height: 32px;
  background: #ffffff;
  border-radius: 100px;
  margin-right: 12px;
  margin-top: -24px;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  a {
    text-decoration: none;
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

const shortDescription = css`
  span {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;

    color: #1d232e;
  }
`;

const addUserContainer = css`
  display: flex;
  width: 100%;
  justify-content: right;
  align-items: right;
  margin-bottom: -24px;
`;

const addUser = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;

  background: linear-gradient(#fff, #fff) padding-box, #ffce00 border-box;
  border: 2px solid transparent;
  border-radius: 50px;

  box-shadow: 1px 1px 4px rgba(93, 107, 130, 0.44);
  button {
    border: none;
    z-index: 1;
  }
  img {
    z-index: 0;
  }
`;

const nameAgeDistanceContainer = css`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .distance {
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: right;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    color: #a7b0c0;
  }
  @media (min-width: 900px) {
    width: 15vw;
  }
`;
const percentageMessageContainer = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
  .percentage {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 150px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */

    text-align: right;

    /* Text/300 */

    color: #a7b0c0;
  }
`;

export default function FilterResultsPlaymode(props) {
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  async function createChat(buddyId) {
    const buddyConversationId = await props.conversations.filter(
      (conversation) => {
        return conversation.buddyPersonalDataId === buddyId;
      },
    );
    if (buddyConversationId?.length > 0) {
      await router.push(`/chats/${buddyConversationId[0].conversationId}`);
    } else {
      const response = await fetch(`./api/chats/new-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buddyPersonalDataId: buddyId,
          csrfToken: props.csrfToken,
        }),
      });

      const createdChat = await response.json();

      if ('errors' in createdChat) {
        setErrors(createdChat.errors);
        console.error('Error in FilterResultsPlaymode: ', errors);
        await router.push('/discovery');
      } else {
        await router.push(`/chats/${createdChat.id}`);
      }
    }
  }

  return (
    <div>
      <div>
        <div css={profileDataContainer}>
          <div css={addUserContainer}>
            <div css={addUser}>
              <button
                onClick={() => {
                  createChat(props.profile.personalDataId).catch((err) => {
                    console.error(
                      'Error after onClick event when creating Chat: ',
                      err,
                    );
                  });
                }}
              >
                <img
                  src="/message.png"
                  alt="message the user"
                  style={{ width: 17, height: 14 }}
                />
              </button>
            </div>
          </div>
          <div css={profileImage}>
            <img
              src={props.profile.profilePictureUrl}
              alt="user avatar"
              css={buddyAvatar}
            />
          </div>
          <div css={viewProfileContainer}>
            <Link href={`/users/usersbyid/${props.profile.personalDataId}`}>
              View Profile
            </Link>
          </div>
          <div css={userInfoContainer}>
            <div css={nameAgeDistanceContainer}>
              <div css={buddyName}>
                <span>
                  {props.profile.firstName}, {props.profile.age}{' '}
                </span>
              </div>
              <div className="distance">
                {Math.ceil(
                  props.buddiesWithinHundredDistance.find((buddy) => {
                    return (
                      buddy.buddyPersonalDataId === props.profile.personalDataId
                    );
                  }).distanceToBuddyMeters / 1000,
                )}{' '}
                km away
              </div>
            </div>
            <div css={shortDescription}>
              <span>{props.profile.shortDescription}</span>
            </div>
            <div css={playingInstruments}>
              {props.profile.playingInstrument.split(',').map((instrument) => {
                return (
                  <div
                    key={`instrument-${instrument}`}
                    css={instrumentContainer}
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
              {props.userGenresArray
                .filter((genre) => {
                  return genre.personalDataId === props.profile.personalDataId;
                })
                .map((genre) => {
                  return genre.genreName.split(',').map((singleGenre) => {
                    return (
                      <div key={`genre-${singleGenre}`} css={genreList}>
                        <span>{singleGenre}</span>
                      </div>
                    );
                  });
                })}
            </div>
            <div css={percentageMessageContainer}>
              <div className="percentage">{props.percentage}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
