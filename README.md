
## 🚀 About Me
I'm Karan, a backend developer.

I'm based in India,Karnataka,Bengaluru.





## Installation

To start this API
```bash
git clone https://github.com/Karan1110/veera.git
npm install
npm run build
```

# Veera - Jira clone
An API written in Express framework using PostgreSQL as DBMS and Sequelize as ORM with effcient and robust features to  the API excel.
## Features

⦁	Implemented a Jira clone with advanced features.

⦁	Incorporated real-time chat functionality capable of handling multiple chat rooms for ease of communication   between an organisation using Web Sockets with Create,Update features for messages and realtime     updation after updating the message.

⦁	Employed authentication and security measures.

⦁	Utilized Express.js and Sequelize as the backend framework and ORM, respectively.

⦁	Utilized PostgreSQL as the DBMS.

⦁	Leveraged advanced SQL features such as TRIGGERS,EVENTS, and INDEXING  for optimal performance.

⦁	Enhanced API security using Helmet to prevent SQL injections.

⦁	Employed efficient data modeling techniques for handling diverse data relations.

⦁	Expressed math formulas and database techniques such as virtual methods and advance update triggers for calculating the punctuality score of the employee who is to attending meetings.

## Deployment

To deploy this project run

```bash
 heroku create veera
```

```bash
heroku addons:create heroku-postgresql:hobby-dev
```
```bash
heroku config:set DATABASE_URL=<your-api-key> JwtPrivateKey=<your-secret-key>
```

```bash
git add .
git commit -m "Initial commit"
git push heroku master
```

```bash
git add .
git commit -m "Initial commit"
git push heroku master
```

```bash
heroku open
```