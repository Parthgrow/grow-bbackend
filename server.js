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
    let flag = true ; 
    let returnData = {
        dayYesterday : "", 
        dayBeforeYesterday : ""
    }

    if( username &&  day){

        // const dayYesterday = day - 1  ; 
        // const dayBeforeYesterday = day - 2 ; 

        

        // if(day === 1)
        // {
        //     res.send(returnData)
            

        // }

        // if(day === 2)
        // {
        //     const dayYesterdayDoc = await db.collection('reflections')
        //     .where("name", "==", username)
        //     .where('testDay', "==", day - 1 )
        //     .get()

        //     if(!dayYesterdayDoc.empty)
        //     {
        //         let value = ""
        //         let ctr = 0 

        //         dayYesterdayDoc.forEach((doc)=>{
        //             const docData = doc.date() ; 
        //             console.log("The doc data is ", docData.commitment)
        //             value = docData.commitment 
        //             ctr++ ; 
        //         })

        //         if(ctr === 1)
        //         {
        //             returnData.dayYesterday = value ; 
        //             res.send(returnData)
        //         }
        //         else
        //         {
        //             console.log("The value is not set because there are multiple values ")
        //             res.send({
        //                 message : "There is something wrong with your code "
        //             })
        //         }

        //     }
        //     else
        //     {
        //         console.log("There is no such doc found in the database")
        //         res.send({
        //             message : "There is something wrong with your code"
        //         })
        //     }
            
        // }

        

        

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
                    flag = false ; 
                    
                }
            }
            else
            {
                console.log("The query you have used doesn't have a corresponding field in the database")
                flag = false ; 
                
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
                        flag = false 
                        
                    }
                }
                else
                {
                    console.log("The query you have used doesn't have a corresponding field in the database")
                    flag = false 
                }



            

            

            

            


        }
        catch(error){
            console.log("there is an error at backend at (post) /get-two-pointer-status ", error)
            flag = false 
        }

        





        

    }
    else
    {
        flag = false 

    }

    if(flag === false)
    {
        res.send({
            message : "There is something wrong", 
            results : false , 
            data : returnData 
        })
    }
    else
    {
        res.send({
            message : "Everything is right", 
            results : true,
            data : returnData 
           
        })
    }

    

})

app.get("/get-reflections", async(req, res)=>{

    try{

  

    const reflectionsSnapshot = await db.collection('reflections').orderBy('testDay').get()

    let reflectionsData = []

    
    reflectionsSnapshot.docs.forEach((ref)=>{
        let newValue = {
            id : ref.id, 
            ...ref.data()
        }
        reflectionsData.push(newValue)
    })
    res.send({
        message : "Everything is cool", 
        data : reflectionsData 
    })

}
catch(error)
{
    console.log("There is an error on backend side in (get) /get-reflections", error)
    res.send({
        message : "There is something wrong at (get) /get-reflections"
    })
}

    
})

app.listen(5173, ()=>{

    console.log("server started on port 5173")

})