import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../../pages/login';
import { main } from '../../../pages/register';
import { createCsrfToken } from '../../../util/auth';
import {
  getUserByValidSessionToken,
  getValidSessionByToken,
} from '../../../util/database';
import { headerContainer } from './instruments-update';
import { confirmButton, confirmButtonContainer, title } from './personal-info';

export const contentContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const nextButtonContainer = css`
  display: flex;
  justify-content: right;
  width: 21em;
`;

export const nextButton = css`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 10em;

  height: 53px;
  width: 53px;
  background: #92969a;
  border-radius: 100px;
  border: none;
  color: #ffffff;
`;

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
  width: 100vw;

  input {
    width: 25em;
    height: 50px;
    margin-top: 1em;
    box-sizing: border-box;

    background: #f8fafd;
    border: 1px solid #e7ecf3;
    border-radius: 25px;
    padding-left: 2em;
  }
`;

export default function UpdatePassword(props) {
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
  const router = useRouter();

  const submitFormData = (e) => {
    if (
      validator.isEmpty(oldPassword) ||
      validator.isEmpty(newPassword) ||
      validator.isEmpty(confirmedNewPassword)
    ) {
      setError(true);
    }
    e.preventDefault();
  };

  async function updatePassword() {
    const response = await fetch(`../../api/update-data/user-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: props.user,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmedNewPassword: confirmedNewPassword,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedUserPassword = await response.json();

    if ('errors' in updatedUserPassword) {
      setErrors(updatedUserPassword.errors);
      return;
    } else {
      // redirect user to private-profile
      await router.push('/users/private-profile');
    }
  }

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <Link href="/users/private-profile">
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </Link>
        <h1 css={title}>Password</h1>
      </div>

      <div css={inputContainer}>
        <input
          type="password"
          placeholder="Old password"
          onChange={(event) => setOldPassword(event.currentTarget.value)}
        />
        <input
          type="password"
          placeholder="New password"
          onChange={(event) => setNewPassword(event.currentTarget.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          onChange={(event) =>
            setConfirmedNewPassword(event.currentTarget.value)
          }
        />
      </div>
      {error ? <div css={errorMessage}>Please, fill all fields</div> : ''}
      {errors.map((errorFromDb) => (
        <div key={`error-${errorFromDb.message}`} css={errorMessage}>
          {errorFromDb.message}
        </div>
      ))}

      <div css={confirmButtonContainer}>
        <button css={confirmButton} onClick={updatePassword}>
          <img
            src="/tick_icon.png"
            alt="tick icon"
            style={{ width: 20, height: 18 }}
          />
        </button>
      </div>
    </form>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = await context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  console.log(user, 'user');
  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const csrfToken = await createCsrfToken(session.csrfSecret);

  if (user) {
    return {
      props: {
        user: user,
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
