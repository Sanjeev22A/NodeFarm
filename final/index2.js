//Core modules
const fs=require("fs");
const http=require("http");
const url=require('url');

//3rd party modules
const  slugify=require("slugify");

//Own modules
const replaceTemplate=require('./modules/replaceTemplate');
const { toUnicode } = require("punycode");


//Variables

const localHost='127.0.0.1';


///First use of slugify

console.log(slugify('Fresh Avocados',{
    replacement:'_',
    lower:false,
    remove:'r',
}));



///First we read our file we use synchronous as this segment is executed only once

const data=fs.readFileSync(`${__dirname}/dev-data/data.JSON`,'utf-8');
const dataObj=JSON.parse(data);
///Reading the templates(use sync as loaded only once)

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.HTML`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.HTML`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.HTML`,'utf-8');


///Creating slugs for all data objects

const slugs=dataObj.map(el=>slugify(el.productName,{
    replacement:'_',
    lower:true}));
//console.log(slugs)

const slugDict=slugs.reduce((acc,slug,index)=>{
    acc[slug]=index;
    return acc;
},{});

console.log(slugDict);

//const productData=JSON.parse(data);

const server=http.createServer((req,res)=>{
         //ends the server response line
    //const pathname=req.url;
    //const { query,pathName }=url.parse(req.url,true);
    //console.log(pathname);
    //console.log(url.parse(pathname,true).query.id);
   ///Overview page

   const { query,pathname }=url.parse(req.url,true);
   console.log(query);
    //console.log(query,' ',pathname)
    if(pathname==='/overview' || pathname==='/'){
        res.writeHead(200,{
            'Content-type':'text/html'
        })
        const cardsHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('');
        //console.log(cardsHtml);
        const output=tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
        res.end(output);
    }



    ///Product page
    else if(pathname==='/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });
      
        const product=dataObj[query.id];
        
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
        
    }


    ///API
    else if(pathname==='/api'){
       res.writeHead(200,{
        'Content-type':'application/JSON'
       });
       res.end(dataObj);
    }


    ////Not found
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'made-up-header':'hello world'
        }); ///headers are set and sent before anyresponse
        res.end("<h1>Page not found!</h1>");
    }
});

server.listen(8000,localHost,()=>{
    console.log("Server has been started\n listening to request on port 8000");
});

