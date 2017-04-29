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

	function initializeTemplates() {
		$scope.course     = "Verklegt námskeið 2";
		$scope.assignment = "Lokaskýrsla";
		$scope.student    = "";
		$scope.result     = "";
		$scope.templates  = [];
		$scope.templates.push(addTemplate(10, "Introduction"));
		$scope.templates.push(addTemplate(20, "Post mortem"));
		$scope.templates.push(addTemplate(20, "Changes in requirements"));
		$scope.templates.push(addTemplate(20, "Diary"));
		$scope.templates.push(addTemplate(20, "Updated class diagram"));
		$scope.templates.push(addTemplate(10, "Other"));
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