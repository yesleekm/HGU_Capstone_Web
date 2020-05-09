var net_server = require('net');

var net_port = 9090;
var express_port = 7070;

//test variable
var c_num_tmp = 3;
var c_log_tmp = 6;

//3 var for client information
var client_ip = new Array();
var client_num = 0;
var client_log = 0;
var socket = new Array();
//var take_pic = new Boolean(false);

var server = net_server.createServer(function(client) {

	    client_num++;
	    client_ip[client_num-1] = client.remoteAddress;
	    socket[client_num-1] = client;

	    console.log('[%d] Client connection', client_num);
	    console.log('   local = %s:%s', client.localAddress, client.localPort);
	    console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);

	    //client.setTimeout(500);
	    client.setEncoding('utf8');

	    client.on('data', function(data) {
		            console.log('Received data from client on port %d: %s', client.remotePort, data.toString());

		            //writeData(client, 'Sending: ' + data.toString());
		            //console.log('  Bytes sent: ' + client.bytesWritten);
		        });

	    client.on('end', function() {
		            console.log('Client disconnected');
		        });

	    client.on('error', function(err) {
		            console.log('Socket Error: ', JSON.stringify(err));
		        });

	    client.on('timeout', function() {
		            console.log('Socket Timed out');
		        });
});

server.listen(net_port, function() {
	    //console.log('Server listening: ' + JSON.stringify(server.address()));
	    console.log('Server socket listening, Port: ' + net_port);

	    server.on('close', function(){
		            console.log('Server Terminated');
		        });
	    server.on('error', function(err){
		            console.log('Server Error: ', JSON.stringify(err));
		        });
});

function writeData(socket, data){
	  var success = socket.write(data);
	  if (!success){
		      console.log("Client Send Fail");
		    }
}

//---add expreess
var express = require('express');
var ejs = require('ejs');
//var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');		//to get 'source' folder

//클릭한 이미지
var image_name = "";
var image_list;


//view engine을 ejs 파일 형태로 설정
app.set("view engine", "ejs");
app.set('views', __dirname+'/views');
//source 내의 이미지를 제공하기 위함
app.use(express.static(__dirname));


app.listen(express_port, function(){
	console.log('Express Start, Port: ' + express_port);
});

app.get('/', function(req, res){
	fs.readdir('source', function(err, files) {
		if(err){
			console.log(err);
		}
		//console.log(files.join('\n'));
		res.render('main', {
			img_list: files,
			c_num: c_num_tmp,
			c_log: c_log_tmp,
			c_ip: client_ip,
			img_name: image_name
		});
	});
});

app.get('/image/:filename', function(req, res){
	console.log(req.params.filename);
	image_name = req.params.filename;
	res.redirect('/');
});

app.get('/camera', function(req, res){
	if(client_num!=0){
		console.log("Button is clicked!");
		for(var i = 0; i < client_num; i++){
			writeData(socket[i], "take a picture!!");
		}
	}
	else{
		console.log("There is no client!");
	}
});
