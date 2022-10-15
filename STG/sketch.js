//blocks
let workBlocks;
let checkBlock;
let exampleBlock;
//controlers
let fontsizeSlider;
let fontSize;
let font = 'HYQiHeiX1-55W';
//let checkboxs = [];
let projectTitle;
//data
let index = 0;
let exampleTable;
let exampleIMG;
let table = [];
let headers = [];
let MM_TO_PIXEL_RATIO = 0.264583333;
let imagesizes = [];
let IMGs = [];
let imgsize;
let frameSize = -1;
//regular expressions 
let regexp = /(\-|\+)?\d+(\.\d+)?/g;
let floatDebug = /[\u4e00-\u9fa5|\。|\．]/g;
let frameTypeSelector = {
	'30': /\版|(水彩)|\年|(连环)|\漫|\宣|\墨/g,
	'10': /\漆|\油/g,
	'0': /(雕塑)|\影/g,
}
let porpertySelector = {
	number: /\序|\号/g,
	title: /\品|\名/g,
	artist: /(作者)|(艺术家)/g,
	size: /(尺寸)/g,
	type: /\材|\类/g,
	frame: /\框/g,
}
//booleans
let displayPreferences = [];
let receiveCSV = false;
let receiveIMG = false;
let conformPreference = false;
let ready = false;
let displayLabel = {};
let framebyType = false;
let showingExample = true;

//加载示例table
function preload() {
	exampleTable = loadTable('data/example/Contemplator.csv', 'csv');
}

//加载示例图片
function loadExampleImg() {
	let img = createImg('data/example/Contemplator.jpg', 'example', '',
		(img) => example(img));
	// let img = createImg(src, '`image${index}`', '',
	// 	(img) => CreateObject(img));
}

//示例block
function example(img) {
	let row1 = exampleTable.getRow(0);
	let row2 = exampleTable.getRow(1);
	let obj = [];
	for (let c = 0; c < exampleTable.getColumnCount(); c++) {
		headers.push(row1.getString(c));
		obj.push(row2.getString(c));
		displayPreferences[c] = true;
	}
	displayPreferences[0] = false;
	table.push(obj);
	IMGs.push(img);
  sortPorperties();
	CreateObject(img);
}

function CreateObject(img) {

	//图片像素
	let originSize = {};
	originSize.width = float(img.elt.naturalWidth);
	originSize.height = float(img.elt.naturalHeight);

	//获取影响图片元素的属性
	let work = {};
	work.index = index;
	work.id = 'normal';

	//获取尺寸
	if (displayLabel.hasOwnProperty('size')) {
		let c = int(displayLabel.size);
		work.size = table[index][c];
		work.size = work.size.replace(floatDebug, ".");

		let targetsize = work.size.match(regexp);
		if (targetsize) {
			if (targetsize.length > 1) {
				targetsize = targetsize.map(x => float(x));
				//对长宽高由大到小排序
				targetsize.sort((a, b) => (b - a));
				if (originSize.width >= originSize.height) {
					work.width = mm(targetsize[0]);
					work.height = mm(targetsize[1]);
				} else {
					work.width = mm(targetsize[1]);
					work.height = mm(targetsize[0]);
				}
			} else {
				work.width = mm(targetsize[0]);
				work.height = mm(targetsize[0]);
			}
		}
	} else {
		work.width = mm(100);
		work.height = mm(100);
		work.frame = 20;
		work.id = 'lacksize';
	}

	//获取画框
	if (displayLabel.hasOwnProperty('frame')) {
		let f = int(displayLabel.frame);
		frameSize = table[index][f].match(regexp);
		work.frame = float(frameSize[0]);
	} else if (!framebyType && frameSize > -1) {
		let frameSizeNumber = frameSize.match(regexp);
		if (frameSizeNumber) {
			frameSizeNumber = frameSizeNumber.map(x => float(x));
			work.frame = frameSizeNumber[0];
		} else work.frame = 20;
	} else if (framebyType && displayLabel.hasOwnProperty('type')) {
		let t = int(displayLabel.type);
		let type = table[index][t];
		for (let p in frameTypeSelector) {
			if (frameTypeSelector[p].test(type)) {
				work.frame = float(p);
				break;
			}
			else work.frame = 20;
		}
	} else work.frame = 20;

	//保存需要显示的文字信息
	let infoElement = [];
	for (let i = 0; i < headers.length; i++) {
		if (displayPreferences[i]) infoElement.push(table[index][i]);
	}

	//缺失尺寸时的提醒
	try {
		if (work.id == 'lacksize') throw `作品${index}尺寸缺失`;
	}
	catch (err) {
		alert(err);
	}

	CreateElements(work, infoElement, img);

	//加载下一个
	if(!showingExample){
		index++;
		if (index < IMGs.length) {
			//首先画出下一个图片，function待修改
			loadImg();
		}
	}
	
}

