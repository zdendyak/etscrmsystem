angular.module('etsApp')
.controller('CoworkersCtrl', [
	'$scope', 
	'coworkers',
	
	function($scope, coworkers) {

	$scope.coworkers = coworkers;
	
}]);