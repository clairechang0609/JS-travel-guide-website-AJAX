var data = [];
var select = document.querySelector('#select');
var intro = document.querySelector('#intro');
var title = document.querySelector('.title');
var btn = document.querySelectorAll('.btn');
var pagination = document.querySelector('.pagination');
var goDown = document.querySelector('.go-down');
var goTop = document.querySelector('.go-top');

var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
xhr.onload = function () {
    data = JSON.parse(xhr.responseText).result.records;
    selectOption(); //一開始載入選單
    changeSelection(data); //一開始載入全部景點
}

//select option
function selectOption() {
    //選取出高雄所有區
    var total = data.length;
    var zoneAll = [];
    for (var i = 0; i < total; i++) {
        var zone = data[i].Zone;
        zoneAll.push(zone);
    }
    var zoneList = Array.from(new Set(zoneAll)); //篩選重複的區

    //放進html
    var total = zoneList.length
    for (var i = 0; i < total; i++) {
        var option = document.createElement('option');
        option.textContent = zoneList[i];
        option.value = zoneList[i];
        select.appendChild(option);
    }
}

//顯示景點
function changeSelection(e) {
    var total = e.length;
    for (var i = 0; i < total; i++) {
        var introCard = document.createElement('li');
        introCard.classList.add('card');
        introCard.style.display = 'none';
        var pic = document.createElement('div');
        pic.classList.add('pic');
        pic.style.backgroundImage = 'url(' + e[i].Picture1 + ')';
        pic.innerHTML = '<div class="shadow"></div><h4>' + e[i].Name + '</h4><span>' + e[i].Zone + '</span>';
        introCard.appendChild(pic);
        var text = document.createElement('ul');
        var time = '<li><i class="fas fa-clock"></i> ' + e[i].Opentime + '</li>';
        var spot = '<li><i class="fas fa-map-marker-alt"></i> ' + e[i].Add + '</li>';
        var phone = '<li><i class="fas fa-mobile-alt"></i> ' + e[i].Tel + '</li>';
        var ticketInfo = e[i].Ticketinfo;
        if (ticketInfo == '') {
            var ticket = '<li><i class="fas fa-tag"></i> 免費參觀</li>';
        } else {
            var ticket = '<li><i class="fas fa-tag"></i> ' + e[i].Ticketinfo + '</li>';
        }
        text.innerHTML = time + spot + phone + ticket;
        introCard.appendChild(text);
        intro.appendChild(introCard);
    }
    var card = document.querySelectorAll('.card');
    if (card.length < 10) { //全部顯示
        pagination.style.display = 'none';
        for (var i = 0; i < card.length; i++) {
            card[i].style.display = 'block';
        }
    } else { //只顯示前10個景點
        pagination.style.display = 'flex';
        var string = '';
        for (i = 0; i < Math.ceil(card.length / 10); i++) {
            string += '<li><a href="#title" data-num="' + i + '" class="page">' + (i + 1) + '</a></li>';
        }
        var prev = '<li class="prev"><a href="#title" class="disable"> < prev </li>';
        var next = '<li class="next"><a href="#title" data-num="1"> next > </li>';
        pagination.innerHTML = prev + string + next;

        for (var i = 0; i < 10; i++) {
            card[i].style.display = 'block';
        }
        var page = document.querySelectorAll('.page');
        page[0].style.color = '#559AC8';
    }
}

//change option 改變內容
select.addEventListener('change', function (e) {
    intro.innerHTML = '';
    var selectdata = [];
    var total = data.length;
    title.textContent = e.target.value;
    for (var i = 0; i < total; i++) {
        if (e.target.value == data[i].Zone) {
            selectdata.push(data[i]);
        } else if (e.target.value == '所有區域') {
            selectdata = data;
        }
    }
    changeSelection(selectdata);
}, false);

//click btn 改變內容 & select也改變
var btnTotal = btn.length;
for (var i = 0; i < btnTotal; i++) {
    btn[i].addEventListener('click', function (e) {
        intro.innerHTML = '';
        var selectdata = [];
        var total = data.length;
        title.textContent = e.target.value;
        select.value = e.target.value;
        for (var i = 0; i < total; i++) {
            if (e.target.value == data[i].Zone) {
                selectdata.push(data[i]);
            }
        }
        changeSelection(selectdata);
    }, false)
}

//分頁選單，一頁10個景點
pagination.addEventListener('click', function (e) {
    var target = e.target.dataset.num;
    var targetnum = parseInt(target);
    var card = document.querySelectorAll('.card');
    var total = card.length;
    var page = document.querySelectorAll('.page');
    var prev = document.querySelector('.prev');
    var next = document.querySelector('.next');
    
    if (e.target.nodeName !== 'A') {
        return;
    } else {
        if (target == 0){ //第一頁關閉prev按鈕
            prev.innerHTML = '<a href="#title" class="disable"> < prev';
        } else {
            prev.innerHTML = '<a href="#title" data-num="' + ( targetnum - 1 ) + '"> < prev';
        }
        if (target == (Math.ceil(card.length / 10) - 1)){ //最後一頁關閉next按鈕
            next.innerHTML = '<a href="#title" class="disable"> next >';
        } else {
            next.innerHTML = '<a href="#title" data-num="' + ( targetnum + 1 ) + '"> next >';
        }

        for (var i = 0; i < total; i++) {
            card[i].style.display = 'none';
        }
        if ((target * 10 + 10) <= total) { //一頁10個景點，包含最後一頁
            for (var i = (target * 10); i < (target * 10 + 10); i++) {
                card[i].style.display = 'block';
            }
        } else { //最後一頁不滿10個景點
            for (var i = (target * 10); i < total; i++) {
                card[i].style.display = 'block';
            }
        }
        for (var i = 0; i < page.length; i++) {
            page[i].style.color = '#4A4A4A';
        }
        page[target].style.color = '#559AC8'; //選取到的頁面改成藍色標記
    }
}, false)

// 點擊滑到介紹區
goDown.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: title.offsetTop,
        behavior: 'smooth',
    });
})

// go top button
goTop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});