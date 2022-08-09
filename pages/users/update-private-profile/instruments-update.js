import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Select from 'react-select';
import { colourStyles } from '../../../components/Form/Fourth';
import { createCsrfToken } from '../../../util/auth';
import {
  getInstruments,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getUserInstrument,
  getValidSessionByToken,
} from '../../../util/database';
import { main } from '../../discovery';
import { errorMessage } from '../../login';
import { title } from '../usersbyid/[userId]';

export const headerContainer = css`
  position: fixed;
  z-index: 1;

  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 60vw;
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
  margin-bottom: 2em;
  button {
    height: 24px;
    width: 24px;
    border: none;
    background-color: white;
  }
`;

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin-top: 46px;
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

const UserIsntrumentUpdate = (props) => {
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const displayedInstrumentOptions = [
    { label: 'Select All', value: 'all' },
    ...props.instruments.map((currentInstrument) => {
      return {
        label: currentInstrument.instrumentName,
        value: currentInstrument.id,
      };
    }),
  ];

  const [valueUserInstruments, setValueUserInstruments] = useState(
    props.userInstruments.map((x) => {
      return {
        value: x.instrumentId,
        label: x.instrumentName,
      };
    }),
  );

  const handleLinkClick = async (e) => {
    e.preventDefault();
    if (valueUserInstruments.length === 0) {
      setError(true);
    } else {
      await router.push(`/users/update-private-profile/additional-info`);
    }
  };

  // API call for deleting instruments

  async function removeOption(removedItemId) {
    const response = await fetch(`../../api/update-data/user-instruments`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removedItemId: removedItemId,
        csrfToken: props.csrfToken,
      }),
    });
    const deletedInstrument = await response.json();
    if ('errors' in deletedInstrument) {
      setErrors(deletedInstrument.errors);
      return;
    }
  }

  // API call for adding instruments
  async function addOption(addedItems) {
    const response = await fetch(`../../api/update-data/user-instruments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addedItems: addedItems,
        csrfToken: props.csrfToken,
      }),
    });
    const addedInstrument = await response.json();
    if ('errors' in addedInstrument) {
      setErrors(addedInstrument.errors);
      return;
    }
  }

  const handleChange = async (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = [];
    }
    if (selectedOption.some((x) => x.value === 'all')) {
      selectedOption = displayedInstrumentOptions.slice(1);
    }
    if (selectedOption.length > valueUserInstruments.length) {
      const addedItems = selectedOption.filter(
        (x) => !valueUserInstruments.includes(x),
      );
      await addOption(addedItems.map((e) => e.value));
    } else {
      const removedItems = valueUserInstruments.filter(
        (x) => !selectedOption.includes(x),
      );
      await removedItems.forEach((removedItem) =>
        removeOption(removedItem.value),
      );
    }
    setValueUserInstruments(selectedOption);
  };

  return (
    <form css={main}>
      <div css={headerContainer}>
        <button onClick={handleLinkClick}>
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </button>
        <h1 css={title}> I'm playing...</h1>
      </div>
      <div css={inputContainer}>
        <Select
          className="select"
          id="instrument-multi-select"
          instanceId="instrument-multi-select"
          isMulti
          options={displayedInstrumentOptions.filter(
            (option) =>
              valueUserInstruments.map((x) => x.value).indexOf(option.value) ===
              -1,
          )}
          value={
            displayedInstrumentOptions.length ===
            valueUserInstruments.length + 1 // all instruments selected
              ? { label: 'All Instruments', value: 'All Instruments' }
              : valueUserInstruments
          }
          placeholder="Select Instruments"
          onChange={handleChange}
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
        {error ? (
          <div css={errorMessage}>Please, add at least 1 instrument</div>
        ) : (
          ''
        )}
        {errors.map((issue) => {
          console.error(issue);
          return (
            <div key={`error-${issue.message}`} css={errorMessage}>
              {issue.message}
            </div>
          );
        })}
      </div>
    </form>
  );
};
export default UserIsntrumentUpdate;

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
  const instruments = await getInstruments();
  const userInstruments = await getUserInstrument(dataId);

  return {
    props: {
      csrfToken: csrfToken,
      instruments: instruments,
      userInstruments: userInstruments,
    },
  };
}
