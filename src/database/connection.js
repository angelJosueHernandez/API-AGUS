const sql = require('mssql');

const dbSettings = {
  user: 'AgusHernadez02_SQLLogin_1',
  password: 'yn46oxcjv9',
  server: '	TareasUthh.mssql.somee.com',
  database: 'TareasUthh', 
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}; 

const connection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    console.log('Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('Database connection failed: ', error);
  }
};

module.exports = {
  sql,
  getConnection: connection,
};
