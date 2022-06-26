import 'rc-slider/assets/index.css';
import { css } from '@emotion/react';
import Head from 'next/head';
import Slider from 'rc-slider';
import { useState } from 'react';
import Select from 'react-select';

const container = css`
  margin-top: 24px;
`;

// temporary "database"
const instruments = [
  'piano',
  'guitar',
  'violin',
  'drums',
  'saxophone',
  'flute',
  'cello',
  'trumpet',
  'harp',
  'synthesizer',
  'vocal',
];

// temporary "database"
const genders = ['male', 'female', 'other'];

export default function Filters() {
  //  add "select all" option to an array and format into "label/ value" relation as required by the package
  const displayedInstrumentOptions = [
    { label: 'Select All', value: 'all' },
    ...instruments.map((currentInstrument) => {
      return { label: currentInstrument, value: currentInstrument };
    }),
  ];

  const displayedGenderOptions = [
    { label: 'Select All', value: 'all' },
    ...genders.map((currentGender) => {
      return { label: currentGender, value: currentGender };
    }),
  ];

  const [valueRange, setValueRange] = useState([25, 35]);
  console.log('age', valueRange);
  const [valueSlider, setValueSlider] = useState([10]);
  console.log('distance', valueSlider);
  const [valueVisible, setValueVisible] = useState([1]);
  console.log('visible', valueVisible);
  const [valueInstrument, setValueInstrument] = useState(instruments);
  console.log('instrument', valueInstrument);
  const [valueGender, setValueGender] = useState('any');
  console.log('gender', valueGender);

  console.log(
    'displayedInstrumentOptions.length',
    displayedInstrumentOptions.length,
  );
  console.log('valueInstrument.length', valueInstrument.length);

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
        <h1>Start discovering</h1>
        <div css={container}>
          <span>Visible</span>
          <Slider
            range
            className="t-slider"
            min={0}
            max={1}
            value={valueVisible}
            step={1}
            onChange={(val) => setValueVisible(val)}
            allowCross={false}
          />
        </div>
        <div css={container}>
          <span>Instrument</span>
          <Select
            id="instrument-multi-select"
            instanceId="instrument-multi-select"
            isMulti
            options={displayedInstrumentOptions.filter(
              (option) => valueInstrument.indexOf(option.value) === -1,
            )}
            // defaultValue={displayedInstrumentOptions[0]}
            value={
              displayedInstrumentOptions.length === valueInstrument.length + 1 // all instruments selected
                ? { label: 'All Instruments', value: 'All Instruments' }
                : valueInstrument.map((x) => {
                    return { value: x, label: x };
                  })
            }
            placeholder="Select Instruments"
            onChange={(data) => {
              data.find((option) => option.value === 'all')
                ? setValueInstrument(
                    displayedInstrumentOptions.slice(1).map((x) => x.value),
                  )
                : setValueInstrument(data.map((x) => x.value));
            }}
          />
        </div>
        <div css={container}>
          <span>Gender</span>
          <Select
            id="gender-multi-select"
            instanceId="instrument-multi-select"
            isMulti
            options={displayedInstrumentOptions.filter(
              (option) => valueInstrument.indexOf(option.value) === -1,
            )}
            // defaultValue={displayedInstrumentOptions[0]}
            value={
              displayedGenderOptions.length === valueGender.length + 1 // all genders selected
                ? { label: 'All genders', value: 'All genders' }
                : valueInstrument.map((x) => {
                    return { value: x, label: x };
                  })
            }
            placeholder="Select genders"
            onChange={(data) => {
              data.find((option) => option.value === 'all')
                ? setValueGender(
                    displayedInstrumentOptions.slice(1).map((x) => x.value),
                  )
                : setValueGender(data.map((x) => x.value));
            }}
          />
        </div>
        <div css={container}>
          <span>Age range</span>{' '}
          <Slider
            range
            className="t-slider"
            min={12}
            max={60}
            value={valueRange}
            step={1}
            onChange={(val) => {
              setValueRange(val);
            }}
            allowCross={false}
          />
        </div>
        <div css={container}>
          <span>Distance</span>
          <Slider
            className="t-slider"
            min={1}
            max={100}
            value={valueSlider}
            step={1}
            onChange={(val) => setValueSlider(val)}
            allowCross={false}
          />
        </div>
      </main>
    </div>
  );
}
