import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';
import { errorMessage } from './login';

export const main = css`
  width: 100vw;
  margin: 0px;
  padding: 0px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

export const title = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -1px;
  color: #1d232e;
  margin-bottom: 2em;
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
  input:active,
  input:focus {
    outline-color: #1b3d5f;
  }
  button {
    width: 21em;
    margin-top: 8em;
    box-sizing: border-box;
    border-radius: 25px;

    padding: 16px 32px;
    gap: 12px;
    border: none;

    background: #92969a;
    border-radius: 25px;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;
    color: #ffffff;
  }

  button:active {
    background: #1b3d5f;
  }
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Register(props: Props) {
  const [email, setEmail] = useState('');
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
        email: email,
        username: username,
        password: password,
      }),
    });

    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();

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
      await router.push('/form');
    }
  }

  return (
    <div>
      <Head>
        <title>SignUp</title>
        <meta name="sign up" content="Register a new user" />
      </Head>

      <main css={main}>
        <h1 css={title} style={{ marginTop: 24 }}>
          Sign up
        </h1>
        <div css={inputContainer}>
          <input
            placeholder="email"
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
          />
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
            type="password"
            id="pswrd"
            name="pswrd"
            pattern="[a-z]{0,9}"
            title="Password should be digits (0 to 9) or alphabets (a to z)"
          />
          <button onClick={() => registerHandler()}>
            <span>Sign Up</span>
          </button>
        </div>

        {errors.map((error) => (
          <div key={`error-${error.message}`} css={errorMessage}>
            {error.message}
          </div>
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
