import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const avatarContainer = css`
  width: 100vw;
  display: flex;
  justify-content: right;
  padding-top: 32px;
  z-index: 1;
  position: fixed;
  top: 0;
  background: #ffff;
`;
const profileImage = css`
  width: 35px;
  height: 35px;
  left: 331px;
  top: 52px;

  background: #f3f1f1;
  border-radius: 25px;
  margin-right: 24px;
`;
function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  const { asPath } = useRouter();

  try {
    if (props?.profileImage?.profilePictureUrl === null && asPath !== '/form') {
      props.refreshUserProfile();
    }
  } catch (error) {
    console.error(
      `Error trying to refresh User Profile in Header --- ${error} with props ${JSON.stringify(
        props,
      )}`,
    );
  }

  return (
    <header>
      {asPath !== '/form' &&
        asPath !== '/' &&
        asPath !== '/register' &&
        asPath !== '/login' &&
        asPath !== '/users/private-profile' &&
        asPath !== '/filters' &&
        props.user && (
          <div css={avatarContainer}>
            <Anchor href="/users/private-profile">
              <img
                css={profileImage}
                src={props.profileImage.profilePictureUrl}
                alt="user"
                data-test-id="user-avatar"
              />
            </Anchor>
          </div>
        )}
    </header>
  );
}
