import { css } from '@emotion/react';
import { useLoadScript } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { headerContainer, prevButton, prevButtonContainer } from './Second';

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 0px;
  margin: 0px;
  width: 100vw;
  height: 368px;
  input {
    width: 25em;
    height: 50px;
    box-sizing: border-box;
    background: #f8fafd;
    border: 1px solid #e7ecf3;
    border-radius: 25px;
    padding-left: 2em;
  }
  input:active,
  input:focus {
    height: 50px;
    outline-color: #1b3d5f;
  }
`;

export const nextButtonContainer = css`
  display: flex;
  justify-content: right;
  width: 21em;

  @media (min-width: 500px) {
    width: 20em;
  }
`;

export const nextButton = css`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 12em;
  @media (min-width: 500px) {
    margin-top: 0em;
  }
  height: 53px;
  width: 53px;
  background: #92969a;
  border-radius: 100px;
  border: none;
  color: #ffffff;
`;

const additionalText = css`
  margin-bottom: 0px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.25px;

  color: #5d6470;
`;

const Sixth = ({ nextPage, prevPage, handleFormData, values, googleAPI }) => {
  const [error, setError] = useState(false);
  const libraries = useMemo(() => ['places'], []);
  const handleChange = (value) => {
    handleFormData('location', value);
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    handleFormData('location', value);
    handleFormData('longitude', latLng.lng);
    handleFormData('latitude', latLng.lat);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleAPI,
    libraries,
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

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
      <PlacesAutocomplete
        value={values.location} // what user types in
        onChange={handleChange}
        onSelect={handleSelect} // when the user selects one of the options provided
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div css={inputContainer}>
            <input {...getInputProps({ placeholder: 'Type address' })} />
            <span css={additionalText}>
              *Please, click on one of the suggestions
            </span>
            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  background: suggestion.active ? '#d9dbdb' : '#fff',
                  width: '20em',
                  marginTop: 12,
                  // marginBottom: 12,
                  paddingTop: 4,
                  paddingBottom: 4,
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#5d6470',
                };

                return (
                  <div key={`li-suggestion-${suggestion.placeId}`}>
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      {error ? <div css={errorMessage}>Please,add your address</div> : ''}

      <div css={nextButtonContainer}>
        <button css={nextButton}>{'>'}</button>
      </div>
    </form>
  );
};

export default Sixth;
