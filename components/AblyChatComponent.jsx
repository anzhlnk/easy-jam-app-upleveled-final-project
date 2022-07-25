import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useChannel } from './AblyReactEffect';

const chatHolder = css`
  display: grid;
  grid-template-rows: 1fr 100px;
  height: 80vh;

  @media screen and (min-width: 900px) {
    height: 85vh;
    width: 70em;
  }
`;

const form = css`
  display: grid;
  grid-template-columns: 1fr 100px;
`;

const chatText = css`
  height: 100%;
  @media screen and (min-width: 900px) {
    width: 80em;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  padding: 1em;
  overflow-y: auto;
`;

const textarea = css`
  width: 80vw;
  @media screen and (min-width: 900px) {
    width: 60em;
    margin-left: 16em;
  }
  height: 50px;
  box-sizing: border-box;
  background: #f8fafd;
  border: 1px solid #e7ecf3;
  border-radius: 25px;
  padding-left: 2em;
  padding-top: 1em;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  margin-right: 1em;
  :focus,
  :active {
    outline: none !important;
    border-color: #1b3d5f;
  }
`;

const button = css`
  border: none;
  font-weight: bold;
  letter-spacing: 4px;
  font-size: 1.4em;
  background: none;
`;

const textButtonContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  position: fixed;
  left: 1em;
`;

const messageTextStyle = (me) =>
  css`
    display: flex;
    flex-direction: column;
    font-size: 16px;
    width: 13em;
    background: ${me ? '#92969A' : '#F8FAFD'};
    color: ${me ? '#fff' : '#1D232E'};
    padding: 0.8em;

    border-radius: 10px;
    flex-grow: 0;

    border-bottom-right-radius: ${me ? '0' : '10px'};
    border-bottom-left-radius: ${me ? '10px' : '0'};

    margin-left: ${me ? '7.5em' : 'auto'};
    margin-right: ${me ? 'auto' : '8em'};

    @media screen and (min-device-width: 600px) and (max-device-width: 900px) {
      margin-left: ${me ? '22em' : 'auto'};
      margin-right: ${me ? 'auto' : '22em'};
    }

    @media screen and (min-width: 900px) {
      margin-left: ${me ? '50em' : 'auto'};
      margin-right: ${me ? 'auto' : '60em'};
    }

    inline-size: 13em;
    line-break: strict;
    overflow-wrap: break-word;
  `;

const AblyChatComponent = (props) => {
  let inputBox = null;
  const messageEndRef = useRef(null);

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setReceivedMessages] = useState(
    props.conversationHistory,
  );
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably] = useChannel(
    JSON.stringify(props.conversation),
    (message) => {
      // Here we're computing the state that'll be drawn into the message history
      // We do that by slicing the last 199 messages from the receivedMessages buffer
      const history = receivedMessages.slice(-199);
      setReceivedMessages([...history, message]);
    },
  );

  async function sendChatMessage() {
    channel.publish({
      name: JSON.stringify(props.personalDataId),
      data: messageText,
    });
    // for saving the message in the database
    try {
      await fetch(`../api/chats/new-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: props.conversation,
          content: messageText,
          csrfToken: props.csrfToken,
        }),
      });
    } catch (err) {
      console.error('Error in sendChatMessage: ', err);
    }
    setMessageText('');
    // inputBox.focus();
  }

  async function handleFormSubmission(event) {
    event.preventDefault();
    await sendChatMessage();
  }

  async function handleKeyPress(event) {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    event.preventDefault();
    await sendChatMessage();
  }

  const messages = receivedMessages.map((message, index) => {
    const sender = Number(message.name) || message.personalDataId;
    const author =
      Number(message.name) === props.personalDataId ? 'me' : message.name;

    return (
      <p
        key={`author-${sender}-${message.id}}`}
        css={messageTextStyle(sender === props.personalDataId)}
        data-author={author}
      >
        {message.timestampAdapted
          ? message.timestampAdapted
          : new Date(message.timestamp).toTimeString().slice(0, 5)}
        <br />
        {message.data && message.data}
        {message.content && message.content}
        <br />
      </p>
    );
  });

  useEffect(() => {
    messageEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [receivedMessages]);

  return (
    <div css={chatHolder}>
      <div css={chatText}>
        {messages}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={handleFormSubmission} css={form}>
        <div css={textButtonContainer}>
          <textarea
            ref={(element) => {
              inputBox = element;
            }}
            value={messageText}
            placeholder="Type a message..."
            onChange={(event) => setMessageText(event.target.value)}
            onKeyPress={(event) => handleKeyPress(event)}
            css={textarea}
            maxLength="600"
          />
          <button
            type="submit"
            // onClick={sendChatMessage}
            css={button}
            disabled={messageTextIsEmpty}
          >
            <img
              src="/send.png"
              alt="send button"
              style={{ width: 34, height: 34 }}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AblyChatComponent;
