import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import validator from 'validator';
import { datePickerContainer } from '../../../components/Form/Second';
import { errorMessage } from '../../../pages/login';
import { createCsrfToken } from '../../../util/auth';
import {
  getPersonalDataIDByUserId,
  getUserBirthday,
  getUserByValidSessionToken,
  getUserPersonalData,
  getValidSessionByToken,
} from '../../../util/database';
import { main } from '../../discovery';

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
  :first-child {
    z-index: 0;
    margin-right: 10em;
  }
  h1 {
    margin-right: -1em;
  }
`;

export const contentContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const confirmButtonContainer = css`
  display: flex;
  justify-content: right;
  width: 21em;
  position: fixed;
  bottom: 8em;
  @media (min-width: 500px) {
    bottom: 40em;
  }
`;

export const title = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -1px;
  color: #1d232e;
`;

export const confirmButton = css`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 10em;

  height: 53px;
  width: 53px;
  background: #92969a;
  border-radius: 100px;
  border: none;
  color: #ffffff;
`;

export const inputContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  margin: 0px;
  width: 100vw;

  input {
    width: 25em;
    height: 50px;
    margin-top: 1em;
    box-sizing: border-box;

    background: #f8fafd;
    border: 1px solid #e7ecf3;
    border-radius: 25px;
    padding-left: 2em;
  }
`;

export default function UpdatePersonalInfo(props) {
  const dateOfBirth = Date.parse(props.userBirthday);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState('');
  const [firstName, setFirstName] = useState(props.personalData.firstName);
  const [lastName, setLastName] = useState(props.personalData.lastName);
  const [birthday, setBirthday] = useState(dateOfBirth);
  const [location, setLocation] = useState(props.personalData.address);
  const router = useRouter();

  console.log('birthday', birthday);

  let twelveYearsAgo = new Date();
  twelveYearsAgo = twelveYearsAgo.setFullYear(
    twelveYearsAgo.getFullYear() - 12,
  );

  const submitFormData = (e) => {
    if (
      validator.isEmpty(firstName) ||
      validator.isEmpty(lastName) ||
      validator.isEmpty(location)
    ) {
      setError(true);
    }
    e.preventDefault();
  };

  async function updatePersonalData() {
    let body = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      location: location,
      csrfToken: props.csrfToken,
    });
    console.log('request', body);
    const response = await fetch(`../../api/update-data/user-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        birthday: birthday,
        location: location,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedUserPersonalData = await response.json();

    if ('errors' in updatedUserPersonalData) {
      setErrors(updatedUserPersonalData.errors);
      return;
    } else {
      // redirect user to private-profile
      await router.push('/users/private-profile');
    }
  }

  return (
    <form onSubmit={submitFormData} css={main}>
      <div css={headerContainer}>
        <Link href="/users/private-profile">
          <img
            src="/back-icon.png"
            alt="back button"
            style={{ width: 24, height: 24 }}
          />
        </Link>
        <h1 css={title}>Personal info</h1>
      </div>
      <div css={inputContainer}>
        <input
          type="text"
          placeholder="First name"
          onChange={(event) => setFirstName(event.currentTarget.value)}
          defaultValue={firstName}
        />
        <input
          type="text"
          placeholder="Last name"
          onChange={(event) => setLastName(event.currentTarget.value)}
          defaultValue={lastName}
        />
        <input
          type="text"
          placeholder="location"
          onChange={(event) => setLocation(event.currentTarget.value)}
          defaultValue={location}
        />
        <div css={datePickerContainer}>
          <DatePicker
            wrapperClassName="date-picker"
            dateFormat="dd/MM/yyyy"
            maxDate={twelveYearsAgo}
            selected={birthday}
            showYearDropdown
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={60}
            scrollableYearDropdown
            onChange={(event) => setBirthday(event)}
          />
        </div>
      </div>
      {error ? <div css={errorMessage}>Please, enter your full name</div> : ''}

      <div css={confirmButtonContainer}>
        <button type="submit" css={confirmButton} onClick={updatePersonalData}>
          <img
            src="/tick_icon.png"
            alt="tick icon"
            style={{ width: 20, height: 18 }}
          />
        </button>
      </div>
    </form>
  );
}

export async function getServerSideProps(context) {
  const sessionToken = await context.req.cookies.sessionToken;
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
  const personalData = await getUserPersonalData(dataId);

  const userBirthday = await getUserBirthday(dataId);

  console.log('birthday', userBirthday);

  console.log(personalData);
  if (user) {
    return {
      props: {
        csrfToken: csrfToken,
        dataId: dataId,
        personalData: personalData,
        userBirthday: JSON.parse(JSON.stringify(userBirthday)),
      },
    };
  }

  return {
    redirect: {
      destination: `/login?returnTo=/users/private-profile`,
      permanent: false,
    },
  };
}
