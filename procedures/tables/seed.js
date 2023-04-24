const { Client } = require("pg");
const config  = require("config")
const winston = require("winston")
const debug = require("debug")("seed")

const client = new Client({
  connectionString:
    config.get('dbURL'),
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
    debug(ex)
  });

async function germinate() {
  await client.query(
    `
    CREATE OR REPLACE PROCEDURE create_tables ()
    LANGUAGE plpgsql
    AS $$
    BEGIN
    CREATE TABLE Employees(
      id SERIAL PRIMARY KEY,
      name  VARCHAR(55) NOT NULL UNIQUE,
      email  VARCHAR(75) NOT NULL UNIQUE,
      phone SMALLINT UNIQUE,
      salary SMALLINT,
      password VARCHAR(255)  NOT NULL,
      education VARCHAR(75),
      age SMALLINT,
      isAdmin BOOL,
      manager_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      working_days INT,
      total_working_days INT,
      total_leaves INT,
      leaves INT,
      salary_debited BOOL
    );
    
    CREATE TABLE Departments(
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      name VARCHAR(55),
      position VARCHAR(55),
      employee_tax integer
    );
    
    CREATE TABLE Statuses(
      id SERIAL PRIMARY KEY,
      name VARCHAR(30)
    );
    
    CREATE TABLE Performances(
      id SERIAL PRIMARY KEY,
      status_id INTEGER REFERENCES Statuses(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE 
    );
    
    CREATE TABLE Levels(
      id SERIAL PRIMARY KEY,
      name VARCHAR(35)
    );
    
    CREATE TABLE Skills(
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      name VARCHAR(55),
      level_id INTEGER REFERENCES Levels(id) ON UPDATE CASCADE ON DELETE CASCADE 
    );
    
    CREATE TABLE Benefits(
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      benefit_type_id INTEGER REFERENCES Benefits(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      package VARCHAR(35)
    );

    CREATE TABLE Benefit_types(
      id SERIAL PRIMARY KEY,
      name VARCHAR(55)
    );

    CREATE TABLE Notifications(
      id SERIAL PRIMARY KEY,
      message_id INTEGER REFERENCES Messages(id) ON UPDATE CASCADE ON DELETE CASCADE 
    )

    CREATE TABLE Messages(
      id SERIAL PRIMARY KEY,
      message VARCHAR(55),
      read BOOLEAN
    )
    
    CREATE TABLE Positions(
      id SERIAL PRIMARY KEY,
      name VARCHAR(55)
    )

    CREATE TABLE Experiences(
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
      company VARCHAR(55),
      "from" DATE,
      "To" DATE,
      duration GENERATED ALWAYS AS ("from" - "to")
    );

    CREATE TABLE Meetings(
      id SERIAL PRIMARY KEY,
      name VARCHAR(55),
      link VARCHAR,
      "from" TIMESTAMP,
      "to" TIMESTAMP,
      duration GENERATED ALWAYS AS ("from" - "to")
    );

    CREATE TABLE Meeting_members(
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER REFERENCES Meetings(id) ON UPDATE CASCADE ON DELETE CASCADE  ,
    employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE 
    );


CREATE TABLE Leaves(
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
  "from" DATE,
  "to DATE,
  duration GENERATED ALWAYS AS ("from" - "to")
)

CREATE TABLE Over_times(
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
  "from" DATE,
  "to DATE,
  duration GENERATED ALWAYS AS ("from" - "to")
)


CREATE TABLE Goals(
  id SERIAL PRIMARY KEY,
  status VARCHAR,
  employee_id INTEGER REFERENCES Employees(id) ON UPDATE CASCADE ON DELETE CASCADE ,
  name VARCHAR
)

CREATE TABLE WorkingDays(
 id SERIAL PRIMARY KEY,
 "from" DATETIME,
 "to" DATETIME
)

    END
    $$;
  
    `,
    []
  );
}

germinate();