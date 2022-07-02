import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/react';
import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { contentContainer, nextButton, nextButtonContainer } from './First';
import { prevButton, prevButtonContainer } from './Second';

const imageField = css`
  background: #f8fafd;
  border: 1px solid #e7ecf3;
  border-radius: 25px;
  padding-left: 2em;
`;

const image = css`
  width: 150px;
  height: 150px;
  left: 331px;
  top: 52px;

  background: #f3f1f1;
  border-radius: 100px;
`;
const Seventh = ({
  prevPage,
  handleFormData,
  cloudinaryName,
  updatePersonalData,
}) => {
  const [imageUrl, setImageUrl] = useState(
    'https://res.cloudinary.com/dnbe0yphw/image/upload/v1656405197/x5881le9eaea9auigpkw.png',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const uploadImage = async (event) => {
    const file = event.currentTarget.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hh5ueugq');
    setLoading(true);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const image = await response.json();
    setImageUrl(image.secure_url);
    setLoading(false);
    handleFormData('profilePicture', image.secure_url);
  };

  const submitFormData = (e) => {
    e.preventDefault();
    if (validator.isEmpty(imageUrl)) {
      setError(true);
    }
  };

  return (
    <form onSubmit={submitFormData} css={main}>
      <h1 css={title}>Add a photo that best represents your music hobby</h1>
      <div css={contentContainer}>
        <div css={prevButtonContainer}>
          <button onClick={prevPage} css={prevButton}>
            {'<'}
          </button>
        </div>
        <div>
          <input type="file" css={imageField} />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <img src={imageUrl} className="mt-4" alt="upload" css={image} />
          )}
        </div>
        {error ? <div css={errorMessage}>Please, add an image</div> : ''}

        <div css={nextButtonContainer}>
          <button
            type="submit"
            onClick={() => {
              updatePersonalData();
            }}
            css={nextButton}
          >
            {'>'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Seventh;
