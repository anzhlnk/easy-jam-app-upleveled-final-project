import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/react';
import DatePicker from 'react-datepicker';
import { main, title } from '../../pages/register';
import { nextButton, nextButtonContainer } from './First';

export const prevButtonContainer = css`
  display: flex;
  justify-content: start;
  align-items: left;
  width: 21em;
`;

export const prevButton = css`
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
const datePickerContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10em;
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
      font-size: 16px;
      letter-spacing: -0.25px;
      color: #a7b0c0;
      line-height: 24px;

      letter-spacing: -0.25px;
      padding-left: 2em;
    }
  }
`;
const Second = ({ nextPage, prevPage, handleFormData, values }) => {
  const submitFormData = (e) => {
    e.preventDefault();
    nextPage();
  };

  let twelveYearsAgo = new Date();
  twelveYearsAgo = twelveYearsAgo.setFullYear(
    twelveYearsAgo.getFullYear() - 12,
  );

  return (
    <form onSubmit={submitFormData} css={main}>
      <h1 css={title}>I was born on...</h1>
      <div css={prevButtonContainer}>
        <button onClick={prevPage} css={prevButton}>
          {'<'}
        </button>
      </div>
      <div css={datePickerContainer}>
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
          }}
        />
      </div>
      <div css={nextButtonContainer}>
        <button type="submit" css={nextButton}>
          {'>'}
        </button>
      </div>
    </form>
  );
};

export default Second;
