A Backend system for handling the employees of the organisation for the Admin.

                                                      To start this API:

git clone https://github.com/Karan1110/Infoware_Assignment.git
npm install
node seed
node index

                                                      Features of this API: 

1. Authentication and Authorization. Use of JsonWebTokens and Bcrypt for auth and hashing the passwords.

2. Advanced error handling using "winston","express-async-errors" and a customer error middleware 
                                                OR
   use a customer async error handler in middlewares/async.js with the customer error middleware.

3. Advanced express methods used to make a signle connect to the cloud hosted Database to access the db for 
   querying using the customer req.db property.

4. Logging Errors to a file or DB using winston.

5. using the asynchronous nature of Express to efficiently manage the middleware pipeline.

6. structuring the API using seed.js to destroy(DROP) and germinate function to create tables with validatinons.

                                                      API routes:

Users - 
localhost:3000/users GET
localhost:3000/users/me GET
localhost:3000/users/:id GET
localhost:3000/users/ POST
localhost:3000/users/:id PUT
localhost:3000/users/:id DELETE 

Departments 
localhost:3000/departments POST
localhost:3000/departments PUT
localhost:3000/departments DELETE

Benefits
localhost:3000/benefits POST
localhost:3000/benefits PUT
localhost:3000/benefits DELETE

Experiences
localhost:3000/experiences POST
localhost:3000/experiences PUT
localhost:3000/experiences DELETE

Levels
localhost:3000/levels POST
localhost:3000/levels PUT
localhost:3000/levels DELETE

PERFORMANCES
localhost:3000/performances POST
localhost:3000/performances PUT
localhost:3000/performances DELETE

Skills
localhost:3000/skills POST
localhost:3000/skills PUT
localhost:3000/skills DELETE

Statuses
localhost:3000/statuses POST
localhost:3000/statuses PUT
localhost:3000/statuses DELETE