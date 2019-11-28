import results from './data/results.json'
// import cleanData from './lib/cleanYears'

const rawData = results.results.bindings

// main function
function main() {
	var cleanedData = convertData(rawData);
    var barChartArrData = createBarChartArr(cleanedData);
    var staticBarChartArrData = createStaticBarChartArr(cleanedData);
    d3Chart(barChartArrData)
}

function splitStringCalcAverage(data) {
    var splittedString = data.split("-")
    return average(splittedString[0], splittedString[1])
}

function average(a, b) {
    // force the input as numbers *1
    return Math.round((a*1 + b*1) /2);
}

function centuryAverageSplitCalc(data) {
    var splittedString = data.split("-")
    return average(splittedString[0], splittedString[1]) - 1 + "50"
}

function centuryToYear(data) {
    if (data == "0") {
        data = 0
    } else {
        if (data.length == 2 || data.length == 1) {
            data = data - 1 + "50"
        }
    }
    return data
}


function clearDateString(data) {
    data.value = data.value.toLowerCase();

    if(data.value && typeof data.value === "string") {
        // Remove Spaces
        data.value = data.value.replace(/\s+/g, '');

        // BC / AD checker
        if (data.value.includes("bc")) {
            data.bcValue = true
            data.value = data.value.replace('bc', "");
            if (data.value.includes("ad")) {
                data.adValue = true
                data.value = data.value.replace('ad', "");
            } else {
                data.adValue = false
            }
        } else {
            data.bcValue = false
        }

        // eeuw checker
        if (data.value.includes("eeuw")) {
            data.eeuw = true
            data.value = data.value.replace('eeuw', "");
        } else if (data.value.includes("th")) {
            data.value = data.value.replace(/\t.*/,'');
            data.eeuw = true
        } else {
            data.eeuw = false
        }

        // odd ones
        if (data.value.includes("2hlft19") || data.value.includes("20evoor1971")) {
            data.value = "0"
        }

        // replace loop met een array en RegExp
        var replaceArr = ["a","b","c","d","e","f","g","h","i","j","k","l","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", /\(/, /\)/, /\./, , /\?/]
        replaceArr.forEach(el => data.value = data.value.replace(new RegExp(el, "g"), ""))

        // Replace / met -
        if (data.value.includes("/")) {
            data.value = data.value.replace('/', "-");
        }
    }

    return data
}


function clearMedium(data) {
    data.value = data.value.toLowerCase();
    var replaceArr = ["ijzer","hout","brons","aarde", "klei", "koper", "goud", "papier"]
    replaceArr.forEach(el => {
        if (data.value.includes(el)) {
            data.value = el
        }
    })
    return data
}

function convertData(item) {
	item.map(el => {
        var clearedStringsDate = clearDateString(el.date)
        var clearedStringsMedium = clearMedium(el.mediumLabel)

        if (clearedStringsDate.eeuw == false){
            if (clearedStringsDate.value.includes("-")) {
                clearedStringsDate.value = splitStringCalcAverage(clearedStringsDate.value);
            }
        } else if (clearedStringsDate.eeuw == true) {
            if (!clearedStringsDate.value.includes("-")) {
                if (clearedStringsDate.value.length >= 3) {
                    clearedStringsDate.value = clearedStringsDate.value.split("2")[1]
                    clearedStringsDate.value = centuryToYear(clearedStringsDate.value)
                }
                clearedStringsDate.value = centuryToYear(clearedStringsDate.value)
            } else {
                clearedStringsDate.value = centuryAverageSplitCalc(clearedStringsDate.value)
            }
        }
	})

	var newArr = item;
    // console.log(newArr)
	return newArr;

}


function createBarChartArr(data) {
    var i = 0
    var objectsArr = []

    data.forEach(el => {
        i ++
        objectsArr.push({
            id: i,
            year: el.date.value,
            material: el.mediumLabel.value,
            cords: [{
                lat: el.lat.value,
                long: el.long.value
            }]
        });
    })
    return objectsArr
}


function createStaticBarChartArr(data) {
    var i = 0
    var hashArr = {}

    data.forEach(el => {
        // check of de value al in de hashArr zit
        if(el.mediumLabel.value in hashArr ){
            // als de value in de hashArr zit, dan +1
            hashArr[el.mediumLabel.value] = hashArr[el.mediumLabel.value] + 1;
        }else{
            hashArr[el.mediumLabel.value] = 1;
        }
    })

    // vorm nieuw object van de hashArr
    var newArr = []
    Object.keys(hashArr).forEach(material => {
        newArr.push({
            material,
            count: hashArr[material]
        })
    })

    return newArr
}

main();

function d3Chart(data) {
	// Get huidige jaar

	var dt = new Date().getFullYear();
	var materialsPerYear = d3.nest()
		.key(function(d) { return d.year; })
		.key(function(d) { return d.material; })
		.rollup(function(v) { return v.length})
  		.entries(data)
		.map(function(group) {
		    return {
		    	year: Number(group.key),
		    	materials: group.values
		    }
		})
		.filter(function(group) { return group.year <= dt; });

		materialsPerYear.sort(function(x, y){
		   return d3.ascending(x.year, y.year);
		})
	var allYears = fillInYears(materialsPerYear)
	makeD3Chart(allYears);
}

