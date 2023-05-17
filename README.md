# Trying out Login with Google

## What's this app?

This app is only a dummy app to generate random word once you log in, but the only method of login is Google

## What stack is this app used

- Backend:

  1. Node.js
  2. SQLite
  3. Sequelize

- Web:
  1. Next.js
  2. axios

## What i do:

1. Create `OAuth client ID` on Google Cloud Platform. This will also create OAuth Consent Screen if you don't have it. I will get UserInfo Email data and UserInfo Profile.
2. I create frontend, you can see the `frontend/src/app/page` we have Google component with a callback that will give you a 'credential' data. This will be verified in the backend
3. I create backend, you can see the `backend/controller.js` that we have `googleAuth` function to validate that `credential` data and also do registring and logging in.

## Reproduce

To reproduce, you just need to change a variable inside `backend/constant.js` the `googleClientID` and `frontend/.env` the `NEXT_PUBLIC_GOOGLE_AUTH_CLIENT` to your `OAuth client ID`.

## How's the flow on login with google

![Login with Google Flow](/flow.png)

## What should i improve?

Don't use email as a primary key, use "sub" field in the credentials. Because email may be change in the google.

