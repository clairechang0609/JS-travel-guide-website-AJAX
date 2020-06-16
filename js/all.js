let data = [];
const select = document.querySelector('#select');
const hotzone = document.querySelector('.hotzone');
const intro = document.querySelector('#intro');
const title = document.querySelector('.title');
const btn = document.querySelectorAll('.btn');
const pagination = document.querySelector('.pagination');
const goDown = document.querySelector('.go-down');
const goTop = document.querySelector('.go-top');

const xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
xhr.onload = () => {
    data = JSON.parse(xhr.responseText).result.records;
    selectOption(); //一開始載入選單
    changeSelection(data); //一開始載入全部景點
}

//select option
let selectOption = () =>{
    //選取出高雄所有區
    let total = data.length;
    let zoneAll = [];
    for (let i = 0; i < total; i++) {
        let zone = data[i].Zone;
        zoneAll.push(zone);
    }
    let zoneList = Array.from(new Set(zoneAll)); //篩選重複的區

    //放進html
    let zonetotal = zoneList.length
    for (let i = 0; i < zonetotal; i++) {
        let option = document.createElement('option');
        option.textContent = zoneList[i];
        option.value = zoneList[i];
        select.appendChild(option);
    }
}

//顯示景點
let changeSelection = e => {
    let total = e.length;
    for (let i = 0; i < total; i++) {
        let introCard = document.createElement('li');
        introCard.classList.add('card');
        introCard.style.display = 'none';
        let ticketText = '';
        if (e[i].Ticketinfo === '') {
            ticketText = '免費參觀';
        } else {
            ticketText = e[i].Ticketinfo;
        }
        
        introCard.innerHTML = ` <div class="pic" style="background-image: url(${e[i].Picture1})">
                                    <div class="shadow"></div>
                                    <h4>${e[i].Name}</h4>
                                    <span>${e[i].Zone}</span>
                                </div>
                                <ul>
                                    <li><i class="fas fa-clock"></i> ${e[i].Opentime}</li>
                                    <li><i class="fas fa-map-marker-alt"></i> ${e[i].Add}</li>
                                    <li><i class="fas fa-mobile-alt"></i> ${e[i].Tel}'</li>
                                    <li><i class="fas fa-tag"></i> ${ticketText}</li>
                                </ul>` 
        intro.appendChild(introCard);
    }
    let card = document.querySelectorAll('.card');
    if (card.length < 10) { //全部顯示
        pagination.style.display = 'none';
        for (let i = 0; i < card.length; i++) {
            card[i].style.display = 'block';
        }
    } else { //只顯示前10個景點
        pagination.style.display = 'flex';
        let string = '';
        for (let i = 0; i < Math.ceil(card.length / 10); i++) {
            string += `<li><a href="#title" data-num="${i}" class="page">${i+1}</a></li>`;
        }
        let prev = `<li class="prev"><a href="#title" class="disable"> < prev </li>`;
        let next = `<li class="next"><a href="#title" data-num="1"> next > </li>`;
        pagination.innerHTML = prev + string + next;

        for (let i = 0; i < 10; i++) {
            card[i].style.display = 'block';
        }
        let page = document.querySelectorAll('.page');
        page[0].style.color = '#559AC8';
    }
}

//change option 改變內容
select.addEventListener('change', e => {
    intro.innerHTML = '';
    let selectdata = [];
    let total = data.length;
    title.textContent = e.target.value;
    for (let i = 0; i < total; i++) {
        if (e.target.value === data[i].Zone) {
            selectdata.push(data[i]);
        } else if (e.target.value === '所有區域') {
            selectdata = data;
        }
    }
    changeSelection(selectdata);
}, false);

//click btn 改變內容 & select也改變
hotzone.addEventListener('click', e => {
    let target = e.target.nodeName;
    if (target !== 'INPUT'){
        return 
    } else {
        intro.innerHTML = '';
        let selectdata = [];
        let total = data.length;
        title.textContent = e.target.value; //標題替換
        select.value = e.target.value; //select value替換
        for (let i = 0; i < total; i++) {
            if (e.target.value === data[i].Zone) {
                selectdata.push(data[i]);
            }
        }
        changeSelection(selectdata);
    }
})

//分頁選單，一頁10個景點
pagination.addEventListener('click', e => {
    const target = e.target.dataset.num;
    const targetnum = parseInt(target);
    const card = document.querySelectorAll('.card');
    const total = card.length;
    const page = document.querySelectorAll('.page');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    
    if (e.target.nodeName !== 'A') {
        return;
    } else {
        if (target == 0){ //第一頁關閉prev按鈕
            prev.innerHTML = `<a href="#title" class="disable"> < prev`;
        } else {
            prev.innerHTML = `<a href="#title" data-num="${targetnum - 1}"> < prev`;
        }
        if (target == (Math.ceil(card.length / 10) - 1)){ //最後一頁關閉next按鈕
            next.innerHTML = `<a href="#title" class="disable"> next >`;
        } else {
            next.innerHTML = `<a href="#title" data-num="${targetnum + 1}"> next >`;
        }

        for (let i = 0; i < total; i++) {
            card[i].style.display = 'none';
        }
        if ((target * 10 + 10) <= total) { //一頁10個景點，包含最後一頁
            for (let i = (target * 10); i < (target * 10 + 10); i++) {
                card[i].style.display = 'block';
            }
        } else { //最後一頁不滿10個景點
            for (let i = (target * 10); i < total; i++) {
                card[i].style.display = 'block';
            }
        }
        for (let i = 0; i < page.length; i++) {
            page[i].style.color = '#4A4A4A';
        }
        page[target].style.color = '#559AC8'; //選取到的頁面改成藍色標記
    }
}, false)

// 點擊滑到介紹區
goDown.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({
        top: title.offsetTop,
        behavior: 'smooth',
    });
})

// go top button
goTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
})