// function timeOut(data){
// 	// var yearDate = new Date().getFullYear();
// 	// var result = {ijzer: 0, hout: 0, brons: 0, aarde: 0, klei: 0, koper: 0, goud: 0};
// 	// var i = 0;
// 	// var intervalTimer = setInterval(function(){
// 	// 	i ++;
// 	// 	var year = i
// 	//
// 	// 	var testdit = counter(data[i], result)
// 	// 	if (i >= yearDate){
// 	// 		clearInterval(intervalTimer)
// 	// 		result = counter(data[i], result)
// 	// 		console.log("result: ", result)
// 	// 		console.log("Year: ", year)
// 	// 	}
// 	// }, 1);
// }

function counter(dataRow, result) {
	// console.log(dataRow)
	dataRow.materials.forEach(function(material) {
		result[material.key] += material.value
	})
	return result
}


function fillInYears(dataa) {
	var yearDate = new Date().getFullYear();
	var i;
	var yearsObject = {}
	var yearsArr = []

	for (i = 0; i <= yearDate; i++) {
		yearsObject[i] = {
			year: i,
			materials: [{
				key: "hout", value: 0
			}]
		};
		overwriteWithRealData(i, dataa, yearsObject)
	}

	function overwriteWithRealData(counter, data, yearsObject) {
		data.forEach(singleData => {
			if (yearsObject[counter].year == singleData.year){
				yearsObject[counter] = {
					year: counter,
					materials: singleData.materials
				}
			}
		})
	}
	return yearsObject
}

