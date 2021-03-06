angular.module('app', []).controller('iconsCtrl', function ($scope, $http) {

    $scope.images = [];
    $scope.fireTypes = [];
    $scope.visibVal = true;
    $scope.loaded = false;
    $scope.loadedMore = true;
    var count = 0;
    var limit = 12;

    $http.get('https://pokeapi.co/api/v1/type/?limit=999')
        .then(function (response) {
            for (var i = 0; i < response.data.objects.length; ++i) {
                $scope.fireTypes[i] = [response.data.objects[i].name, getRandomColor()];
            }

            $http.get('https://pokeapi.co/api/v1/pokemon/?limit=12')
                .then(function (response) {
                    for (var i = 0; i < limit; ++i) {
                        $scope.images[i] = [response.data.objects[i].national_id, response.data.objects[i].types, response.data.objects[i].name];
                        for (var j = 0; j < $scope.fireTypes.length; ++j) {
                            if ($scope.fireTypes[j][0].toLowerCase() === response.data.objects[i].types[0].name) {
                                $scope.images[i][1][0].color = $scope.fireTypes[j][1];
                            }
                            if (response.data.objects[i].types[1] && $scope.fireTypes[j][0].toLowerCase() === response.data.objects[i].types[1].name) {
                                $scope.images[i][1][1].color = $scope.fireTypes[j][1];
                            }
                        }
                    }
                    $scope.loaded = true;
                })
                .catch(function () {
                    console.error("GET JSON ERROR");
                });
        })
        .catch(function () {
            console.error("GET JSON ERROR");
        });

    var getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    $scope.loadMoreClick = function () {
        ++count;
        $scope.loadedMore = false;
        $http.get('https://pokeapi.co/api/v1/pokemon/?limit=12&offset=' + (limit * count))
            .then(function (response) {
                for (var i = 0; i < limit; ++i) {
                    $scope.images[limit * count + i] = [response.data.objects[i].national_id, response.data.objects[i].types, response.data.objects[i].name];
                    for (var j = 0; j < $scope.fireTypes.length; ++j) {
                        if ($scope.fireTypes[j][0].toLowerCase() === response.data.objects[i].types[0].name) {
                            $scope.images[limit * count + i][1][0].color = $scope.fireTypes[j][1];
                        }
                        if (response.data.objects[i].types[1] && $scope.fireTypes[j][0].toLowerCase() === response.data.objects[i].types[1].name) {
                            $scope.images[limit * count + i][1][1].color = $scope.fireTypes[j][1];
                        }
                    }
                }
                $scope.loadedMore = true;
            })
            .catch(function () {
                console.error("GET JSON ERROR");
            });
    };

    $scope.onClick = function (img) {
        $scope.visibVal = false;
        $scope.loaded = false;
        $scope.types = [];
        $http.get('https://pokeapi.co/api/v1/pokemon/?limit=' + (limit + limit * count))
            .then(function (response) {
                for (var i = 0; i < limit + limit * count; ++i) {
                    if (img[0] === response.data.objects[i].national_id) {
                        $scope.pokemonName = response.data.objects[i].name;
                        $scope.pokemonId = response.data.objects[i].national_id;

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
            .catch(function () {
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
            link: function (scope, $elm) {

                $elm.on('click', function () {
                    $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top}, "slow");
                });
            }
        }
    });
