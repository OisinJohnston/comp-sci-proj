

round = (val) => Math.round(val*1000)/1000

// Chart.js does not natively support drawing a horizontal line across a graph so I wrote this plugin
const linePlugin = {
	id: "linePlugin",
	afterDraw: (chart, args, options) => {
		// This function is called after the chart has been drawn.
		const {ctx} = chart;
		y = chart.scales.y;
		scalingNumber = (y.height)/chart.scales.y.end; // Generate a magic number to scale the height by
		Object.values(options).forEach((options) => {
			lineHeight = (options.lineHeight)*scalingNumber; // scale the line height so it lines up with the ticks on the graph.
			colour = options.colour;
			ctx.strokeStyle = colour;
			ctx.fillStyle = colour;
			ctx.beginPath();
			ctx.moveTo(chart.scales.x._startPixel, y.bottom - lineHeight); // start the line at the leftmost edge of the x-axis, coords are measured from the top left so we need to get the y-value relative to the top and not the bottom.
			ctx.lineTo(chart.scales.x._endPixel, y.bottom - lineHeight); // end the line at the rightmost edge of the x-axis at the same height.
			ctx.closePath();
			ctx.stroke();
		})
	}
}


Chart.register(linePlugin) // Tell chart.js that our plugin exists
function drawLine(yValue, colour, lineName) {
	console.log(chart.options.plugins.linePlugin)
	if (!chart.options.plugins.linePlugin) {
		chart.options.plugins.linePlugin = {}
	}
	chart.options.plugins.linePlugin[lineName] = {
		lineHeight: yValue,
		colour: colour
	}// update the chart's options so that it has the needed options.
	
	chart.update();
}

function callIfUnder(waterneeded, callback) {
	getData((values) => {
		volumes = values[1];
		dates = values[0];
		volumes.forEach((volume, index) => {
			if (volume < waterneeded) {
					callback(round(waterneeded-volume), dates[index])
			}
		})
	})
}


function calculate() {
	var weight = document.getElementById("weight").value;
	var minutesOfActivity = document.getElementById("activityLevels").value; // minutes of activity per week
	waterneeded = weight*0.03; // needed water is 3% of bodyweight note 1kg of water = 1L of water so no unit conversion needed.
	if (minutesOfActivity > 0) {
		waterneeded += Math.round(980/7)/1000;
		waterneeded += Math.round((24*minutesOfActivity)/7)/1000;
	}

	drawLine(waterneeded, "#eb4034", "neededLine");
	alert("You need to drink "+round(waterneeded)+"L of water every day");
	callIfUnder(waterneeded, (excess, date) => alert("You need to drink " + excess + "L more water on "+ date))
}

function compareToAverage() {
	respond = (volume) => alert("Your age drinks on average " + volume + "L of water.")
	averageVol = 0
	sex = (document.querySelector('input[name="sex"]:checked').value);
	age = document.getElementById('age').value;
	if (age < 4) {
		averageVol = 0.946;
	} else if (age < 9) {
		averageVol = 1.183;
	} else if (age < 14) {
		averageVol = 1.656;
	} else if (age < 19) {
		averageVol = 1.893;
	} else {
		averageVol = {'m': 3.075, 'f': 2.129}[sex]
	}
	drawLine(averageVol, "#2631ad", "averageLine")
	callIfUnder(averageVol, (excess, date) => alert("You drank less than average on: " + date))	
}






