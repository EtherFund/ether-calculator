/*
- ether.calculator.js v0.1
- GAS calculator
- for http://ether.fund/tool/calculator
- by @jrbedard
*/


// Init
$(function () {
	var hash = document.location.hash
	if(hash) {
		var params = getHashParams(); // from URL hash
		setEtherInput('amount', params['av'], params['au']);
		$("#input-gas").val(params['gv']);
		setEtherInput('gasprice', params['gpv'], params['gpu']); // from URL hash
		
	} else {
		setEtherInput('amount',1,'ether');
		$("#input-gas").val(10000);
		setEtherInput('gasprice',10,'szabo');
	}
	
	$("#input-amount").focus();
	
	var input = validate();
	if(input) {
		calculate(input);
		$("#go-btn").removeClass('disabled');
	}
});



// Selected value unit
$("#dropdown-amount li a").click(function() {
	setEtherInput('amount', null, $(this).text()); // todo: use val, not text...
	$("#input-amount").focus();
	$('#go-btn').click(); return false;
});

// Selected gasprice unit
$("#dropdown-gasprice li a").click(function() {
	setEtherInput('gasprice', null, $(this).text()); // todo: use val, not text...
	$("#input-gasprice").focus();
	$('#go-btn').click(); return false;
});

// Changed value
$("#input-amount, #input-gas, #input-gasprice").bind("change paste keyup", function() {
   $('#go-btn').click(); return true;
});

// Pressed Enter
$('#input-amount, #input-gas, #input-gasprice').keypress(function (e) {
	var key = e.which;
	if(key == 13) {
		$('#go-btn').click(); return false;
	}
});

// Clicked GO
$("#go-btn").click(function() {
	var input = validate();
	if(input) {
		calculate(input);
	}
});


// Selected OUTPUT gasprice unit
$("#dropdown-gas-subtotal li a").click(function() {
	var unit = $(this).text();
	var output = convertEther(gSubtotal, null); // convert
	setEtherInput('gas-subtotal', output[unit], unit); // display in unit
	return true; // todo: no #
});

// Selected OUTPUT gasprice unit
$("#dropdown-cost-total li a").click(function() {
	var unit = $(this).text();
	var output = convertEther(gTotal, null); // convert
	setEtherInput('cost-total', output[unit], unit);
	return true; // todo: no #
});





// validate
function validate() {
	var input = validateEtherInput(['amount','gas','gasprice']);
	if(!input) {
		return;
	}
	
	input['amount']['hash'] = ['av','au'];
	input['gas']['hash'] = ['gv','gu'];
	input['gasprice']['hash'] = ['gpv','gpu'];
	//console.log(input);
	setHashParams(input, false);
	return input;
}


var gSubtotal = {value:0,unit:''};
var gTotal = {value:0,unit:''};


// calculate
function calculate(input) {
	var amount = input['amount'];
	var gas = input['gas'];
	var gasprice = input['gasprice'];
	
	
	// Gas subtotal
	gSubtotal['value'] = new BigNumber(gas['value']).times(gasprice['value']);
	gSubtotal['unit'] = gasprice['unit'];
	gSubtotal = figureEtherUnit(gSubtotal);
	
	setEtherInput('gas-subtotal', gSubtotal['value'].noExponents(), gSubtotal['unit']); // Set gas cost sub-total
	
	
	// Total
	var output = convertEther(gSubtotal, null); // convert
	
	gTotal['value'] = new BigNumber(amount['value']).plus(output[amount['unit']]);
	gTotal['unit'] = amount['unit'];
	gTotal = figureEtherUnit(gTotal);
	
	setEtherInput('cost-total', gTotal['value'].noExponents(), gTotal['unit']); // Set total
}








