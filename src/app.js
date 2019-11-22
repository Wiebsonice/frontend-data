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
		// console.log(materialsPerYear)
	var allYears = makeFullObj(materialsPerYear)
	// console.log(allYears)
	timeOut(allYears)
}

function timeOut(data){
	var yearDate = new Date().getFullYear();
	var result = {ijzer: 0, hout: 0, brons: 0, aarde: 0, klei: 0, koper: 0, goud: 0};
	var i = 0;
	var intervalTimer = setInterval(function(){
		i ++;
		var year = i

		var testdit = counter(data[i], result)
		if (i >= yearDate){
			clearInterval(intervalTimer)
			result = counter(data[i], result)
			console.log("result: ", result)
			console.log("Year: ", year)
		}
	}, 1);
}
function counter(dataRow, result) {
	dataRow.materials.forEach(function(material) {
		result[material.key] += material.value
	})
	return result
}


function makeFullObj(dataa) {
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
	// console.log(yearsObject)
	return yearsObject
	// console.log(yearsArr)
}

// testObj()
