import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { inputContainer, main, title } from '../../pages/register';
import { contentContainer, nextButton, nextButtonContainer } from './First';
import { headerContainer, prevButton, prevButtonContainer } from './Second';

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
      <div css={headerContainer}>
        <h1 css={title}>My location is ...</h1>
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
      <div css={inputContainer}>
        <input
          type="text"
          placeholder="location"
          onChange={handleFormData('location')}
          value={values.location}
        />
      </div>
      {error ? <div css={errorMessage}>Please,add your address</div> : ''}

      <div css={nextButtonContainer}>
        <button type="submit" css={nextButton}>
          {'>'}
        </button>
      </div>
    </form>
  );
};

export default Sixth;
