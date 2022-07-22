const profileList = [5, 4, 2, 5];

const counts = {};
profileList.forEach((e) => {
  if (!(e in counts)) {
    counts[e] = 0;
  }
  counts[e]++;
});

test('calculate the number of times a number appears in an array', () => {
  expect(counts).toStrictEqual({ 2: 1, 4: 1, 5: 2 });
});
