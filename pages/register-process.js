import Head from 'next/head';
import { useState } from 'react';

export default function UserProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [instrument, setInstrument] = useState('');
  const [genre, setGenre] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [active, setActive] = useState(0);

  const toggleHandler = (id) => () => setActive(id);

  return (
    <div>
      <Head>
        <title>Sign Up process</title>
        <meta name="sign up process" content="add some personal information" />
      </Head>
      <main>
        {/* page 1 */}
        {active === 0 && (
          <div>
            <h1>My name is...</h1>
            <div>
              <input
                placeholder="First name"
                onChange={(event) => {
                  setFirstName(event.currentTarget.value);
                }}
              />
              <input
                placeholder="Last name"
                onChange={(event) => {
                  setLastName(event.currentTarget.value);
                }}
              />
            </div>
            <button onClick={toggleHandler(1)}> {'>'} </button>
          </div>
        )}
        {/* page 2 */}
        {active === 1 && (
          <div>
            <button onClick={toggleHandler(0)}> back </button>
            <h1>I was born on...</h1>
            <input
              placeholder="birthday"
              onChange={(event) => {
                setBirthday(event.currentTarget.value);
              }}
            />
            <button onClick={toggleHandler(2)}> {'>'} </button>
          </div>
        )}
        {/* page 3 */}
        {active === 2 && (
          <div>
            <button onClick={toggleHandler(1)}> back </button>
            <h1>I identify as...</h1>
            <div>
              <button
                placeholder="Female"
                onClick={(event) => {
                  setGender(event.currentTarget.value);
                }}
              />
              <button
                placeholder="Last name"
                onClick={(event) => {
                  setGender(event.currentTarget.value);
                }}
              />
              <button
                placeholder="Other"
                onClick={(event) => {
                  setGender(event.currentTarget.value);
                }}
              />
            </div>
            <button onClick={toggleHandler(3)}> {'>'} </button>
          </div>
        )}
        {/* page 4 */}
        {active === 3 && (
          <div>
            <button onClick={toggleHandler(2)}> back </button>
            <h1>The instrument(s) I’d like to play while jamming...</h1>
            <div>
              <input
                placeholder="Instrument"
                onChange={(event) => {
                  setInstrument(event.currentTarget.value);
                }}
              />
            </div>
            <button onClick={toggleHandler(4)}> {'>'} </button>
          </div>
        )}
        {/* page 5 */}
        {active === 4 && (
          <div>
            <button onClick={toggleHandler(3)}> back </button>
            <h1>The genres I’d like to play...</h1>
            <div>
              <input
                placeholder="genres"
                onChange={(event) => {
                  setGenre(event.currentTarget.value);
                }}
              />
            </div>
            <button onClick={toggleHandler(5)}> {'>'} </button>
          </div>
        )}
        {/* page 6 */}
        {active === 5 && (
          <div>
            <button onClick={toggleHandler(4)}> back </button>
            <h1>My location is...</h1>
            <div>
              <input
                placeholder="location"
                onChange={(event) => {
                  setLocation(event.currentTarget.value);
                }}
              />
            </div>
            <button onClick={toggleHandler(6)}> {'>'} </button>
          </div>
        )}
        {/* page 7  */}
        {active === 6 && (
          <div>
            <button onClick={toggleHandler(5)}> back </button>
            <h1>Add a photo that best represents your music hobby</h1>
            <div>
              <input
                placeholder="location"
                onChange={(event) => {
                  setLocation(event.currentTarget.value);
                }}
              />
            </div>
            <button> {'>'} </button>
          </div>
        )}
      </main>
    </div>
  );
}
