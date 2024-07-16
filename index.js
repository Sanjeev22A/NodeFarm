const fs=require("fs");


console.log("Reading data");
const textOut=fs.readFileSync('./txt/input.txt','utf-8');
console.log(textOut);
//const hello="hello world";
//console.log(hello);


const textIn=`This is what we know about avocado : ${textOut}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textIn);




///Asynchronous reading and writing
console.log("Asynchronous operation");
fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
    if(err){
        console.log(err);
    }
    else{
        fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data2)=>{
            if(err){
                console.log("Error in reading inner file:"+err);
            }
            else{
                console.log("Inner file data : "+data2);
                fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(data3);
                        fs.writeFile("./txt/final.txt",`${data2} \n ${data3}`,"utf-8",(err)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Final file written");
                            }
                        })
                    }
                })
            }
        })
    }
});