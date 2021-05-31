# Social Network (Dev-Connector)

A platform for developers to connect. They can create their portofolio by adding their experience, education, skills and other important information of their professional career.

Users can also create small posts and like/dislike and comment on other posts.

---

## Quick Start 🚀

### Add a default.json file in config folder with the following

```
{
  "MONGO_URI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "JWT_SECRET": "secret",
  "GITHUB_TOKEN": "<yoursecrectaccesstoken>"
}
```

> To generate a github token : [Link](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```

---

## Main Technologies

### Client Side

-   [React](https://github.com/facebook/react)
-   [Redux](https://github.com/reactjs/redux)
-   [Twitter Bootstap 4](https://github.com/twbs/bootstrap/tree/v4-dev)
-   [React-Router-DOM](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)

#### Libraries used in Client-side

-   [axios](https://github.com/axios/axios)
-   [react-moment](https://github.com/headzoo/react-moment)
-   [react-redux](https://github.com/reduxjs/react-redux)
-   [redux-thunk](https://github.com/reduxjs/redux-thunk)

### Server Side

-   [Node.js / Express](https://github.com/expressjs/express)
-   [MongoDB](https://github.com/mongodb/mongo)
-   [JWT](https://github.com/auth0/node-jsonwebtoken)

#### Libraries used in Server-side

-   [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
-   [gravatar](https://github.com/emerleite/node-gravatar)
-   [mongoose](http://mongoosejs.com/)
-   [jwt-decode](https://github.com/auth0/jwt-decode)
-   [express-validator](https://github.com/express-validator/express-validator)
-   [moment](https://momentjs.com/)
-   [normalize-url](https://github.com/sindresorhus/normalize-url)
