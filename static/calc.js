const linePlugin = {
	id: "linePlugin",
	afterDraw: (chart, args, options) => {
		const {ctx} = chart;
		y = chart.scales.y // some magic constant that seems to work with every value, honestly not sure why
		scalingNumber = (y.height)/chart.scales.y.end
		lineHeight = (options.lineHeight)*scalingNumber;
		ctx.beginPath();
		ctx.moveTo(0, y.bottom - lineHeight);
		ctx.lineTo(ctx.canvas.clientWidth, y.bottom - lineHeight);
		ctx.closePath();
		ctx.stroke();
	}
}


Chart.register(linePlugin)
function drawLine(yValue) {
	chart.options.plugins = {linePlugin: {
		lineHeight: yValue
	}}
	chart.update()
}


function calculate() {
	weight = document.getElementById("weight").value
	waterneeded = weight*0.03
	drawLine(waterneeded)
	alert("You need to drink "+waterneeded+"L of water")
}


