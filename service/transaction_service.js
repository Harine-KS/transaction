const dbquery = require('../repo/dbconnection')
async function transactionMethod(req, res) {
    const { transactionType, amount } = req.body
    const { walletId } = req.params
    

    let balance;
    await dbquery.query('BEGIN')
    try {
        const userAmount = await dbquery.query(`select amount from user_account where wallet_id=$1`, [walletId])
        
        if (userAmount.rowCount > 0) {
            if (transactionType == 'CREDIT') {
                balance = userAmount.rows[0].amount + amount;
            }
            else if (transactionType == 'DEBIT') {
                balance = userAmount.rows[0].amount - amount;
            }

            

            const data = await dbquery.query(` INSERT INTO transaction(wallet_id, type, amount) VALUES($1, $2, $3) RETURNING transaction_id`,
                [walletId, transactionType, amount]);
            
            if (data.rowCount > 0) {
                const userData = await dbquery.query(`Update user_account set amount=$2 where wallet_id=$1  RETURNING wallet_id`, [walletId, balance])
                
            }
            await dbquery.query('COMMIT')
            res.json({ transactionId: data.rows[0].transaction_id, message: "OK" })
        }
        else {
            res.json({ message: "No data Found" })
        }
    }
    catch (error) {
        await dbquery.query('ROLLBACK')
        res.json({ error: error.message })
        

    }
}
async function deleteTransactionMethod(req, res) {
    const { transactionId, walletId } = req.params
    
    try {
        await dbquery.query("BEGIN")
        const transactionData = await dbquery.query('select * from transaction where transaction_id=$1', [transactionId])
        const totalBalance = await dbquery.query(`select amount from user_account where wallet_id=$1`, [walletId])
        
        
        if (totalBalance.rowCount > 0) {
            let balance;
            if (transactionData.rows[0].type == 'CREDIT') {
                balance = totalBalance.rows[0].amount - transactionData.rows[0].amount
            }
            else if (transactionData.rows[0].type == 'DEBIT') {
                balance = totalBalance.rows[0].amount + transactionData.rows[0].amount
            }
            
            // res.send({ 'message': "ok" })
            const userData = await dbquery.query(`update user_account set amount=$2 where wallet_id=$1 returning wallet_id`, [walletId, balance])
            
            if (userData.rowCount > 0) {
                const data = await dbquery.query(`delete from transaction where transaction_id=$1 Returning transaction_id`, [transactionId])
                
                if (data.rowCount > 0) {
                    await dbquery.query('COMMIT')
                    res.send({ "transactionId": transactionId, "status": 'Cancelled', "message": "ok" })
                }
            }
        } else {
            res.json({ message: "No data Found" })
        }
    }
    catch (error) {
        
        res.json({ error: error.message })
        await dbquery.query('ROLLBACK')
    }


}
async function currentBalanceMethod(req, res) {
    const { walletId } = req.params
    
    try {
        const currentBalance = await dbquery.query(`select * from user_account where wallet_id=$1`, [walletId])
        if (currentBalance.rowCount > 0) {
            res.json({ amount: currentBalance.rows[0].amount, message: "OK" })
        }else{
            res.json({message:"No data Found"})
        }
    }
    catch (error) {
        
        res.json({ error: error.message })
    }


}
async function viewPassbookMethod(req, res) {
    const { walletId } = req.params
    
    try {
        const viewPassbook = await dbquery.query(`select amount,type from transaction where wallet_id=$1`, [walletId]);
        
        if (viewPassbook.rows.length > 0) {
            res.json({
                transaction: viewPassbook.rows, message: "ok"
            })
        }
        else{
            res.json({message:"No data Found"})
        }
    }
    catch (error) {
        res.send({ error: "error" })
        
    }
}
module.exports = { transactionMethod, deleteTransactionMethod, currentBalanceMethod, viewPassbookMethod }