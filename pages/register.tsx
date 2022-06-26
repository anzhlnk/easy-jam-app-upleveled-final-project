import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  input {
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    background: #f8fafd;
    border: 1px solid #e7ecf3;
    border-radius: 25px;
    padding: 16px 0px;

    //font
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.25px;
    padding-left: 16px;
  }
`;

const signUpButton = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;

  position: absolute;
  height: 56px;
  left: 24px;
  right: 24px;
  bottom: 342px;

  background: #92969a;
  border-radius: 25px;

  span {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;
    color: #ffffff;
  }
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();

    console.log(registerResponseBody);

    // in case there is an error
    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // to validate returnTo parameter against valid path
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      // redirect user to user profile

      await props.refreshUserProfile();
      await router.push('/register-process');
    }
  }

  return (
    <div>
      <Head>
        <title>SignUp</title>
        <meta name="sign up" content="Register a new user" />
      </Head>

      <main>
        <h1>Sign up</h1>
        <div css={inputContainer}>
          <input
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />

          <input
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </div>
        <button onClick={() => registerHandler()} css={signUpButton}>
          <span>Sign Up</span>
        </button>
        {errors.map((error) => (
          <div key={`error-${error.message}`}>{error.message}</div>
        ))}
      </main>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
