import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useChannel } from './AblyReactEffect';

const chatHolder = css`
  margin-top: 32px;
  display: grid;
  grid-template-rows: 1fr 100px;
  height: 80vh;

  @media screen and (min-width: 600px) {
    height: 85vh;
    width: 80vw;
  }
`;

const form = css`
  display: grid;
  grid-template-columns: 1fr 100px;
`;

const chatText = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  padding: 1em;
  overflow-y: auto;
`;

const textarea = css`
  width: 80vw;
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
    outline-color: #68107a;
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
    @media screen and (min-width: 500px) {
      margin-left: ${me ? '55em' : 'auto'};
      margin-right: ${me ? 'auto' : '80em'};
    }
    inline-size: 13em;
    line-break: strict;
    overflow-wrap: break-word;
  `;

const AblyChatComponent = (props) => {
  let inputBox = null;
  let messageEnd = null;

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
      console.log('history: ', history);
      setReceivedMessages([...history, message]);
      console.log('Adding new message: ', message);
      console.log(
        'receivedMessages after adding new one: ',
        receivedMessages.slice(-1),
      );
      // Then finally, we take the message history, and combine it with the new message
      // This means we'll always have up to 199 message + 1 new message, stored using the
      // setMessages react useState hook
    },
  );

  async function sendChatMessage() {
    console.log('Sending Chat Msg: ', messageText);
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
      console.log(err);
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

    // const author = message.connectionId === ably.connection.id ? 'me' : 'other';

    return (
      <p
        key={`author-${sender}-${message.timestamp}`}
        css={messageTextStyle(sender === props.personalDataId)}
        data-author={author}
      >
        {message.timestamp}
        <br />
        {message.data && message.data}
        {message.content && message.content}
        <br />
      </p>
    );
  });

  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: 'smooth' });
  });

  return (
    <div css={chatHolder}>
      <div css={chatText}>
        {messages}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        ></div>
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