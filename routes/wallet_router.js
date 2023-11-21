const express = require('express')
const router = express.Router();
var serviceRouter = require('../service/transaction_service')

router.post('/wallet/:walletId/transaction', async (req, res) => {

    await serviceRouter.transactionMethod(req, res)
})
router.delete('/wallet/:walletId/transaction/:transactionId', async (req, res) => {
    await serviceRouter.deleteTransactionMethod(req, res)
})
router.get('/wallet/:walletId',async(req,res)=>{
await serviceRouter.currentBalanceMethod(req,res)
}
)
router.get('/wallet/:walletId/transaction',async(req,res)=>{
    await serviceRouter.viewPassbookMethod(req,res)
})
module.exports = router