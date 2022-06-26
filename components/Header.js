import { css } from '@emotion/react';
import Link from 'next/link';

export default function Header(props) {
  return (
    <header>
      {props.user && (
        <Link href="/users/private-profile">{props.user.username}</Link>
      )}
    </header>
  );
}
