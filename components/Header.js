import { css } from '@emotion/react';
import Link from 'next/link';

const profileImage = css`
  width: 35px;
  height: 35px;
  left: 331px;
  top: 52px;

  background: #f3f1f1;
  border-radius: 25px;
`;

export default function Header(props) {
  console.log(props, 'props heeeere');
  return (
    <header>
      {props.user && (
        <Link href="/users/private-profile">
          <img
            css={profileImage}
            src={props.profileImage.profilePictureUrl}
            alt="user"
          />
        </Link>
      )}
    </header>
  );
}
