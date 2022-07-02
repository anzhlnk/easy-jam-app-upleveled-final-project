import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { inputContainer, main, title } from '../../pages/register';
import { contentContainer, nextButton, nextButtonContainer } from './First';
import { prevButton, prevButtonContainer } from './Second';

const Sixth = ({ nextPage, prevPage, handleFormData, values }) => {
  const [error, setError] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();

    if (validator.isEmpty(values.location)) {
      setError(true);
    } else {
      nextPage();
    }
  };

  return (
    <form onSubmit={submitFormData} css={main}>
      <h1 css={title}>My location is...</h1>
      <div css={contentContainer}>
        <div css={prevButtonContainer}>
          <button onClick={prevPage} css={prevButton}>
            {'<'}
          </button>
        </div>
        <div css={inputContainer}>
          <input
            type="text"
            placeholder="location"
            onChange={handleFormData('location')}
            value={values.location}
          />
        </div>
        {error ? <div css={errorMessage}>Please,add your address</div> : ''}
      </div>
      <div css={nextButtonContainer}>
        <button type="submit" css={nextButton}>
          {'>'}
        </button>
      </div>
    </form>
  );
};

export default Sixth;
