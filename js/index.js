// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const weightMinInput = document.querySelector('.minweight__input');//поле получения максимального веса
const weightMaxInput = document.querySelector('.maxweight__input');//поле получения максимального веса
const dropResult = document.querySelector('#drop');//кнопка сброса результатов
const cancelSort = document.querySelector('.sort__cancel__btn');//отменяет примененную сортировку и возвращает массив до сортировки

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "дуриан", "color": "зеленый", "weight": 35},
  {"kind": "личи", "color": "красный", "weight": 17},
  {"kind": "карамбола", "color": "желтый", "weight": 28},
  {"kind": "тамаринд", "color": "коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let tempFruitsArray=[...fruits];
let tempFruitsArrayBeforeSort=[...fruits];

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML='';
  let elemList;

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    elemList = document.createElement('li');
    elemList.innerHTML=`
    <div class="fruit__info">
      <div>index: ${i}</div>
      <div>kind: ${fruits[i]['kind']}</div>
      <div>color: ${fruits[i]['color']}</div>
      <div>weight (кг): ${fruits[i]['weight']}</div>
    </div>`;
  switch(fruits[i]['color'])
  {
    case 'фиолетовый':
      elemList.setAttribute("class","fruit__item fruit_violet");
      break;
    case 'зеленый':
      elemList.setAttribute("class","fruit__item fruit_green");
      break;
    case 'красный':
      elemList.setAttribute("class","fruit__item fruit_red");
      break;
    case 'желтый':
      elemList.setAttribute("class","fruit__item fruit_yellow");
      break;
    case 'коричневый':
      elemList.setAttribute("class","fruit__item fruit_brown");
      break;
    case 'оранжевый':
      elemList.setAttribute("class","fruit__item fruit_orange");
      break;
    case 'голубой':
      elemList.setAttribute("class","fruit__item fruit_blue");
      break;
    case 'синий':
      elemList.setAttribute("class","fruit__item fruit_darkblue");
      break;
  }
  fruitsList.appendChild(elemList);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let tempArray=[...fruits];
  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    result.push(fruits.splice(getRandomInt(0,fruits.length-1),1)[0]);
  }
  for(let i=0;i<result.length;i++){
    if(result[i]['color']===tempArray[i]['color']){
      alert('порядок элементов не изменился');
      fruits = tempArray;
      return;
    }
  }
  sortTimeLabel.textContent='-';
  sortAPI['sorted']=false;
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

dropResult.addEventListener('click',event=>{
  weightMaxInput.value='';
  weightMinInput.value='';
  fruits=[...tempFruitsArray];
  sortTimeLabel.textContent='-';
  sortAPI['sorted']=false;
  display();
})

weightMaxInput.addEventListener('click',event=>{
  weightMaxInput.value='';
})

weightMinInput.addEventListener('click',event=>{
  weightMinInput.value='';
})

// фильтрация массива
const filterFruits = () => {
  if(
    weightMaxInput.value!=='' 
    && weightMinInput.value!==''
    && !isNaN(weightMaxInput.value)
    && !isNaN(weightMinInput.value)
    && !(+weightMaxInput.value<=+weightMinInput.value)
    && +weightMaxInput.value>0
    && +weightMinInput.value>0
  ){
    fruits=fruits.filter((item) => {
      // TODO: допишите функцию
      return item['weight']>=+weightMinInput.value&&item['weight']<=+weightMaxInput.value;
    });
    weightMinInput.value='';
    weightMaxInput.value='';
    sortTimeLabel.textContent='-';
  }
  else{
    weightMaxInput.value='повторите ввод';
    weightMinInput.value='повторите ввод';
  }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

cancelSort.addEventListener('click',event=>{
  if(sortAPI['sorted']){
    sortTimeLabel.textContent='-';
    fruits=[...tempFruitsArrayBeforeSort];
    sortAPI['sorted']=false;
    display();
  }
})

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  return a['color'].localeCompare(b['color']);//используется лексеграфическое сравнение так как было сказано что можно использовать любое сравнение
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    if(!sortAPI.sorted){
      let tmp;
      for(let i=0; i<arr.length-1;i++){
        for(let j=0; j<arr.length-i-1; j++){
          if(comparation(arr[j],arr[j+1])>0){
            tmp=arr[j];
            arr[j]=arr[j+1];
            arr[j+1] = tmp;
          }
        }
      }
      sortAPI.sorted=true;
    }
    return arr;
  },

  quickSort(List, comparation) {
    if(!sortAPI.sorted){
      if (List.length <= 1) {
          return List;
      }

      const pivot = List[List.length - 1];
      const leftList = [];
      const rightList = [];

      for (let i = 0; i < List.length - 1; i++) {
          if (comparation(List[i],pivot)<0) {
              leftList.push(List[i]);
          }
          else {
              rightList.push(List[i])
          }
      }

      List=[...sortAPI.quickSort(leftList,comparation), pivot, ...sortAPI.quickSort(rightList,comparation)];
    }
    sortAPI.sorted=true;
    return List;
  },

  sorted:false,

    // выполняет сортировку и производит замер времени
    startSort(sort, arr, comparation) {
      const start = new Date().getTime();
      tempFruitsArrayBeforeSort=[...fruits];
      const sortedArray = sort(arr, comparation);
      const end = new Date().getTime();
      sortTime = `${end - start} ms`;
      return sortedArray;
    },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if(sortKind==='bubbleSort'){
    sortKind='quickSort';
    sortKindLabel.textContent=sortKind;
    sortTime='-';
    sortTimeLabel.textContent=sortTime;
  }
  else{
    sortKind='bubbleSort';
    sortKindLabel.textContent=sortKind;
    sortTime='-';
    sortTimeLabel.textContent=sortTime;
  }
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  if(!sortAPI['sorted']){
    sortTimeLabel.textContent='sorting...';
    const sort = sortAPI[sortKind];
    fruits=sortAPI.startSort(sort, fruits, comparationColor);
    // TODO: вывести в sortTimeLabel значение sortTime
    sortTimeLabel.textContent=sortTime;
  }
  else{
    sortTimeLabel.textContent='данные уже отсортированы';
  }
  display();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  if(
    kindInput.value!==''
    && colorInput.value!==''
    && weightInput.value!==''
    && !isNaN(weightInput.value)
    && weightInput.value>0
    && typeof colorInput.value==='string'
    && (String(colorInput.value).toLowerCase()==='зеленый'
    || String(colorInput.value).toLowerCase()==='фиолетовый'
    || String(colorInput.value).toLowerCase()==='красный'
    || String(colorInput.value).toLowerCase()==='желтый'
    || String(colorInput.value).toLowerCase()==='коричневый'
    || String(colorInput.value).toLowerCase()==='оранжевый'
    || String(colorInput.value).toLowerCase()==='голубой'
    || String(colorInput.value).toLowerCase()==='коричневый'
    || String(colorInput.value).toLowerCase()==='синий')
    ){        
      if(
      !fruits.some(elem=>kindInput.value.toLowerCase()===elem['kind']&&colorInput.value===elem['color']
        &&+weightInput.value===elem['weight'])){
        weightMaxInput.value='';
        weightMinInput.value='';
        fruits.push({kind: kindInput.value.toLowerCase(), color: colorInput.value, weight: +weightInput.value});
        sortTimeLabel.textContent='-';
        sortAPI['sorted']=false;
        display();
      }
      else{
        alert("такой элемент уже есть, попробуйте добавить еще раз");
      }
  }
  else{
    alert("повторите ввод, неверные данные");
  }
  colorInput.value='';
  weightInput.value='';
  kindInput.value='';
});
