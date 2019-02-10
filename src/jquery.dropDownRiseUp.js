/**
* Horizontal drop-down menu
*/
(function($) {	
	jQuery.fn.dropDownRiseUp = function(options){
		var settings = $.extend({
			time: 2000, // время выполнения увеличения высоты высоты элемента
			pix: 300, // высота до которой нужно увеличить элемент
			timeout: 30 // частота с которой выполняеться каждый шаг анимации (минимальная 40 милисекунд => 25 шагов(изменений) за сек)
		}, options);
		
		var object = $(this);	
		var objectHeight = object.height();
		var step = stepRiseUp = settings.pix/(settings.time/settings.timeout); // это формула которая определяет шаг изменения высоты элемента за settings.timeout (40 милисекунд) чтобы анимация была плавной и выполнялась за время указаное в settings.time
		// создаем массивы чтобы свойства применялись к каждому элементу JQuery выборки индивидуально и их значения не переписывались
		var timerStopEnter = ''; // уникальный иднтификатор для остановки setTimeot() который используеться для увеличения высоты элемента
		var timerStopLeave = []; // массив уникальных иднтификаторов для остановки конкретного setTimeot() который используеться для уменьшения высоты элемента
		var functionState = []; // массив переменных содержащих значение состояния функции "dropDown" выполняеться в даный момент функция или нет "fal" - выполняеться "tr" - нет
		var elementHeight = []; // массив значений высот элементов по выборке 
		var stepDown = []; // будет содержать число которое будет уменьшать на каждом шаге высоту элемента для которого запущена функия "dropDown" в даний момент
		
		for (var l = 0; l < object.length; l++) { 
			object.eq(l).attr('data-drop-down-rise-up', "drop-down-rise-up") // устанавливаем одинаковый атрибут всем элементам выборки для дальнейшей идентификации в условных операторах
			elementHeight[l] = objectHeight; // создаем для каждого тега свой elementHeight который будет содержать значение высоты элемента и изменяться пры выполнении каждой запущеной функции чтобы значения elementHeight не заменялись при выполнении двух и более функций одновременно
			functionState[l] = ""; // cоздаем в масcиве число элементов которое равняеться "object.length"
			stepDown[l] = step; // создаем в масcиве число элементов которое равняеться "object.length" и присваиваем им шаг изменения высоты элемента
			timerStopLeave[l] = "";	// создаем в масcиве число элементов которое равняеться "object.length"
		}

		object.mouseenter(function(event) {
			var thiss = $(this); // $(this) не работает в телах условных операторов что находяться в функциях "riseUp" и "dropDown" поэтому присваиваем этот объект переменной (так работает)
			var a = thiss.index(); // присваиваем индекс выбраного элемента для изменения именно его свойств 
			// Условия что находиться ниже необходимо потому что при переходе курсора только по элементам выборки запускаеться одновременно две функции "mouseleave" и "mouseenter" и уменьшение высоты атрибутов происходить некоректно 
			// (продолжает увеличиваться потому что запускаеться clearTimeout() и останвливает выполнение "mouseleave")
			if ($(this).attr('data-drop-down-rise-up') == "drop-down-rise-up" && $(event.relatedTarget).attr('data-drop-down-rise-up') == 'data-drop-down-rise-up') { // если курсор перемещаеться только по элементам c атрибутом 'data-drop-down-rise-up' и не переходит с других элементов	
				if (functionState[a] == false) { // если функция "dropDown" еще выполняеться для тега, индекс которого равен индексу элемента под курсором
					stepDown[a] = 0; // останавливаем умеьнешие высоты элемента с индексом "a" 
					clearTimeout(timerStopLeave[a]); // останавливаем выполнение функции "setTimeout" именно для элемента с индексом "a" 
				} else {
					stepDown[a] = step; // продолжаем уменьшать высоту выбраного элемента
				}
			} else {
				stepDown[a] = 0;
				clearTimeout(timerStopLeave[a]);			
			}	
			var riseUp = function animate_custom(){	
				if (elementHeight[a] <= settings.pix) { // если высота элемента с индексом "а" меньше заданой в переменной settings.pix
					thiss.height(elementHeight[a]); // устанавливаем высоту выбраного тега на значение элемента массива elementHeight индекс которого равняеться $(this).index()
					elementHeight[a] = elementHeight[a] + stepRiseUp;
					timerStopEnter = setTimeout(animate_custom, settings.timeout); // рекурсия, функция setTimeout() запускает функцию animate_custom() с частотой заданой в переменной settings.timeout
				} else { // после завершения условия elementHeight[a] <= settings.pix, elementHeight[a] иногда бывает меньше settings.pix на величину stepRiseUp или меньше в итоге elementHeight[a] не равняеться settings.pix 
					//чтобы этого избежать устанавливаем принудительно точное значение для переменной elementHeight[a] после выполнения условия (elementHeight[a] <= settings.pix)
					elementHeight[a] = settings.pix; // устанавливаем принудительно точное значение высоты тега
					thiss.height(elementHeight[a]);			
				}
			}();
		});

		object.mouseleave(function(event) {
			clearTimeout(timerStopEnter); // останавливаем выполнение функции riseUp чтобы  "mouseleave" и "mouseenter" не работали одновременно
			var thiss2 = $(this);
			var b = thiss2.index(); // b это индекс элемента на котором произошло событие "mouseleave"
			stepDown[b] = step; // устанавливаем скорость анимации потому что в событии mouseenter текущему элементу этого массива с точно таким же индексом может присвоиться 0 в зависимости от результата условного оператора
			var dropDown = function animate_custom2(){
				if (elementHeight[b] >= objectHeight) {
					thiss2.height(elementHeight[b]);
					elementHeight[b] = elementHeight[b] - stepDown[b];
					functionState[b] = false; // присваивам элементу массива с индексом b значение false, это значит что функция выполняеться 
					timerStopLeave[b] = setTimeout(animate_custom2, settings.timeout);
				} else { 
					elementHeight[b] = objectHeight;
					thiss2.height(elementHeight[b]);
					functionState[b] = true; // присваивам элементу массива с индексом b значение true, это значит что функция выполнилась 
				}
			}();
		});

		return this; // в итоге, метод dropDownRiseUp вернет текущий объект jQuery обратно для возможности продолжить цепочку методов
	};
}) (jQuery);
