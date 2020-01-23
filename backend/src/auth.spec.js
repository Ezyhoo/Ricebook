process.env.NODE_ENV = 'test';
var assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');
let auth = require('../index');
let should = chai.should();
let mongoose = require("mongoose");

chai.use(chaiHttp);

const correct = {
    username: "yh75",
    password: 123
}

describe('auth', function () {

    it('...', function(done){
        this.timeout(15000);
        setTimeout(done, 15000);
    });
    it('should register', (done) => {

        chai.request(auth)
            .post('/register')
            .send(correct)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    })
    it('should login with correct username & password', (done) => {
        chai.request(auth)
            .post('/login')
            .send(correct)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    })
})
