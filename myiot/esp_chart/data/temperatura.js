var chartT = new Highcharts.Chart({
  chart:{ renderTo : 'chart-temperature' }, //id
  title: { text: 'Temperatura' },
  series: [{
    showInLegend: false,
    data: []
  }],
  plotOptions: {
    line: { animation: false,
      dataLabels: { enabled: true }
    },
    series: { color: '#059e8a' }
  },
  xAxis: { type: 'datetime',
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: {
    title: { text: 'Temperatura (Celsius)' }
  },
  credits: { enabled: false }
});

setInterval(function ( ) {
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { //200 é o OK
    var x = (new Date()).getTime() - (3*60*60*1000), // fuso Brasil
        y = parseFloat(this.responseText); //faz o cast para float do texto que .ino mandou pelo .send_P()
    console.log(this.responseText);
    if(chartT.series[0].data.length > 40) {
        chartT.series[0].addPoint([x, y], true, true, true);
    } else {
        chartT.series[0].addPoint([x, y], true, false, true);
    }
    }
};
xhttp.open("GET", "/temperature", true); //aqui requere os dados do ESP32
xhttp.send();
}, 30000 ) ;