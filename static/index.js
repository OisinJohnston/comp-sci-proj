var chart
function getData(callback) {	
	fetch('/data').then((resp) => resp.json()).then((data) => {
		
		dates = [];
		volumes = [];
		temps = [];
		data.forEach((i) => {
			dates.push(i[0])
			volumes.push(i[1]/1000)
			temps.push(i[2])
		})
		return [dates, volumes, temps]	
	}).then(callback)
}


function drawChart() {
	const ctx = document.getElementById('chart');
	getData((data) => {
		[dates, volumes, temps] = data
		chart =  new Chart(ctx, {
			data: {
				labels: dates,
				datasets: [{
					type: 'bar',
					label: 'Water Consumed (L) ',
					data: volumes,
					borderWidth: 1,
				}, {
					type: 'line',
					label: 'Average Temperature  (C)',
					data: temps,
					borderWidth: 1,
				}],	
				},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					y: {beginAtZero: true},
				},
				plugins: {
					linePlugin: false	
				}
			}
		});
	});
}

function updateChart() {
	getData((data) => {
		[dates, volumes, temps] = data
		chart.data.labels = dates;
		chart.data.datasets[0].data = volumes;
		chart.data.datasets[1].data = temps;
		chart.update()
	});
}

document.addEventListener("DOMContentLoaded", (e) => {
	drawChart();
	setInterval(updateChart, 1000);	
});


