
function calcCleanArmor(dmgRedPercent){
	let damageRed = dmgRedPercent / 100.0;
	let damageMul = 1.0 - damageRed;
	let cleanArmor = ((100.0/damageMul) - 100.0)/0.845;
	return cleanArmor;
}
function calcArmor(dmgRedPercent=50, penetration=0, percentPenetration=0){
	let cleanArmor = calcCleanArmor(dmgRedPercent);
	let armor = (cleanArmor/(1.0-(percentPenetration/100.0)))+penetration;
	return armor;
}
function calcPenetration(dmgRedPercent=50, armor=0, percentPenetration=0){
	
	let cleanArmor = calcCleanArmor(dmgRedPercent);
	let penetration = armor - (cleanArmor/(1.0-(percentPenetration/100.0)));
	return penetration;
}
function calcPercentPenetration(dmgRedPercent=50, armor=0, penetration=0){
	
	let cleanArmor = calcCleanArmor(dmgRedPercent);
	let percentPenetration = (1.0-cleanArmor/(armor - penetration)) * 100.0;
	return percentPenetration;
}
function calcDamageReduction(armor=0, penetration=0, percentPenetration=0){
	let cleanArmor = (armor-penetration)*(1.0-(percentPenetration/100.0));
	let damageMul = 100.0/(100.0+cleanArmor*0.845);
	let damageRed = 1.0 - damageMul;
	let damageRedPercent = 100.0 * damageRed;
	return damageRedPercent;
}

function itemclick(e) {    
	++e.dataSeries.clickCount;
    for(var i = 0; i < e.chart.options.data.length; i++) {
    	            
		if (e.dataSeries == e.chart.options.data[i]) {  
			e.chart.options.data[i].visible = !e.chart.options.data[i].visible;
		}
    }
    e.chart.render();
}
function newSeries(name){
	return {
		name: name,
		showInLegend: true,
		type: "spline",
		click: selectOnClick,
		markerSize: 4,
		selectedMarkerSize: 10,
		dataPoints: []
	};
}

var evt1 = null;
var evt2 = null;
var point1 = null;
var point2 = null;

function setPoint1(point){
	point1 = point;
	
	if(point1 == null){
		jQuery("#point-1-x").text("");
		jQuery("#point-1-y").text("");
	}else{
		jQuery("#point-1-x").text(point1.x.toFixed(2));
		jQuery("#point-1-y").text(point1.y.toFixed(2));
	}
	
	setPoint2(null);
}

function setPoint2(point){
	point2 = point;
	
	if(point2 == null){
		jQuery("#point-2-x").text("");
		jQuery("#point-2-y").text("");
	}else{
		jQuery("#point-2-x").text(point2.x.toFixed(2));
		jQuery("#point-2-y").text(point2.y.toFixed(2));
		
	}
	showDiff();
}

function showDiff(){
	if(point2 == null){
		jQuery("#point-diff-x").text("");
		jQuery("#point-diff-y").text("");
	}else{
		jQuery("#point-diff-x").text((point2.x - point1.x).toFixed(2));
		jQuery("#point-diff-y").text((point2.y - point1.y).toFixed(2));
	}
}

function cleanSeries(series){
	if(series != null){
		for(let i = 0; i < series.dataPoints.length; i++){
			series.dataPoints[i].markerType = "circle";
			series.dataPoints[i].markerSize = series.markerSize;
		}
	}
}

var clickCounter = 0;
function selectOnClick(e) {  
	clickCounter++;
	if( clickCounter % 2 != 0){// || series != e.dataSeries){
		if(evt2 != null && evt1.dataSeries != evt2.dataSeries){
			cleanSeries(evt2.dataSeries);
			evt2.chart.render();
		}
		if(evt1 != null){
			cleanSeries(evt1.dataSeries);
			if(evt1.chart != e.chart){
				evt1.chart.render();
			}
		}
		evt1 = e;
		evt2 = null;
		
		setPoint1(e.dataPoint);
		e.dataPoint.markerType = "square";
		e.dataPoint.markerSize = e.dataSeries.selectedMarkerSize;
    }
	else {  
		if(point1 == e.dataPoint){
			clickCounter--;
			return;
		}
		evt2 = e; 
		setPoint2(e.dataPoint);  
		e.dataPoint.markerType = "cross";
		e.dataPoint.markerSize = e.dataSeries.selectedMarkerSize;
	}  
	e.chart.render();
}


