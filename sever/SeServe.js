const express = require('express');
const clc = require('cli-color');
const multiparty = require('multiparty');
const EventEmitter = require('events');
// const exStatic = require("express-static");
var pg = require('pg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { Buffer } = require('buffer');
const {stat} = require('fs').promises
// const {baseData} = require('./static/data/baseData.js')
// const {account} = require('./static/data/account.js')
const bodyParser = require('body-parser')
const json = express.json({type: '*/json'});
// 存储读取路径
const STATIC_FILES = path.resolve(__dirname, './static/files');
const STATIC_TEMPORARY = path.resolve(__dirname, './static/temp');
const STATIC_BASEDATA = path.resolve(__dirname, './static/data/baseData.js');
const server = express();
const PORT = "3001"
const LOCALHOST=`192.168.190.198:${PORT}`
// 使后台能获取到json数据
server.use(json);
server.use(bodyParser.urlencoded({ extended: false }));
// 跨域
server.use(cors());
server.use(express.static(__dirname+'/dist'))

server.get('/home', (req, res) => {
	res.redirect('/')
    // res.send('hi,express.');
});
server.get('/alter', (req, res) => {
	res.redirect('/')
    // res.send('hi,express.');
});
server.get('/login', (req, res) => {
	res.redirect('/')
    // res.send('hi,express.');
});
server.post('/delete', (req, res) => {
	// fs.rmdir()
	// console.log(req.body)
	let deleteList=req.body
	deleteList.forEach(el=>{
		
		if(fs.existsSync("./static/files/"+el+".mp4")){
			fs.unlinkSync("./static/files/"+el+".mp4")
		}
		if(fs.existsSync("./static/files/"+el+".pdf")){
			fs.unlinkSync("./static/files/"+el+".pdf")
		}
		// console.log(el)
	})
    res.send();
});
server.get('/loginps', (req, res) => {
	// console.log(req.query)   //get获取参数用query,会揉合params参数与quer参数y 请求时为params,post配合插件并用body，请求时为data
	let {email,password}=req.query
	// console.log(account)
	let {account}=require('./static/data/account.js')
	let result = account.find((el) => {
	        return (
	          el.email === email && el.password === password
	        );
	      });
	res.json(result);
	
});
server.get('/basedata', (req, res) => {
	// console.log({baseData})
	
	// let {baseData} = require('./static/data/baseData.js')
	
	fs.readFile('./static/data/baseData.txt',{flag:'r'},function(error,data){
	    let baseData= JSON.parse(data.toString())
		res.json({baseData});
	});
	// console.log("数据已返回")
});
server.post("/update",(req,res)=>{
	// let basedatafile =fs.openSync(STATIC_BASEDATA,"w")
	// let data="let data ="+JSON.stringify(req.body.basedata)+"\r\n module.exports.baseData = data"
	// fs.writeSync(basedatafile,data)
	// fs.close(basedatafile)
	
	
	let bb =fs.openSync('./static/data/baseData.txt',"w")
	fs.writeSync(bb,JSON.stringify(req.body.basedata))
	fs.close(bb)
	
	// console.log(req.body.basedata)
	res.end()
})

server.post('/upload', (req, res) => {

    const multipart = new multiparty.Form();
    const myEmitter = new EventEmitter();

    const formData = {
        filename: undefined,
        hash: undefined,
        chunk: undefined,
    }

    let isFieldOk = false, isFileOk = false;

    multipart.parse(req, function (err, fields, files) {
        formData.filename = fields['filename'][0];
        formData.hash = fields['hash'][0];

        isFieldOk = true;
        myEmitter.emit('start');
    });

    multipart.on('file', function (name, file) {
        formData.chunk = file;
        isFileOk = true;
        myEmitter.emit('start');
    });

    myEmitter.on('start', function () {
        if (isFieldOk && isFileOk) {
            const { filename, hash, chunk } = formData;
            const dir = `${STATIC_TEMPORARY}/${filename}`;

            try {
                if (!fs.existsSync(dir)) fs.mkdirSync(dir);

                const buffer = fs.readFileSync(chunk.path);
                const ws = fs.createWriteStream(`${dir}/${hash}`);
                ws.write(buffer);
                ws.close();

                res.send(`${filename}-${hash} 切片上传成功`)
            } catch (error) {
                console.error(error);
            }

            isFieldOk = false;
            isFileOk = false;

        }
    });
});
server.get('/merge', async (req, res) => {
    const { filename } = req.query;
	// console.log(req.querys)
    try {
        let len = 0;
        const bufferList = fs.readdirSync(`${STATIC_TEMPORARY}/${filename}`).map(hash => {
            const buffer = fs.readFileSync(`${STATIC_TEMPORARY}/${filename}/${hash}`);
            len += buffer.length;
            return buffer;
        });

        const buffer = Buffer.concat(bufferList, len);
        const ws = fs.createWriteStream(`${STATIC_FILES}/${filename}`);
        ws.write(buffer);
        ws.close();

        res.send(`切片合并完成`);
		deleteFolder(STATIC_TEMPORARY)
    } catch (error) {
        console.error(error);
    }
})

function deleteFolder(filepath) {
    if (fs.existsSync(filepath)) {
		let ff
        fs.readdirSync(filepath).forEach(filename => {
            const fp = `${filepath}/${filename}`;
            if (fs.statSync(fp).isDirectory())
			 {
				 deleteFolder(fp);
				 fs.rmdirSync(fp);
			 }
            else fs.unlinkSync(fp);
        });
        // fs.rmdirSync(fp);
    }
}


server.get('/video', async function (req, res) {
	let range = req.headers['range']
	var videoName = req.query.name;
	// console.log(range)
	try{
		if (range) {
		    let stats = await stat('./static/files/'+videoName + '.mp4')
		    let r = range.match(/=(\d+)-(\d+)?/)
		    // console.log(range)
		    let start = parseInt(r[1], 10)
		    let end = r[2] ? parseInt(r[2], 10) : start + 1024 * 1024
		    if(end > stats.size -1) end = stats.size - 1
		    let header = {
		      'Content-Type': 'video/mp4',
		      'Content-Range': `bytes ${start} - ${end} / ${stats.size}`,
		      'Content-Length': end - start + 1,
		      'Accept-Ranges': 'bytes'
		    }
		    res.writeHead(206,header)
			
			let rs= fs.createReadStream('./static/files/'+videoName + '.mp4',{start:start,end:end,autoClose:true})
			rs.pipe(res)
			rs.on('end', function () {
			    res.end();
			    // console.log('end call');
			});
		  } else {  
		    let rs=fs.createReadStream('./static/files/'+videoName + '.mp4',{ autoClose: true})
			rs.pipe(res)
			rs.on('end', function () {
			    res.end();
			    // console.log('end call');
			});
		  }
	}catch(e){
		res.end()
		// console.log(e)
	}
   
});
// 获取PDF
 server.get('/pdf', function (req, res) {
     var time = new Date();
     var pdfName = req.query.name;
 	// var pdfName='./1.pdf'
     // console.log("-------点击查询下载" + time.getFullYear() + "/" + time.getMonth() + "/" + time.getDate() + "/" + time.getHours() + "/" + time.getMinutes() + "/" + time.getSeconds() + "-------");
     if(fs.existsSync('./static/files/'+pdfName + '.pdf')){
     	res.writeHead(200,{'Content-type':'application/pdf'});
     	var rs = fs.createReadStream('./static/files/'+pdfName + '.pdf');
     	rs.pipe(res);
     }else{
     	res.end()
     }
	 
  
     rs.on('end', function () {
         res.end();
         // console.log('end call');
     });
 });
// var server = app.listen(8081, function () {
 
//     var host = server.address().address;
//     var port = server.address().port;
 
//     console.log("应用实例，访问地址为 http://%s:%s", host, port);
 
// });

server.listen(PORT, _ => {
    console.log(clc.bold.blue.underline(`http://localhost:${PORT}/`));
    console.log(clc.bold.blue.underline(`http://127.0.0.1:${PORT}/`));
	console.log(clc.bold.blue.underline(LOCALHOST));
});