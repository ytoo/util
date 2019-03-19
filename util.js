// 数字保留固定小数点位数
Number.prototype.toFixed = function (d) {
        var s = this + "";
        if (!d) d = 0;
        if (s.indexOf(".") == -1) s += ".";
        s += new Array(d + 1).join("0");
        if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
            s = "0" + RegExp.$2,
                pm = RegExp.$1,
                a = RegExp.$3.length,
                b = true;
            if (a == d + 2) {
                a = s.match(/\d/g);
                if (parseInt(a[a.length - 1]) > 4) {
                    for (var i = a.length - 2; i >= 0; i--) {
                        a[i] = parseInt(a[i]) + 1;
                        if (a[i] == 10) {
                            a[i] = 0;
                            b = i != 1;
                        } else break;
                    }
                }
                s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

            }
            if (b) s = s.substr(1);
            return (pm + s).replace(/\.$/, "");
        }
        return this + "";

    };
    
    // 时间格式化成任意格式 传入需要匹配的字符串 y:年 M:月 d:天 h:小时 m:分钟 s:秒 
    // (new Date(需要转换的时间，当为空时默认就是当前时间)).format("yyyy-MM-dd hh:mm:ss")
    Date.prototype.format = function (_format) {
        if (!_format) return this;
        //转换小于10的数字
        var _trans = function (num) {
            return num < 10 ? "0" + num : num.toString();
        }
        var _o = {
            "y+": _trans(this.getFullYear()),
            "M+": _trans(this.getMonth() + 1),
            "d+": _trans(this.getDate()),
            "h+": _trans(this.getHours()),
            "m+": _trans(this.getMinutes()),
            "s+": _trans(this.getSeconds())
        }
        //遍历匹配正则项并支持不同数量的参数
        for (var k in _o) {
            _format = _format.replace(new RegExp(k), function ($1) {
                return _o[k].slice(-$1.length);
            })
        }

        return _format;
    }
    
    
    var util = {
         // 数字格式转换成千分位
         fCommafy: function (num) {
                if (this.fTrim(num + "") === "") {
                    return "";
                }
                if (isNaN(num)) {
                    return "";
                }
                num = num + "";
                var re = /(-?\d+)(\d{3})/;
                if (/^.*\..*$/.test(num)) {
                    var pointIndex = num.lastIndexOf(".");
                    var intPart = num.substring(0, pointIndex);
                    var pointPart = num.substring(pointIndex + 1, num.length);
                    intPart = intPart + "";
                    while (re.test(intPart)) {
                        intPart = intPart.replace(re, "$1,$2");
                    }
                    num = intPart + "." + pointPart;
                } else {
                    num = num + "";
                    while (re.test(num)) {
                        num = num.replace(re, "$1,$2");
                    }
                }
                return num;
            },

            // 去除千分位
            fDelcommafy: function (num) {
                if (this.fTrim(num + "") === "") {
                    return "";
                }
                num = num.replace(/,/gi, '');
                return num;
            },
            //去左空格;
            fLtrim: function (str) {
                var i;
                for (i = 0; i < str.length; i++) {
                    if (str.charAt(i) != " " && str.charAt(i) != " ") break;
                }
                str = str.substring(i, str.length);
                return str;
            },
            //去右空格;
            fRtrim: function (str) {
                var i;
                for (i = str.length - 1; i >= 0; i--) {
                    if (str.charAt(i) != " " && str.charAt(i) != " ") break;
                }
                str = str.substring(0, i + 1);
                return str;
            },
            //去左右空格;
            fTrim: function (str) {
                //s.replace(/(^/s*)|(/s*$)/g, "");
                return this.fRtrim(this.fLtrim(str));
            }
    
    }
    
    // 移动端遮罩层内元素滚动,遮罩层窗体不滚动的JS处理  依赖jq
    // container表示委托的浮层容器元素（$包装器jq对象）一般为页面的整个灰色遮罩层div
    // selectorScrollable表示container中可以滚动的元素的选择器，表示真正的滚动的主体 一般为遮罩层内当内容过多时可以滚动的元素，设置overflow:auto;max-height:某个固定值值
    $.smartScroll = function(container, selectorScrollable) {
        // 如果没有滚动容器选择器，或者已经绑定了滚动事件，忽略
        if (!selectorScrollable || container.data('isBindScroll')) {
            return;
        }
        // 是否是搓浏览器
        // 自己在这里添加判断和筛选
        var isSBBrowser;
        var data = {
            posY: 0,
            maxscroll: 0
        };
        // 事件处理
        container.on({
            touchstart: function (event) {
                var events = event.touches[0] || event;
                // 先求得是不是滚动元素或者滚动元素的子元素
                var elTarget = $(event.target);
                if (!elTarget.length) {
                    return;
                }
                var elScroll;
                // 获取标记的滚动元素，自身或子元素皆可
                if (elTarget.is(selectorScrollable)) {
                    elScroll = elTarget;
                } else if ((elScroll = elTarget.parents(selectorScrollable)).length == 0) {
                    elScroll = null;
                }
                if (!elScroll) {
                    return;
                }
                // 当前滚动元素标记
                data.elScroll = elScroll;

                // 垂直位置标记
                data.posY = events.pageY;
                data.scrollY = elScroll.scrollTop();
                // 是否可以滚动 小于0时可以滚动，等于0时不可以滚动
                data.maxscroll = elScroll[0].scrollHeight - elScroll[0].clientHeight;
            },
            touchmove: function (event) {
                // 如果不足于滚动，则禁止触发整个窗体元素的滚动
                if (data.maxscroll == 0 || isSBBrowser) {
                    // 禁止滚动
                    event.preventDefault();
                }
                // 滚动元素
                var elScroll = data.elScroll;
                // 当前的滚动高度
                var scrollTop = elScroll.scrollTop();
                // 现在移动的垂直位置，用来判断是往上移动还是往下
                var events = event.touches[0] || event;
                // 移动距离
                var distanceY = events.pageY - data.posY;
                if (isSBBrowser) {
                    elScroll.scrollTop(data.scrollY - distanceY);
                    elScroll.trigger('scroll');
                    return;
                }
                // 上下边缘检测
                if (distanceY > 0 && scrollTop == 0) {
                    // 往上滑，并且到头
                    // 禁止滚动的默认行为
                    event.preventDefault();
                    return;
                }
                // 下边缘检测
                if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
                    // 往下滑，并且到头
                    // 禁止滚动的默认行为
                    event.preventDefault();
                    return;
                }
            },
            touchend: function () {
                data.maxscroll = 0;
            }
        });
        // 防止多次重复绑定
        container.data('isBindScroll', true);
    };