function renderArmorChart(){
	let armor = parseFloat(jQuery("#armor").val());
	let bonusArmor = parseFloat(jQuery("#bonus-armor").val());
	let bonusArmor2 = parseFloat(jQuery("#bonus-armor-2").val());
	let armorB = armor+bonusArmor;
	let armorB2 = armor+bonusArmor2;
	let armorBB2 = armor+bonusArmor+bonusArmor2;
	let targetReduction = parseFloat(jQuery("#target-reduction").val());
	let max = parseFloat(jQuery("#max-armor").val());
	let penetration = parseFloat(jQuery("#armor-penetration").val());
	let percentPenetration = parseFloat(jQuery("#armor-percent-penetration").val());
	
	let data = [];
	
	let start = 0;
	let step = 5;
	
	let j = -1;
	
	if(bonusArmor2 != 0){
		if(bonusArmor != 0){
			if(penetration != 0){
				if(percentPenetration != 0){
					++j;
					data.push(newSeries("Bonus 2, Bonus, pen, percent"));
					for (let i = start; i <= max; i+=step){
						data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2+bonusArmor,penetration, percentPenetration)});
					}
				}
				++j;
				data.push(newSeries("Bonus 2, Bonus, pen"));
				for (let i = start; i <= max; i+=step){
					data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2+bonusArmor,penetration,0)});
				}
			}
			if(percentPenetration != 0){
				++j;
				data.push(newSeries("Bonus 2, Bonus, percent"));
				for (let i = start; i <= max; i+=step){
					data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2+bonusArmor,0, percentPenetration)});
				}
			}
			++j;
			data.push(newSeries("Bonus 2, Bonus"));
			for (let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2+bonusArmor,0,0)});
			}
		}
		if (penetration != 0){
			if(percentPenetration != 0){
				++j;
				data.push(newSeries("Bonus 2, Pen, percent"));
				for (let i = start; i <= max; i+=step){
					data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2,penetration, percentPenetration)});
				}
			}
			++j;
			data.push(newSeries("Bonus 2, pen"));
			for (let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2,penetration,0)});
			}
		}
		if (percentPenetration != 0){
			++j;
			data.push(newSeries("Bonus 2, Percent"));
			for (let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2,0, percentPenetration)});
			}
		}
		++j;
		data.push(newSeries("Bonus 2"));
		for (let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor2,0,0)});
		}
	}
	if(bonusArmor != 0){
		if(penetration != 0){
			if(percentPenetration != 0){
				++j;
				data.push(newSeries("Bonus, pen, percent"));
				for (let i = start; i <= max; i+=step){
					data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor,penetration, percentPenetration)});
				}
			}
			++j;
			data.push(newSeries("Bonus, pen"));
			for (let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor,penetration,0)});
			}
		}
		if(percentPenetration != 0){
			++j;
			data.push(newSeries("Bonus, percent"));
			for (let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor,0, percentPenetration)});
			}
		}
		++j;
		data.push(newSeries("Bonus"));
		for (let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(i+bonusArmor,0,0)});
		}
	}
	if (penetration != 0){
		if(percentPenetration != 0){
			++j;
			data.push(newSeries("Pen, percent"));
			for (let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(i,penetration, percentPenetration)});
			}
		}
		++j;
		data.push(newSeries("pen"));
		for (let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(i,penetration,0)});
		}
	}
	if (percentPenetration != 0){
		++j;
		data.push(newSeries("Percent"));
		for (let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(i,0, percentPenetration)});
		}
	}
	++j;
	data.push(newSeries("Pure armor"));
	for (let i = start; i <= max; i+=step){
		data[j].dataPoints.push({x:i, y:calcDamageReduction(i,0,0)});
	}
	
	
	var chart = new CanvasJS.Chart("armorChart", {
		animationEnabled: true,  
		title:{
			text: "Damage Reduction by Armor"
		},
		legend: {
			cursor: "pointer",
			itemclick: itemclick
		},
		axisY: {
			title: "Damage Reduction",
			labelAutoFit: true,
			includeZero: true,
			suffix: "%",
			stripLines: [
				{
					value: 50,
					labelPlacement: "outside",
					color: "black",
					labelFontColor: "black",
					labelBackgroundColor: "transparent",
					label: "50%"
				},
				{
					value: targetReduction,
					labelAlign: "far",
					labelPlacement: "inside",
					color: "green",
					labelFontColor: "green",
					label: "Target"
				}
			]
		},
		axisX: {
			title: "Armor",
			labelAutoFit: true,
			includeZero: true,
			stripLines: [
				{
					value: 180,
					labelAlign: "near",
					labelPlacement: "inside",
					color: "green",
					labelFontColor: "green",
					label: "Avg Tank: 180"
				},
				{
					value: armor,
					label: "Armor"
				},
				{
					value: armorB,
					label: "Armor+Bonus 1"
				},
				{
					value: armorB2,
					labelAlign: "near",
					labelPlacement: "inside",
					color: "green",
					labelFontColor: "green",
					label: "Armor+Bonus 2"
				},
				{
					value: armorBB2,
					labelAlign: "near",
					labelPlacement: "inside",
					color: "green",
					labelFontColor: "green",
					label: "Armor+Bonus 1+2"
				},
			]
		},
		data: data
	});
	chart.render();
}

