/************************************************************
 * MOSTRANDO A TEMPERATURA EM TEMPO REAL
 */

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
xhttp.open("GET", "/temperature", true); //aqui abre index.html
xhttp.send();
}, 30000 ) ;


/************************************************************
 * MOSTRANDO SE O AQUECIMENTO ESTÁ LIGADO
 */

var button, canvas, ctx, canvas;

//assigna os elementos da pagina à variáveis
button = document.getElementById("toggleButton");
canvas = document.getElementById("led");

//desenha circulo no canvas
ctx = canvas.getContext("2d");
ctx.arc(25,25,15,0,2*Math.PI, false); //um arco de 2pi é um circulo
ctx.lineWidth = 3;
ctx.strokeStyle = "black";
ctx.stroke();
ctx.fillStyle = "black";
ctx.fill();