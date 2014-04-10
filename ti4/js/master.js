// Put all your page JS here

$(function () {
    $('#activityMCQ').activityMCQ();
});


			window.onload = function() {
				var theCanvas = document.getElementById('resultsStar');
				if (theCanvas && theCanvas.getContext) {
					var ctx = theCanvas.getContext("2d");
					if(ctx){
// begin Drawscript code

ctx.strokeStyle="#555460";
ctx.lineWidth=20;
ctx.beginPath();
ctx.lineCap="square";
ctx.moveTo(30,-15);
ctx.lineTo(170,140);
ctx.lineTo(310,-15);
ctx.stroke();

ctx.fillStyle="rgb(252,202,101)";
ctx.strokeStyle="#555460";
ctx.lineWidth=10;
ctx.lineJoin='miter';	
ctx.beginPath();
ctx.moveTo(174,90);
ctx.lineTo(212,168);
ctx.lineTo(297,182);
ctx.lineTo(236,240);
ctx.lineTo(251,325);
ctx.lineTo(175,285);
ctx.lineTo(98,325);
ctx.lineTo(113,240);
ctx.lineTo(51,182);
ctx.lineTo(136,168);
ctx.closePath();
ctx.fill();
ctx.stroke();


ctx.globalCompositeOperation = 'source-atop';

ctx.fillStyle="rgb(238,81,155)";
ctx.lineWidth=0;
ctx.beginPath();
ctx.arc(173,221,40,0,2*Math.PI);
ctx.fill();
ctx.fill();


// end Drawscript code
					}
				}
			}

