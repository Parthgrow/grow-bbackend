const express = require('express') ; 

require('dotenv').config()

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


// post request for /reflect 

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

app.post("/get-two-pointer-status", async(req, res)=>{

    // console.log("This the value of req : ", req)
    
    const reqData = await req.body ; 
    console.log("This is the value of reqData ", reqData)
    const {username, day} = reqData ; 
    console.log("The value of username is ", username)
    console.log("The value of day is ", day)

    if( username &&  day){

        const dayYesterday = day - 1  ; 
        const dayBeforeYesterday = day - 2 ; 

        let returnData = {
            dayYesterday : "", 
            dayBeforeYesterday : ""
        }

        

        try{

            console.log("I was here")

            const dayYesterdayDoc = await db.collection('reflections')
            .where("name", "==", username)
            .where('testDay', "==", day - 1)
            .get()


            if(!dayYesterdayDoc.empty)
            {
                let value = ""
                let ctr = 0 ; 
                dayYesterdayDoc.forEach((doc)=>{
                    const docData = doc.data() ; 
                    console.log("THe doc data is ", docData.commitment)
                    value = docData.commitment 
                    ctr++ ; 
                    

                })
                if(ctr === 1)
                {
                    returnData.dayYesterday = value ; 
                }
                else
                {
                    console.log("The value is not set because there are multiple values ")
                }
            }
            else
            {
                console.log("The query you have used doesn't have a corresponding field in the database")
            }

            const dayBeforeYesterdayDoc = await db.collection('reflections')
            .where("name", "==", username)
            .where('testDay', "==", day - 2)
            .get()

            if(!dayBeforeYesterdayDoc.empty)
                {
                    let value = ""
                    let ctr = 0 ; 
                    dayBeforeYesterdayDoc.forEach((doc)=>{
                        const docData = doc.data() ; 
                        console.log("THe doc data is ", docData.commitment)
                        value = docData.commitment 
                        ctr++ ; 
                        
    
                    })
                    if(ctr === 1)
                    {
                        returnData.dayBeforeYesterday = value ; 
                    }
                    else
                    {
                        console.log("The value is not set because there are multiple values ")
                    }
                }
                else
                {
                    console.log("The query you have used doesn't have a corresponding field in the database")
                }



            

            

            res.send(returnData)

            


        }
        catch(error){
            console.log("there is an error at backend at (post) /get-two-pointer-status ", error)
        }

        





        

    }
    else
    {
        res.send({
            message : "There has been something wrong"
        })

    }

    

})

app.listen(5173, ()=>{

    console.log("server started on port 5173")

})