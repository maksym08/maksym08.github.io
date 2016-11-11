/**
 * Created by maksy on 11/10/2016.
 */

angular.module('app', []).controller('galleryCtrl', function ($scope, $http) {

    $scope.images = [];
    $scope.visibVal = true;
    $scope.loaded = false;
    var count = 0;
    var limit = 12;

    $http.get('http://pokeapi.co/api/v1/pokemon/?limit=12')
        .then(function (response) {
            for (var i = 0; i < limit; ++i) {
                $scope.images[i] = [response.data.objects[i].national_id, response.data.objects[i].types, response.data.objects[i].name];
            }
            $scope.loaded = true;
        })
        .catch(function (data) {
            console.error("GET JSON ERROR");
        });

    $scope.loadMoreClick = function () {
        ++count;
        $http.get('http://pokeapi.co/api/v1/pokemon/?limit=12&offset=' + (limit * count))
            .then(function (response) {

                for (var i = 0; i < limit; ++i) {
                    $scope.images[limit * count + i] = [response.data.objects[i].national_id, response.data.objects[i].types, response.data.objects[i].name];
                }
            })
            .catch(function (data) {
                console.error("GET JSON ERROR");
            });
    }

    $scope.onClick = function (img) {
        $scope.visibVal = false;
        $scope.loaded = false;
        $scope.types = [];
        $http.get('http://pokeapi.co/api/v1/pokemon/?limit=' + (limit + limit * count))
            .then(function (response) {
                for (var i = 0; i < limit + limit * count; ++i) {
                    if (img[0] === response.data.objects[i].national_id) {
                        $scope.pokemonName = response.data.objects[i].name;
                        
                        $scope.types.push({
                            "name": "Attack",
                            "value": response.data.objects[i].attack
                        });
                        $scope.types.push({
                            "name": "Defense",
                            "value": response.data.objects[i].defense
                        });
                        $scope.types.push({
                            "name": "HP",
                            "value": response.data.objects[i].hp
                        });
                        $scope.types.push({
                            "name": "SP Attack",
                            "value": response.data.objects[i].sp_atk
                        });
                        $scope.types.push({
                            "name": "SP Defense",
                            "value": response.data.objects[i].sp_def
                        });
                        $scope.types.push({
                            "name": "Speed",
                            "value": response.data.objects[i].speed
                        });
                        $scope.types.push({
                            "name": "Weight",
                            "value": response.data.objects[i].weight
                        });
                        $scope.types.push({
                            "name": "Total moves",
                            "value": response.data.objects[i].total
                        });
                    }
                }
                $scope.loaded = true;
            })
            .catch(function (data) {
                console.error("GET JSON ERROR");
            });
    };

})
    .directive('scrollToItem', function () {
        return {
            restrict: 'A',
            scope: {
                scrollTo: "@"
            },
            link: function (scope, $elm, attr) {

                $elm.on('click', function () {
                    $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top - 50}, "slow");
                });
            }
        }
    });
