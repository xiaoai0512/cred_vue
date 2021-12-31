/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor','wangaidan']
  // return valid_map.indexOf(str.trim()) >= 0
  const reg = /^[A-Za-z]+$/
  return reg.test(str)

}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isNumber(val) {
  const reg = /^[0-9]*$/
  return reg.test(val)
}


//密码规则：至少八个字符，至少一个字母和一个数字
export function passwordPatter(password) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
  return reg.test(password)
}

//判断是否含有中文
export function hasChinese (val) {
  let pattern = new RegExp("[\u4E00-\u9FA5]+");
  if(pattern.test(val)){
      return true
  }else {
    return false
  }
}

/* 必填  最大长度 */
// required : 布尔值
export function validateMustMaxlength ( rule, value, callback , params) {
  if (!val) {
    // callback(new Error('不能为空'));
    return false
  }

  if (val.length <= param) {
    // callback()
    return true
  } else {
    // callback(new Error('输入长度不能大于'+param+'字符'))
    return false
  }
}

/*是否合法IP地址*/
export function validateIP(rule, value,callback) {
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的IP地址'));
    } else {
      callback();
    }
  }
}

/* 是否手机号码或者固话*/
export function validPhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的电话号码或者固话号码'));
    } else {
      callback();
    }
  }
}
/* 是否固话*/
export function validTelphone(rule, value,callback) {
  const reg =/0\d{2}-\d{7,8}/;
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'));
    } else {
      callback();
    }
  }
}
/* 是否手机号码*/
export function validPhone(value) {    
  const reg =/^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(value)
}

/* 是否邮箱*/
export function validateEMail(rule, value,callback) {
  const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else{
    if (!reg.test(value)){
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  }
}
/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/*验证内容是否英文数字以及下划线*/
export function isPassword(rule, value, callback) {
  const reg =/^[_a-zA-Z0-9]+$/;
  if(value==''||value==undefined||value==null){
    callback();
  } else {
    if (!reg.test(value)){
      callback(new Error('密码仅由英文字母，数字以及下划线组成'));
    } else {
      callback();
    }
  }
}

/*自动检验数值的范围*/
export function checkMax20000(rule, value, callback) {
  if (value == '' || value == undefined || value == null) {
    callback();
  } else if (!Number(value)) {
    callback(new Error('请输入[1,20000]之间的数字'));
  } else if (value < 1 || value > 20000) {
    callback(new Error('请输入[1,20000]之间的数字'));
  } else {
    callback();
  }
}

//验证数字输入框最大数值,32767
export function checkMaxVal(rule, value,callback) {
  if (value < 0 || value > 32767) {
    callback(new Error('请输入[0,32767]之间的数字'));
  } else {
    callback();
  }
}
//验证是否1-99之间
export function isOneToNinetyNine(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[1-9][0-9]{0,1}$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数，值为【1,99】'));
      } else {
        callback();
      }
    }
  }, 0);
}

// 验证是否整数
export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}
// 验证是否整数,非必填
export function isIntegerNotMust(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 1000);
}

// 验证是否是[0-1]的小数
export function isDecimal(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入[0,1]之间的数字'));
    } else {
      if (value < 0 || value > 1) {
        callback(new Error('请输入[0,1]之间的数字'));
      } else {
        callback();
      }
    }
  }, 100);
}

// 验证是否是[1-10]的小数,即不可以等于0
export function isBtnOneToTen(rule, value, callback) {
  if (typeof value == 'undefined') {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数，值为[1,10]'));
    } else {
      if (!(value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value == '7' || value == '8' || value == '9' || value == '10')) {
        callback(new Error('请输入正整数，值为[1,10]'));
      } else {
        callback();
      }
    }
  }, 100);
}
// 验证是否是[1-100]的小数,即不可以等于0
export function isBtnOneToHundred(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入整数，值为[1,100]'));
    } else {
      if (value < 1 || value > 100) {
        callback(new Error('请输入整数，值为[1,100]'));
      } else {
        callback();
      }
    }
  }, 100);
}
// 验证是否是[0-100]的小数
export function isBtnZeroToHundred(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入[1,100]之间的数字'));
    } else {
      if (value < 0 || value > 100) {
        callback(new Error('请输入[1,100]之间的数字'));
      } else {
        callback();
      }
    }
  }, 100);
}

// 验证端口是否在[0,65535]之间
export function isPort(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (value == '' || typeof(value) == undefined) {
      callback(new Error('请输入端口值'));
    } else {
      const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入在[0-65535]之间的端口值'));
      } else {
        callback();
      }
    }
  }, 100);
}
// 验证端口是否在[0,65535]之间，非必填,isMust表示是否必填
export function isCheckPort(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (value == '' || typeof(value) == undefined) {
      //callback(new Error('请输入端口值'));
    } else {
      const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入在[0-65535]之间的端口值'));
      } else {
        callback();
      }
    }
  }, 100);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}
