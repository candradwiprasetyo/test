(function () {
    'use strict';
    angular.module('app')
.controller('activityController', ['$scope','$http', function ($scope, $http) {
    
    // Privacy Setting
    $scope.ptsbs = [
        'Public',
        'Friends'
    ];
    $scope.ptsbSelected = 0;
    $scope.selectPTSB = function(opt){
        $scope.ptsbSelected = opt;
    };
    
    // Privacy Setting Button
    $scope.isActivePTSB = false;
    $scope.togglePTSB = function(){
        $scope.isActivePTSB = !$scope.isActivePTSB;
    };
    
    // Activity (SA)
    $scope.listAct = [];
    $scope.selectedAct = null;
    $scope.selectedActIndex = -1;
    $scope.searchAct = function(){
        $scope.selectedAct = null;
        $scope.selectedActIndex = -1;
        $http.get('../assets/json/activity.json').success(function(data){
            $scope.listAct = data;
        });
    };
    $scope.selectAct = function(index){
        $scope.actKey = $scope.listAct[index].name;
        $scope.selectedAct = $scope.listAct[index];
        $scope.listAct = [];
    };
    $scope.checkKeyDownAct = function(event){
        if(event.keyCode === 40){
            event.preventDefault();
            if($scope.selectedActIndex+1 !== $scope.listAct.length){
                $scope.selectedActIndex++;
            }
        }
        else if(event.keyCode === 38){
            event.preventDefault();
            if($scope.selectedActIndex-1 !== -1){
                $scope.selectedActIndex--;
            }
        }
        else if(event.keyCode === 13){
            $scope.selectAct($scope.selectedActIndex);
        }
    };
    
    // Mood
    $scope.moods = [
        {"name":"Happy","img":"img"},
        {"name":"Normal","img":"img"},
        {"name":"Sad","img":"img"}
    ];
    $scope.moodSelected = 1;
    $scope.selectMood = function(index){
        $scope.moodSelected = index;    
    };
    
    // Item
    /*$scope.listItem = [];
    $scope.listItemSelected = [
        {
            "name": "item 1",
            "img": "",
            "img_thumb": ""
        },
        {
            "name": "item 2",
            "img": "",
            "img_thumb": ""
        },
        {
            "name": "item 3",
            "img": "",
            "img_thumb": ""
        },
        {
            "name": "item 4",
            "img": "",
            "img_thumb": ""
        }
    ];
    $scope.selectedItemIndex = -1;
    $scope.searchItem = function(){
        $scope.selectedItemIndex = -1;
        $http.get('../../source/json/item.json').success(function(data){
            $scope.listItem = data;
        });
    };
    $scope.checkKeyDownItem = function(event){
        if(event.keyCode === 40){
            event.preventDefault();
            if($scope.selectedItemIndex+1 !== $scope.listItem.length){
                $scope.selectedItemIndex++;
            }
        }
        else if(event.keyCode === 38){
            event.preventDefault();
            if($scope.selectedItemIndex-1 !== -1){
                $scope.selectedItemIndex--;
            }
        }
        else if(event.keyCode === 13){
            $scope.selectItem($scope.listItem[$scope.selectedItemIndex]);
        }
    };
    $scope.selectItem = function(item){
        $scope.itemKey=null;
        var lastItem = $scope.lastItemIndex();
        var inList = $scope.inListItemSelected(item);
        if(!inList){
            if(lastItem != 4){
                $scope.listItemSelected[lastItem] = item;
                $scope.itemKey = '';
            } else {
                alert('sudah penuh om');
            }
        } else {
            var ind = 0;
            for(var i = 0; i < $scope.listItemSelected.length; i++){
                if($scope.listItemSelected[i].name === item.name){
                    ind = i;
                }
            }
            $scope.listItemSelected[ind] = {
                "name": "item "+(ind+1),
                "img": "",
                "img_thumb": ""
            };
        }
    };
    $scope.lastItemIndex = function(){
        for(var i = 0; i < $scope.listItemSelected.length; i++){
            if($scope.listItemSelected[i].img === ''){
                return i;
            }
        }
        return 4;
    };
    $scope.inListItemSelected = function(item){
        for(var i = 0; i < $scope.listItemSelected.length; i++){
            if($scope.listItemSelected[i].name === item.name){
                return true;
            }
        }
        return false;
    };
    $scope.resetListItem = function(){
        $scope.listItemSelected = [
            {
                "name": "item 1",
                "img": "",
                "img_thumb": ""
            },
            {
                "name": "item 2",
                "img": "",
                "img_thumb": ""
            },
            {
                "name": "item 3",
                "img": "",
                "img_thumb": ""
            },
            {
                "name": "item 4",
                "img": "",
                "img_thumb": ""
            }
        ];  
    };*/
    $scope.listItem = [];
    $scope.itemSelected = {
        "name": "item 1",
        "type": "",
        "img": "",
        "img_thumb": ""
    };
    $scope.itemSelected2 = {
        "name": "item 2",
        "type": "",
        "img": "",
        "img_thumb": ""
    };
    $scope.itemSelected3 = {
        "name": "item 3",
        "type": "",
        "img": "",
        "img_thumb": ""
    };
    $scope.itemSelected4 = {
        "name": "item 4",
        "type": "",
        "img": "",
        "img_thumb": ""
    };
    $scope.selectedItemIndex = -1;
    $scope.searchItem = function(){
        $scope.selectedItemIndex = -1;
        $http.get('../assets/json/item.json').success(function(data){
            $scope.listItem = data;
        });
    };
    $scope.checkKeyDownItem = function(event){
        if(event.keyCode === 40){
            event.preventDefault();
            if($scope.selectedItemIndex+1 !== $scope.listItem.length){
                $scope.selectedItemIndex++;
            }
        }
        else if(event.keyCode === 38){
            event.preventDefault();
            if($scope.selectedItemIndex-1 !== -1){
                $scope.selectedItemIndex--;
            }
        }
        else if(event.keyCode === 13){
            $scope.selectItem($scope.listItem[$scope.selectedItemIndex]);
        }
    };
    $scope.selectItem = function(item){
        $scope.itemSelected = item;
        $scope.itemKey = '';
    };
    $scope.selectItem2 = function(item){
        $scope.itemSelected2 = item;
        $scope.itemKey2 = '';
    };
    $scope.selectItem3 = function(item){
        $scope.itemSelected3 = item;
        $scope.itemKey3 = '';
    };
    $scope.selectItem4 = function(item){
        $scope.itemSelected4 = item;
        $scope.itemKey4 = '';
    };
    
    // Friend
    $scope.listFriend = [];
    $scope.listFriendSelected = [];
    $scope.selectedFriendIndex = -1;
    $scope.searchFriend = function(){
        $scope.selectedFriendIndex = -1;
        $http.get('../assets/json/friend.json').success(function(data){
            $scope.listFriend = data;
        });
    };
    $scope.checkKeyDownFriend = function(event){
        if(event.keyCode === 40){
            event.preventDefault();
            if($scope.selectedFriendIndex+1 !== $scope.listFriend.length){
                $scope.selectedFriendIndex++;
            }
        }
        else if(event.keyCode === 38){
            event.preventDefault();
            if($scope.selectedFriendIndex-1 !== -1){
                $scope.selectedFriendIndex--;
            }
        }
        else if(event.keyCode === 13){
            $scope.selectFriend($scope.listFriend[$scope.selectedFriendIndex]);
        }
    };
    $scope.selectFriend = function(friend){
        if(!$scope.inListFriendSelected(friend)){
            $scope.listFriendSelected.push(friend);
            $scope.friendKey = '';
        } else {
            var ind = $scope.listFriendSelected.indexOf(friend);
            $scope.listFriendSelected.splice(ind, 1);
        }
    };
    $scope.inListFriendSelected = function(friend){
        for(var i = 0; i < $scope.listFriendSelected.length; i++){
            if($scope.listFriendSelected[i].name === friend.name){
                return true;
            }
        }
        return false;
    };
    $scope.resetFriend = function(){
        $scope.listFriendSelected = [];
    };
    
    // Place
    $scope.listPlace = [];
    $scope.placeSelected = {
        "name": "place",
        "type": "",
        "img": "",
        "img_thumb": ""
    };
    $scope.selectedPlaceIndex = -1;
    $scope.searchPlace = function(){
        $scope.selectedPlaceIndex = -1;
        $http.get('../assets/json/place.json').success(function(data){
            $scope.listPlace = data;
        });
    };
    $scope.checkKeyDownPlace = function(event){
        if(event.keyCode === 40){
            event.preventDefault();
            if($scope.selectedPlaceIndex+1 !== $scope.listPlace.length){
                $scope.selectedPlaceIndex++;
            }
        }
        else if(event.keyCode === 38){
            event.preventDefault();
            if($scope.selectedPlaceIndex-1 !== -1){
                $scope.selectedPlaceIndex--;
            }
        }
        else if(event.keyCode === 13){
            $scope.selectPlace($scope.listPlace[$scope.selectedPlaceIndex]);
        }
    };
    $scope.selectPlace = function(place){
        $scope.placeSelected = place;  
        $scope.placeKey = '';
    };
    
    // Tab Posting Activity
    $scope.editActivity = 'captions';
    $scope.selectEdit = function(e){
        $scope.editActivity = e;
    }
    
    // Reset Post
    $scope.resetPost = function(){
        // Reset Activity
        $scope.actKey = '';    
        $scope.selectedIndex = -1;
        $scope.listAct = [];
        $scope.selectedAct = null;
        
        // Reset Mood
        $scope.moodSelected = 1;
        
        // Reset List Item
        $scope.resetListItem();

        // Reset List Friend
        $scope.resetFriend();
        
        // Reset Place
        $scope.placeSelected = {
            "name": "place",
            "type": "",
            "img": "",
            "img_thumb": ""
        };
        
        // Reset Caption
        $scope.previewCaption = '';
        
        // Reset Edit Activity
        $scope.editActivity = 'captions';
    };
}]).filter('firstName', function () {
    return function (str) {
        var name = str.split(" ");
        return name[0];
    }
}).filter('matchedBold', ['$sce', function ($sce) {
    return function (str, model) {
        var result = '';
        var name = str.split(' ');
        for(var i = 0; i < name.length; i++){
            if(angular.lowercase(name[i]) === angular.lowercase(model)){
                result += '<strong>'+name[i]+'</strong> ';
            } else {
                result += name[i]+' ';
            }
        }
        return $sce.trustAsHtml(result);
    }
}]);
})();