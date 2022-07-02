import { css } from '@emotion/react';
import { useState } from 'react';
import Select from 'react-select';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { contentContainer, nextButton, nextButtonContainer } from './First';
import { prevButton, prevButtonContainer } from './Second';
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
      <h1 css={title}>The instrument(s) I’d like to play while jamming...</h1>
      <div css={contentContainer}>
        <div css={prevButtonContainer}>
          <button onClick={prevPage} css={prevButton}>
            {'<'}
          </button>
        </div>
        <div css={inputContainer}>
          <Select
            styles={customStyles}
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
          />
        </div>
        {error ? (
          <div css={errorMessage}>Please add at least 1 instrument</div>
        ) : (
          ''
        )}
      </div>
      <div css={nextButtonContainer}>
        <button type="submit" css={nextButton}>
          {'>'}
        </button>
      </div>
    </form>
  );
};
export default Fourth;
