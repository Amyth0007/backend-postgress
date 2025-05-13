import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Nz2pBORyr4WQ@ep-morning-tooth-a1yp437z.ap-southeast-1.aws.neon.tech/neondb?sslmode=require', // use your Neon URL
  ssl: {
    rejectUnauthorized: false, // important for self-signed certs in Neon
  },
});

export default pool;
