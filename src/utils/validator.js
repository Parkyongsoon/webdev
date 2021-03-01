import Joi from 'joi';

export const registerValidator = Joi.object({
  username:         Joi.string()
                       .alphanum()
                       .min(5)
                       .required()
                       .messages({
                        'string.empty': '아이디를 입력해주세요.',
                        'string.min': '최소 {#limit}자 이상입니다.',
                        'any.required': '아이디 입력은 필수입니다.'
                       }),
  password:         Joi.string()
                       .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#?!@$%^&*-])[0-9a-zA-Z#?!@$%^&*-]{8,20}$/)
                       .required()
                       .messages({
                        'string.empty': '비밀번호를 입력해주세요.',
                        'string.pattern.base': '대,소문자/숫자/특수문자 조합해서 최소 8자 최대 20 입니다.',
                        'any.required': '비밀번호 입력은 필수입니다.'
                       }),
  confirm_password: Joi.string()
                       .valid(Joi.ref('password'))
                       .messages({
                         'any.only': '비밀번호가 일치하지 않습니다'
                       }),
  name:             Joi.string()
                       .messages({
                         'string.empty': '이름을 입력해주세요.',
                       }),
  email:            Joi.string()
                       .email({
                         minDomainSegments: 2,
                         tlds: { allow: ['com'] }
                       })
                       .messages({
                        'string.empty': '이메일을 입력해주세요.',
                        'string.email': '메일주소가 유효하지 않습니다.'
                       }),
  postcode:         Joi.string(),
  address:          Joi.string(),
  detailAddress:    Joi.string(),
  extraAddress:     Joi.string(),
  phone:            Joi.number()
                       .integer()
                         
})
.with('password', 'confirm_password');

export const designerRegisterValidator = Joi.object({
  username:         Joi.string()
                       .alphanum()
                       .min(5)
                       .required()
                       .messages({
                        'string.empty': '아이디를 입력해주세요.',
                        'string.min': '최소 {#limit}자 이상입니다.',
                        'any.required': '아이디 입력은 필수입니다.'
                       }),
  password:         Joi.string()
                       .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#?!@$%^&*-])[0-9a-zA-Z#?!@$%^&*-]{8,20}$/)
                       .required()
                       .messages({
                        'string.empty': '비밀번호를 입력해주세요.',
                        'string.pattern.base': '대,소문자/숫자/특수문자 조합해서 최소 8자 최대 20 입니다.',
                        'any.required': '비밀번호 입력은 필수입니다.'
                       }),
  confirm_password: Joi.string()
                       .valid(Joi.ref('password'))
                       .messages({
                         'any.only': '비밀번호가 일치하지 않습니다'
                       }),
  name:             Joi.string()
                       .messages({
                         'string.empty': '이름을 입력해주세요.',
                       }),
  email:            Joi.string()
                       .email({
                         minDomainSegments: 2,
                         tlds: { allow: ['com'] }
                       })
                       .messages({
                        'string.empty': '이메일을 입력해주세요.',
                        'string.email': '메일주소가 유효하지 않습니다.'
                       }),
  postcode:         Joi.string(),
  address:          Joi.string(),
  detailAddress:    Joi.string(),
  extraAddress:     Joi.string(),
  phone:            Joi.number()
                       .integer()
                         
})
.with('password', 'confirm_password');

export const loginValidator = Joi.object({
  username:         Joi.string()
                       .alphanum()
                       .min(5)
                       .required(),
  password:         Joi.string()
                       .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#?!@$%^&*-])[0-9a-zA-Z#?!@$%^&*-]{8,20}$/, 'i')),
});