import { css } from '@emotion/react';
import Link from 'next/link';
import { useState } from 'react';
import Select from 'react-select';
import { createCsrfToken } from '../../../util/auth';
import {
  getInstruments,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getUserInstrument,
  getValidSessionByToken,
} from '../../../util/database';
import { errorMessage } from '../../login';
import { title } from '../usersbyid/[userId]';
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

export const headerContainer = css`
  z-index: 0;
  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 50vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
  margin-bottom: 38px;
`;

const UserIsntrumentUpdate = (props) => {
  // const [error, setError] = useState(false);
  const [errors, setErrors] = useState([]);

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
    console.log('remove option instruments: ', deletedInstrument);
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
    console.log('added option instruments: ', addedInstrument);
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
      console.log('added Items in handleChange', addedItems);
      await addOption(addedItems.map((e) => e.value));
    } else {
      const removedItems = valueUserInstruments.filter(
        (x) => !selectedOption.includes(x),
      );
      console.log(removedItems);
      await removedItems.forEach((removedItem) =>
        removeOption(removedItem.value),
      );
    }
    setValueUserInstruments(selectedOption);
  };

  return (
    <form>
      <div css={headerContainer}>
        <Link href="/users/update-private-profile/additional-info">
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </Link>
        <h1 css={title}> I'm playing...</h1>
      </div>
      <div css={inputContainer}>
        <Select
          styles={customStyles}
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
        />
      </div>
      {/* {error ? (
        <div css={errorMessage}>Please add at least 1 instrument</div>
      ) : (
        ''
      )} */}

      {errors.map((issue) => {
        console.error(issue);
        return (
          <div key={`error-${issue.message}`} css={errorMessage}>
            {issue.message}
          </div>
        );
      })}
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
