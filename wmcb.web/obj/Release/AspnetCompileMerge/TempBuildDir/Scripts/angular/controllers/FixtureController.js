﻿WMCBApp.controller('FixtureCtrl', ["$scope","$filter", "wmcbService", "filteredListService", function ($scope,$filter, wmcbService,filteredListService) {
    $scope.schedules = "";
    $scope.pageSize = 20;
    $scope.reverse = false;
    $scope.sort = {
        sortingOrder: 'TestId',
        reverse: true
    };
    $scope.gap = 5;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 1;
    wmcbService.getSchedule().then(function (data) {
        $scope.schedules = data;
    });
    $scope.$watch('schedules', function () {
        debugger;
        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };
        // init the filtered items
        $scope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.schedules, function (item) {
                for (var attr in item) {
                    if ( attr !="ID" && searchMatch(item[attr], $scope.searchText))
                        return true;
                }
                return false;
            });
            // take care of the sorting order
            //if ($scope.sort.sortingOrder !== '') {
            //    $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
            //}
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };
        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                }
            }
        };

        $scope.range = function (size, start, end) {
            var ret = [];
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                if (i >= 0)
                    ret.push(i);
            }
            return ret;
        };
        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };
        // functions have been describe process the data for display
        $scope.search();
    });
}]);