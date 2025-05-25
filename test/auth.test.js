const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const User = require('../models/userModel');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes', () => {
    const testUser = { name: 'Test User', email: 'testuser@example.com', password: 'testpass' };

    before(async () => {
        await User.deleteOne({ email: testUser.email });
    });

    describe('POST /register', () => {
        it('should register a new user', (done) => {
            chai.request(app)
                .post('/register')
                .send(testUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.be.true;
                    done();
                });
        });

        it('should fail if user already exists', (done) => {
            chai.request(app)
                .post('/register')
                .send(testUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.be.false;
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('should fail login before verification', (done) => {
            chai.request(app)
                .post('/login')
                .send({ email: testUser.email, password: testUser.password })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.be.false;
                    done();
                });
        });
    });
});
