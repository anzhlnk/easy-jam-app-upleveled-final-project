import Link from 'next/link';
import { useState } from 'react';
import Select from 'react-select';
import { createCsrfToken } from '../../../util/auth';
import {
  getGenres,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getUserGenreByPersonalDataID,
  getValidSessionByToken,
} from '../../../util/database';
import { errorMessage } from '../../login';
import { title } from '../usersbyid/[userId]';
import { headerContainer } from './instruments-update';
import { inputContainer } from './personal-info';

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
const UserGenreUpdate = (props) => {
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(false);
  // const submitFormData = (e) => {
  //   e.preventDefault();

  //   if (values.genre.length < 3) {
  //     setError(true);
  //   } else {
  //     nextPage();
  //   }
  // };
  const displayedGenreOptions = [
    { label: 'Select All', value: 'all' },
    ...props.genres.map((currentGenre) => {
      return {
        label: currentGenre.genreName,
        value: currentGenre.id,
      };
    }),
  ];

  const [valueUserGenres, setValueUserGenres] = useState(
    props.userGenres.map((x) => {
      return {
        value: x.genreId,
        label: x.genreName,
      };
    }),
  );

  // API call for deleting instruments

  async function removeOption(removedItemId) {
    const response = await fetch(`../../api/update-data/user-genres`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataId: props.dataId,
        removedItemId: removedItemId,
        csrfToken: props.csrfToken,
      }),
    });
    const deletedInstrument = await response.json();
    console.log('remove option instruments: ', deletedInstrument);
    if ('errors' in deletedInstrument) {
      setErrors(deletedInstrument.errors);
      return;
    }
  }

  //API call for adding genres
  async function addOption(addedItems) {
    console.log(
      'addcall',
      JSON.stringify({
        dataId: props.dataId,
        addedItems: addedItems.map((genre) => {
          return {
            personal_data_id: props.dataId,
            genre_id: genre,
          };
        }),
        csrfToken: props.csrfToken,
      }),
    );
    const response = await fetch(`../../api/update-data/user-genres`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataId: props.dataId,
        addedItems: addedItems.map((genre) => {
          return {
            personal_data_id: props.dataId,
            genre_id: genre,
          };
        }),
        csrfToken: props.csrfToken,
      }),
    });
    const addedGenre = await response.json();
    console.log('added option genres: ', addedGenre);
    if ('errors' in addedGenre) {
      setErrors(addedGenre.errors);
      return;
    }
  }

  const handleChange = async (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = [];
    }
    if (selectedOption.some((x) => x.value === 'all')) {
      selectedOption = displayedGenreOptions.slice(1);
    }
    if (selectedOption.length > valueUserGenres.length) {
      let addedItems = selectedOption.filter(
        (x) => !valueUserGenres.includes(x),
      );
      console.log('added Items in handleChange instruments', addedItems);
      await addOption(addedItems.map((e) => e.value));
    } else {
      let removedItems = valueUserGenres.filter(
        (x) => !selectedOption.includes(x),
      );
      console.log(removedItems);
      await removedItems.forEach((removedItem) =>
        removeOption(removedItem.value),
      );
    }
    setValueUserGenres(selectedOption);
  };

  return (
    <form
    // onSubmit={submitFormData}
    >
      <div css={headerContainer}>
        <Link href="/users/update-private-profile/additional-info">
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </Link>
        <h1 css={title}>
          The genres <br /> I'd play...{' '}
        </h1>
      </div>
      <div css={inputContainer}>
        <Select
          styles={customStyles}
          id="genre-multi-select"
          instanceId="genre-multi-select"
          isMulti
          options={displayedGenreOptions.filter(
            (option) =>
              valueUserGenres.map((x) => x.value).indexOf(option.value) === -1,
          )}
          value={
            displayedGenreOptions.length === valueUserGenres.length + 1 // all instruments selected
              ? { label: 'All Instruments', value: 'All Instruments' }
              : valueUserGenres
          }
          placeholder="Select Genres"
          onChange={handleChange}
        />
      </div>
      {error ? <div css={errorMessage}>Please add at least 3 genres</div> : ''}
      {errors.map((error) => (
        <div key={`error-${error.message}`} css={errorMessage}>
          {error.message}
        </div>
      ))}
    </form>
  );
};
export default UserGenreUpdate;

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }

  const csrfToken = await createCsrfToken(session.csrfSecret);
  const dataId = await getPersonalDataIDByUserId(user.id);

  const genres = await getGenres();
  const userGenres = await getUserGenreByPersonalDataID(dataId);

  console.log('genres', genres);
  console.log('userGenres', userGenres);

  return {
    props: {
      dataId: dataId,
      csrfToken: csrfToken,
      genres: genres,
      userGenres: userGenres,
    },
  };
}
