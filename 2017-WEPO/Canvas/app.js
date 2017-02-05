var app = angular.module("TemplateApp", []);
app.controller("TemplateController", function($scope, $timeout) {
	$scope.templates = [];
	function addTemplate(value, description, bonus) {
		return {
			id: $scope.templates.length,
			value: value,
			description: description,
			result: 0,
			comment: "",
			isBonus: (bonus ? true : false)
		}
	}

	function calculateMaxGrade() {
		$scope.maxGrade = 0;

		for(var i = 0; i < $scope.templates.length; ++i) {
			if(!$scope.templates[i].isBonus) {
				$scope.maxGrade += $scope.templates[i].value;
			}
		}
	}

	function calculateCurrentGrade() {
		calculateMaxGrade();
		$scope.currentGrade = 0;
		for(var i = 0; i < $scope.templates.length; ++i) {
			if(!$scope.templates[i].result) {
				$scope.templates[i].result = 0;
			}
			$scope.currentGrade += parseInt($scope.templates[i].result);
		}
	}
/*
	function initializeTemplates() {
		$scope.student = "";
		$scope.result = "";
		$scope.templates = []
		$scope.templates.push(addTemplate(20, "Player always centered on X-axis. Clicking/Tapping space makes character jump - otherwise he falls."));
		$scope.templates.push(addTemplate(10, "Pipes and ground slowly move leftwards."));
		$scope.templates.push(addTemplate(10, "If player collides with ground/pipes - he instantly dies."));
		$scope.templates.push(addTemplate(5, "One point for every gap survived"));
		$scope.templates.push(addTemplate(10, "Upon loosing the player gets his score and option to restart"));
		$scope.templates.push(addTemplate(10, "All moving elements are hardware accelerated"));
		$scope.templates.push(addTemplate(10, "Background element moving in paralax to foreground"));
		$scope.templates.push(addTemplate(10, "Player animation+rotation"));
		$scope.templates.push(addTemplate(15, "Background music + sound effects and an option to mute"));
		$scope.templates.push(addTemplate(20, "Bonus", true));
	}
*/
	function initializeTemplates() {
		$scope.student   = "";
		$scope.result    = "";
		$scope.templates = [];
		$scope.templates.push(addTemplate(40, "Draw objects"));
		$scope.templates.push(addTemplate(10, "Manipulate attributes"));
		$scope.templates.push(addTemplate(10, "Undo/Redo"));
		$scope.templates.push(addTemplate(10, "Movable objects"));
		$scope.templates.push(addTemplate(10, "Save/Load"));
		$scope.templates.push(addTemplate(10, "Code quality"));
		$scope.templates.push(addTemplate(10, "Application usability"));
		$scope.templates.push(addTemplate(20, "Bonus points", true));
	}
	$scope.clear = function() {
		var userIsSure = confirm("Are you sure you want to clear all fields?");
		if (userIsSure) {
			initializeTemplates();
			calculateCurrentGrade();
			$scope.doneGrading = false;
			$scope.currentTemplate = $scope.templates[0];

			$timeout(function(){
				$("#gradeGiven").focus();
			}, 100);
		}
	}

	$scope.nextAssignment = function nextAssignment() {
		initializeTemplates();
		calculateCurrentGrade();
		$scope.doneGrading = false;
		$scope.currentTemplate = $scope.templates[0];

		$timeout(function(){
			$("#gradeGiven").focus();
		}, 100);
	}

	$scope.updateGrade = function(template) {
		template.result = parseInt(template.result);
		if(template.result == "") template.result = 0;
		if(template.result < 0) template.result = 0;

		if(template.result > template.value) {
			template.result = template.value;
		}

		calculateCurrentGrade();
	}

	$scope.generateResult = function() {
		$scope.doneGrading = true;

		$scope.result = "";
		for(var i = 0; i < $scope.templates.length; ++i) {
			var currentTemplate = $scope.templates[i];
			$scope.result += "\n-----\n"
			$scope.result += currentTemplate.description + ": " + currentTemplate.result + "/" + currentTemplate.value
			if(currentTemplate.comment !== "") {
				$scope.result += "\n" + currentTemplate.comment
			}
		}
		$scope.result += "\n\n----------\n"
		$scope.result += "Total grade: " + $scope.currentGrade + "/" + $scope.maxGrade + "\n"
		$scope.result += "\n" + $scope.teacher;
	}

	$scope.classByScore = function(score, max) {
		score = parseInt(score);
		if(score === max) {
			return "full-score";
		}
		else if(score > 0 && score < max) {
			return "ok-score";
		}
		else {
			return "bad-score";
		}
	}

	$scope.shorten = function(text) {
		if(text.length > 30) {
			return text.slice(0, 30) + "...";
		}
		else {
			return text;
		}
	}

	$scope.templateMouseEvent = function(template, mouseEnter) {
		if(mouseEnter) {
			template.hovering = true;
		}
		else {
			template.hovering = false;
		}
	}

	$scope.selectTemplate = function(template) {
		$scope.currentTemplate = template;
	}

	$scope.nextTemplate = function() {
		var currentIndex = $scope.currentTemplate.id;
		var nextIndex = (currentIndex + 1) % $scope.templates.length
		$scope.currentTemplate = $scope.templates[nextIndex];
		$("#gradeGiven").focus();
	}

	$scope.previousTemplate = function() {
		var currentIndex = $scope.currentTemplate.id;
		nextIndex = currentIndex - 1;
		if(nextIndex < 0) {
			nextIndex = $scope.templates.length-1;
		}
		$scope.currentTemplate = $scope.templates[nextIndex];
		$("#gradeGiven").focus();
	}

	$scope.checkIfTabWasPressed = function (event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			if ($scope.currentTemplate.id === $scope.templates.length - 1) {
				$scope.generateResult();
			} else {
				$scope.nextTemplate();
			}
		}
	}

	initializeTemplates();
	calculateMaxGrade();

	$scope.currentGrade = 0;
	$scope.doneGrading = false;
	$scope.currentTemplate = $scope.templates[0];
})