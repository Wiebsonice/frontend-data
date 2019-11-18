import results from './data/results.json'
// import cleanData from './lib/cleanYears'

const rawData = results.results.bindings

// main function
function main() {
	let cleanedData = convertData(rawData);
    let barChartArrData = createBarChartArr(cleanedData);
    let staticBarChartArrData = createStaticBarChartArr(cleanedData);
    makeD3Chart(staticBarChartArrData);
    // console.log(barChartArrData)
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

	let newArr = item;
    // console.log(newArr)
	return newArr;

}


function createBarChartArr(data) {
    let i = 0
    let objectsArr = []

    data.forEach(el => {
        i ++
        objectsArr.push({
            id: i,
            year: el.date.value.toString(),
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
    let i = 0
    let hashArr = {}
    let hout = 0

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
    let newArr = []
    Object.keys(hashArr).forEach(material => {
        newArr.push({
            material,
            count: hashArr[material]
        })
    })

    return newArr
}

main();

function makeD3Chart(cleanArr) {
    // Example from https://bl.ocks.org/caravinden/eb0e5a2b38c8815919290fa838c6b63b

    // Own Data
    var data = cleanArr;
    data.sort(function(a, b) {
        return d3.ascending(a.count, b.count)
    })
    console.log(data)


    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);

    var x = d3.scaleLinear()
              .range([0, width])
              .nice();

    var myColor = d3.scaleOrdinal().domain(data)
                    .range(["#f0c989", "#f0c989", "#5d5b5b", "#6e3d34", "#b08d57", "#b29700", "#9b7653", "#caa472"])

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      // format the data
      data.forEach(function(d) {
        d.count = +d.count;
      });

      // Scale the range of the data in the domains
      x.domain([0, d3.max(data, function(d){ return d.count + 250; })])
      y.domain(data.map(function(d) { return d.material; }));
      //y.domain([0, d3.max(data, function(d) { return d.count; })]);

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("width", function(d) {return x(d.count); } )
          .attr("y", function(d) { return y(d.material); })
          .attr("fill", function(d){return myColor(d.material) })
          .attr("height", y.bandwidth());

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
}
