const DEFAULT_SUCCESS_CODE = 200;
const SUCCESS_CREATED_CODE = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

const DEFAULT_ERROR_MESSAGES = {
  BAD_REQUEST: 'Отправленные неверные данные',
  UNAUTHORIZED: 'Требуется авторизация',
  FORBIDDEN: 'Доступ запрещен',
  NOT_FOUND: 'Не найдено',
  CONFLICT: 'Пользователь с этим адресом электронной почты уже зарегистрирован',
  SERVER_ERROR: 'Ошибка сервера',
  ITEM_NOT_FOUND: 'Элемент с указанным идентификатором не найден',
  BAD_CREDENTIALS: 'Неверный адрес электронной почты или пароль',
  MAX_LIMIT_REACHED:
    'Слишком много попыток регистрации или входа в систему с этого IP-адреса, пожалуйста, повторите попытку через час',
}


module.exports = {
  DEFAULT_SUCCESS_CODE,
  SUCCESS_CREATED_CODE,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
  DEFAULT_ERROR_MESSAGES
}