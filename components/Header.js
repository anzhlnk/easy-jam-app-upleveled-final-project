import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const avatarContainer = css`
  width: 100vw;
  display: flex;
  justify-content: right;
  margin-top: 24px;
  z-index: 1;
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

export default function Header(props) {
  const { asPath } = useRouter();

  return (
    <header>
      {asPath !== '/form' &&
        asPath !== '/users/private-profile' &&
        asPath !== '/filters' &&
        props.user && (
          <div css={avatarContainer}>
            <Link href="/users/private-profile">
              <img
                css={profileImage}
                src={props.profileImage.profilePictureUrl}
                alt="user"
              />
            </Link>
          </div>
        )}
    </header>
  );
}
