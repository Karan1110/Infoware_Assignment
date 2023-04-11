const { Client } = require("pg");
const winston = require("winston");

const client = new Client({
  connectionString:
    "postgres://gbpaytdx:bhl8nviSImZ0Xwk0w9xPbRl11VpOaqax@lallah.db.elephantsql.com/gbpaytdx",
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .then(() => {
    winston.info("Connected to DB");
  })
  .catch((ex) => {
    winston.error(ex);
  });

async function seed() {
  await client.query(
    `
    CREATE TABLE Employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(55),
        email VARCHAR(75),
        password VARCHAR(255),
        education VARCHAR(75),
        age SMALLINT,
        isAdmin BOOL
    );
    
    CREATE TABLE Departments(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES Employees(id),
        position VARCHAR(55)
    );
    
    CREATE TABLE Statuses(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES Employees(id),
        name VARCHAR(30)
    );
    
    CREATE TABLE Performance(
        status_id INTEGER REFERENCES Statuses(id),
        employee_id INTEGER REFERENCES Employees(id)
    );
    
    CREATE TABLE Levels(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES Employees(id),
        name VARCHAR(35)
    );
    
    CREATE TABLE Skills(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES Employees(id),
        name VARCHAR(55),
        level_id INTEGER REFERENCES Levels(id)
    );
    
    CREATE TABLE Benefits(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES Employees(id),
        name VARCHAR(5),
        package VARCHAR(35)
    );
    
    CREATE TABLE Experience(
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES Employees(id),
        company VARCHAR(55),
        "From" DATE,
        "To" DATE
    );
    
    `,
    []
  );
}

seed();