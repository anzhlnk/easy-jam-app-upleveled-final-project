import 'rc-slider/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Slider from 'rc-slider';
import { useState } from 'react';
import Select from 'react-select';
import { nextButton } from '../components/Form/First';
import { headerContainer } from '../components/Form/Second';
import { main, title } from '../pages/register';
import { createCsrfToken } from '../util/auth';
import {
  getGenders,
  getInstruments,
  getLocationIdByPersonalDataID,
  getPersonalDataIDByUserId,
  getRequiredAge,
  getRequiredDistance,
  getRequiredGenders,
  getRequiredInstrument,
  getUserByValidSessionToken,
  getUserStatus,
  getValidSessionByToken,
} from '../util/database';
import { errorMessage } from './login';

const container = css`
  margin-top: 20px;
`;

const contentContainer = css`
  width: 80vw;
`;

const statusVisibility = css`
  margin-top: 16px;
  width: 36px;
  height: 20px;
  border: 2px solid #1b3d5f;
  border-radius: 50px;
`;

const inputs = css`
  margin-top: 8px;
`;

export const nextButtonContainer = css`
  display: flex;
  justify-content: right;
`;

const valueText = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  text-align: left;
  letter-spacing: -0.25px;

  color: #3b3c3d;

  opacity: 0.29;
