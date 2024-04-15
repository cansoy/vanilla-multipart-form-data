
const express=require("express")
const fs =require("fs")
const path =require("path")
const server=express()
const mongoose =require("mongoose")
const userSchema =require("./models/userSchema")
const dotenv=require("dotenv").config()
const uri = process.env.DB_PATH
const PORT=process.env.PORT || 3000
mongoose.connect(uri)
    .then(res=>{
        console.log("db-connection:",res.connection.readyState)
    })
    .catch(err=>{
        console.log("db-connection-error:",err.message)
    })


server.use(express.static(path.join(__dirname,"./public")))
server.set("view engine","ejs")
server.set("views","./views")
server.set("etag",false)

server.get("/",(req,res)=>{
    res.render("home")
})

server.post("/posted",(req,res)=>{
    let data =[]
    req.on("data",(chunk)=>{
        data.push(chunk)
    })
    req.on("end",()=>{
        const buffer=Buffer.concat(data)
        const body=buffer.toString("binary") // encoding type is important to conevrt it again ! For Multipart data always use binary encoding!
        // *********************************************************************************************************************
        // FOR IMAGE!
        const uploadedImage =body.split("Content-Type: image/png")[1].trim().split("------")[0].trim()
        const imageBuffer =Buffer.from(uploadedImage,"binary")
        console.log("upload-imageBuffer:",imageBuffer,imageBuffer.length)
        fs.writeFile("./uploads/image.png",imageBuffer,(err=>{
            console.log("image-is-okey")
        }))
        // FOR IMAGE!
        // *********************************************************************************************************************
        // FOR VIDEO!
        const uploadedVideo =body.split("Content-Type: video/mp4")[1].trim().split("------")[0].trim()
        const videoBuffer =Buffer.from(uploadedVideo,"binary")
        console.log("upload-videoBuffer:",videoBuffer,videoBuffer.length)
        fs.writeFile("./uploads/video.mp4",videoBuffer,(err=>{
            console.log("video-is-okey")
        }))
        // FOR VIDEO!
        // *********************************************************************************************************************
        // FOR PDF!
        const uploadedPdf =body.split("Content-Type: application/pdf")[1].trim().split("------")[0].trim()
        const pdfBuffer =Buffer.from(uploadedPdf,"binary")
        console.log("upload-pdfBuffer:",pdfBuffer,pdfBuffer.length)
        fs.writeFile("./uploads/pdf.pdf",pdfBuffer,(err=>{
            console.log("pdf-is-okey")
        }))
        // FOR PDF!
        // *********************************************************************************************************************
        // FOR TEXT!
        const uploadedtext =body.split("Content-Type: text/plain")[1].trim().split("------")[0].trim()
        const textBuffer =Buffer.from(uploadedtext,"binary")
        console.log("upload-textBuffer:",textBuffer,textBuffer.length)
        fs.writeFile("./uploads/text.txt",textBuffer,(err=>{
            console.log("txt-is-okey")
        }))
        // FOR TEXT!
        // *********************************************************************************************************************
        const UserSchema=new userSchema({
            name:"name-muhammed",
            surname:"surname-cansoy",
            city:"city-ankara",
            image:imageBuffer,
            video:videoBuffer,
            pdf:pdfBuffer,
            text:textBuffer
        })
        UserSchema.save()
            .then(res=>{
                console.log("saved !")
            })
            .catch(err=>{
                console.log(err.message)
            })
    })
    res.send("file-uploaded")
})

server.get("/:content",(req,res)=>{
    const content =req.params.content
    // IMAGE
    if (content=="image") {
        res.set("content-type","image/png")
        fs.readFile("./uploads/image.png",(err,data)=>{
            console.log("image-buffer:",data.length)
           return res.send(data)
        })
    }
    // VIDEO
    if (content=="video") {
        res.set("content-type","video/mp4")
        fs.readFile("./uploads/video.mp4",(err,data)=>{
            console.log("video-buffer:",data.length)
           return res.send(data)
        })
    }
    // PDF
    if (content=="pdf") {
        res.set("content-type","application/pdf")
        fs.readFile("./uploads/pdf.pdf",(err,data)=>{
            console.log("pdf-buffer:",data.length)
           return res.send(data)
        })
    }
    // TEXT
    if (content=="text") {
        res.set("content-type","text/plain")
        fs.readFile("./uploads/text.txt",(err,data)=>{
            console.log("txt-buffer:",data.length)
           return res.send(data)
        })
    }
})

server.get("/db/:content",async(req,res)=>{
    const content=req.params.content
    const user=await userSchema.findOne({name:"name-muhammed"})
    const {image,video,pdf,text}=user
    const imageBuffer=Buffer.from(image)
    const videoBuffer=Buffer.from(video)
    const pdfBuffer =Buffer.from(pdf)
    const textBuffer =Buffer.from(text)
    if (content=="image") {
        res.setHeader("content-type","image/png")
        res.setHeader("x-content-type","my-custom-image")
        // console.log(imageBuffer)
        res.send(imageBuffer)
    }
    if (content=="video") {
        res.setHeader("content-type","video/mp4")
        res.setHeader("x-content-type","my-custom-video")
        // console.log(videoBuffer)
        return res.send(videoBuffer)
    }
    if (content=="pdf") {
        res.setHeader("content-type","application/pdf")
        res.setHeader("x-content-type","my-custom-pdf")
        // console.log(pdfBuffer)
        return res.send(pdfBuffer)
    }
    if (content=="text") {
        res.setHeader("content-type","text/plain")
        res.setHeader("x-content-type","my-custom-text")
        // console.log(textBuffer)
        return res.send(textBuffer)
    }
})

server.get("/dw/:content",async(req,res)=>{
    const content=req.params.content
    const user=await userSchema.findOne({name:"name-muhammed"})
    const {image,video,pdf,text}=user
    const imageBuffer=Buffer.from(image)
    const videoBuffer=Buffer.from(video)
    const pdfBuffer =Buffer.from(pdf)
    const textBuffer =Buffer.from(text)
    if (content=="image") {
        // to download data image
        // res.set("content-type","image/png") //ıf you dont specify content-type to download express set content-type:application/octet-stream
        res.set("content-disposition",'attachment; filename="image.png"')
        return res.send(imageBuffer)

    }
    if (content=="video") {
        // to download data video
        // res.set("content-type","video/mp4") //ıf you dont specify content-type to download express set content-type:application/octet-stream
        res.set("content-disposition",'attachment; filename="video.mp4"')
        return res.send(videoBuffer)
    }
    if (content=="pdf") {
        // to download data pdf
        // res.set("content-type","application/pdf") //ıf you dont specify content-type to download express set content-type:application/octet-stream
        res.set("content-disposition",'attachment; filename="pdf.pdf"')
        return res.send(pdfBuffer)
    }
    if (content=="text") {
        // to download data pdf
        // res.set("content-type","text/plain") //ıf you dont specify content-type to download express set content-type:application/octet-stream
        res.set("content-disposition",'attachment; filename="text.txt"')
        return res.send(textBuffer)
    }
})

server.listen(PORT,()=>console.log("***************************************",PORT))