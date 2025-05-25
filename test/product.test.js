const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const Product = require('../models/productModel');

chai.use(chaiHttp);
const { expect } = chai;

describe('Product Routes', () => {
    let productId;

    it('should create a new product', (done) => {
        chai.request(app)
            .post('/product')
            .send({ title: 'Test Product', price: 100, photo: 'testphoto', ownerEmail: 'test@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.be.true;
                productId = res.body.productId;
                done();
            });
    });

    it('should get all products', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.be.true;
                expect(res.body.products).to.be.an('array');
                done();
            });
    });

    it('should approve a product', (done) => {
        chai.request(app)
            .post(`/api/products/${productId}/approve`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.be.true;
                done();
            });
    });

    it('should delete a product', (done) => {
        chai.request(app)
            .delete(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.be.true;
                done();
            });
    });
});
