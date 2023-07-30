
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import Users, { UserInput } from '../models/users.models';
import { SearchUserInput } from '../types/users.types';
import { Response } from 'express';
import { Sessions } from '../models';
import sequelizeConnection from '../config/db_config';
import dbInit from '../config/db';

chai.use(chaiHttp);
const should = chai.should();

const search: SearchUserInput = {
  search: '',
  limit: 10,
  page: 0
}

const adminUser: UserInput = {
  id: '1', 
  name: 'admin',
  email: 'admin@email.com',
  isAdmin: true,
  password: 'testpass',
}

const nonAdminUser: UserInput = {
  id: '2', 
  name: 'test',
  email: 'test@email.com',
  isAdmin: false,
  password: 'adminpass',
}

let access_token: string = '';

describe('Test Users /users', () => {

  before(async function () {
    // runs once before the first test in this block
    await dbInit()
    // done()
  });

  describe('create non-admin user /create', () => {
    it('it should create users', async() => {
      chai.request(app)
      .post('/users/create')
      .send(nonAdminUser)
      .end((err: any, res: any) => {
        should.exist(res.body);
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('login non-admin user /login', () => {
    it('it should login non-admin user ', async() => {
      chai.request(app)
      .post('/users/login')
      .send(nonAdminUser)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
        access_token = res.body.data.access_token;
      
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('find all from non-admin user /findAll', () => {
    it('it should find all from non-admin users', async() => {
      chai.request(app)
      .post('/users/findAll')
      .auth(access_token, { type: 'bearer' })
      .send(search)
      .end((err: any, res: any) => {
        res.should.have.status(403);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('find self from non-admin user /findOne', () => {
    it('it should find self from non-admin users', async() => {
      chai.request(app)
      .get('/users/findOne/me')
      .auth(access_token, { type: 'bearer' })
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('find someone from non-admin user /findOne', () => {
    it('it should find someone from non-admin user', async() => {
      chai.request(app)
      .get('/users/findOne/1')
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(403);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('update self from non-admin user /update', () => {
    it('it should update self from non-admin user', async() => {
      chai.request(app)
      .put('/users/update/2')
      .send(nonAdminUser)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('update someone from non-admin user /update', () => {
    it('it should update someone from non-admin user', async() => {
      chai.request(app)
      .put('/users/update/1')
      .send(nonAdminUser)
      .end((err: any, res: any) => {
        res.should.have.status(403);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('delete from non-admin /deleteUser', () => {
    it('it should delete from non-admin', async() => {
      chai.request(app)
      .delete('/users/deleteUser/2')
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(403);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });


  describe('create admin user /create', () => {
    it('it should create admin user', async() => {
      chai.request(app)
      .post('/users/create')
      .send(adminUser)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('login admin user /login', () => {
    it('it should login users', async() => {
      chai.request(app)
      .post('/users/login')
      .send(adminUser)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
        access_token = res.body.data.access_token;
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('find all from admin user /findAll', () => {
    it('it should find all from admin user', async() => {
      chai.request(app)
      .post('/users/findAll')
      .auth(access_token, { type: 'bearer' })
      .send(search)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('find self from admin user /findOne', () => {
    it('it should find self from admin user', async() => {
      chai.request(app)
      .get('/users/findOne/me')
      .auth(access_token, { type: 'bearer' })
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('find someone from admin user /findOne', () => {
    it('it should find someone from admin user', async() => {
      chai.request(app)
      .get('/users/findOne/1')
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('update self from admin user /update', () => {
    it('it should update self from admin user', async() => {
      chai.request(app)
      .put('/users/update/1')
      .send(adminUser)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('update someone from admin user /update', () => {
    it('it should update someone from admin use', async() => {
      chai.request(app)
      .put('/users/update/2')
      .send(nonAdminUser)
      .end((err: any, res: any) => {
        res.should.have.status(200);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('delete admin from admin user /deleteUser', () => {
    it('it should delete admin from admin user', async() => {
      chai.request(app)
      .delete('/users/deleteUser/1')
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('pages');
        res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });

  describe('delete non admin from admin /deleteUser', () => {
    it('it should delete non admin from admin', async() => {
      chai.request(app)
      .delete('/users/deleteUser/2')
      .send()
      .end((err: any, res: any) => {
        res.should.have.status(403);
        // res.body.should.be.a('object');
        // res.body.should.have.property('errors');
        // res.body.errors.should.have.property('pages');
        // res.body.errors.pages.should.have.property('kind').eql('required');
      });
      // expect(actualResult.error).to.equal('OK');
    });
  });


  /**
   * after all tests are done, clear the database and close the connection
   * Please comment this if you don't want data to be deleted at the end of the test
   */
  after(async function(){
    // runs after all tests in this block
    await Users.destroy({
      where: {},
      truncate: true
    })
    await Sessions.destroy({
      where: {},
      truncate: true
    })
    sequelizeConnection.close()
    console.log("purged data after all tests")
    // process.exit(0);
  });

});