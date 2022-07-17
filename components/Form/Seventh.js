import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/react';
import { useState } from 'react';
import validator from 'validator';
import { errorMessage } from '../../pages/login';
import { main, title } from '../../pages/register';
import { nextButton, nextButtonContainer } from './First';
import { headerContainer, prevButton, prevButtonContainer } from './Second';

const imageField = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 36px;
  border-radius: 25px;

  .file {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }
  .file-input label {
    display: block;
    position: relative;
    width: 200px;
    height: 50px;
    border-radius: 25px;
    background: linear-gradient(45deg, #f7ff26, #4dfb34, #18fdef);
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;
    color: #1d232e;

    cursor: pointer;
    transition: transform 0.2s ease-out;
  }
`;

const imageStyle = css`
  @media (min-width: 500px) {
    margin-right: 24em;
  }
  margin-right: 24px;
  margin-top: 4em;
  width: 200px;
  height: 200px;
  left: 331px;
  top: 52px;

  background: #f3f1f1;
  border-radius: 100px;
`;

const imageContainer = css`
  display: flex;
  width: 100vw;
  justify-content: right;
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
      <div css={headerContainer}>
        <h1 css={title}>
          Add a photo that best <br /> represents your music hobby
        </h1>
      </div>

      <div css={prevButtonContainer} style={{ marginTop: -92 }}>
        <button onClick={prevPage} css={prevButton}>
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </button>
      </div>

      <div css={imageField}>
        <div className="file-input">
          <input
            type="file"
            id="file"
            className="file"
            onChange={uploadImage}
          />
          <label htmlFor="file">Select file</label>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div css={imageContainer}>
            <img
              src={imageUrl}
              className="mt-4"
              alt="upload"
              css={imageStyle}
            />
          </div>
        )}
      </div>
      {error ? <div css={errorMessage}>Please, add an image</div> : ''}

      <div css={nextButtonContainer}>
        <button
          onClick={() => {
            updatePersonalData();
          }}
          css={nextButton}
        >
          {'>'}
        </button>
      </div>
    </form>
  );
};

export default Seventh;