/*保留2为小数*/
export function validatetoFixedNew(str) {
  return str ;
}
/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}


/* 身份证验证*/
/*
 * @Description:身份证校验规则.
 * @Version: 1.0
 * @Author: wangaidan
 * @Date: 2021-03-26
 */
export function isIdentityId(identityId) {
    var patrn = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;//长度或格式校验
    //地区校验
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    // 出生日期验证
    var sBirthday = (
        identityId.substr(6, 4) +
        "-" +
        Number(identityId.substr(10, 2)) +
        "-" +
        Number(identityId.substr(12, 2))
    ).replace(/-/g, "/"),
        d = new Date(sBirthday)
    // 身份证号码校验 最后4位  包括最后一位的数字/字母X
    var sum = 0,
        weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        codes = "10X98765432";
    for (var i = 0; i < identityId.length - 1; i++) {
        sum += identityId[i] * weights[i];
    }
    var last = codes[sum % 11]; //计算出来的最后一位身份证号码

    var errorMsg = '';
    if (identityId === '') {
        errorMsg = "身份证号不能为空"
    } else if (!patrn.exec(identityId)) {
        errorMsg = "输入的身份证长度或格式错误"
    } else if (!aCity[parseInt(identityId.substr(0, 2))]) {
        errorMsg = "输入的身份证地区非法"
    } else if (sBirthday != d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()) { errorMsg = "身份证上的出生日期非法" } else if (identityId[identityId.length - 1] != last) {
        errorMsg = "输入的身份证号非法"
    }
    return errorMsg;
}


/* 测试环境，身份证验证 只验证18位，*/
export function isIdentityIdTest(str) {
    /*测试环境，身份证验证 只验证18位，*/
    const reg = /^\d{17}(\d|x|X)$/;
    var errorMsg = '';
    if (str === '') {
        errorMsg = "身份证号不能为空"
    } else if (!reg.test(str)) {
        errorMsg = "身份证号非法"
    }
    return errorMsg;
}


/* 港澳居民来往内地通行证验证*/
/*
 * @Description:港澳居民来往内地通行证规则.
 * @Version: 1.0
 * @Author: wangaidan
 * @Date: 2021-03-26
 */
export function isHKCard(str) {
    /*长11位，以HM开头+10位数字*/
    const reg = /^([HMhm]\d{10}(\(\w{1}\))?)$/;
    var errorMsg = '';
    if (str === '') {
        errorMsg = "通行证号不能为空"
    } else if (!reg.test(str)) {
        errorMsg = "通行证号非法"
    }
    return errorMsg;
}


/* 台湾居民来往内地通行证验证*/
/*
 * @Description:台湾居民来往内地通行证规则.
 * @Version: 1.0
 * @Author: wangaidan
 * @Date: 2021-03-26
 */
export function isTWCard(str) {
    /*第一位字母或数字+8位数字*/
    const reg = /^([a-zA-Z0-9]|[0-9]){8}$/;
    var errorMsg = '';
    if (str === '') {
        errorMsg = "通行证号不能为空"
    } else if (!reg.test(str)) {
        errorMsg = "通行证号非法"
    }
    return errorMsg;
}

/* 外国人永久居留证验证*/
/*
 * @Description:外国人永久居留证规则.
 * @Version: 1.0
 * @Author: wangaidan
 * @Date: 2021-03-26
 */
export function isPermanentReside(str) {
    /*前3位字母+12位数字*/
    const reg = /^[a-zA-Z]{3}\d{12}$/;
    var errorMsg = '';
    if (str === '') {
        errorMsg = "居留证不能为空"
    } else if (!reg.test(str)) {
        errorMsg = "居留证非法"
    }
    return errorMsg;
}


/* 护照验证*/
/*
 * @Description: 护照规则.
 * @Version: 1.0
 * @Author: wangaidan
 * @Date: 2021-03-26
 */
export function passport(str) {
    /*字母开头+8位数字*/
    const reg = /^([a-zA-Z]|[0-9]){9}$/;
    var errorMsg = '';
    if (str === '') {
        errorMsg = "护照不能为空"
    } else if (!reg.test(str)) {
        errorMsg = "护照非法"
    }
    return errorMsg;
}

/* 军官证号码验证*/
/*
 * @Description: 军官证号码规则.
 * @Version: 1.0
 * @Author: wangaidan
 * @Date: 2021-03-26
 */
export function militaryCard(str) {
    /*字母开头+8位数字*/
    const reg = /^([\u4e00-\u9fa5]{1,}[\u4e00-\u9fa50-9()()-]{5,})$/;
    var errorMsg = '';
    if (str === '') {
        errorMsg = "军官证号码不能为空"
    } else if (!reg.test(str)) {
        errorMsg = "军官证号码非法"
    }
    return errorMsg;
}