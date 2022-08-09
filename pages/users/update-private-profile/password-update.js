import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../../pages/login';
import { createCsrfToken } from '../../../util/auth';
import {
  getUserByValidSessionToken,
  getValidSessionByToken,
} from '../../../util/database';
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

export const headerContainer = css`
  z-index: 1;
  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 55vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: 34.5px;
  margin-bottom: 30px;
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
export const main = css`
  width: 100vw;
  margin: 0px;
  padding: 0px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
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
    :focus {
      outline: none !important;
      border-color: #1b3d5f;
    }
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
        {error ? <div css={errorMessage}>Please, fill all fields</div> : ''}
        {errors.map((errorFromDb) => (
          <div key={`error-${errorFromDb.message}`} css={errorMessage}>
            {errorFromDb.message}
          </div>
        ))}
      </div>

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

  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const csrfToken = await createCsrfToken(session.csrfSecret);

  if (user) {
    return {
      props: {
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
