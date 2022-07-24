import { useRouter } from 'next/router';
import { useState } from 'react';
import Fifth from '../components/Form/Fifth';
import First from '../components/Form/First';
import Fourth from '../components/Form/Fourth';
import Second from '../components/Form/Second';
import Seventh from '../components/Form/Seventh';
import Sixth from '../components/Form/Sixth';
import Third from '../components/Form/Third';
import { createCsrfToken } from '../util/auth';
import {
  getGenders,
  getGenres,
  getInstruments,
  getPersonalDataIDByUserId,
  getUserByValidSessionToken,
  getUserPersonalData,
  getValidSessionByToken,
} from '../util/database';

function Form(props) {
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  let twelveYearsAgo = new Date();
  twelveYearsAgo = twelveYearsAgo.setFullYear(
    twelveYearsAgo.getFullYear() - 12,
  );
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: twelveYearsAgo,
    instrument: [],
    genre: [],
    gender: '',
    profilePicture: '',
    location: '',
    longitude: '',
    latitude: '',
  });

  const nextPage = () => {
    setPage(page + 1);
  };
  const prevPage = () => {
    setPage(page - 1);
  };
  function handleInputFieldData(input) {
    return (e) => {
      const { value } = e.currentTarget;
      setFormData((prev) => ({
        ...prev,
        [input]: value,
      }));
    };
  }
  function handleOtherDataFields(input, value) {
    return setFormData((prev) => ({
      ...prev,
      [input]: value,
    }));
  }

  async function updatePersonalData() {
    const response = await fetch(`api/update-data/form`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        usersInstruments: formData.instrument,
        usersGenres: formData.genre,
        gender: formData.gender,
        profilePicture: formData.profilePicture,
        location: formData.location,
        longitude: formData.longitude,
        latitude: formData.latitude,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedUserPersonalData = await response.json();

    if ('errors' in updatedUserPersonalData) {
      setErrors(updatedUserPersonalData.errors);
      console.error(errors);
      return;
    } else {
      // redirect user to filters
      await router.push('/filters');
    }
  }

  switch (page) {
    case 1:
      return (
        <div>
          <First
            nextPage={nextPage}
            handleFormData={handleInputFieldData}
            values={formData}
          />
        </div>
      );
    case 2:
      return (
        <div>
          <Second
            nextPage={nextPage}
            prevPage={prevPage}
            handleFormData={handleOtherDataFields}
            values={formData}
          />
        </div>
      );
    case 3:
      return (
        <div>
          <Third
            nextPage={nextPage}
            prevPage={prevPage}
            values={formData}
            handleFormData={handleOtherDataFields}
            genders={props.genders}
          />
        </div>
      );
    case 4:
      return (
        <div>
          <Fourth
            nextPage={nextPage}
            prevPage={prevPage}
            values={formData}
            handleFormData={handleOtherDataFields}
            instruments={props.instruments}
          />
        </div>
      );
    case 5:
      return (
        <div>
          <Fifth
            nextPage={nextPage}
            prevPage={prevPage}
            values={formData}
            handleFormData={handleOtherDataFields}
            genres={props.genres}
          />
        </div>
      );
    case 6:
      return (
        <div>
          <Sixth
            nextPage={nextPage}
            prevPage={prevPage}
            values={formData}
            handleFormData={handleOtherDataFields}
            googleAPI={props.googleAPI}
          />
        </div>
      );
    case 7:
      return (
        <div>
          <Seventh
            prevPage={prevPage}
            values={formData}
            handleFormData={handleOtherDataFields}
            cloudinaryName={props.cloudinaryName}
            updatePersonalData={updatePersonalData}
          />
        </div>
      );

    default:
      return <div />;
  }
}

export default Form;

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const dataId = await getPersonalDataIDByUserId(user.id);
  const personalData = await getUserPersonalData(dataId);
  if (
    personalData?.firstName &&
    personalData?.lastName &&
    personalData?.age &&
    personalData?.address &&
    personalData?.longitude &&
    personalData?.latitude &&
    personalData?.profilePictureUrl
  ) {
    return {
      redirect: {
        destination: '/discovery',
        permanent: false,
      },
    };
  }

  const cloudinaryName = process.env.CLOUDINARY_NAME;
  const csrfToken = await createCsrfToken(session.csrfSecret);
  const instruments = await getInstruments();
  const genres = await getGenres();
  const genders = await getGenders();

  const googleAPI = process.env.GOOGLE_API_KEY;

  return {
    props: {
      csrfToken: csrfToken,
      cloudinaryName: cloudinaryName,
      instruments: instruments,
      genres: genres,
      genders: genders,
      googleAPI: googleAPI,
    },
  };
}
