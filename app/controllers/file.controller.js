var stream = require('stream');
var await = require('await')

//const db = require('../config/db.config.js');
 
//const db = {};
const knex = require('knex');
const db = knex(
  {
      client: 'pg',
      connection: {
          host: 'ec2-184-73-25-2.compute-1.amazonaws.com',
          user: 'icohhpaxgwxryx',
          password: '2768331444d523baadc9f51401aea3e343c519a052851429b8f25c10481e5740',
          database: 'desjo7vusbeeqk',
		   
  ssl: {
    rejectUnauthorized: false
  }
      },
  }
);
const File = db.files;
const Artists2 = db.tests;

// exports.uploadFile = (req, res) => {
// 	console.log(req.artistpicker);
// 	File.create({
// 		type: req.file.mimetype,
// 		name: req.file.originalname,
// 		data: req.file.buffer,	
// 		artistId:req.artistId
// 	}).then(file => {
// 		console.log(file);

// 		const result = {
// 			status: "ok",
// 			filename: req.file.originalname,
// 			message: "Upload Successfully...!",
// 			downloadUrl: "http://localhost:8080/api/file/" + file.dataValues.id,
// 		}

// 		res.json(result);
// 	}).catch(err => {
// 		console.log(err);

// 		const result = {
// 			status: "error",
// 			error: err
// 		}
// 		res.json(result);
// 	});
// }



exports.uploadFile = (req, res) => {
//	const { filename, mimetype, size } = req.file;
   // const filepath = req.file.path;
	const type= req.file.mimetype;
	const name= req.file.originalname;
	const data=req.file.buffer;
	const caligformid=req.body.caligformpicker;
	const artistId=req.body.artistpicker;
	//console.log(req.body.caligformpicker);
	if(caligformid && artistId && artistId>0 && caligformid>0 && type.indexOf('image/') > -1){
	db
	.insert({
		type,
		name,
		data,
		artistId,
		caligformid
	})
	.into('files')
	.then(file => {
				console.log(file);
		
				const result = {
					status: "ok",
					filename: req.file.originalname,
					message: "Upload Successfully...!",
					//downloadUrl: "http://localhost:8080/api/file/" + file.dataValues.id,
				}
		
				res.json(result);
			}).catch(err => {
				console.log(err);
		
				const result = {
					status: "error",
					error: err
				}
				res.json(result);
			});
		}
		else{

			console.log('no select option');
		
				const result = {
					status: "error select option",
					message: "مقادیر ورودی صحیح نمی باشند"
					
				}
				res.json(result);
		}
		// const result = {
		// 	status: "ok",
		// 	filename: req.file.originalname,
		// 	message: "Upload Successfully...!",
		// 	downloadUrl: "http://localhost:8080/api/file/" + file.dataValues.id,
		// }
		// res.json(result);
}

exports.uploadMultipleFiles = async (req, res) => {
	const messages = [];
		
	for (const file of req.files) {
		const uploadfile = await File.create({
								type: file.mimetype,
								name: file.originalname,
								data: file.buffer,
								//artisId:1//req.artisId
							});

        // It will now wait for above Promise to be fulfilled and show the proper details
        console.log(uploadfile);

	    if (!uploadfile){
			const result = {
				status: "fail",
				filename: file.originalname,				
				message: "Can NOT upload Successfully",
			}

			messages.push(result);
		} else {
			const result = {
				status: "ok",
				filename: file.originalname,
				message: "Upload Successfully..!",
				downloadUrl: "http://localhost:8080/api/file/" + uploadfile.dataValues.id,
			}

			messages.push(result);
		}
	}

	return res.json(messages);
}

// exports.listAllFiles = (req, res) => {
// 	File.findAll({attributes: ['id', 'name']}).then(files => {

// 		const fileInfo = [];

// 		console.log(files);
	  
// 		for(let i=0; i<files.length; i++){
// 			fileInfo.push({
// 				filename: files[i].name,
// 				url: "http://localhost:8080/api/file/" + files[i].dataValues.id
// 			})
// 		}

// 	    res.json(fileInfo);
// 	}).catch(err => {
// 		console.log(err);
// 		res.json({msg: 'Error', detail: err});
// 	});
// }

exports.listAllFiles = (req, res) => {
	
	
		return db
		  .select("*")
		  .from("files").
		//   .then(rows => rows).then(data => {
		// 	res.send(data);
		//   });
		then(files => {

					const fileInfo = [];
			
					console.log(files);
				  
					for(let i=0; i<files.length; i++){
						fileInfo.push({
							id:files[i].id,
							name: files[i].name,
							type: files[i].type,
							//data: files[i].data,
							artistid: files[i].artistid,
							caligformid: files[i].caligformid
							//url: "http://localhost:8080/api/file/" + files[i].dataValues.id
						})
					}
			
				    res.json(fileInfo);
				}).catch(err => {
					console.log(err);
					res.json({msg: 'Error', detail: err});
				});
	 

}


exports.listAllcaligform = (req, res) => {
	
	
	return db
	  .select("*")
	  .from("caligform").
	//   .then(rows => rows).then(data => {
	// 	res.send(data);
	//   });
	then(files => {

				const fileInfo = [];
		
				console.log(files);
			  
				for(let i=0; i<files.length; i++){
					fileInfo.push({
						id:files[i].id,
						name: files[i].name,
			
						//url: "http://localhost:8080/api/file/" + files[i].dataValues.id
					})
				}
		
				res.json(fileInfo);
			}).catch(err => {
				console.log(err);
				res.json({msg: 'Error', detail: err});
			});
 

}

exports.downloadFile = (req, res) => {
	console.log(req.params.id);
	db
	.select("*")
	.from("files").where("id", req.params.id)
	.first().then(file => {
		var fileContents = Buffer.from(file.data, "base64");
		var readStream = new stream.PassThrough();
		readStream.end(fileContents);
		
		res.set('Content-disposition', 'attachment; filename=' + file.name);
		res.set('Content-Type', file.type);

		readStream.pipe(res);
	}).catch(err => {
		console.log(err);
		res.json({msg: 'Error', detail: err});
	});
}


exports.listAllArtists = (req, res) => {

	// pool.query(
	// 	'SELECT * FROM Poet',
	   
	// 	(error, results) => {
	// 	  if (error) {
	// 		throw error;
	// 	  }
	// 	  console.log(results);
		
	// 	  return res.send({ error: false, data: results, message: req.params});
	// 	}
	//   );


	return db
	  .select("*")
	  .from("artists").
	//   .then(rows => rows).then(data => {
	// 	res.send(data);
	//   });
	then(files => {

				const fileInfo = [];
				console.log(files);
				for(let i=0; i<files.length; i++){
					fileInfo.push({
					id:	files[i].id,
						name:files[i].name
						,lifetime:files[i].lifetime
					})
				}
		
				res.json(fileInfo);
			}).catch(err => {
				console.log(err);
				res.json({msg: 'Error', detail: err});
			});
 

	// Artists2.findAll({attributes: ['id', 'name']}).then(artists1 => {

	// 	const fileInfo = [];

	// 	//console.log(files);
	  
	// 	for(let i=0; i<artists1.length; i++){
	// 		fileInfo.push({
	// 		id:	artists1[i].id,
	// 			name:artists1[i].name
	// 		})
	// 	}
	// 	console.log(fileInfo);
	//     res.json(fileInfo);
	// }).catch(err => {
	// 	console.log(err);
	// 	res.json({msg: 'Error', detail: err});
	// });
}