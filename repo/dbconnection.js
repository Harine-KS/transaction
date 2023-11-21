const {Pool}=require('pg')
const pool=new Pool({
    user:"postgres",
    host:'localhost',
    database:"postgres",
    password:'hari6122',
    port:5432
})
module.exports=pool