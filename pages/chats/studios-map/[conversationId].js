import { css } from '@emotion/react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Head from 'next/head';
import Link from 'next/link';
import {
  getClosestStudio,
  getConversationsUser,
  getPersonalDataIDByUserId,
  getStudios,
  getUserByValidSessionToken,
  getValidSessionByToken,
} from '../../../util/database';

const mapContainerStyle = {
  width: '80vw',
  height: '60vh',
};

export const title = css`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  text-align: center;
  letter-spacing: -1px;
  color: #1d232e;
`;

export const headerContainer = css`
  z-index: 0;
  @media (min-width: 500px) {
    width: 50vw;
  }
  width: 75vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 24px;
  margin-top: -24px;
`;

const contentContainer = css`
  margin-top: 4em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const libraries = ['places', 'geometry'];

const options = { disableDefaultUI: true, zoomControl: true };

const Studios = (props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries,
  });

  const center = {
    lat: Number(props.closestStudio.latitude),
    lng: Number(props.closestStudio.longitude),
  };

  console.log('props.closestStudio.latitude', props.closestStudio.latitude);
  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      <Head>
        <title>Closest studio</title>
        <meta name="description" content="About the app" />
      </Head>
      <main>
        <div css={headerContainer}>
          <Link href="/discovery">
            <img
              src="/back-icon.png"
              alt="back button"
              style={{ width: 24, height: 24 }}
            />
          </Link>
          <h1 css={title}>Closest studio to both of you</h1>
        </div>
        <div css={contentContainer}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={17}
            center={center}
            options={options}
          >
            {props.studios.map((room) => {
              return (
                <Marker
                  key={`'room'-${room.rehearsalStudiosId}`}
                  position={{
                    lat: Number(room.latitude),
                    lng: Number(room.longitude),
                  }}
                  optimized={true}
                  title={{
                    fontSize: '14pt',
                    text: room.studioName.toString(),
                  }}
                  label={{
                    fontSize: '14pt',
                    text: room.studioName,
                  }}
                  animation={google.maps.Animation.DROP}
                />
              );
            })}
          </GoogleMap>
        </div>
      </main>
    </div>
  );
};

export default Studios;

export async function getServerSideProps(context) {
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  const dataId = await getPersonalDataIDByUserId(user.id);
  if (!session) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  const studios = await getStudios();
  const googleAPI = process.env.GOOGLE_API_KEY;

  const conversation = await Number(context.query.conversationId);
  const participatnsOfTheConversation = await getConversationsUser(
    conversation,
  );
  const currentUserParticipant = participatnsOfTheConversation
    .map((user) => {
      return user.personalDataId;
    })
    .includes(dataId);

  if (!currentUserParticipant) {
    return {
      props: { errors: 'Not authenticated' },
    };
  }
  if (!conversation) {
    return {
      redirect: {
        destination: '/discovery',
        permanent: false,
      },
    };
  }

  const participantsDataId = participatnsOfTheConversation.map((user) => {
    return user.personalDataId;
  });

  const closestStudio = await getClosestStudio(participantsDataId);

  // based on personal data ids, return  the closes studio

  return {
    props: {
      googleAPI: googleAPI,
      studios: studios,
      closestStudio: closestStudio,
    },
  };
}