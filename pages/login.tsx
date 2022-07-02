import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

const main = css`
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const title = css`
  h1 {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    letter-spacing: -1px;
    color: #1d232e;
    margin-bottom: 2em;
  }
`;

const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
  width: 100vw;

  left: calc(50% - 327px / 2);
  top: 128px;

  input {
    width: 21em;
    height: 50px;
    margin-top: 1em;
    box-sizing: border-box;

    background: #f8fafd;
    border: 1px solid #e7ecf3;
    border-radius: 25px;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    letter-spacing: -0.25px;
    color: #a7b0c0;
    line-height: 24px;

    letter-spacing: -0.25px;
    padding-left: 2em;

    :focus {
      outline-color: #68107a;
    }

    color: #a7b0c0;
    @media (min-width: 900px) {
      width: 30em;
    }
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

    :active {
      outline: #68107a;
    }

    @media (min-width: 900px) {
      width: 30em;
    }
  }
`;

export const errorMessage = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  position: relative;
  margin-top: 0.3em;
  color: #f32020;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const loginResponseBody: LoginResponseBody = await loginResponse.json();

    // in case there is an error
    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // to  validate returnTo parameter against valid path
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      await props.refreshUserProfile();
      await router.push(`/discovery`);
    }
  }

  return (
    <main>
      <div>
        <Head>
          <title>Login</title>
          <meta name="login" content="Login a new user" />
        </Head>

        <main css={main}>
          <div css={title}>
            <h1>Log in</h1>
          </div>
          <div css={inputContainer}>
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
              placeholder="Username"
            />
            <input
              name="pswrd"
              pattern="[a-z]{0,9}"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
              placeholder="Password"
            />
            <button onClick={() => loginHandler()}>Login</button>
          </div>

          {errors.map((error) => (
            <div key={`error-${error.message}`} css={errorMessage}>
              {error.message}
            </div>
          ))}
        </main>
      </div>
    </main>
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
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
