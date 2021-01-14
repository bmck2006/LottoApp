var lottoPickerApp = angular.module('LottoPicker', [])
    .controller('mainController', ($scope, $http) => {

        $scope.megaMillionsNumbersData = [];
        $scope.latestDrawDate;
        $scope.dataPulled = false;
        $scope.counted = false;
        $scope.dataButtonClicked = false;
        $scope.historyButtonClicked = false;
        $scope.luckyString;

        $scope.frontNumArray = [];
        $scope.frontMegaBallArray = [];

        var getPreviousMegaMillionsNumbers = function() {
            $http.get('https://data.ny.gov/resource/5xaw-6ayf.json')
                .then(function (response) {
                    $scope.megaMillionsNumbersData = response.data;
                    console.log(response.data);
                }, function (error) {
                    console.log('Error: ' + error);
                    alert("Error: " + error);
                });
        }


        $scope.pullData = function() {
            getPreviousMegaMillionsNumbers();
            $scope.dataPulled = true;
        };

        $scope.latestDrawDate =  function () {
            return $scope.megaMillionsNumbersData[0].draw_date.substring(0,10);
        }
        $scope.latestWinningNumbers = function () {
            var returnString = $scope.megaMillionsNumbersData[0].winning_numbers + ' (' +
            $scope.megaMillionsNumbersData[0].mega_ball + ')';
            return returnString;
        }

        $scope.generate = function () {
        /** Utility Functions */
        var winningNumbersStringToArray = function(winningNumbersString) {
            var array = [];
            array.push(parseInt(winningNumbersString.slice(0,2)));
            array.push(parseInt(winningNumbersString.slice(3,5)));
            array.push(parseInt(winningNumbersString.slice(6,8)));
            array.push(parseInt(winningNumbersString.slice(9,11)));
            array.push(parseInt(winningNumbersString.slice(12)));
            return array;
        }

        var dateStringToArray = function(dateString) {
            var array = [];
            array.push(parseInt(dateString.slice(0,4)));
            array.push(parseInt(dateString.slice(5,7)));
            array.push(parseInt(dateString.slice(8,10)));
            return array;
        }

        $scope.frontDateFormatter = function(string) {
            var finalString = string.slice(0,10);
            return finalString;
        }
        //** End Utility Functions */
 
        //** Setup for Big For Loop for counts */
        var numArray = [];
        var numArrayLength = 70;
        var megaBallArray = [];
        var megaBallArrayLength = 25;

        //fill numArray
        for (var index = 0; index < numArrayLength; index++) {
            numArray.push({
                "number":index + 1,
                "count":0
            });
        }

        //fill megaBallArray
        for (var index = 0; index < megaBallArrayLength; index++) {
            megaBallArray.push({
                "number":index + 1,
                "count":0
            });
        }

        //Big for loops to generate counts
        for (var i = 0; i < $scope.megaMillionsNumbersData.length; i++) {
            
            //*** DATE CHECK - Only dates after oct 28 should be included where rules are 1-70 white balls and 1-25 megaball. */
            var dateArray = dateStringToArray($scope.megaMillionsNumbersData[i].draw_date);
            if (dateArray[0] < 2018) {
                break;
            } else if (dateArray[0] === 2018 && dateArray[1] < 10) {
                break;
            } else if (dateArray[0] === 2018 && dateArray[1] === 10 && dateArray[2] < 28) {
                break;
            } else {

                /** Contine after Date check */
                //get num array for regular numbers
                var tempNumArray = winningNumbersStringToArray($scope.megaMillionsNumbersData[i].winning_numbers);

                //match and add counts to numArray
                for(var x = 0; x < tempNumArray.length; x++) {
                    for(var y = 0; y < numArray.length; y++) {
                        if (tempNumArray[x] === numArray[y].number) {
                            numArray[y].count++;
                            break;
                        }
                    }
                }
                
                //string to int for mega ball
                var tempMegaBall = parseInt($scope.megaMillionsNumbersData[i].mega_ball);

                //match and add count to megaBallArray
                for (var a = 0; a < megaBallArray.length; a++) {
                    if (tempMegaBall === megaBallArray[a].number) {
                        megaBallArray[a].count++;
                        break;
                    }
                }
            }
        } // End Big For loops for count generation

        //Sort the arrays ascending lowest to high
        numArray.sort((a,b) => {
            return a.count - b.count;
        });
        megaBallArray.sort((a,b) => {
            return a.count - b.count;
        });

        //set lists for front-end viewing
        $scope.frontNumArray = numArray;
        $scope.frontMegaBallArray = megaBallArray;

        //generate final array
        var finalArray = [];
        finalArray.push(numArray[0].number);
        finalArray.push(numArray[1].number);
        finalArray.push(numArray[2].number);
        finalArray.push(numArray[3].number);
        finalArray.push(numArray[4].number);
        finalArray.sort((a,b) => {
            return a - b;
        });
        finalArray.push(megaBallArray[0].number);
        
        //generate lucky string
        $scope.luckyString = finalArray[0] + " - " +
            finalArray[1] + " - " +
            finalArray[2] + " - " +
            finalArray[3] + " - " +
            finalArray[4] + " (" +
            finalArray[5] + ")";

        $scope.counted = true;
        

    };

    $scope.dataButtonClick = function() {
        if (!$scope.dataButtonClicked)
            $scope.dataButtonClicked = true;
        else
            $scope.dataButtonClicked = false;
    };
    $scope.historyButtonClick = function() {
        if (!$scope.historyButtonClicked)
            $scope.historyButtonClicked = true;
        else
            $scope.historyButtonClicked = false;
    };
    });