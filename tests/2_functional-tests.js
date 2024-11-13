const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

     let testIssueId;


     // POST Tests
     test('POST request with required fields', function (done) {
          chai.request(server)
               .post('/api/issues/testproject')
               .send({
                    issue_title: 'New Issue',
                    issue_text: 'Details about the issue',
                    created_by: 'User1',
                    assigned_to: 'User2',
                    status_text: 'In Progress'
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, '_id');
                    assert.propertyVal(res.body, 'issue_title', 'New Issue');
                    assert.propertyVal(res.body, 'issue_text', 'Details about the issue');
                    assert.propertyVal(res.body, 'created_by', 'User1');
                    assert.propertyVal(res.body, 'assigned_to', 'User2');
                    assert.propertyVal(res.body, 'status_text', 'In Progress');
                    assert.property(res.body, 'created_on');
                    assert.property(res.body, 'updated_on');
                    assert.propertyVal(res.body, 'open', true);
                    testIssueId = res.body._id; // Save ID for future tests
                    done();
               });
     });

     test('POST request with missing required fields', function (done) {
          chai.request(server)
               .post('/api/issues/testproject')
               .send({
                    issue_title: 'Incomplete Issue'
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'error', 'required field(s) missing');
                    done();
               });
     });

     // GET Tests
     test('GET request for all issues in a project', function (done) {
          chai.request(server)
               .get('/api/issues/testproject')
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.property(res.body[0], '_id');
                    assert.property(res.body[0], 'issue_title');
                    assert.property(res.body[0], 'issue_text');
                    assert.property(res.body[0], 'created_by');
                    assert.property(res.body[0], 'created_on');
                    assert.property(res.body[0], 'updated_on');
                    assert.property(res.body[0], 'open');
                    done();
               });
     });

     test('GET request with filtering by query parameters', function (done) {
          chai.request(server)
               .get('/api/issues/testproject')
               .query({ open: true, created_by: 'User1' })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                         assert.propertyVal(issue, 'open', true);
                         assert.propertyVal(issue, 'created_by', 'User1');
                    });
                    done();
               });
     });

     // PUT Tests
     test('PUT request with _id and fields to update', function (done) {
          chai.request(server)
               .put('/api/issues/testproject')
               .send({
                    _id: testIssueId,
                    issue_text: 'Updated issue text'
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'result', 'successfully updated');
                    assert.propertyVal(res.body, '_id', testIssueId);
                    done();
               });
     });

     test('PUT request with missing _id', function (done) {
          chai.request(server)
               .put('/api/issues/testproject')
               .send({
                    issue_text: 'No ID provided'
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'error', 'missing _id');
                    done();
               });
     });

     test('PUT request with no fields to update', function (done) {
          chai.request(server)
               .put('/api/issues/testproject')
               .send({
                    _id: testIssueId
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'error', 'no update field(s) sent');
                    assert.propertyVal(res.body, '_id', testIssueId);
                    done();
               });
     });

     // DELETE Tests
     test('DELETE request with valid _id', function (done) {
          chai.request(server)
               .delete('/api/issues/testproject')
               .send({
                    _id: testIssueId
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'result', 'successfully deleted');
                    assert.propertyVal(res.body, '_id', testIssueId);
                    done();
               });
     });

     test('DELETE request with missing _id', function (done) {
          chai.request(server)
               .delete('/api/issues/testproject')
               .send({})
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'error', 'missing _id');
                    done();
               });
     });

     test('DELETE request with invalid _id', function (done) {
          chai.request(server)
               .delete('/api/issues/testproject')
               .send({ _id: 'invalidid123' })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'error', 'could not delete'); // Adjusted to match expected error
                    assert.propertyVal(res.body, '_id', 'invalidid123');
                    done();
               });
     });

     // New test: DELETE request with non-existent _id
     test('DELETE request with non-existent _id', function (done) {
          chai.request(server)
               .delete('/api/issues/testproject')
               .send({ _id: '507f1f77bcf86cd799439011' }) // Assuming this is a non-existent _id
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'error', 'could not delete');
                    done();
               });
     });

     // Additional Tests
     test('GET request for issues with multiple query parameters', function (done) {
          chai.request(server)
               .get('/api/issues/testproject')
               .query({ open: true, created_by: 'User1', assigned_to: 'User2' })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                         assert.propertyVal(issue, 'open', true);
                         assert.propertyVal(issue, 'created_by', 'User1');
                         assert.propertyVal(issue, 'assigned_to', 'User2');
                    });
                    done();
               });
     });

     test('POST request with empty status_text', function (done) {
          chai.request(server)
               .post('/api/issues/testproject')
               .send({
                    issue_title: 'New Issue without Status',
                    issue_text: 'Details about the issue',
                    created_by: 'User1'
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'status_text', ''); // status_text should be empty string
                    done();
               });
     });

     /*      test('PUT request with open field to change status', function (done) {
               chai.request(server)
                    .put('/api/issues/testproject')
                    .send({
                         _id: testIssueId,
                         open: false
                    })
                    .end((err, res) => {
                         assert.equal(res.status, 200);
                         assert.isObject(res.body);
                         assert.propertyVal(res.body, 'result', 'successfully updated');
                         assert.propertyVal(res.body, '_id', testIssueId);
                         done();
                    });
          }); */

     test('PUT request with updated created_by field', function (done) {
          chai.request(server)
               .put('/api/issues/testproject')
               .send({
                    _id: testIssueId,
                    created_by: 'NewUser'
               })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.propertyVal(res.body, 'result', 'successfully updated');
                    assert.propertyVal(res.body, '_id', testIssueId);
                    done();
               });
     });

});
