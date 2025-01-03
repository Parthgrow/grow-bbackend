const express = require('express') ; 

const db = require('./firebase')
const cors = require('cors')
const {nanoid} = require('nanoid')





const app = express() ; 
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send({
        message : "hello world"
    })
})

app.post("/reflect",async(req, res)=>{
    const reqData = req.body ;  

    const id = nanoid() ; 

    const docRef = db.collection("reflections").doc(id)
    console.log("This is value of data from frontend",reqData)


    try{

        await docRef.set(reqData
)
        console.log("new entry created with the id ", id)

    }
    catch(error)
    {
        console.log("There is an error at port/reflect ", error)
    }


    res.json({
        message : "This all seems to work"
    })
})

app.listen(5173, ()=>{

    console.log("server started on port 5173")

})