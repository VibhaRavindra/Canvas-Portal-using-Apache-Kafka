var expect = require('chai').expect;
var app = require('../index');
var request = require('supertest');
// JWT token for authorization
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJc0xvZ2dlZEluIjp0cnVlLCJpc1N0dWRlbnQiOnRydWUsInVzZXJpZCI6IjVjYjM5MDE5NjQ2ZjRjNDZiMmE3Y2I3ZCIsInVzZXJfbmFtZSI6IkxvYWQgVGVzdCIsImlhdCI6MTU1NTI3MjAwNywiZXhwIjoxNTU1MzU4NDA3fQ.7Al68rZKfkYqT56u7n_5zkaGOMZN24MWM2rwF7nSWmw"

  describe('GET /getCourseDetails/:courseid', function(done){
    it('A logged in user should be able to retrieve course details', function(done){
      request(app).get('/getCourseDetails/1').set('Authorization', 'Bearer ' + token).end(function(err, response){
          expect(response.statusCode).to.equal(200);
          expect(response.body).to.be.an('object');
          done();
        });
    });
  });

  describe('GET /courses', function(done){
      it('should return non empty list of courses if user is loggedin', function(done){
        request(app).get('/getCourses/student/1').set('Authorization', 'Bearer ' + token).end(function(err, response){
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an('object');
            done();
          });
      });
    });

    describe('GET /getDepartment', function(done){
        it('Should return non empty number of departments to a loggedin user.', function(done){
          request(app).get('/getDepartment').set('Authorization', 'Bearer ' + token).end(function(err, response){
              expect(response.statusCode).to.equal(200);
              expect(response.body).to.be.an('object');
              done();
            });
        });
      });
  
      describe('POST /updateGrade', function(done){
        it('Update grade should return 401 for Student.', function(done){
          request(app).post('/updateGrade').set('Authorization', 'Bearer ' + token).end(function(err, response){
              expect(response.statusCode).to.not.equal(200);
              done();
            });
        });
      });

      describe('GET /isLoggedIn', function(done){
        it('should NOT return any user before logging in', function(done){
          request(app).get('/isLoggedIn').end(function(err, response){
              expect(response.statusCode).to.equal(200);
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('isLoggedIn');
              expect(response.body).not.to.have.property('isStudent');
              expect(response.body).not.to.have.property('userid');
              expect(response.body.isLoggedIn).to.equal(false);
              done();
            });
        });
      });