function renderPenetrationChart(){

	let targetReduction = parseFloat(jQuery("#target-reduction").val());
	let armor = parseFloat(jQuery("#armor").val());
	let bonusArmor = parseFloat(jQuery("#bonus-armor").val());
	let bonusArmor2 = parseFloat(jQuery("#bonus-armor-2").val());
	let armorB = armor+bonusArmor;
	let armorB2 = armor+bonusArmor2;
	let armorBB2 = armor+bonusArmor+bonusArmor2;
	let percentPenetration = parseFloat(jQuery("#armor-percent-penetration").val());
	let penetration = parseFloat(jQuery("#armor-penetration").val());
	
	let data = [];
	
	let start = 0;
	let max = 100;
	let step = 5;
	
	let j = -1;
	
	if(bonusArmor2 != 0){
		if(bonusArmor != 0){
			if(percentPenetration != 0){
				data.push(newSeries("Bonus2, Bonus, Percent"));
				++j;
				for(let i = start; i <= max; i+=step){
					data[j].dataPoints.push({x:i, y:calcDamageReduction(armorBB2, i, percentPenetration)});
				}
			}
			data.push(newSeries("Bonus2, Bonus"));
			++j;
			for(let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(armorBB2, i, 0)});
			}
		}
		if(percentPenetration != 0){
			data.push(newSeries("Bonus2, Percent"));
			++j;
			for(let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB2, i, percentPenetration)});
			}
		}
		data.push(newSeries("Bonus2"));
		++j;
		for(let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB2, i, 0)});
		}
	}
	if(bonusArmor != 0){
		if(percentPenetration != 0){
			data.push(newSeries("Bonus, Percent"));
			++j;
			for(let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB, i, 0)});
			}
		}
		data.push(newSeries("Bonus"));
		++j;
		for(let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB, i, 0)});
		}
	}
	if(percentPenetration != 0){
		data.push(newSeries("Percent"));
		++j;
		for(let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(armor, i, percentPenetration)});
		}
	}
	data.push(newSeries("Just Percent"));
	++j;
	for(let i = start; i <= max; i+=step){
		data[j].dataPoints.push({x:i, y:calcDamageReduction(armor, i, 0)});
	}
	
	
	var chart = new CanvasJS.Chart("penetrationChart", {
		animationEnabled: true,  
		title:{
			text: "Damage Reduction by Value Penetration"
		},
		legend: {
			cursor: "pointer",
			itemclick: itemclick
		},
		axisY: {
			title: "Damage Reduction",
			labelAutoFit: true,
			includeZero: true,
			suffix: "%",
			stripLines: [
				{
					value: 50,
					labelPlacement: "outside",
					color: "black",
					labelFontColor: "black",
					labelBackgroundColor: "transparent",
					label: "50%"
				},
				{
					value: targetReduction,
					labelAlign: "far",
					labelPlacement: "inside",
					color: "green",
					labelFontColor: "green",
					label: "Target"
				}
			]
		},
		axisX: {
			title: "Armor Penetration",
			labelAutoFit: true,
			includeZero: true,
			stripLines: [
				{
					value: 15,
					label: "15"
				},
				{
					value: 30,
					label: "30"
				},
				{
					value: 45,
					label: "45"
				},
				{
					value: 60,
					label: "60"
				},
				{
					value: penetration,
					label: "Input: " + penetration
				}
			]
		},
		data: data
	});
	chart.render();
}

