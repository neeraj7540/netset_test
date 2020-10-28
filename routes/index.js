var express = require('express');
var router = express.Router();
const User = require('../Models/user');
const Chat = require('../Models/chat');
const mongoose = require('mongoose');
const isPDF = require("is-pdf-valid");
const fs = require("fs");
const path = require('path');
var multer  = require('multer')
const ObjectId = require('mongodb').ObjectID;

// var upload = multer({ dest: 'uploads/' })

//For upload the image only pdf format
router.use('/uploads', express.static(path.join(__dirname, '/uploads')));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const FileFilter = (req, file, cb) => {
	// reject a file
	if (!file.originalname.match(/\.(pdf)$/)) {
  
	  cb(new Error("Send valid File Type i.e (pdf)"));
	} else {
	  cb(null, true);
	}
  };
const upload = multer({ storage: storage, fileFilter: FileFilter });
module.exports = function (router) {

	// For Create User
	router.post('/createUser', function (req, res, next) {
		let name = req.body.name;
		let number = req.body.number;
		// let file = req.body.file
		var regexp = /^\S*$/; 
		if(!name.match(regexp)){
			res.send(400, 'Please remove the white space');
		}
		// console.log("test",typeof phone)
		let change = ("" + number).replace(/,/g, '.')
		number = change.replace(/(\d{3})(\d{3})(\d{4})/,"($1)$2-$3"); // (012)345-6789
        		console.log("test", number,name)

		User.create({ "name": name,"number": number}).then(response => {
			console.log("resposs",response)
			res.send(200, 'Data Added Successfully');
		 	return next();
		}).catch(error => {
			return error;
		});
	});


	//For Chat User
	router.post('/chat',async  function (req, res, next) {
		var chatDetail = {};
		const { message, userId, chatId} = req.body;
		if(chatId) {
			let chatDetail = await Chat.findOne({_id: chatId})
			if(chatDetail){
				let newItem = {
					message: req.body.chatDetail[0].message,
					userId:  req.body.chatDetail[0].userId
				}
				console.log("xxxxxxx",newItem)

				chatDetail.chatDetail.push(newItem)
			}
      		Chat.updateMany({ _id: chatId},{$set: chatDetail}, {new: true}).then(resp => {
				res.send(200, 'Data Added Successfully');
			  }).catch(error => {
				  console.log("errpr")
			  })
		}else {
			console.log("nnnnnn",req.body)
			var a = new Chat(req.body);
			a.save(function(error) {
				if(error) 
				{
					console.log("errrrr",error)
				}
				res.send(200, 'Data Added Successfully');
			});
		}
	});


	// For Get Chat by Id
	router.get('/chat/:id',async  function (req, res, next) {
		const id = ObjectId(req.params.id);
		Chat.find({_id: id}).then(resp => {
			res.send(200, resp);
		}).catch(error => {
			console.log("errrrr",error)
		})
	});

	// For Delete Chat
	router.post('/deletechat',async  function (req, res, next) {
		const id = ObjectId(req.body.id);
		Chat.remove({_id: id}).then(resp => {
			res.send(200, 'Data Deleted Successfully');
		}).catch(error => {
			console.log("errrrr",error)
		})
	});


	router.post('/upload', upload.single('image'), (req, res, next) => {
		try {
			res.send(200, 'Data Added Successfully');
		} catch (error) {
			console.error(error);
		}
	});
};

