const request = require('supertest');
const server = require("../index");
const Employee = require("../models/employee");

describe('Test the application routes.', () => {
   let test_employee;
    let employee_id;
    let employee;

    beforeEach(async () => {
         test_employee = {
            name: "test_user",
            email: "test@gmail.com",
            password: "test_password",
            isadmin: true
        };
        employee = await Employee.create({ name: test_employee.name, email: test_employee.email, password: test_employee.password, isadmin: test_employee.isadmin });
        employee_id = employee.dataValues.id;
    });
    afterEach(async () => { 
        await Employee.destroy({where : {}});
        await server.close();
    });
    describe('POST:/employees',() => { 
        it('POST : Should return a 400 if a user already exists.', async () => {
            const res = await request(server)
                .post('/employees')
                .send({
                    email: test_employee.email
                });

            expect(res.text).toBe('USER ALREADY EXISTS...');
            expect(res.status).toBe(400);
        });

        it('POST : Should return a 200 and a auth-token with employee rows.', async () => {
            const res = await request(server)
                .post('/employees')
                .send({
                    name : test_employee.name,
                    email: "test_2@gmail",
                    password: test_employee.password,
                    isAdmin : test_employee.isadmin
                });
            
            expect(res.text).toContain('token','Employee');
            expect(res.statusCode).toBe(201);
            console.log(res);
        });

        it('PUT : Should return a 200 and a auth-token with employee rows.', async () => {
            const test_name = 'test_name_2';

            const res = await request(server)
                .put(`/employees/${employee_id}`)
                .send({
                    name : test_name,
                    email: "test_2@gmail",
                    password: test_employee.password,
                    isAdmin : test_employee.isadmin
                });
            
            expect(res.text).toContain('Employee');
            expect(res.text.Employee).toBe(test_name);
            expect(res.statusCode).toBe(200);
        });
        
        it('PUT : Should return a 200 and a auth-token with employee rows.', async () => {
            const test_name = 'test_name_2';

            const res = await request(server)
                .put('/employees/')
                .send({
                    name : test_name,
                    email: "test_2@gmail",
                    password: test_employee.password,
                    isAdmin : test_employee.isadmin
                });
            
            expect(res.text).toContain('Employee');
            expect(res.text.Employee).toBe(test_name);
            expect(res.statusCode).toBe(200);
        });

    });
});