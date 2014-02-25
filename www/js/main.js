;(function($){
	$("document").ready(function(){
		// 跨域控制
		$( document ).bind( "mobileinit", function() {
		    // Make your jQuery Mobile framework configuration changes here!

		    $.mobile.allowCrossDomainPages = true;
		});
		// 表单查询信息
		var formObj = {
			action: 'http://218.206.27.193:8080/cqflyingCityHTTPServer/externalAction!external.action',
			param: {
				phoneNumber: '13800000000',
				serverName: 'weizhangTicket',
				methodName: 'getCarInfo',
				hphm: '',
				hpzl: '',
				clsbdh: '',
				pn: 1,
				ps: 100
			}
		};

		// 加载化验证框架
		$("#loginForm").isHappy({
			fields: {
				'#carNumIpt': {
					required: true,
					message: '这不是车牌号！',
					test: happy.carNumber
				},
				'#carIdIpt': {
					required: true,
					message: '只需输入最后四位！',
					test: happy.carId
				}
			}
		});

		// 逻辑处理
		if (localStorage.carType && localStorage.carNum && localStorage.carId) {
			$("#dialog").attr("href", "onlineDia.html").click();
			$(document).on("pageinit","#onlineDia",function(){
				$("#onlineLab").text("当前账号：渝"+localStorage.carNum);
				$("#loginLi").click(function(){
					$("#onlineDia").dialog("close");
					$("#loginBtn").unbind("click");
					$.showH2Panel();
				});
				$("#logoffLi").click(function(){
					$("#onlineDia").dialog("close");
				});
			});
		}

		$("#loginBtn").click(function(){
			// 第一次登陆和注销（直接登陆就注销此事件，这个逻辑不知道有什么好的方式处理）
			$.modifyLoginForm();
			happy.play(function(){
				$.showH2Panel();
			});
		});

		// 功能模块
		$.fn.extend({
			/**
			 * [showH2 description] 依次显示违章信息（h2标签）
			 * @param  {[type]} count [description] h2标签的个数
			 * @return {[type]}       [description] 退出迭代
			 */
			showDiv: function(count){
				var $box = $(this);
				$box.find("div.custom-corners:hidden:first").show("slow", function() {
					$(this).find("div.ui-body").slideDown("slow", function(){
						if (count != 1) {
							$box.showDiv(count-1);
						}
					});
				});
				return ;
			}
		});

		$.extend({
			modifyLoginForm: function(){
				localStorage.carType = $("#carTypeSel input[name='carTypeRdo']:checked")
					.val();
				localStorage.carNum = $("#carNumIpt").val().toUpperCase();
				localStorage.carId = $("#carIdIpt").val();
			},
			/**
			 * [showH2Panel description] 提交表单跨域获取违章信息展示
			 * @return {[type]} [description] 退出函数
			 */
			showH2Panel: function(){
				formObj.param.hphm = localStorage.carNum;
				formObj.param.hpzl = localStorage.carType;
				formObj.param.clsbdh = localStorage.carId;

				$("#loginForm").slideUp("slow", function(){
					$(this).remove();
				});

				var url = formObj.action + "?" + $.param(formObj.param);
				$.getJSON(url, function(info){
					// data for debug
					if ($.isPlainObject(info)) {
						// TODO 1.1版本全局缓存
						var car = info.CarInfo;
						var type = (car.Hpzl=="01")?"大车车":"小车车";

						var h2Head = '<h2><a href="javascript:location.reload();">'+car.Clpp1+type+'\t渝'+car.Hphm+'</a></h2><br/>';
						var $box = $("#carBox").append(h2Head);

						var score = 0;
						var money = 0;
						$.each(info.List, function(){
							score += parseInt(this.Jfz);
							money += parseInt(this.Fkje);
							var h2List = '<h2>'+this.Wfdd+'</h2>';
							h2List += '<h2>'+this.Wfxwmc+'</h2>';
							h2List += '<h2>扣分：'+this.Jfz+'分</h2>';
							h2List += '<h2>罚款：'+this.Fkje+'大洋</h2>';

							var divList = '<div class="ui-corner-all custom-corners" style="display:none;"><div class="ui-bar ui-bar-a"><h3>';
							divList += this.Wfsj+'</h3></div>';
							divList += '<div class="ui-body ui-body-a" style="display:none;">';
							divList += h2List + '</div></div>';

							console.log(divList);

							$box.append(divList+'<br/>');
						});

						var h2Foot = "<h2>目前有"+info.Count+"次未处理的违章</h2>";
						h2Foot += "<h2>一哈出脱"+score+"分</h2>";
						h2Foot += "<h2>总计罚款"+money+"元</h2>";
						$box.append(h2Foot);

						// 显示数据
						$box.showDiv($box.find("div.custom-corners").size());
					}
				});
				return ;
			}
		});

	});
})(jQuery);