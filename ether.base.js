/*
- ether.base.js v0.1
- Basic data structures and utilities to build ethereum tools & tutorials
- for http://ether.fund
- by @jrbedard
*/

var ETH_UNITS = {'wei':1e-18, 'Kwei':1e-15, 'Mwei':1e-12, 'Gwei':1e-9, 'szabo':1e-6, 'finney':1e-3, 
	'ether':1.0, 'Kether':1e3, 'Mether':1e6, 'Gether':1e9, 'Tether':1e12
};

var GAS = {};

var BTC_UNITS = {'satoshi':1e-8, 'bit':1e-6, 'BTC':1.0};


var SALE_PRICE = 2000.0; // Ethereum ether genesis sale, 1 BTC = 2000 ETH

var btcprice = 0.0; // BTC


function getBTCprice(func) {
	$.get('/api/btc_price', function(data) {
		//btcprice = new BigNumber(data);
		btcprice = data.toFixed(2);
		func(btcprice);
	});
}


function convertUSD() {
	
}



// Convert to all ether denominations
function convertEther(input, options) {
	// todo options
	var ether = new BigNumber(ETH_UNITS[input['unit']]).times(input['value']); // value for 1 ETH
	
	var output = $.extend({}, ETH_UNITS);
	$.each(ETH_UNITS, function(unit, value) {
		output[unit] = ether.dividedBy(value).noExponents();
	});
	return output;
}

// figure wich ether unit to use
function figureEtherUnit(input) {
	var output = convertEther(input);
	var best = null; // best unit
	$.each(output, function(unit, value) {
		val = new BigNumber(value);	
		if(value >= 1 && value <= 1000) {
			best = {unit:unit, value:val};
		}
	});
	//console.log(best);
	if(!best) { best = input; }
	return best;
}



// convert to all BTC denomination
function convertBTC(input, options) {
	// todo options
	var btc = new BigNumber(BTC_UNITS[input['unit']]).times(input['value']); // value for 1 BTC
	
	var output = $.extend({}, BTC_UNITS);
	$.each(BTC_UNITS, function(unit, value) {
		output[unit] = btc.dividedBy(value).noExponents();
	});
	return output;
}

// figure 
function figureBTCUnit(input) {
	
}





// set value+unit selector
function setEtherInput(id, value, unit) {
	if(value) {
		$("#input-"+id).val(value); // value
	}
	if(unit) {
		$("#btn-"+id).val(unit);
		$("#btn-"+id).html(unit+" <span class='caret'></span>");
		
		$("#dropdown-"+id+" li").removeClass("active");
		$("#dropdown-"+id+" li#in-"+unit).addClass("active");
	}
}


// validate an ether input value
function validateEtherInput(ids) {
	var values = {};
	for(i=0; i<ids.length; i++) {
		var id = ids[i];
		// value
		var val = $("#input-"+id).val();
		if(!val || val=="") {
			$("#input-"+id+"-wrap").addClass("has-error");
			continue;
		}
		if(isNaN(val)) { // todo: if number!
			$("#input-"+id+"-wrap").addClass("has-error");
			continue;
		}
		if(val.length > 14) { // todo: if number!
			$("#input-"+id+"-wrap").addClass("has-error");
			continue;
		}
		// cleared!
		$("#input-"+id+"-wrap").removeClass("has-error");
		
		// todo: if btn
		var unit = $("#btn-"+id).val();
		if(!unit) {
			
		}
		values[id] = {value:parseFloat(val), unit:unit};		
	}
	if(ids.length != Object.keys(values).length) { // invalid inputs
		return null;
	}
	return values;
}


// no scientific notation: 1e3 -> 1000
BigNumber.prototype.noExponents = function(){
	var data= String(this).split(/[eE]/);
	if(data.length== 1) return data[0]; 

	var  z= '', sign= this<0? '-':'',
	str= data[0].replace('.', ''),
	mag= Number(data[1])+ 1;

	if(mag<0){
		z= sign + '0.';
		while(mag++) z += '0';
		return z + str.replace(/^\-/,'');
	}
	mag -= str.length;  
	while(mag--) z += '0';
	return str + z;
}

// add english commas to numbers
Number.prototype.withCommas = function() {
	return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toggleCommas(display) {
	if(display) {
		//$("input").val( $(this).val()).withCommas() );
	}
}



// set URL params
function setHashParams(input, set) {
	var hash = "";
	$.each(input, function(id, obj) {
		 hash="v="+new BigNumber(obj.value).noExponents()+'&u='+obj.unit;
	});
	$(".shareLink").attr('href', gPageUrl+"#"+hash);
	if(set) { // actually set hash in URL
		if(history.pushState) {
	    	history.pushState(null,null,"#"+hash);
		} else {
	    	document.location.hash = hash;
		}
	}
	return hash;
}

// permanent link with hash, clicked
$(".shareLink").click(function() {
	window.location.reload();
});


// get params from URL hash
function getHashParams() {
	var hashParams = {};
	var e,
	    a = /\+/g, // Regex for replacing addition symbol with a space
	    r = /([^&;=]+)=?([^&;]*)/g,
	    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
	    q = window.location.hash.substring(1);

	while (e = r.exec(q))
	   hashParams[d(e[1])] = d(e[2]);

	return hashParams;
}