`;

export const colourStyles = {
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      padding: 20,
      backgroundColor: isFocused ? '#e9e9e9' : null,
      color: '#333333',
      borderRadius: 25,
    };
  },
};

export default function Filters(props) {
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(false);
  //  add "select all" option to an array and format into "label/ value" relation as required by the package
  const displayedInstrumentOptions = [
    { label: 'Select All', value: 'all' },
    ...props.instruments.map((currentInstrument) => {
      return {
        label: currentInstrument.instrumentName,
        value: currentInstrument.id,
      };
    }),
  ];

  const displayedGenderOptions = [
    { label: 'Select All', value: 'all' },
    ...props.genders.map((currentGender) => {
      return { label: currentGender.genderName, value: currentGender.id };
    }),
  ];

  const [valueAgeRange, setValueAgeRange] = useState([
    props.requiredAge.buddyAgeMin,
    props.requiredAge.buddyAgeMax,
  ]);

  const [valueDistanceSlider, setValueDistanceSlider] = useState(
    props.requiredDistance.preferredDistance,
  );
  const [valueVisible, setValueVisible] = useState(props.userStatus.status);
  const [valueRequiredInstruments, setValueRequiredInstruments] = useState(
    props.requiredInstruments.map((x) => {
      return {
        value: x.instrumentId,
        label: x.instrumentName,
      };
    }),
  );

  // API call for updating the age requirements

  async function updateRequiredAge(selectedOption) {
    const response = await fetch(`api/update-data/requirements-age`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updatedRequiredAgeMin: selectedOption[0],
        updatedRequiredAgeMax: selectedOption[1],
        csrfToken: props.csrfToken,
      }),
    });
    const updatedDistance = await response.json();
    if ('errors' in updatedDistance) {
      setErrors(updatedDistance.errors);
      return;
    }
  }

  // API  call for updating distance
  async function updateDistance(selectedOption) {
    const response = await fetch(`api/update-data/requirements-distance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updatedDistance: selectedOption,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedDistance = await response.json();
    if ('errors' in updatedDistance) {
      setErrors(updatedDistance.errors);
      return;
    }
  }

  // API call for updating status
  async function updateStatus(selectedOption) {
    const response = await fetch(`api/update-data/requirements-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updatedStatus: selectedOption,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedStatus = await response.json();
    if ('errors' in updatedStatus) {
      setErrors(updatedStatus.errors);
      return;
    }
  }

  // API call for adding genders
  async function addOptionGenders(addedItems) {
    const response = await fetch(`api/update-data/requirements-genders`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addedItems: addedItems,
        csrfToken: props.csrfToken,
      }),
    });
    const addedGender = await response.json();
    if ('errors' in addedGender) {
      setErrors(addedGender.errors);
      return;
    }
  }

  // API call for adding instruments
  async function addOption(addedItems) {
    const response = await fetch(`api/update-data/requirements-instruments`, {
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

  // API call for deleting genders

  async function removeOptionGenders(removedItemId) {
    const response = await fetch(`api/update-data/requirements-genders`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removedItemId: removedItemId,
        csrfToken: props.csrfToken,
      }),
    });
    const deletedGender = await response.json();
    if ('errors' in deletedGender) {
      setErrors(deletedGender.errors);
      return;
    }
  }

  // API call for deleting instruments

  async function removeOption(removedItemId) {
    const response = await fetch(`api/update-data/requirements-instruments`, {
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

  const [valueRequiredGenders, setValueRequiredGenders] = useState(
    props.requiredGenders.map((x) => {
      return {
        value: x.genderId,
        label: x.genderName,
      };
    }),
  );

  const submitFormData = (e) => {
    e.preventDefault();
  };

  // handle Change for instruments
  const handleChange = async (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = [];
    }
    if (selectedOption.some((x) => x.value === 'all')) {
      selectedOption = displayedInstrumentOptions.slice(1);
    }
    if (selectedOption.length > valueRequiredInstruments.length) {
      const addedItems = selectedOption.filter(
        (x) => !valueRequiredInstruments.includes(x),
      );
      await addOption(addedItems.map((e) => e.value));
    } else {
      const removedItems = valueRequiredInstruments.filter(
        (x) => !selectedOption.includes(x),
      );
      await removedItems.forEach((removedItem) =>
        removeOption(removedItem.value),
      );
    }
    setValueRequiredInstruments(selectedOption);
  };

  // handle change for genders

  const handleChangeGenders = async (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = [];
    }
    if (selectedOption.some((x) => x.value === 'all')) {
      selectedOption = displayedGenderOptions.slice(1);
    }
    if (selectedOption.length > valueRequiredGenders.length) {
      const addedItems = selectedOption.filter(
        (x) => !valueRequiredGenders.includes(x),
      );
      await addOptionGenders(addedItems.map((e) => e.value));
    } else {
      const removedItems = valueRequiredGenders.filter(
        (x) => !selectedOption.includes(x),
      );
      await removedItems.forEach((removedItem) =>
        removeOptionGenders(removedItem.value),
      );
    }
    setValueRequiredGenders(selectedOption);
  };

  const handleChangeStatus = async (selectedOption) => {
    setValueVisible(selectedOption);
    await updateStatus(selectedOption);
  };

  const handleChangeDistance = async (selectedOption) => {
    await updateDistance(selectedOption);
    setValueDistanceSlider(selectedOption);
  };

  const handleChangeRequiredAge = async (selectedOption) => {
    await updateRequiredAge(selectedOption);
    setValueAgeRange(selectedOption);
  };
  const router = useRouter();

  const buttonHandler = async () => {
    if (
      valueRequiredInstruments.length < 1 ||
      valueRequiredGenders.length < 1
    ) {
      setError(true);
    } else {
      await router.push('/discovery');
    }
  };

  return (
    <div>
      <Head>
        <title>Filters</title>
        <meta
          name="filters"
          content="set up filters to find your jamming buddy"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <form css={main} onSubmit={submitFormData}>
          <div css={headerContainer}>
            <h1 css={title}>Start discovering</h1>
          </div>
          <div css={contentContainer}>
            <div css={container}>
              <span>Status</span>
              <Slider
                range
                className="t-slider"
                min={0}
                max={1}
                value={valueVisible}
                step={1}
                onChange={(selection) => handleChangeStatus(selection[0])}
                allowCross={false}
                css={statusVisibility}
                handleStyle={{
                  borderColor: '#1B3D5F',
                  height: 22,
                  width: 22,
                  marginTop: -8,
                  boxShadow: 'none',
                }}
              />
              {valueVisible === 1 ? (
                <div css={valueText}>visible in the search</div>
              ) : (
                <div css={valueText}>not visible in the search</div>
              )}
            </div>
            <div css={container}>
              <span>Instrument</span>
              <Select
                css={inputs}
                id="instrument-multi-select"
                instanceId="instrument-multi-select"
                isMulti
                options={displayedInstrumentOptions.filter(
                  (option) =>
                    valueRequiredInstruments
                      .map((x) => x.value)
                      .indexOf(option.value) === -1,
                )}
                value={
                  displayedInstrumentOptions.length ===
                  valueRequiredInstruments.length + 1 // all instruments selected
                    ? { label: 'All Instruments', value: 'All Instruments' }
                    : valueRequiredInstruments
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
            </div>
            <div css={container}>
              <span>Gender</span>
              <Select
                css={inputs}
                id="gender-multi-select"
                instanceId="gender-multi-select"
                isMulti
                options={displayedGenderOptions.filter(
                  (option) =>
                    valueRequiredGenders
                      .map((x) => x.value)
                      .indexOf(option.value) === -1,
                )}
                value={
                  displayedGenderOptions.length ===
                  valueRequiredGenders.length + 1 // all genders selected
                    ? { label: 'All Genders', value: 'All Genders' }
                    : valueRequiredGenders
                }
                placeholder="Select Genders"
                onChange={handleChangeGenders}
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
            <div css={container}>
              <span>Age range</span>{' '}
              <Slider
                css={inputs}
                range
                className="t-slider"
                min={12}
                max={100}
                value={valueAgeRange}
                step={1}
                onChange={handleChangeRequiredAge}
                allowCross={false}
                trackStyle={{
                  backgroundColor: '#CACACA',
                }}
                handleStyle={{
                  borderColor: '#1B3D5F',
                  height: 16,
                  width: 16,
                  boxShadow: 'none',
                }}
              />
            </div>
            <div css={valueText}>
              from {valueAgeRange[0]} to {valueAgeRange[1]}
            </div>
            <div css={container}>
              <span>Distance</span>
              <Slider
                css={inputs}
                trackStyle={{
                  backgroundColor: '#CACACA',
                }}
                className="t-slider"
                min={1}
                max={100}
                value={valueDistanceSlider}
                step={1}
                onChange={handleChangeDistance}
                allowCross={false}
                handleStyle={{
                  borderColor: '#1B3D5F',
                  height: 16,
                  width: 16,
                  boxShadow: 'none',
                }}
              />
            </div>
            <div css={valueText}>up to {valueDistanceSlider} km</div>
            {error ? (
              <div css={errorMessage}>Please, add instruments and genders</div>
            ) : (
              ''
            )}
            <div css={nextButtonContainer}>
              <button
                css={nextButton}
                onClick={buttonHandler}
                style={{ marginTop: 36 }}
                data-test-id="tick"
              >
                <img
                  src="/tick_icon.png"
                  alt="tick icon"
                  style={{ width: 20, height: 18 }}
                />
              </button>
            </div>
            {errors.map((issue) => (
              <div key={`error-${issue.message}`} css={errorMessage}>
                {error.message}
              </div>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}

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
  const genders = await getGenders();
  const locationId = await getLocationIdByPersonalDataID(dataId);
  const userStatus = await getUserStatus(dataId);
  const requiredDistance = await getRequiredDistance(locationId);
  const requiredGenders = await getRequiredGenders(dataId);
  const requiredAge = await getRequiredAge(dataId);
  const requiredInstruments = await getRequiredInstrument(dataId);

  return {
    props: {
      csrfToken: csrfToken,
      instruments: instruments,
      requiredInstruments: requiredInstruments,
      genders: genders,
      requiredGenders: requiredGenders,
      userStatus: userStatus[0],
      requiredDistance: requiredDistance[0],
      requiredAge: requiredAge[0],
    },
  };
}