function CreateElements(work, infoElement, img) {
	let workUnit = createDiv();
	if(showingExample) workUnit.class('example-block');
	else workUnit.class('work-unit');
	workUnit.parent(exampleBlock);

	let workContent = createDiv();
	workContent.class('work-content');
	workContent.parent(workUnit);

	let imageblock = createDiv();
	imageblock.class('img-block');
	imageblock.parent(workContent);
	imageblock.mousePressed(deletElement);
	img.parent(imageblock);

	img.elt.width = work.width;
	img.elt.height = work.height;
	img.elt.alt = join(infoElement, '');
	img.elt.title = work.index;
	if (work.id === 'normal') img.class('img-normal');
	else img.class('img-lacksize');
	img.style('padding', `${work.frame}mm`);


	let infoblock = createDiv();
	infoblock.class('info-block');
	infoblock.parent(workContent);

	let info = createP();
	info.class('info');
	info.parent(infoblock);
	let infowidth = max((work.width + mm(15)), mm(200));
	info.style('width', `${infowidth}px`);

	for (let i = 0; i < infoElement.length; i++) {
		let s = createSpan(infoElement[i] + " ");
		s.parent(info);
	}

}

// function CreateElements(work, img) {
// 	let workUnit = createDiv();
// 	workUnit.class('work-unit');
// 	workUnit.parent(workBlocks);

// 	let workContent = createDiv();
// 	workContent.class('work-content');
// 	workContent.parent(workUnit);

// 	let imageblock = createDiv();
// 	imageblock.class('img-block');
// 	imageblock.parent(workContent);
// 	imageblock.mousePressed(deletElement);
// 	img.parent(imageblock);

// 	img.elt.width = work.width;
// 	img.elt.height = work.height;
// 	img.elt.alt = work.title;
// 	img.elt.title = work.index;
// 	img.class('img-maxFrame');
// 	switch (work.frame) {
// 		case "maxF": img.class('img-maxFrame');
// 			break;
// 		case "minF": img.class('img-minFrame');
// 			break;
// 		case "midF": img.class('img-midFrame');
// 			break;
// 		case "autoF": img.class('img-autoFrame');
// 			break;
// 		case "noneF": img.class('img-noneFrame');
// 			break;
// 	}
// 	let infoblock = createDiv();
// 	infoblock.class('info-block');
// 	infoblock.parent(workContent);

// 	let info = createP();
// 	info.class('info');
// 	info.parent(infoblock);
// 	let infowidth = max((work.width + mm(15)), mm(200));
// 	info.style('width', `${infowidth}px`);
// 	let number = createSpan(work.number + " ");
// 	let author = createSpan(work.author);
// 	let title = createSpan("<br>" + work.title + " - ");
// 	let size = createSpan(work.size + "  ");
// 	number.class('info-number');
// 	author.class('info-author');
// 	title.class('info-title');
// 	size.class('info-size');
// 	number.parent(info);
// 	author.parent(info);
// 	title.parent(info);
// 	size.parent(info);
// }

// function CreateObject(img) {

// 	let originSize = {};
// 	originSize.width = float(img.elt.naturalWidth);
// 	originSize.height = float(img.elt.naturalHeight);

// 	let work = {};
// 	work.index = index;
// 	work.number = table.getString(index, 0);
// 	work.title = table.getString(index, 1);
// 	work.author = table.getString(index, 2);
// 	work.size = table.getString(index, 3);
// 	work.size = work.size.replace(floatDebug, ".");
// 	work.type = table.getString(index, 4);
// 	for (let p in frameTypeSelector) {
// 		if (frameTypeSelector[p].test(work.type)) {
// 			work.frame = p;
// 			break;
// 		}
// 		else work.frame = 'midF';
// 	}

// 	let targetsize = work.size.match(regexp);
// 	if (targetsize) {
// 		if (targetsize.length > 1) {
// 			targetsize = targetsize.map(x => float(x));
// 			//对长宽高由大到小排序
// 			targetsize.sort((a, b) => (b - a));
// 			if (originSize.width >= originSize.height) {
// 				work.width = mm(targetsize[0]);
// 				work.height = mm(targetsize[1]);
// 			} else {
// 				work.width = mm(targetsize[1]);
// 				work.height = mm(targetsize[0]);
// 			}
// 		} else {
// 			work.width = mm(targetsize[0]);
// 			work.height = mm(targetsize[0]);
// 		}
// 	} else {
// 		work.width = mm(100);
// 		work.height = mm(100);
// 		work.frame = 'autoF';
// 	}
// 	index++;

