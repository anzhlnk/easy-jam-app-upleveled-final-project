import { css } from '@emotion/react';
import { useState } from 'react';
import { main, title } from '../../pages/register';
import { nextButton, nextButtonContainer } from './First';
import { prevButton, prevButtonContainer } from './Second';

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;

  input {
    width: 25em;
    height: 50px;
    margin-top: 2em;
    box-sizing: border-box;

    border: 1px solid #e7ecf3;
    border-radius: 25px;

    accent-color: #68107a;
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

  console.log('gender values', values.gender);

  return (
    <form onSubmit={submitFormData} css={main}>
      <div>
        <h1 css={title}>I identify as...</h1>
        <div css={prevButtonContainer}>
          <button onClick={prevPage} css={prevButton}>
            {'<'}
          </button>
        </div>
        <div>
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
            {genders[0].genderName}
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
            {genders[1].genderName}
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
            {genders[2].genderName}
          </div>
        </div>
        <div css={nextButtonContainer}>
          <button type="submit" css={nextButton}>
            {'>'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Third;
