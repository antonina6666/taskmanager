// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('taskmanager', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('Categories',function(){
	return{
		save:function(categories){
			window.localStorage['categories']=angular.toJson(categories);
		},
		all:function(){
			var categoryString=window.localStorage['categories'];
			if (categoryString)
			{
				return angular.fromJson(categoryString);
			}
			return [];
		},
		newCategory:function(categoryTitle)
		{
			return{
				title:categoryTitle,
				tasks:[]
			};
			
		},
		getLastActiveIndex:function(){
			return parseInt(window.localStorage['lastActiveCategory']) || 0;
		},
		setLastActiveIndex(index){
			window.localStorage['lastActiveCategory']=index;
		}
		
	}
})
.controller('TaskCtrl',function($scope,$ionicModal,Categories,$ionicSideMenuDelegate,$timeout){
	$scope.tasks=[
	/*{title:'Task1'},
	{title:'Task2'},
	{title:'Task3'}*/];
	var createCategory=function(categoryTitle){
		var newCategory=Categories.newCategory(categoryTitle);
		//$scope.categories.push(categoryTitle);
		$scope.categories.push(newCategory);
		Categories.save($scope.categories);
		$scope.selectCategory(newCategory,$scope.categories.length-1);
	};
	$scope.categories=Categories.all();
	$scope.activeCategory=$scope.categories[Categories.getLastActiveIndex()];
	$scope.newCategory=function(){
		var categoryTitle=prompt('Enter category');
		if (categoryTitle)
		{
			createCategory(categoryTitle);
		}
	};
	$scope.selectCategory=function(category,index){
		$scope.activeCategory=category;
		Categories.setLastActiveIndex(index);
		$ionicSideMenuDelegate.toggleLeft(false);
	};
	
	$ionicModal.fromTemplateUrl('new-task.html',function(modal){
		$scope.taskModal=modal;
	},{
		scope:$scope,
		animation:"slide-in-up"
	});
	$scope.newTask=function(){
		$scope.taskModal.show();
	};
	$scope.closeTask=function(){
		$scope.taskModal.hide();
	};
	$scope.createTask=function(task){
		if (!$scope.activeCategory || !task)
		{
			return false;
		}
		$scope.activeCategory.tasks.push({
			title: task.title
		});
		$scope.taskModal.hide();
		Categories.save($scope.categories);
		task.title="";
	}
	$scope.removeTask=function(task){
		for(i=0;i<$scope.activeCategory.tasks.length;i++)
		{
			if ($scope.activeCategory.tasks[i].title==task.title)
				$scope.activeCategory.tasks.splice(i,1);
			Categories.save($scope.categories);
		}
	}
	$scope.toggleCategories=function(){
		$ionicSideMenuDelegate.toggleLeft();
	}
	$timeout(function(){
		if ($scope.categories.length==0)
		{
		
			while(true)
			{
				var categoryTitle=prompt('Enter category!');
				createCategory(categoryTitle);
				break;
			}
		}
	});
});
