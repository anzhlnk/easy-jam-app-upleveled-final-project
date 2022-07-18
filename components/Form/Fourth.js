import { css } from '@emotion/react';
import { useState } from 'react';
import Select from 'react-select';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { nextButton, nextButtonContainer } from './First';
import { headerContainer, prevButton, prevButtonContainer } from './Second';

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
  width: 100vw;
  .select {
    width: 20em;
    height: 50px;
  }
  :active,
  :focus {
    outline-color: #1b3d5f;
  }
`;

export const colourStyles = {
  option: (
    styles,
    { data, isDisabled, isFocused, isSelected, borderRadius },
  ) => {
    // const color = chroma(data.color);
    console.log({
      data,
      isDisabled,
      isFocused,
      isSelected,
      borderRadius,
    });
    return {
      ...styles,
      padding: 20,
      backgroundColor: isFocused ? '#e9e9e9' : null,
      color: '#333333',
      borderRadius: 25,
    };
  },
  control: (base) => ({
    ...base,
    minHeight: 50,
  }),
};

const Fourth = ({
  nextPage,
  prevPage,
  handleFormData,
  values,
  instruments,
}) => {
  const [error, setError] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();

    if (values.instrument.length < 1) {
      setError(true);
    } else {
      nextPage();
    }
  };
  const displayedInstrumentOptions = [
    { label: 'Select All', value: 'all' },
    ...instruments.map((currentInstrument) => {
      return {
        label: currentInstrument.instrumentName,
        value: currentInstrument.id,
      };
    }),
  ];

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <h1 css={title}>The instrument(s) I’d like to play ...</h1>
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
        <Select
          className="select"
          id="instrument-multi-select"
          instanceId="instrument-multi-select"
          isMulti
          options={displayedInstrumentOptions.filter(
            (option) =>
              values.instrument.map((x) => x.value).indexOf(option.value) ===
              -1,
          )}
          value={
            displayedInstrumentOptions.length === values.instrument.length + 1 // all instruments selected
              ? { label: 'All Instruments', value: 'All Instruments' }
              : values.instrument.map((x) => {
                  return { value: x.value, label: x.label };
                })
          }
          placeholder="Select Instruments"
          onChange={(data) => {
            handleFormData(
              'instrument',
              data.find((option) => option.value === 'all')
                ? displayedInstrumentOptions.slice(1) // give entire {label: "sax/piano", value: 1/2/3} object
                : data,
            );
          }}
          styles={colourStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 25,

            colors: {
              ...theme.colors,
              primary25: '#1B3D5F',
              primary: '#1B3D5F',
            },
          })}
        />
      </div>
      {error ? (
        <div css={errorMessage}>Please add at least 1 instrument</div>
      ) : (
        ''
      )}

      <div css={nextButtonContainer}>
        <button css={nextButton}>{'>'}</button>
      </div>
    </form>
  );
};
export default Fourth;
