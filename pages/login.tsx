import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

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

        <main>
          <h1>Login</h1>

          <label>
            username:{' '}
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>

          <label>
            password:{' '}
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <button onClick={() => loginHandler()}>Login</button>
          {errors.map((error) => (
            <div key={`error-${error.message}`}>{error.message}</div>
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
