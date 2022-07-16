import { useLoadScript } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { inputContainer, main, title } from '../../pages/register';
import { nextButton, nextButtonContainer } from './First';
import { headerContainer, prevButton, prevButtonContainer } from './Second';

const Sixth = ({ nextPage, prevPage, handleFormData, values, googleAPI }) => {
  const [error, setError] = useState(false);
  const libraries = useMemo(() => ['places'], []);
  const handleChange = async (value) => {
    // does this function have to wait for handleFormData to succeed before continuing?
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

            <div>
              {loading ? <div>...loading</div> : null}

              {suggestions.map((suggestion) => {
                const style = {
                  background: suggestion.active ? '#d9dbdb' : '#fff',
                  width: '20em',
                  marginTop: 12,
                  marginBottom: 12,
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
