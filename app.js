angular.module('chartApp', ['angularFileUpload'])

.controller('chartCtrl', ['$scope','$upload',function($scope,$upload){
	
	$scope.dataHeaders = [];
	$scope
	$scope.onFileSelect = function($files){
		var reader = new FileReader();
		reader.onload = function(e){
			
			$scope.dataHeaders = getHeader(reader.result);

			$scope.rawdata = reader.result;


			// $scope.csvdata = csvJSON(reader.result);
			// if($scope.csvdata[0].date){
			// 	$scope.csvdata.sort(function(a,b){
			// 	  return new Date(b.date) - new Date(a.date);
			// 	});
			// }
			$scope.$apply();
		}
		reader.readAsText($files[0]);
	}

/*設定表 START 格資料*/

	$scope.classfyData = function(index){
		var data = new Object();
		var temp = _.groupBy($scope.csvdata,$scope.dataHeaders[index]);
		data.keys = _.keys(temp);
		data.values = _.values(temp);
		console.log(data);
		$scope.classfiedData = data;
	}
	$scope.xAxis = new Object();
	$scope.addxAxis = function(header){
		$scope.xAxis.categories = _.pluck($scope.csvdata, header)
		console.log($scope.xAxis)
	}

	$scope.yAxis = [];
	$scope.addyAxis = function(header){
		
		$scope.yAxis.push($scope.newyaxis)
		$scope.newyaxis = new Object();
		console.log($scope.yAxis);

	}
	// {
 //    	min: 0,
 //        title: {
 //            text: '錯誤次數'
 //        }
 //    }
 	
 	$scope.series = [];   
 	$scope.addSeries = function(data, index){
 		var newseries = new Object();
 		newseries.yAxis= 0;
 		newseries.type = 'column';
 		newseries.name = data;
 		newseries.data = _.pluck($scope.classfiedData.values[index],'count').map(Number);

 		$scope.series.push(newseries);
 		console.log($scope.series);

 	}
 	// {
  //   	yAxis: 0,
  //   	type: 'column',
  //       name: '影片連結失效/system',
  //       data: _.pluck(classify[1],'count').map(Number)
  //   }
  //   
  	$scope.generateChart = function(){
  			console.log($scope.xAxis)
  			console.log($scope.yAxis)
  			console.log($scope.series)
  		
		    $('#container').highcharts({
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: 'System Error'
		        },
		        xAxis: $scope.xAxis,
		        yAxis: $scope.yAxis,
		        series: $scope.series
		        
		    });
	
  	}

/*設定表 END 格資料*/

	$scope.deleteHeader = function(){
		for(var i =0; i<$scope.dataHeaders.length ;i++){
			$scope.dataHeaders[i] = "第"+i+"欄";
		}
	}

	$scope.headerconsole = function(){
		console.log($scope.dataHeaders);
	}

	$scope.changeHeader = function(header, index){
		$scope.dataHeaders[index] = header;
	}


	function getHeader(csv){
		var lines=csv.split("\n");
		var headers=lines[0].split(",");

		return headers;
	}

	$scope.cvnJSONStart = function(){
		$scope.csvdata = csvJSON($scope.rawdata);
		if($scope.csvdata[0].date){
			$scope.csvdata.sort(function(a,b){
			  return new Date(b.date) - new Date(a.date);
			});
		}
		console.log($scope.csvdata)
	}

	function csvJSON(csv){
	  var lines=csv.split("\n");
	  var result = [];
	  var headers=lines[0].split(",");
	  
	  for(var i=1;i<lines.length -1 ;i++){
		  var obj = new Object();
		  var currentline=lines[i].split(",");
		  for(var j=0;j<$scope.dataHeaders.length;j++){
			  obj[$scope.dataHeaders[j]] = currentline[j];
		  }
		  result.push(obj);
	  }
	  return result  //in json format (have \r)
	}

}])

