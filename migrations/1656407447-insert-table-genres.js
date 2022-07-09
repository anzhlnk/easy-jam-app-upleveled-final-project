const genreDatabase = [
  {
    id: '1',
    genre_name: 'country',
  },
  {
    id: '2',
    genre_name: 'rock',
  },
  {
    id: '3',
    genre_name: 'pop',
  },
  {
    id: '4',
    genre_name: 'blues',
  },
  {
    id: '5',
    genre_name: 'jazz',
  },
  {
    id: '6',
    genre_name: 'folk',
  },
  {
    id: '7',
    genre_name: 'soul',
  },
  {
    id: '8',
    genre_name: 'indie pop',
  },
  {
    id: '9',
    genre_name: 'r&b',
  },
  {
    id: '10',
    genre_name: 'reggae',
  },
  {
    id: '11',
    genre_name: 'funk',
  },
  {
    id: '12',
    genre_name: 'disco',
  },
  {
    id: '13',
    genre_name: 'classic',
  },

  {
    id: '14',
    genre_name: 'metal',
  },
  {
    id: '14',
    genre_name: 'latin',
  },
  {
    id: '15',
    genre_name: 'k-pop',
  },
  {
    id: '16',
    genre_name: 'techno',
  },
  {
    id: '17',
    genre_name: 'hip-hop',
  },
  {
    id: '18',
    genre_name: 'rap',
  },
  {
    id: '19',
    genre_name: 'electronic',
  },
  {
    id: '20',
    genre_name: 'punk',
  },
];

// //migration start
exports.up = async (sql) => {
  await sql`
INSERT INTO genres
${sql(genreDatabase, 'genre_name')}
`;
};

exports.down = async (sql) => {
  for (const genre of genreDatabase) {
    await sql`
DELETE FROM genres
WHERE
genre_name = ${genre.genre_name}`;
  }
};
// end of migration
