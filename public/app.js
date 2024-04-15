const image =document.querySelector("#image")
const video =document.querySelector("#video")
const imageBox=document.querySelector("#image-box")
const videoBox=document.querySelector("#video-box")

image.addEventListener("change",(e)=>{
    // image.files[0]=e.target.files[0]
    const imageFile =e.target.files[0]
    const fileReader =new FileReader()
    fileReader.readAsDataURL(imageFile)
    fileReader.onload=(e)=>{
        // e.target.result=fileReader.result
        const result=e.target.result
        imageBox.setAttribute("src",result)
    }
})
video.addEventListener("change",(e)=>{
    const videoFile =e.target.files[0]
    const fileReader=new FileReader()
    fileReader.readAsDataURL(videoFile)
    fileReader.onload=(e)=>{
        const result =e.target.result
        videoBox.setAttribute("autoplay",true)
        videoBox.setAttribute("controls",true)
        videoBox.setAttribute("src",result)
    }

})

