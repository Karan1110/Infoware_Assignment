A Backend system for handling the employees of the organisation for the Admin.

To start this API:
git clone https://github.com/Karan1110/Infoware_Assignment.git
npm install
npm run build

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

