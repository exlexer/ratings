const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres@localhost:5432/reviews',
});

pool.on('error', function(err, client) {
  console.error('idle client error', err.message, err.stack)
});

module.exports = {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.connect((err, client, done) => {
        if (err) return console.error('error fetching client from pool', err);
        try {
          client.query(text, params, (err, res) => {
            if (err) reject(err);
            else {
              if (res.command === 'DELETE' && res.rowCount < 1) reject(new Error('no rows deleted'));
              if (res.command === 'INSERT' && res.rowCount < 1) reject(new Error('no rows inserted'));
              if (res.command === 'INSERT' && res.rows.length === 1) resolve(res.rows[0]);
              if (res.command === 'INSERT' && res.rows.length > 1) resolve(res.rows);
              if (res.command === 'SELECT' && res.rowCount === 1) resolve(res.rows[0]);
              if (res.command === 'SELECT' && res.rowCount > 1) resolve(res.rows);
              resolve(res);
            };
          });
        } finally {
          client.release();
        }
      });
    });
  }
};