// 	try {
// 		if (work.frame == 'autoF') throw `作品${index}尺寸缺失`;
// 		if (work.number == "") throw `作品${index}编号缺失`;
// 	}
// 	catch (err) {
// 		alert(err);
// 	}

// 	CreateElements(work, img);
// 	if (index < table.rows.length) {
// 		loadImg();
// 	}
// }

function removeExtraElement(e) {
	for (let i of e) {
		if (i.nodeType === 3) i.remove();
	}
	return e;
}

function setup() {
	noCanvas();

	//控制面板
	let ul = selectAll('ul');

	//设置文件传输按钮
	let inputli = ul[0].child();
	inputli = removeExtraElement(inputli);

	let inputIMG = createFileInput(handleIMG, [MULTIPLY]);
	inputIMG.class('inputfile');
	inputIMG.id('IMGfile');
	inputIMG.parent(inputli[0]);
	inputIMG.attribute('name', 'IMGfile');
	let inputIMGlabel = createElement('label', '上传图片');
	inputIMGlabel.parent(inputli[0]);
	inputIMGlabel.attribute('for', 'IMGfile');

	let inputCSV = createFileInput(handleFile);
	inputCSV.class('inputfile');
	inputCSV.id('CSVfile');
	inputCSV.parent(inputli[1]);
	inputCSV.attribute('name', 'CSVfile');
	let inputCSVlabel = createElement('label', '上传CSV文件');
	inputCSVlabel.parent(inputli[1]);
	inputCSVlabel.attribute('for', 'CSVfile');



	projectTitle = createP('Gallery Clipboard');
	projectTitle.parent(inputli[2]);
	projectTitle.id('logo');


	//设置排版控制按钮
	let controlli = ul[1].child();
	controlli = removeExtraElement(controlli);
	let printButton = createButton('储存当前页面');
	printButton.parent(controlli[0]);
	printButton.mousePressed(savePDF);
	printButton.class('button');
	printButton.id('button-save');

	let fontButton = createButton('更改字体');
	fontButton.parent(controlli[1]);
	fontButton.mouseClicked(changeFont);
	fontButton.class('button');
	fontButton.id('button-font');

	let silderDescription = createP('更改字体大小');
	silderDescription.parent(controlli[2]);

	fontsizeSlider = createSlider(10, 120, 40);
	fontsizeSlider.parent(controlli[3]);
	fontsizeSlider.class('slider');

	//设置作品区域
	workBlocks = select('#workblocks');
  

	//示例作品
	exampleBlock = createDiv();
	workBlocks.child(exampleBlock);
	exampleBlock.class('example');
	loadExampleImg();
	//loadImg();
}


//对作品属性对应列进行记录，返回displayLabel
function sortPorperties() {
	for (let i = 0; i < headers.length; i++) {
		for (let p in porpertySelector) {
			if (porpertySelector[p].test(headers[i])) {
				displayLabel[p] = i;
				break;
			}
		}
	}
	if (!displayLabel.hasOwnProperty('size')) {
		selectSize();
		console.log('finding size');
	}

	if(showingExample){
		framebyType = true;
	} else if (!displayLabel.hasOwnProperty('frame')) {
		if (!displayLabel.hasOwnProperty('type')) {
			let s = '没有找到作品“材质”或“画框”信息，请输入作品边框尺寸（单位为厘米）';
			customizeFrame(s);
			console.log('customizing frame');
		} else {
			let c = confirm('没有找到“画框”信息，是否按照“材质”属性设定边框尺寸？');
			if (c) framebyType = true;
			else {
				let s = '请输入作品边框尺寸';
				customizeFrame(s);
			}
		}
	}
}

//sortPorperties没有找到材质所在列的情况下，询问用户画框类型
function customizeFrame(s) {
	let cusFrame = prompt(s, '0cm');
	if (select != null) {
		frameSize = cusFrame;
	} else frameSize = 0;
	console.log(frameSize);
}

