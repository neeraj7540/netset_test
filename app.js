#!/usr/bin/env nodejs
var dotenv = require('dotenv');
dotenv.config();
const config = require('./config');
const restify = require('restify');
const mongoose = require('mongoose');
const restifyPlugins = require('restify-plugins');
const rjwt = require('restify-jwt-community');

var https_options = {
	name: config.name,
	version: config.version

};


const router = restify.createServer(https_options);
require('./routes')(router);

router.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
router.use(restifyPlugins.acceptParser(router.acceptable));
router.use(restifyPlugins.queryParser({ mapParams: true }));
router.use(restifyPlugins.fullResponse());

router.listen(config.port, () => {
	mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, );
   const db = mongoose.connection;
   db.on('error', (err) => {
	process.exit(1);
	});

	db.once('open', () => {
		// console.log('Server is listening on port ', config.port);
	});
});