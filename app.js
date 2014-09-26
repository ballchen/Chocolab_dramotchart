angular.module('chartApp', ['angularFileUpload'])

.controller('chartCtrl', ['$scope','$upload',function($scope,$upload){
	$scope.initial = function(){
		$scope.dataHeaders = [];
		$scope.xAxis = new Object();
		$scope.yAxis = [];
		$scope.series = []; 
		$scope.charts = []; 
		$scope.yAxisChoice =new Object();
		$scope.newyaxis = new Object(); 
		$scope.newyaxis_op = new Object(); 
	}
	$scope.onFileSelect = function($files){
		var reader = new FileReader();
		reader.onload = function(e){			
			$scope.dataHeaders = getHeader(reader.result);
			$scope.rawdata = reader.result;
			$scope.$apply();
		}
		reader.readAsText($files[0]);
	}

/*設定表 START 格資料*/
	$scope.addCharts = function(){
		var newchart = new Object();
		newchart.headers = $scope.dataHeaders;
		$scope.charts.push(newchart);
		console.log($scope.charts)
	}

	$scope.classifyData = function(chart,header){
		console.log(header);
		var data = new Object();
		var temp = _.groupBy($scope.csvdata,header);
		data.keys = _.keys(temp);
		data.values = _.values(temp);
		console.log(data);
		chart.classify = data;
	}
	
	$scope.addxAxis = function(chart, header){
		var newxaxis = new Object();
		newxaxis.categories = _.pluck($scope.csvdata, header)
		chart.xAxis = newxaxis;
	}

	
	$scope.addyAxis = function(chart, opposite){
		if(!chart.yAxis) chart.yAxis = [];
		var find = _.find(chart.yAxis, function(axis){return axis.opposite === opposite});
		if(!find){
			if(!opposite)
				chart.yAxis.push(_.extend(_.pick($scope.newyaxis, 'min','title'),{opposite:opposite}));
			else
				chart.yAxis.push(_.extend(_.pick($scope.newyaxis_op, 'min','title'),{opposite:opposite}));
		}

		_.each(chart.yAxis, function(axis, i){
			axis.num = i;
		})
		
		
		
	}

	$scope.deleteyAxis = function(yAxis, tf){
		_.each(yAxis, function(axis, i){
			if(tf === axis.opposite) yAxis.splice(i, 1);
		})
		

	}
 	
 	$scope.consoleY = function(y){
 		console.log(y);
 	}

 	$scope.addSeries = function(chart, data, index, yAxis){
 		console.log(yAxis);

 		
 		if(!chart.series) chart.series = [];
 		var newseries = new Object();
 		newseries.yAxis= parseInt(yAxis);
 		newseries.type = 'column';
 		newseries.name = data;
 		newseries.data = _.pluck(chart.classify.values[index],'count').map(Number);

 		chart.series.push(newseries);

 	}

  	$scope.generateChart = function(chart){
  		
  		
  		for(var i = 0; i < chart.yAxis.length; i++){
  			delete chart.yAxis[i].num;
  			console.log(chart.yAxis);
  		}
  		console.log(JSON.stringify(chart));
		
	    $('#container').highcharts({
	        chart: {
	            type: chart.type
	        },
	        title: {
	            text: chart.title
	        },
	        xAxis: chart.xAxis,
	        yAxis: chart.yAxis,
	        series: chart.series
	        
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
			  return -(new Date(b.date) - new Date(a.date));
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

