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