function makeD3Chart(allYears) {
	// console.log(allYears)
		var data = [{"key": "ijzer","value": 0,},{"key": "hout","value": 0},{"key": "brons","value": 0},{"key": "aarde","value": 0},{"key": "klei","value": 0},{"name": "koper","value":  0},{"key": "goud","value": 0}];
			var myColor = d3.scaleOrdinal().domain(data)
  							.range(["#f0c989", "#f0c989", "#5d5b5b", "#6e3d34", "#b08d57", "#b29700", "#9b7653", "#caa472"])


        //sort bars based on value
        data = data.sort(function (a, b) {
            return d3.ascending(a.value, b.value);
        })

		// set the dimensions and margins of the graph
		var margin = {top: 20, right: 20, bottom: 30, left: 70},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;

		// set the ranges
		var y = d3.scaleBand()
		          .range([height, 0])
		          .padding(0.1);

		var x = d3.scaleLinear()
		          .range([0, width]);

		// append the svg object to the body of the page
		// append a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
			.attr("class", "outerGraph")
		  .append("g")
		    .attr("transform",
		          "translate(" + margin.left + "," + margin.top + ")");

		// Get sizes from svg container
		var rect = document.querySelector(".outerGraph").getBoundingClientRect();

		//enable defs
		var defs = svg.append('svg:defs');

		var materialImgArr = [
			{ material: "aarde", url: "https://static.planetminecraft.com/files/resource_media/screenshot/1236/pack_3530346.jpg"},
			{ material: "hout", url: "https://lh3.googleusercontent.com/jThaL5Qb1SRGBrxs9SEkSmuJu2p7InXKVawlyRsyt9il_BnsE9rZhsG_5RatPeFx97q5nuVFE3VWjrzaDwgVDg"},
			{ material: "koper", url: "https://lh3.googleusercontent.com/PaIsOYu8KvxKNf3HBfL9iR-KHXiosdhX4qAdcw615I5Xn3DPEUOHZ9q0J899C31s409blV83k4BYWPx0GEqjzg"},
			{ material: "klei", url: "https://lh3.googleusercontent.com/6cWf1CSNI0OTLHInMQI5gHmWrJlbbPDWoyHTYQAKUewAeeOuxzxrh8U0wbVeNQCX2FbHQqyNKA1y-z84chsy"},
			{ material: "ijzer", url: "https://lh3.googleusercontent.com/r6hcRC36CzWCl30MUbabHMUI_KT_yFarwA2bFmBMnvYJ4KpesmjTQvGM_-5rn64JbJYzQRf7N8rYrm0q_BE"},
			{ material: "goud", url: "https://www.tynker.com/minecraft/api/block?id=5adf641d1c36d1c16b8b4585&w=800&h=800&width=800&height=800"},
			{ material: "brons", url: "https://www.tynker.com/minecraft/api/block?id=57277eeb65e4f220738b456d&w=800&h=800&width=800&height=800"}
		]

		// set defs aan de hand van materialImgArr
		function defRhymz(id, url) {
			defs.append('svg:pattern')
				.attr('id', `${id}`)
				.attr("width", 55)
			    .attr("height", 55)
			    .attr("patternUnits", "userSpaceOnUse")
			    .append("svg:image")
				.attr("xlink:href", `${url}`)
			    .attr("width", 55)
			    .attr("height", 55)
		}

		// for each loop
		materialImgArr.forEach(material => {
			defRhymz(material.material, material.url)
		})

		// tooltip:
  		var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  		// Counter:
  		var counterDiv = d3.select("body").append("div").attr("class", "counterDiv");
  		counterDiv
  		  .style("right", "calc(100% - " + rect.right + "px + 20px)")
  		  .style("bottom", "calc(100% - " + rect.bottom + "px + 50px)")
  		  .style("opacity", 1)
  		  .style("display", "inline-block");

		  // Scale the range of the data in the domains
		  x.domain([0, d3.max(data, function(d){ return d.value; })])
		  y.domain(data.map(function(d) { return d.key; }));
		  //y.domain([0, d3.max(data, function(d) { return d.value; })]);

		  var bars = svg.selectAll(".bar")
            .enter()
            .append("g")
		    .data(data)
		    .enter().append("rect")
			  // .attr("fill", function(d){return myColor(d.key) })
			  .attr("class", function(d){return "bar " + d.key })
		      //.attr("x", function(d) { return x(d.value); })
		      .attr("width", function(d) {return x(d.value); } )
		      .attr("y", function(d) { return y(d.key); })
		      .on("mouseleave", function(d){
  		          tooltip
  		            .style("opacity", 0)
  		      })
			  .on("mousemove", function(d){
  				  tooltip
  					.style("left", d3.event.pageX - 50 + "px")
  					.style("top", d3.event.pageY - 70 + "px")
  					.style("opacity", 1)
  					.style("display", "inline-block")
  					.html((d.key) + "<br>" + (d.value));
  			  })
		      .attr("height", y.bandwidth());

		  var labels = svg.selectAll("text")
	         .data(data)
	         .enter()
	         .append("text")
	         .text(function(d) { return d.key + ": " + d.value })
	         .attr("y", function(d) { return y(d.key); })
			 .attr("transform", "translate(5, 35)")
	         .attr("x", function(d, i) { return d.value })
			 .attr("text-transform", "capitalize")

		  var formatxAxis = d3.format('.0f');

		  // add the x Axis
		  svg.append("g")
		  	  .attr("class", "xAxis")
		      .attr("transform", "translate(0, -25)")
		      .call(d3.axisBottom(x));

		  // add the y Axis
		  svg.append("g")
		  	  .attr("class", "yAxis")
		      .call(d3.axisLeft(y));


			  function intervalFunc(allYears) {
			  	var yearDate = new Date().getFullYear();
			  	var result = {ijzer: 0, hout: 0, brons: 0, aarde: 0, klei: 0, koper: 0, goud: 0};
			  	var i = 0;
				var interval;

			  	var interval = d3.interval(function(elapsed) {
			  		var year = i
					updateYear(i)
					var counterData = d3.map(counter(allYears[i], result)).entries()

					if(i % 20 === 0){
						updateBars(counterData)
			        }

			  		if ( i >= yearDate) {
			  			interval.stop();
			  			updateBars(d3.map(counter(allYears[i], result)).entries())
			  			updateYear(i)
			  		}
			  		i ++;
			    }, 30);
			  }

		  intervalFunc(allYears)

		  function updateBars(data) {
			var transitionTime = 100;
			data = data.sort(function (a, b) {
	            return d3.ascending(a.value, b.value);
	        })

			var bars = svg.selectAll(".bar")
			bars
		  	.data(data)
			.attr("fill", function(d){return myColor(d.key) })
			.attr("class", function(d){return "bar " + d.key })
			.transition()
		  	.attr("width", function(d) { return x(d.value); } )
			.attr("y", function(d) { return y(d.key); });


			// All classes arr
			var barClassArr = ["aarde", "hout", "brons", "koper", "klei", "ijzer", "goud"]

			// assign classes to fill
			barClassArr.forEach(el =>
				svg.selectAll("." + el).attr("fill", function(d){return myColor(d.key) })
				    .attr("fill", "url(#" + el + ")")
			)

			y.domain(data.map(function(d) { return d.key; }));
			x.domain([0, d3.max(data, function(d){ return d.value; })])

  			svg.select(".xAxis")
				.transition()
  				.call(d3.axisBottom(x));
			svg.select(".yAxis")
	  			.transition()
	  			.call(d3.axisLeft(y));

			labels.data(data)
				.text(function(d) { return d.key + ": " + d.value})
				.style("opacity", function(d) {
		            if (d.value >= 1) {return 1}
		            else { return 0}
		        ;})
				.transition()
				.attr("y", function(d) { return y(d.key); })
				.attr("transform", "translate(0, 33)")
				.attr("x", function(d) {
					if (x(d.value) >= 750) {return x(d.value) - 85; }
					else {return x(d.value) + 20; }
				})
				.attr("fill", function(d) {
					if (x(d.value) >= 800) {return "white" }
					else {return "black" }
				});
		  }

		  function updateYear(activeYear) {
			  counterDiv
				.html((activeYear));
		  }

}
