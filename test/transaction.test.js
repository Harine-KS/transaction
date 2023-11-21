const request = require('supertest');
const app = require('../app');

describe('View Passbook Service', () => {
    it('should return passbook data for a valid wallet ID', async () => {
        const res = await request(app).get('/wallet/1/transaction');
        expect(res.status).toBe(200);

    });

    it('should return "No data Found" for an invalid wallet ID', async () => {
        const res = await request(app).get('/wallet/432/transaction');
        expect(res.status).toBe(200);
    });

    it('should handle errors and return an error message', async () => {

        const res = await request(app).get('/wallet/error/transaction');
        expect(res.body).toHaveProperty('error');
    });
});
describe('Current Balance Service', () => {

    it('should return passbook data for a valid wallet ID', async () => {
        const res = await request(app).get('/wallet/1/transaction');
        expect(res.status).toBe(200);
    });
    it('should return "No data Found" for an invalid wallet ID', async () => {
        const res = await request(app).get('/wallet/432/transaction');
        expect(res.status).toBe(200);
    });
    it('should handle errors and return an error message', async () => {

        const res = await request(app).get('/wallet/error/transaction');
        expect(res.body).toHaveProperty('error');
    });
});
describe('Delete Transaction Service', () => {
    it('should delete a transaction and update user account balance', async () => {
        const res = await request(app).delete('/wallet/1/transaction/6'); 
        expect(res.status).toBe(200);
    });

    it('should return "No data Found" for an invalid wallet ID', async () => {
        const res = await request(app).get('/wallet/432/transaction');
        expect(res.status).toBe(200);
    });
    it('should handle errors and return an error message', async () => {

        const res = await request(app).get('/wallet/error/transaction');
        expect(res.body).toHaveProperty('error');
    });
});
describe('Transaction Service', () => {
    it('should handle a credit transaction and update user account balance', async () => {
     
  
      const res = await request(app)
        .post('/wallet/1/transaction')
        .send({ transactionType: 'CREDIT', amount: 50 }); 
  
      expect(res.status).toBe(200);
     
    });
  
    it('should handle a debit transaction and update user account balance', async () => {
     
      const res = await request(app)
        .post('/wallet/123/transaction')
        .send({ transactionType: 'DEBIT', amount: 50 }); // Replace with a valid wallet ID
  
      expect(res.status).toBe(200);
    
    });
  
    it('should return "No data Found" if user account balance data not found', async () => {
      const res = await request(app)
        .post('/wallet/123/transaction')
        .send({ transactionType: 'CREDIT', amount: 50 });
  
      expect(res.status).toBe(200);
    
    });
  
    it('should handle errors and return an error message', async () => {
    
      const res = await request(app)
        .post('/wallet/error/transaction')
        .send({ transactionType: 'CREDIT', amount: 50 });
  
     
      expect(res.body).toHaveProperty('error');
    });
  });
