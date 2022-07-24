import { css } from '@emotion/react';
import { useState } from 'react';
import { main, title } from '../../pages/register';
import { contentContainer, nextButton } from './First';
import { headerContainer, prevButton, prevButtonContainer } from './Second';

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;

  input {
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-top: 1em;
    box-sizing: border-box;
    border: 1px solid #e7ecf3;
    border-radius: 25px;

    accent-color: #1b3d5f;
  }
  span {
    margin-top: 0.5em;
  }
`;

export const nextButtonContainer = css`
  display: flex;
  justify-content: right;
  width: 21em;
  margin-top: 16em;

  @media (min-width: 500px) {
    width: 20em;
    margin-top: 6em;
  }
`;

const Third = ({ nextPage, prevPage, handleFormData, values, genders }) => {
  const [error, setError] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();

    if (values.gender.length === 0) {
      setError(true);
    } else {
      nextPage();
    }
  };

  if (error) console.error('values.gender is empty');

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <h1 css={title}>I identify as...</h1>
      </div>
      <div css={prevButtonContainer}>
        <button onClick={prevPage} css={prevButton}>
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </button>
      </div>
      <div css={contentContainer}>
        <div css={inputContainer}>
          <input
            type="radio"
            name="gender"
            value={genders[0].id}
            checked={Number(values.gender) === genders[0].id}
            onChange={(e) => {
              handleFormData('gender', e.currentTarget.value);
            }}
          />
          <span> {genders[0].genderName}</span>
        </div>
        <div css={inputContainer}>
          <input
            type="radio"
            name="gender"
            value={genders[1].id}
            checked={Number(values.gender) === genders[1].id}
            onChange={(e) => {
              handleFormData('gender', e.currentTarget.value);
            }}
          />
          <span>{genders[1].genderName}</span>
        </div>
        <div className="radio-btn" css={inputContainer}>
          <input
            type="radio"
            value={genders[2].id}
            checked={Number(values.gender) === genders[2].id}
            onChange={(e) => {
              handleFormData('gender', e.currentTarget.value);
            }}
          />
          <span> {genders[2].genderName}</span>
        </div>
      </div>
      <div css={nextButtonContainer}>
        <button css={nextButton}>{'>'}</button>
      </div>
    </form>
  );
};

export default Third;
