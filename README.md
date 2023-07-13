# Бэкенд Диплома: Movies Explorer API. <br> Реализована в рамках учебной и практической работы на платформе [Яндекс.Практикум](https://praktikum.yandex.ru/) в факультете ["Веб-разработчик"](https://praktikum.yandex.ru/web/)

## Ссылки:
- Backend [http://api.deonis.nomoredomains.work/](http://api.deonis.nomoredomains.work/)

## Описание проекта
[Репозиторий для дипломной работы Movies Explorer](https://github.com/Denis-Deonis/movies-explorer-api), включающий бэкенд часть приложения со следующими возможностями: авторизации и регистрации пользователей, операции с фильмами и пользователями.

## Функционал:
- Роуты для пользователей:
    - `GET /users/me` — возвращает информацию о пользователе
    - `PATCH /users/me` — обновляет информацию о пользователе
      
- Роуты для фильмов:
    - `GET /movies` — возвращает все фильмы из базы
    - `DELETE /movies/:movieId` — удаляет фильм по _id
    - `POST /movies` — создаёт фильм с переданными в теле<details><summary>запроса</summary>
      - country,
      - director,
      - duration,
      - year,
      - description,
      - image,
      - trailer,
      - thumbnail,
      - movieId,
      - nameRU и nameEN
    
 
## Директории
* `/controllers` – содержит файлы описания моделей пользователя и фильма
* `/models` – содержит файлы описания схем пользователя и фильма
* `/routes` — содержит описание основных роутов для пользователя и фильма
* `/utils` – содержит вспомогательные файлы

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
