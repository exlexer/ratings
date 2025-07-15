import { Client } from "pg";

const client: Client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  }
});

export const query = (text: string, params?: any[]): Promise<any[] | any> =>
  new Promise((resolve, reject): void => {
    client.query(text, params, (error: Error, res) => {
      if (error) return reject(error);
      if (res.command === "DELETE" && res.rowCount < 1)
        reject(new Error("no rows deleted"));
      if (res.command === "INSERT" && res.rowCount < 1)
        reject(new Error("no rows inserted"));
      if (res.command === "INSERT" && res.rows.length === 1)
        resolve(res.rows[0]);
      if (res.command === "INSERT" && res.rows.length > 1) resolve(res.rows);
      if (res.command === "SELECT" && res.rowCount === 1) resolve(res.rows[0]);
      if (res.command === "SELECT" && res.rowCount > 1) resolve(res.rows);
      resolve(res);
    });
  });
