import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { nextButton, nextButtonContainer } from './First';

export const prevButtonContainer = css`
  display: flex;
  justify-content: start;
  align-items: left;
  width: 21em;
  margin-top: -64px;
  z-index: 0;
`;

export const prevButton = css`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 24px;
  width: 24px;

  border-radius: 100px;
  border: none;
  background: none;
  z-index: 1;
  margin-bottom: 38px;
`;
export const datePickerContainer = (isBlack) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 3.92em;

  .date-picker {
    width: 100%;
    input {
      width: 12em;
      height: 50px;
      margin-top: 1em;
      box-sizing: border-box;

      background: #f8fafd;
      border: 1px solid #e7ecf3;
      border-radius: 25px;

      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      /* font-size: 16px; */
      letter-spacing: -0.25px;
      color: ${isBlack ? 'black' : '#a7b0c0'};
      line-height: 24px;

      letter-spacing: -0.25px;
      padding-left: 2em;

      :focus {
        outline: none !important;
        border-color: #1b3d5f;
      }
    }
  }
`;

export const headerContainer = css`
  z-index: 0;
  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 34px;
`;

const Second = ({ nextPage, prevPage, handleFormData, values }) => {
  const [error, setError] = useState(false);
  const [fontBlack, setFontBlack] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();
    if (!values.birthday) {
      setError(true);
    } else {
      nextPage();
    }
  };

  let twelveYearsAgo = new Date();
  twelveYearsAgo = twelveYearsAgo.setFullYear(
    twelveYearsAgo.getFullYear() - 12,
  );

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <h1 css={title}>I was born on...</h1>
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
      <div css={datePickerContainer(fontBlack)}>
        <DatePicker
          wrapperClassName="date-picker"
          dateFormat="dd/MM/yyyy"
          maxDate={twelveYearsAgo}
          selected={values.birthday}
          showYearDropdown
          dateFormatCalendar="MMMM"
          yearDropdownItemNumber={60}
          scrollableYearDropdown
          onChange={(data) => {
            handleFormData('birthday', data);
            setFontBlack(true);
          }}
        />
      </div>
      {error ? (
        <div css={errorMessage}>Please, add your date of birth</div>
      ) : (
        ''
      )}
      <div css={nextButtonContainer}>
        <button css={nextButton}>{'>'}</button>
      </div>
    </form>
  );
};

export default Second;
