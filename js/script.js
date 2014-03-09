// Script

(function( $ ) {
	$.fn.numberScroll = function(){
		return this.each(function(){
			// How many decimal places does the step attribute have?
			var round = decimalPlaces($(this).attr('step'));

			// We use the 'round' variable to make sure the number 
			// displays as a float or an integer where necessary
			function parseIt(number){
				if(round > 0){
					return parseFloat(number);
				}else{
					return parseInt(number);
				}
			}

			var range_input = $(this);
			var max = parseIt(range_input.attr('max'));
			var min = parseIt(range_input.attr('min'));
			var step = parseIt(range_input.attr('step'));
			var round_factor = Math.pow(10,round);

			// A very scrappy function to quickly work out how many 
			// decimal places the 'step' attribute of the range is using
			function decimalPlaces(number) {
				var stringNumber = String(number);
				if(stringNumber.indexOf(".") < 0){
					return 0;
				}else{
					var decimals = stringNumber.split('.')[1]	
					if(typeof(decimals)== undefined){
						return 0;
					}else{
						return decimals.length;
					}			
				}
			}

			// By its very nature the range control has minimum and maximums
			// that need to be taken into account. This function makes sure we
			// don't accidentally input a value higher than or lower than
			function highLowRound(calc){
				if(calc < min){
					calc = min;
				}
				if(calc > max){
					calc = max;
				}
				if(round > 0){
					calc = calc.toFixed(round)
				}else{
					calc = parseInt(calc);
				}
				range_input.val(calc);
				text_input.val(calc);
				span_input.text(calc);
				return calc;
			}

			// Wrap the element
			$(this).wrap( "<div class='range-wrap'></div>" );

			// Create a label if there should be one
			if($(this).attr('data-label')){
				$('<label/>',{
					"for":$(this).attr('id'),
					"html": $(this).attr('data-label')
				}).insertBefore(this);		
			}

			// Create the all new input, in the form of a span
			var span_input = $('<span/>',{
				"class":"range-value",
				"html": $(this).val()
			});
			var text_input = $('<input/>',{
				"class":"direct-text-input",
				"value": $(this).val(),
				"css":{
					"display":"none"
				}
			});

			text_input.insertBefore(this);
			span_input.insertBefore(this);


			span_input.mousewheel(function(evt){
				// Stop the page scrollkng up and down
				evt.preventDefault();
				value = parseIt($(this).text());
				// Add the scrolled multiplied by the step
				calc = value + (evt.deltaY * step);
				calc = Math.round(calc*round_factor) / round_factor;
				// Keep it inside the bounds
				highLowRound(calc);
			});

			span_input.click(function(){
				$(this).hide();
				text_input.show();
				text_input.focus();
			});

			text_input.blur(function(){
				var calc = parseIt($(this).val());
				highLowRound(calc);
				$(this).hide();
				span_input.show();
			})

			$(this).hide();
		});
	};
}(jQuery));

$("input[type=range]").numberScroll();