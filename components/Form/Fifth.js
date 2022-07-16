import { useState } from 'react';
import Select from 'react-select';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { contentContainer, nextButton, nextButtonContainer } from './First';
import { headerContainer, prevButton, prevButtonContainer } from './Second';
import { inputContainer } from './Third';

const customStyles = {
  option: (provided) => ({
    ...provided,
    borderBottom: '1px grey',
    padding: 20,
  }),
  control: () => ({
    width: 200,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
};
const Fifth = ({ nextPage, prevPage, handleFormData, values, genres }) => {
  const [error, setError] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();

    if (values.genre.length < 3) {
      setError(true);
    } else {
      nextPage();
    }
  };
  const displayedGenreOptions = [
    { label: 'Select All', value: 'all' },
    ...genres.map((currentGenre) => {
      return { label: currentGenre.genreName, value: currentGenre.id };
    }),
  ];

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <h1 css={title}>The genres I’d like to play ...</h1>
      </div>
      <div css={contentContainer}>
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
          <Select
            styles={customStyles}
            id="genre-multi-select"
            instanceId="genre-multi-select"
            isMulti
            options={displayedGenreOptions.filter(
              (option) =>
                values.genre.map((x) => x.value).indexOf(option.value) === -1,
            )}
            value={
              displayedGenreOptions.length === values.genre.length + 1 // all genres selected
                ? { label: 'All Genres', value: 'All Genres' }
                : values.genre.map((x) => {
                    return { value: x.value, label: x.label };
                  })
            }
            placeholder="Select Genres"
            onChange={(data) => {
              handleFormData(
                'genre',
                data.find((option) => option.value === 'all')
                  ? displayedGenreOptions.slice(1)
                  : data,
              );
            }}
          />
        </div>
        {error ? (
          <div css={errorMessage}>Please add at least 3 genres</div>
        ) : (
          ''
        )}
      </div>
      <div css={nextButtonContainer}>
        <button css={nextButton}>{'>'}</button>
      </div>
    </form>
  );
};
export default Fifth;