function renderPercentPenetrationChart(){

	let targetReduction = parseFloat(jQuery("#target-reduction").val());
	let armor = parseFloat(jQuery("#armor").val());
	let bonusArmor = parseFloat(jQuery("#bonus-armor").val());
	let bonusArmor2 = parseFloat(jQuery("#bonus-armor-2").val());
	let armorB = armor+bonusArmor;
	let armorB2 = armor+bonusArmor2;
	let armorBB2 = armor+bonusArmor+bonusArmor2;
	let penetration = parseFloat(jQuery("#armor-penetration").val());
	let percentPenetration = parseFloat(jQuery("#armor-percent-penetration").val());
	
	let data = [];
	
	let start = 0;
	let max = 115;
	let step = 5;
	
	let j = -1;
	
	if(bonusArmor2 != 0){
		if(bonusArmor != 0){
			if(penetration != 0){
				data.push(newSeries("Bonus2, Bonus, Pen"));
				++j;
				for(let i = start; i <= max; i+=step){
					data[j].dataPoints.push({x:i, y:calcDamageReduction(armorBB2, penetration, i)});
				}
			}
			data.push(newSeries("Bonus2, Bonus"));
			++j;
			for(let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(armorBB2, 0, i)});
			}
		}
		if(penetration != 0){
			data.push(newSeries("Bonus2, Pen"));
			++j;
			for(let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB2, penetration, i)});
			}
		}
		data.push(newSeries("Bonus2"));
		++j;
		for(let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB2, 0, i)});
		}
	}
	if(bonusArmor != 0){
		if(penetration != 0){
			data.push(newSeries("Bonus, Pen"));
			++j;
			for(let i = start; i <= max; i+=step){
				data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB, penetration, i)});
			}
		}
		data.push(newSeries("Bonus"));
		++j;
		for(let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(armorB, 0, i)});
		}
	}
	if(penetration != 0){
		data.push(newSeries("Pen"));
		++j;
		for(let i = start; i <= max; i+=step){
			data[j].dataPoints.push({x:i, y:calcDamageReduction(armor, penetration, i)});
		}
	}
	data.push(newSeries("Just Percent"));
	++j;
	for(let i = start; i <= max; i+=step){
		data[j].dataPoints.push({x:i, y:calcDamageReduction(armor, 0, i)});
	}
	
	
	var chart = new CanvasJS.Chart("percentPenetrationChart", {
		animationEnabled: true,  
		title:{
			text: "Damage Reduction by Percent Penetration"
		},
		legend: {
			cursor: "pointer",
			itemclick: itemclick
		},
		axisY: {
			title: "Damage Reduction",
			includeZero: true,
			labelAutoFit: true,
			suffix: "%",
			stripLines: [
				{
					value: 50,
					labelPlacement: "outside",
					color: "black",
					labelFontColor: "black",
					labelBackgroundColor: "transparent",
					label: "50%"
				},
				{
					value: targetReduction,
					labelAlign: "far",
					labelPlacement: "inside",
					color: "green",
					labelFontColor: "green",
					label: "Target"
				}
			]
		},
		axisX: {
			title: "Percent Armor Penetration",
			includeZero: true,
			labelAutoFit: true,
			stripLines: [
				{
					value: 15,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "Raptor Machete"
				},
				{
					value: 40,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "Malefic Roar"
				},
				{
					value: 55,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "MR + RM"
				},
				{
					value: 60,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "Hilda Ult Max"
				},
				{
					value: 100,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "HUM + MR"
				},
				{
					value: 115,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "HUM + MR + RM"
				},
				{
					value: percentPenetration,
					labelWrap:true,
					labelPlacement: "inside",
					labelAlign: "near",
					label: "Input: " + percentPenetration
				}
			]
		},
		data: data
	});
	chart.render();
}

function renderCharts(){
	renderArmorChart();
	renderPenetrationChart();
	renderPercentPenetrationChart();
}

function refreshCalc(){
	
	let targetReduction = parseFloat(jQuery("#target-reduction").val());
	let armor = parseFloat(jQuery("#armor").val());
	let penetration = 0;
	let percentPenetration =0;
	
	if(jQuery("#bonus-armor-cb").is(':checked')){
		let bonusArmor = parseFloat(jQuery("#bonus-armor").val());
		armor += bonusArmor;
	}
	if(jQuery("#bonus-armor-2-cb").is(':checked')){
		let bonusArmor2 = parseFloat(jQuery("#bonus-armor-2").val());
		armor += bonusArmor2;
	}
	if(jQuery("#penetration-cb").is(':checked')){
		penetration =  parseFloat(jQuery("#armor-penetration").val());
	}
	
	if(jQuery("#percent-penetration-cb").is(':checked')){
		percentPenetration =  parseFloat(jQuery("#armor-percent-penetration").val());
	}
	
	jQuery("#achieved-reduction").text(calcDamageReduction(armor, penetration, percentPenetration).toFixed(2));
	jQuery("#needed-armor").text(calcArmor(targetReduction, penetration, percentPenetration).toFixed(2));
	jQuery("#needed-penetration").text(calcPenetration(targetReduction, armor, percentPenetration).toFixed(2));
	jQuery("#needed-percent-penetration").text(calcPercentPenetration(targetReduction, armor, penetration).toFixed(2));
}

$(function () {
	jQuery(".graph-input").change(function(){
		renderCharts();
		refreshCalc();
	});
	jQuery(".calc-input").change(function(){
		refreshCalc();
	});
	jQuery("form").submit(function(e){
		e.preventDefault();
		return false;
	  });
	renderCharts();
	refreshCalc();
	
});