import { css } from '@emotion/react';
import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { inputContainer, main, title } from '../../pages/register';
import { headerContainer } from './Second';

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
  margin-top: 25em;

  @media (min-width: 500px) {
    width: 20em;
    margin-top: 15em;
  }
`;

export const nextButton = css`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 53px;
  width: 53px;
  background: #92969a;
  border-radius: 100px;
  border: none;
  color: #ffffff;
`;

const First = ({ nextPage, handleFormData, values }) => {
  const [error, setError] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();

    if (
      validator.isEmpty(values.firstName) ||
      validator.isEmpty(values.lastName)
    ) {
      setError(true);
    } else {
      nextPage();
    }
  };

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <h1 css={title}>My name is...</h1>
      </div>
      <div css={contentContainer}>
        <div css={inputContainer}>
          <input
            placeholder="First name"
            onChange={handleFormData('firstName')}
            value={values.firstName}
          />
          <input
            placeholder="Last name"
            onChange={handleFormData('lastName')}
            value={values.lastName}
          />
        </div>
        {error ? (
          <div css={errorMessage}>Please, enter your full name</div>
        ) : (
          ''
        )}
        <div css={nextButtonContainer}>
          <button css={nextButton}>{'>'}</button>
        </div>
      </div>
    </form>
  );
};

export default First;
