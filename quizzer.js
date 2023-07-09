// inicializamos un array de arrays con la preguntas del juego. 
let questions = [
	[
		"¿Qué es blockchain?",
		"Un tipo de criptomoneda utilizada para realizar transacciones en línea de forma segura",
		"Un sistema de almacenamiento en la nube utilizado para respaldar y compartir archivos digitales",
		"Red social descentralizada que permite a los usuarios interactuar y compartir contenido en línea",
		"Una tecnología que permite la creación de un registro digital descentralizado, transparente e inmutable, utilizado para verificar y registrar transacciones de forma segura",
		3
	],
	[
		"¿Por qué se dice que blockchain es un sistema descentralizado?",
		"Porque no hay una autoridad central que controle la información. En su lugar, los nodos participantes en la red mantienen una copia completa y actualizada del blockchain",
		"Porque utiliza un algoritmo criptográfico central para validar las transacciones",
		"Debido a que utiliza una red de satélites para mantener la integridad de los datos",
		"Porque utiliza servidores centrales para almacenar y controlar la información",
		0
	],
	[
		"¿Cuál de las siguientes industrias no se ha visto afectada por la tecnología blockchain?",
		"Finanzas",
		"Educación",
		"Cadenas de suministro",
		"Salud",
		1
	],
	[
		"¿Cuál de las siguientes características no es propia de blockchain?",
		"Descentralización",
		"Transparencia",
		"Escalabilidad",
		"Seguridad",
		2
	],
	[
		"¿Qué son las aplicaciones blockchain?",
		"Son programas informáticos utilizados para minar criptomonedas y obtener beneficios económicos",
		"Son juegos en línea que utilizan tokens digitales para realizar transacciones dentro del juego",
		"Son sistemas o soluciones específicas que utilizan la tecnología blockchain para abordar diversos problemas o mejorar procesos en diferentes sectores",
		"Son plataformas de intercambio de criptomonedas donde se pueden comprar y vender activos digitales",
		2
	],
];

// Aquí utilizamos UnderscoreJS para generar un template de pregunta.
let questionTemplate = _.template(" \
	<div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          <label for='q<%= index %>o1'><%= a %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          <label for='q<%= index %>o2'><%= b %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          <label for='q<%= index %>o3'><%= c %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          <label for='q<%= index %>o4'><%= d %></label> \
        </li> \
      </ul> \
    </div> \
    ");

// Definimos las variables de estado del juego y los valores iniciales (como el tiempo de respuesta de cada pregunta).
let points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 8, // segundos
	timeLeftForQuestion; 
// Manipulacion de elementos con JQuery.
$(function() {

	// Uso de jQuery para escuchar el evento click del botón de Comenzar y Volver a jugar.
	$('button.start').click(start);
	$('.play_again button').click(restart);

	// La función restart inicializa los valores de las letiables de estado del juego.
	function restart() {
		points = 0;
		pointsPerQuestion = 10;
		currentQuestion = 0;
		timeLeftForQuestion = timeForQuestion;
	// Se oculta la pantalla de finalizar y un mensaje que dice "Se acabó el tiempo".
		$('.finish.card').hide();
		$('div.start').show();
		$('.times_up').hide();

		generateCards();
		updateTime();
		updatePoints();
	}

	//  La función start se ejecuta cuando el jugador hace click en comenzar.
	function start() {
		$('div.start').fadeOut(200, function() {
			moveToNextQuestion();
		});
	}

	// Esta es una de las funciones clave del juego, encargada de generar las preguntas. 
	function generateCards() {
		$('.questions').html('');
		for (let i = 0; i < questions.length; i++) {
			let q = questions[i];
			let html = questionTemplate({
				question: q[0],
				index: i,
				a: q[1],
				b: q[2],
				c: q[3],
				d: q[4]
			});
			$('.questions').append(html);
		};

                // Indicamos que nos interesa el evento change de los inputs dentro de los elementos con clase question y card (cada una de las preguntas).
		$('.question.card input').change(optionSelected);
	}

	// Esta función cambia el estado del juego para pasar de una pregunta a la siguiente.
	function moveToNextQuestion() {
		currentQuestion += 1;
		if (currentQuestion > 1) {
			$('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
		}

		// Se muestra la siguiente pregunta.
		showQuestionCardAtIndex(currentQuestion);
		setupQuestionTimer();
	}

	// Esta función inicializa el temporizador para responder una pregunta.
	function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;

		// Cada 1 segundo, nuestro temporizador llamará a la función countdownTick(). 
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// Mostramos la tarjeta de pregunta correspondiente al índice que la función recibe por parámetro.
	function showQuestionCardAtIndex(index) { // staring at 1
		let $card = $('.question.card:nth-child(' + index + ')').show();
	}

	// La función countdownTick() se ejecuta cada un segundo, y actualiza el tiempo restante para responder en la pantalla del jugador.
	function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) { 
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// Actualiza el tiempo restante en pantalla, utilizando la función html(). 
	function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}

	// Actualiza los puntos en pantalla.
	function updatePoints() {
		$('.points span.points').html(points + ' puntos');
	}

	// Esta función se ejecuta cuando el jugador escoge una respuesta.
	function optionSelected() {
		let selected = parseInt(this.value);
		let correct = questions[currentQuestion-1][5];

		if (selected == correct) {
			points += pointsPerQuestion;
			updatePoints();
			correctAnimation();
		} else {
			wrongAnimation();
		}

		if (currentQuestion == questions.length) {
			clearTimeout(questionTimer);
			return finish();
		}
		moveToNextQuestion();
	}

	// Animación de respuesta correcta e incorrecta.
	function correctAnimation() {
		animatePoints('right');
	}

	// Animación de respuesta correcta e incorrecta.
	function wrongAnimation() {
		animatePoints('wrong');
	}

	// Esta función anima el puntaje en pantalla.
	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function() {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	// Cuando el juego termina, esta función es ejecutada.
	function finish() {
		if (timeLeftForQuestion == 0) {
			$('.times_up').show();
		}
		$('p.final_points').html(points + ' puntos');
		$('.question.card:visible').hide();
		$('.finish.card').show();
	}

	// 24
	restart();

});