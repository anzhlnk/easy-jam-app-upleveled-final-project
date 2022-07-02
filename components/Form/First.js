import { css } from '@emotion/react';
import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { inputContainer, main, title } from '../../pages/register';

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

  console.log(values.firstName);

  return (
    <form onSubmit={submitFormData} css={main}>
      <h1 css={title}>My name is...</h1>
      <div css={contentContainer}>
        <div css={inputContainer}>
          <input
            type="text"
            placeholder="First name"
            onChange={handleFormData('firstName')}
            value={values.firstName}
          />
          <input
            type="text"
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
          <button type="submit" css={nextButton}>
            {'>'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default First;
