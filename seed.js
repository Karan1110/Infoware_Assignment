const { Client } = require("pg")
const winston = require("winston")

const client = new Client({
  connectionString:
    "postgres://gbpaytdx:bhl8nviSImZ0Xwk0w9xPbRl11VpOaqax@lallah.db.elephantsql.com/gbpaytdx",
  ssl: {
    rejectUnauthorized: false,
  },
})

client
  .connect()
  .then(() => {
    winston.info("Connected to DB")
  })
  .catch((ex) => {
    winston.error(ex)
  })

// (async function seed() {
//   await client.query(
//     `
//     CREATE TABLE Employees(
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(55),
//         email VARCHAR(75),
//         password VARCHAR(255),
//         education VARCHAR(75),
//         age SMALLINT,
//         isAdmin BOOL
//     )
    
//     CREATE TABLE Departments(
//         id SERIAL PRIMARY KEY,
//         employee_id INTEGER REFERENCES Employees(id),
//         name
//         position VARCHAR(55)
//     )
//     CREATE TABLE Statuses(
//       id SERIAL PRIMARY KEY,
//       performance_id INTEGER REFERENCES Performances(id),
//       name VARCHAR(30)
//   )

//     CREATE TABLE Performances(
//       id SERIAL PRIMARY KEY,
//       status_id INTEGER REFERENCES Statuses(id),
//       employee_id INTEGER REFERENCES Employees(id)
//   )
    
//   CREATE TABLE Levels(
//     id SERIAL PRIMARY KEY,
//     employee_id INTEGER REFERENCES Employees(id),
//     name VARCHAR(35)
// )

//     CREATE TABLE Skills(
//         id SERIAL PRIMARY KEY,
//         employee_id INTEGER REFERENCES Employees(id),
//         name VARCHAR(55),
//         level_id INTEGER REFERENCES Levels(id)
//     )
    
//     CREATE TABLE Benefits(
//         id SERIAL PRIMARY KEY,
//         employee_id INTEGER REFERENCES Employees(id),
//         name VARCHAR(5),
//         package VARCHAR(35)
//     )
    
//     CREATE TABLE Experiences(
//         id SERIAL PRIMARY KEY,
//         employee_id INTEGER REFERENCES Employees(id),
//         company VARCHAR(55),
//         "From" DATE,
//         "To" DATE
//     )
    
//     `,
//     []
//   )
// })()

// IIFE function, not recommend

async function seed() {
  await client.query(
    `
    CREATE TABLE Employees(
      id SERIAL PRIMARY KEY,
      name  VARCHAR(55) NOT NULL UNIQUE,
      email  VARCHAR(75) NOT NULL UNIQUE,
      password VARCHAR(255)  NOT NULL,
      education VARCHAR(75),
      age SMALLINT,
      isAdmin BOOL
  );
  
  CREATE TABLE Departments(
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES Employees(id),
      name VARCHAR(55),
      position VARCHAR(55)
  );
  
  CREATE TABLE Statuses(
      id SERIAL PRIMARY KEY,
      name VARCHAR(30)
  );
  
  CREATE TABLE Performances(
      id SERIAL PRIMARY KEY,
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
  
  CREATE TABLE Experiences(
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES Employees(id),
      company VARCHAR(55),
      "From" DATE,
      "To" DATE
  );  
    `,
    []
  )
}

seed();
  
  async function destroy() {
    await client.query(
    `
    DROP TABLE  Departments, Performance, Statuses, Benefits, Skills, Experience, Levels, Employees;
  `,
      []
    )
}