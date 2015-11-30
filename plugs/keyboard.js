/*
 * @desc 数字键盘
 * @example 
 * HTML: <span class="calCyCodeTrade1 eui-keyboard-input amount-input device-simulate" name="calCyCode1" value="0" maxlength="12" required="请输入货币1金额！" num="货币1金额必须为数字！" biggerzero="货币1金额必须大于0！" >0</span>
 * JS: $('.calCyCodeTrade1').keyboard({});
 * @author sandycoding@163.com
 * */
;(function(exports) {
	var KeyBoard = function(input, options) {
		var self = this;
		this.options = options || {};
		this.numInput = input;
		this.currentValue = input.innerHTML;
		this.maxlength = options.maxlength || $(input).attr('maxlength') || 100;
		this.keyupCallback = options.keyup;
		this.changeCallback = options.change;
		this.blurCallback = options.blur;
		this.conflictElms = options.conflictElms || [];		
		//点击页面其他控件关闭键盘
		this._handleConflict();
		this._renderKeyBoard();		
		this._bindKeyBoardEvent();
		setTimeout(function() {
			self.show();
		}, 10);
	};

	KeyBoard.prototype._renderKeyBoard = function(){
		var options = this.options;
		var keyboardT = '<table class="key-wrapper" border="0" cellspacing="0" cellpadding="0">';
		keyboardT += '<tr class="keyboard-row"><td class="key key-number" data="1">1</td><td class="key key-number" data="2">2</td><td class="key key-number" data="3">3</td><td class="key key-number" data=".">.</td></tr>';
		keyboardT += '<tr class="keyboard-row"><td class="key key-number" data="4">4</td><td class="key key-number" data="5">5</td><td class="key key-number" data="6">6</td><td class="key key-number figure-delete" data="back">←</td></tr>';
		keyboardT += '<tr class="keyboard-row"><td class="key key-number" data="7">7</td><td class="key key-number" data="8">8</td><td class="key key-number" data="9">9</td><td class="key key-number confirm" rowspan="2" data="confirm">✔</td></tr>';
		keyboardT += '<tr class="keyboard-row"><td class="key key-number" data=""></td><td class="key key-number" data="0">0</td><td class="key key-number" data=""></td></tr>';
		keyboardT += '</table>';
		this.keyboard = document.createElement('div');		
		this.keyboard.id = options.keyboardId || 'keyboard' + Date.parse(new Date());
		this.keyboard.className = 'eui-keyboard';
		this.keyboard.innerHTML = keyboardT;
		$('body').append(this.keyboard);
	};

	KeyBoard.prototype.show = function() {
		if (!$(this.numInput).attr('readonly')) {
			$('.eui-keyboard').removeClass('active');
			$(this.keyboard).addClass('active');
			this.initValue = parseFloat($(this.numInput).html());
			if (!this.initValue) {
				$(this.numInput).html('');
			}
		}
	};

	KeyBoard.prototype.hide = function() {
		var self = this;
		if (self.blurCallback) {
			self.blurCallback(self.numInput.innerHTML);
		}
		$(self.keyboard).removeClass('active');
		if(self.currentValue != self.initValue){
			self.changeCallback(self.currentValue);
		}		
	};
	
	KeyBoard.prototype._bindKeyBoardEvent = function(){
		var self = this;
		$(self.keyboard).find('.key-number').each(function(){
			this.ontouchstart = function(){
				$(this).addClass('active');
				var value = $(this).attr('data');
				if (value !== "back" && value !== "confirm") {
					if (self.numInput.innerHTML.length < self.maxlength) {
						if (!self.numInput.innerHTML.length && (value == '.')) {
							self.numInput.innerHTML += '0.';
						}else if (!((value == '.') && (self.numInput.innerHTML.indexOf('.') != -1))) {
							self.numInput.innerHTML += value;
						}
						self.keyupCallback(self.numInput.innerHTML, value);
						self.currentValue = self.numInput.innerHTML;
					}
				}else if (value === "confirm") {
					self.hide();
				}else if (value === "back") {
					var num = self.numInput.innerHTML;
					if (num) {
						var newNum = num.substr(0, num.length - 1);
						self.numInput.innerHTML = newNum;						
						self.keyupCallback(self.numInput.innerHTML);
						self.currentValue = self.numInput.innerHTML;
					}
				}
			};
			this.ontouchend = function(e) {
				$(this).removeClass('active');
			};
		});
	};
	
	KeyBoard.prototype._handleConflict = function() {
		var self = this;
		var ce = self.conflictElms;
		for (var i = 0, len = ce.length; i < len; i++) {
			$(ce[i]).each(function() {
				this.ontouchstart = function() {
					self.hide();
					$('.eui-keyboard').removeClass('active');
				};
			});
		}
	};

	exports.KeyBoard = KeyBoard;

})(window);

$.fn.keyboard = function(options) {
	$(this).bind('tap', function() {
		var keyboard = $(this).data('keyboard');console.log(keyboard);
		if (!keyboard) {
			var kb = new KeyBoard(this, options);
			$(this).data('keyboard', kb);
		} else {
			keyboard.show();
		}
	});
};