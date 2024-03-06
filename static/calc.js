

// Chart.js does not natively support drawing a horizontal line across a graph so I wrote this plugin
const linePlugin = {
	id: "linePlugin",
	afterDraw: (chart, args, options) => {
		// This function is called after the chart has been drawn.
		const {ctx} = chart;
		y = chart.scales.y
		scalingNumber = (y.height)/chart.scales.y.end // Generate a magic number to scale the height by
		lineHeight = (options.lineHeight)*scalingNumber; // scale the line height so it lines up with the ticks on the graph.

		ctx.beginPath();
		ctx.moveTo(chart.scales.x._startPixel, y.bottom - lineHeight); // start the line at the leftmost edge of the x-axis, coords are measured from the top left so we need to get the y-value relative to the top not the bottom as we currently have
		ctx.lineTo(chart.scales.x._endPixel, y.bottom - lineHeight); // end the line at the rightmost edge of the x-axis at the same height.
		ctx.closePath();
		ctx.stroke();
	}
}


Chart.register(linePlugin) // Tell chart.js that our plugin exists
function drawLine(yValue) {
	chart.options.plugins = {linePlugin: {
		lineHeight: yValue
	}} // update the chart's options so that it has the needed options.
	chart.update()
}


function calculate() {
	weight = document.getElementById("weight").value
	waterneeded = weight*0.03 // needed water is 3% of bodyweight note 1kg of water = 1L of water so no unit conversion needed.
	drawLine(waterneeded)
	alert("You need to drink "+waterneeded+"L of water")
}


