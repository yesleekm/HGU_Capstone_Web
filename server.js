/*
200518 Leekyungmin
HGU 20-2 capstone web
*/

//1-1) 상태 변수
var isConnected= false;
var isAdmin = false;
//1-2) 지정 변수
var express_port = 7070;
var path_src_deap = 'source/';
var path_src_ROI = 'data/src_ROI/';
var path_data_ROI = 'data/ROI.txt';
var path_data_people = 'data/people.txt';
var path_data_camera = 'data/camera.txt';
//1-3) 일반 변수
var client_num = 0;
var client_log = 0;
var recent_image_name = "";
var recent_image_num = -1;
var curr_image_name = "";
var curr_image_camera = 0;
var curr_image_num = -1;
var setting_bnum = new Array();;
var setting_plist = new Array();;
var num_people = -1;
var num_camera = 0;
var num_src_deap = new Array();
var num_src_ROI = 0;
var num_curr_ROI = 1;
var list_src_deap = new Array(20);
for(var i =0 ; i<20; i++){
	list_src_deap[i] = new Array();
}
var list_src_ROI;
var list_data_people = new Array();
var list_data_camera = new Array();
//1-4) 일반 함수
function findNumber(list, filename){
	// list - 0:전체 / 홀수:파일명 / 짝수:사람수
	for(var i =0 ; i<list.length; i++){
		if(list[i]==filename){
			return list[i+1];
		}
	}
	console.log(list.length);
	return -1;
}

//2-1) 모듈 동작 변수 선언 (express, ejs, fs)
var express = require('express');
var ejs = require('ejs');
var app = express();
var fs = require('fs');
//2-2) 엔진 설정 (view engine - ejs + static path 설정 + express listen)
app.set("view engine", "ejs");
app.set('views', __dirname+'/views');
app.use(express.static(__dirname));				//source 내의 이미지를 제공하기 위함
app.listen(express_port, function(){
	console.log('Express Start, Port: ' + express_port);
});

//3) web root page 설정
app.get('/', function(req, res){
	num_camera = fs.readdirSync(path_src_deap).length;
	for(var i = 0; i<num_camera; i++){
		list_src_deap[i] = fs.readdirSync(path_src_deap+String(i+1));
		num_src_deap[i] = list_src_deap[i].length;
	}
	list_src_ROI = fs.readdirSync(path_src_ROI);
	num_src_ROI = list_src_ROI.length;
	isConnected = (num_src_ROI!=0)? true:false;
	//3-1) Waiting
	if(!isConnected){
		res.render('waiting');
	}
	//3-2) Admin mode
	else if(!isAdmin){
    res.render('admin', {
			path: path_src_ROI,
      img_list: list_src_ROI,
			num_curr: num_curr_ROI,
			num_img: num_src_ROI
    });
	}
	//3-3) Basic mode
	else{
		list_data_people = fs.readFileSync(path_data_people, 'utf8').toString().split("\n");
		num_people = list_data_people[0];
		list_data_camera = fs.readFileSync(path_data_camera, 'utf8').toString().split("\n");
		res.render('basic', {
			path: path_src_deap,
			p_num: num_people,
			img_list: list_src_deap,
			c_num: num_camera,
			c_log: num_src_deap,
			c_ip: list_data_camera,
			curr_img_name: curr_image_name,
			curr_img_camera: curr_image_camera,
			curr_img_num: curr_image_num,
			recent_img_name: recent_image_name,
			recent_img_num: recent_image_num
		});
	}
});

//4-1) (RESTAPI) basic: filename
app.get('/image/:camera/:filepath', function(req, res){
	curr_image_camera = req.params.camera;
	curr_image_name = req.params.filepath;
	recent_image_name = list_src_deap[curr_image_camera-1][num_src_deap[curr_image_camera-1]-1];
	curr_image_num = findNumber(list_data_people, curr_image_name);
	recent_image_num = findNumber(list_data_people , recent_image_name);
	res.redirect('/');
});
//4-2) (RESTAPI) admin: go next image
app.get('/setting/next', function(req, res){
	console.log("next");
	setting_bnum[num_curr_ROI-1] = req.query.b_num;
	setting_plist[num_curr_ROI-1] = JSON.parse(req.query.p_list);
	num_curr_ROI++;
	res.redirect('/');
});
//4-3) (RESTAPI) admin: go previous image
app.get('/setting/prev', function(req, res){
	console.log("prev");
	setting_bnum[num_curr_ROI-1] = req.query.b_num;
	setting_plist[num_curr_ROI-1] = JSON.parse(req.query.p_list);
	num_curr_ROI--;
	res.redirect('/');
});
//4-4) (RESTAPI) admin: finish mode
app.get('/setting/finish', function(req, res){
	console.log("finish");
	setting_bnum[num_curr_ROI-1] = req.query.b_num;
	setting_plist[num_curr_ROI-1] = JSON.parse(req.query.p_list);
	isAdmin=true;
	fs.writeFileSync(path_data_ROI, "number of ROI\n"+setting_bnum+"\n\ndata of ROI\n", 'utf8');
	for(var i =0 ; i< num_src_ROI; i++){
		fs.appendFileSync(path_data_ROI, setting_plist[i] + '\n', 'utf8');
	}
	res.redirect('/');
});