//sortPorperties没有找到尺寸所在列的情况下，使用的尺寸筛选功能
function selectSize() {
	let sample = 10;
	if (table.length < 10) sample = table.length;
	//寻找尺寸；
	let sizeCandidate = [];
	let numberCandidate = [];
	for (let i = 0; i < sample; i++) {
		let line = table[i];
		for (let j = 0; j < headers.length; j++) {
			if (regexp.test(line[j])) {
				let existingNumber = line[j].match(regexp);
				if (existingNumber.length !== 1) sizeCandidate.push(j);
			}
		}
	}
	if (sizeCandidate.length > 1) {
		let sizeCol = Search(sizeCandidate);
		displayLabel['size'] = int(sizeCol[0]);
	} else {
		alert('表格中不包括尺寸信息，将按照默认尺寸显示');
		console.log('did not find any size');
	}
}

//查询数组中重复最多的数
function Search(arr) {
	let obj = {};
	for (let i = 0; i < arr.length; i++) {
		let arr2 = Object.keys(obj);
		if (arr2.indexOf(String(arr[i])) != -1) obj[arr[i]]++;
		else obj[arr[i]] = 1;
	}
	let max = 0;
	let ans = [];
	for (let i in obj) {
		if (obj[i] > max) {
			max = obj[i];
			ans.length = 0;
			ans.push(i);
		} else if (obj[i] == max) {
			ans.push(i);
		}
	}
	return ans;
}

//选择需要显示的属性
function checkDisplayPreferences() {
	checkBlock = createDiv();
	checkBlock.class('checkBlock')
	checkBlock.parent(workBlocks);
	let statement = createP('请选择需要显示的文字信息:');
	statement.parent(checkBlock);
	statement.style('margin-left', '2mm');
	statement.style('font-size', '12pt');

	for (let i = 0; i < headers.length; i++) {
		displayPreferences[i] = true;
		let checkboxs = createCheckbox(headers[i], false);
		checkboxs.parent(checkBlock);
		checkboxs.class('checkbox');

		checkboxs.changed(() => {
			if (checkboxs.checked()) displayPreferences[i] = true;
			else displayPreferences[i] = false;
		});
	}
	let check = createButton('确定');
	check.class('button');
	check.id('checkbutton');
	check.parent(workBlocks);
	check.mousePressed(() => conformPreference = true);
}

//处理CSV文件
function handleFile(file) {

	//判断格式
	if (file.type === 'text') {
		//清空示例;
		headers = null;
		table = [];
		displayPreferences = [];
		//更换标题
		let t = split(file.name, '.');
		projectTitle.html(t[0]);

		//load headers
		let txt = file.data;
		let lines = txt.split("\n");
		lines = lines.map(x => trim(x));
		headers = lines[0].split(",");

		//根据header确定需要显示的选项
		//checkDisplayPreferences();

		//load table;
		for (let i = 1; i < lines.length; i++) {
			let obj = [];
			let currentline = lines[i].split(",");
			for (var j = 0; j < headers.length; j++) {
				obj.push(currentline[j]);
			}
			table.push(obj);
		}
		receiveCSV = true;

	} else {
		alert("格式错误，请上传csv文件");
	}
}
function handleIMG(img) {
	if (img.type === "image") {
		IMGs = [];
		IMGs.push(img.data);
		receiveIMG = true;
	} else {
		alert("格式错误，请上传图片");
	}
}



function draw() {
	fontSize = `${fontsizeSlider.value()}pt`;

	workBlocks.style.fontSize = fontSize;
	workBlocks.style.fontFamily = font;
	//console.log(font);

	if (receiveCSV && receiveIMG) {
    exampleBlock.remove();
		exampleBlock = createDiv();
		workBlocks.child(exampleBlock);
		exampleBlock.class('example');
		let img = createImg(IMGs[0], `${index}`,'', (img)=>CreateObject(img));
		checkDisplayPreferences();
		sortPorperties();
		receiveIMG = false;
		receiveCSV = false;
	}
}

function savePDF() {
	window.print();
}

function changeFont() {
	if (font === 'STHeiti') {
		font = 'HYQiHeiX1-55W';
		alert("字体将更改为汉仪旗黑，保存pdf时文字可能会转曲");
	} else {
		font = 'STHeiti';
		alert("字体将更改为华文黑体");
	}
}

//font-family: "HYQiHeiX1-55W","STHeiti","SimHei"; 


function deletElement() {
	let object = document.elementFromPoint(mouseX, mouseY);
	let parent = object.parentNode.parentNode;
	let delet = confirm('是否删除作品：' + object.alt);
	if (delet) {
		parent.remove();
	} else {
	}
}


function mm(wantedMM) {
	return float(wantedMM / MM_TO_PIXEL_RATIO);
}
