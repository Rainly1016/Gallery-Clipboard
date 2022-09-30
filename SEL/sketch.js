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

let maincanvas;
let mainTableRow;
let workBlocks;
let controlerBlocks;
let fontsizeControler;
let fontSize;
let font = 'STHeiti';


function preload() {
	table = loadTable('data/黄河实验.csv', 'csv', 'header');
}

function CreateElements(work, img) {
	let workblock = createDiv();
	workblock.class('mainblock');
	workblock.parent(workBlocks);
	workblock.mousePressed(deletElement);
	let imageblock = createDiv();
	imageblock.class('img-block');
	imageblock.parent(workblock);

	img.parent(imageblock);

	//img.class('img-thumbnail');
	img.elt.width = work.width;
	img.elt.height = work.height;
	console.log(img.elt.width);
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
	let infroblock = createDiv();
	infroblock.class('infro-block');
	infroblock.parent(workblock);

	let infro = createP();
	infro.class('infro');
	infro.parent(infroblock);
	let infrowidth = max((work.width + mm(15)), mm(200));
	infro.style('width', `${infrowidth}px`);
	let number = createSpan("#"+work.number + " ");
	let author = createSpan(work.author);
	let title = createSpan("<br>" + work.title + "   ");
	let size = createSpan(work.size + "  ");
	number.class('infro-number');
	author.class('infro-author');
	title.class('infro-title');
	size.class('infro-size');
	number.parent(infro);
	author.parent(infro);
	title.parent(infro);
	size.parent(infro);
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
		work.type = 'autoF';
	}
	index++;
	//console.log(work, index);
	CreateElements(work, img);
	if (index < table.rows.length) {
		loadImg();
	}
}

function setup() {
	noCanvas();
	loadImg();
  
	maincanvas = createDiv();
	maincanvas.id('maincanvas');
	mainTableRow = createDiv();
	mainTableRow.id('main-table-row');
	mainTableRow.parent(maincanvas);
	controlerBlocks = createDiv();
	controlerBlocks.id('controlerblock');
	controlerBlocks.parent(mainTableRow);
	workBlocks = createDiv();
	workBlocks.id('workblocks');
	workBlocks.parent(mainTableRow);
	let printButton = createButton('储存当前页面');
	printButton.parent(controlerBlocks);
	printButton.mousePressed(savePDF);
	printButton.class('button');

	let fontButton = createButton('更改字体');
	fontButton.parent(controlerBlocks);
	fontButton.mouseClicked(changeFont);
	fontButton.class('button');
	fontsizeControler = createSlider(10, 120, 40);
	controlerBlocks.child(fontsizeControler);

	fontsizeControler.style('width', '40mm');

}

function loadImg() {
	let src = `data/image/黄河实验_21203_image${nf(index + 1, 3, 0)}.png`;
	let img = createImg(src, '`image${index}`', '',
		(img) => CreateObject(img));
}

function draw() {
	fontSize = `${fontsizeControler.value()}pt`;

	workBlocks.style('font-size', fontSize);
	workBlocks.style('font-family', font);
	//console.log(font);
}

function savePDF() {
	window.print();

}

function changeFont() {
	font = 'HYQiHeiX1-55W';
	alert(font);
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