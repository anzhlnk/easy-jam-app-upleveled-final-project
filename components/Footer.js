import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const image = css`
  width: 32px;
  height: 32px;
`;
const main = css`
  width: 100vw;
  position: fixed;
  z-index: 1;
  bottom: 0;
  background: #fafafa;
  height: 60px;
  border-top: 0.5px solid #a7b0c0;
  @media (min-width: 900px) {
    height: 42px;
  }

  .footerButtons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 70px;

    img {
      margin-right: 1.5em;
      margin-left: 1.5em;
      margin-bottom: 1em;
      @media (min-width: 900px) {
        margin-bottom: 2em;
      }
    }
  }
`;
export default function Footer(props) {
  const { asPath } = useRouter();

  return (
    <footer>
      {asPath === '/discovery' && props.user && (
        <div css={main}>
          <div className="footerButtons">
            <Link href="/discovery">
              <img css={image} src="/discovery-active.png" alt="discovery" />
            </Link>
            <Link href="/chats/overview">
              <img
                css={image}
                src="/chat-inactive.png"
                alt="discovery"
                data-test-id="to-chats"
              />
            </Link>
          </div>
        </div>
      )}
      {asPath === '/discovery-playmode' && props.user && (
        <div css={main}>
          <div className="footerButtons">
            <Link href="/discovery">
              <img
                css={image}
                src="/discovery-active.png"
                alt="discovery"
                data-test-id="to-chats"
              />
            </Link>
            <Link href="/chats/overview">
              <img css={image} src="/chat-inactive.png" alt="discovery" />
            </Link>
          </div>
        </div>
      )}
      {asPath === '/chats/overview' && props.user && (
        <div css={main}>
          <div className="footerButtons">
            <Link href="/discovery">
              <img
                css={image}
                src="/discovery-inactive.png"
                alt="discovery"
                data-test-id="to-chats"
              />
            </Link>
            <Link href="/chats/overview">
              <img css={image} src="/chat-active.png" alt="discovery" />
            </Link>
          </div>
        </div>
      )}
    </footer>
  );
}
