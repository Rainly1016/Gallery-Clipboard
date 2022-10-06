let MM_TO_PIXEL_RATIO = 0.264583333;
let table;
let imagesizes = [];
let IMG = [];
let imgsize;
let regexp = /(\-|\+)?\d+(\.\d+)?/g;
let floatDebug = /[\u4e00-\u9fa5|\。|\．]/g;
let frameTypeSelector = {
	maxF: /\版|(水彩)|\年|(连环)|\漫|\宣|\墨/g,
	minF: /\漆|\油/g,
	noneF: /(雕塑)|\影/g,
}
let index = 0;

let mainTableRow;
let workBlocks;

let fontsizeSlider;
let fontSize;
let font = 'HYQiHeiX1-55W';


function preload() {
	table = loadTable('data/黄河实验.csv', 'csv', 'header');
}

function CreateElements(work, img) {
	let workUnit = createDiv();
	workUnit.class('work-unit');
	workUnit.parent(workBlocks);

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
	img.elt.alt = work.title;
	img.elt.title = work.index;
	img.class('img-maxFrame');
	switch (work.frame) {
		case "maxF": img.class('img-maxFrame');
			break;
		case "minF": img.class('img-minFrame');
			break;
		case "midF": img.class('img-midFrame');
			break;
		case "autoF": img.class('img-autoFrame');
			break;
		case "noneF": img.class('img-noneFrame');
			break;
	}
	let infoblock = createDiv();
	infoblock.class('info-block');
	infoblock.parent(workContent);

	let info = createP();
	info.class('info');
	info.parent(infoblock);
	let infowidth = max((work.width + mm(15)), mm(200));
	info.style('width', `${infowidth}px`);
	let number = createSpan(work.number + " ");
	let author = createSpan(work.author);
	let title = createSpan("<br>" + work.title + " - ");
	let size = createSpan(work.size + "  ");
	number.class('info-number');
	author.class('info-author');
	title.class('info-title');
	size.class('info-size');
	number.parent(info);
	author.parent(info);
	title.parent(info);
	size.parent(info);
}

function CreateObject(img) {

	let originSize = {};
	originSize.width = float(img.elt.naturalWidth);
	originSize.height = float(img.elt.naturalHeight);

	let work = {};
	work.index = index;
	work.number = table.getString(index, 0);
	work.title = table.getString(index, 1);
	work.author = table.getString(index, 2);
	work.size = table.getString(index, 3);
	work.size = work.size.replace(floatDebug, ".");
	work.type = table.getString(index, 4);
	for (let p in frameTypeSelector) {
		if (frameTypeSelector[p].test(work.type)) {
			work.frame = p;
			break;
		}
		else work.frame = 'midF';
	}

	let targetsize = work.size.match(regexp);
	if (targetsize) {
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
		work.width = mm(100);
		work.height = mm(100);
		work.frame = 'autoF';
	}
	index++;
	//console.log(work.type);
    try{
		if(work.frame == 'autoF') throw `作品${index}尺寸缺失`;
		if(work.number == "") throw `作品${index}编号缺失`;
	} 
	catch(err){
		alert(err);
	}

	CreateElements(work, img);
	if (index < table.rows.length) {
		loadImg();
	}
}

function setup() {
	noCanvas();
	loadImg();

  let controlersRow = document.getElementById('controlers-row');
	workBlocks = document.getElementById('workblocks');

	let printButton = createButton('储存当前页面');
	printButton.parent(controlersRow);
	printButton.mousePressed(savePDF);
	printButton.class('button');
	printButton.id('button-save');

	let fontButton = createButton('更改字体');
	fontButton.parent(controlersRow);
	fontButton.mouseClicked(changeFont);
	fontButton.class('button');
	fontButton.id('button-font');

	let sliderContainer = createDiv();
	sliderContainer.parent(controlersRow);
	sliderContainer.id('slider-container');

	let silderDescription = createP('更改字体大小');
	silderDescription.parent(sliderContainer);
	silderDescription.id('silder-description');

	fontsizeSlider = createSlider(10, 120, 40);
	fontsizeSlider.parent(silderDescription);
	fontsizeSlider.class('slider');

	// let addWorkContainer = createDiv();
	// addWorkContainer.parent(controlersRow);
	// addWorkContainer.id('add-work-container');

	// let addWork = createP('增加作品');
	// addWork.parent(addWorkContainer);
	// addWork.id('add-work');

	let logo = createP('Super Thumbnail Generator');
	logo.parent(controlersRow);
	logo.id('logo');
}

function loadImg() {
	let src = `data/image/黄河实验_21203_image${nf(index+1, 3, 0)}.png`;
	//let src = `data/image/黄河实验_21203_image${nf(180+index, 3, 0)}.png`;

		let img = createImg(src, '`image${index}`', '',
			(img) => CreateObject(img));
}

function draw() {
	fontSize = `${fontsizeSlider.value()}pt`;

	workBlocks.style.fontSize = fontSize;
	workBlocks.style.fontFamily = font;
	//console.log(font);
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
