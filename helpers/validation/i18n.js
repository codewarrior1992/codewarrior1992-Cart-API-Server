const msgHandler = data =>{
  let {code, limit ,label} = data;
  let errorMsg = {
    'string.email':{
      tw : "email 欄位必須使用信箱格式.",
      en : "email must be a valid email.",
      jp : "有効なメールアドレスである必要があります."
    },
    'string.min':{
      tw : `${label} 長度最少需要 ${limit} 個字.`,
      en : `${label} should have at least ${limit} characters.`,
      jp : `値は ${limit}  文字以上である必要があります.`
    },
    'string.max':{
      tw: `${label} 長度多只能 ${limit} 個字.`,
      en: `${label}hould have at most ${limit} characters.`,
      jp: `値は最大 ${limit} 文字である必要があります.`
    },
    'string.empty':{
      tw: `${label} 欄位為必填.`,
      en: `${label} is not allowed to be empty.`,
      jp: `${label} 空にすることはできません.`
    },
    'string.base':{
      tw: `${label} 必須為字串.`,
      en: `${label} must be a string.`,
      jp: `${label} 文字列である必要があります.`
    },
    'string.alphanum':{
      tw: `${label} 必須為字母和數字組成.`,
      en: `${label} must only contain alpha-numeric characters.`,
      jp: `${label} 英数字のみを含める必要があります.`
    }
  }
  return errorMsg[code]
}

const errorHandler = errors => {
  errors.forEach((err)=>{
    let data = {
      code : err.code,
      limit : err.local.limit,
      label : err.local.label,
    }
    err.message = msgHandler(data);
  })
  return errors
}

module.exports.errorHandler = errorHandler;

