# WhatsApp chat app

I'm writing some of my notes here and steps so that I can come back to this project and easily rebuild it by working through these notes instead of creating a new process.

First, you want to clean up some of the code that's already provided by Next.js.

- Delete the `main` and the `footer` tags along with everything inside.
- Edit the `Head` to include desired title and meta data.

## Some of the dependencies that we'll be using in this app:

A list of all dependencies, of course, are found in the package.json, but just for reference:

- Material UI
    - For styling purposes and icons.
- better-react-spinkit
    - Something is going on with the --legacy-dependencies, so I'm not sure if this package will stay. I have to figure that out. Look for alternatives.
- email-validator
- firebase
- react-firebase-hooks
- styled-components

## First component

The first component I'll be working on is the `Sidebar` component.

Create the structure of the sidebar using `styled-components`.

The icons are imported from `@mui/icons` along with some other UI components:
- Avatar
- Button
- IconButton

Tip: If you want to override the Material UI styles you use `&&& {}`.

### Sidebar Functionalities

- When the user clicks the `UserAvatar` it should sign them out. At this point we haven't worked on the Firebase side of things, but just to keep in mind.

        onClick={() => signOut(auth)};

- When the user clicks the `SidebarButton` that says "Start a new chat", the `createChat` function should be envoked. Create the function, but it's a placeholder for now until we get the authentication and database working.

- `createChat()` function should prompt a message asking the user to type in the email that they want to send a message to. This value will be stored in a variable called `input`. **If there is no input, return null.**
    - Two things objectives with this function:
        1. Check if the chat already exists.
        2. Validate that the email entered is valid.
    - Just add comments as placeholders and we'll come back to this.

## Firebase

Create a file at the root directory called `firebase.js`. This is where all of the configuration for firebase will be done.

1. You want create a new project at [Firebase.](https://firebase.google.com)
    - Create the firestore database
    - Create the authentication which for this app we'll be signing in using Google.
    - Initialize the backend.

2. Copy and paste the config code provided in the firebase console.

3. Check to see if an app has already been initialized, if not, initialize the app using the config.

        const app = !getApps().length ? initializeApp(config)
            : getApp();

4. Create database variable that holds `getFirestore(app)`.

5. Create auth.

6. Create googleProvider.

7. Export the variables just created.

## Creating Login and Loading

In `_app.js` page you'll want to render a login page if there aren't any users.

You to that with the following:

        if (!users) return <Login />

But where do you get the information on users from?

- You do so using react-firebase-hooks. One of the hooks is `useAuthState` which you'll need to import from `react-firebase-hooks/auth`.
- You can get user and loading from `useAuthState`.
- Pass in the `auth` imported from `firebase.js`

Now you have access to whether a user is logged in and also loading. 

Before checking for users you can return `<Loading />` if it's loading.

Now you need to created both the `<Login />` and `<Loading />`.

### The Login Page

Create the `login.js` as a new page. This is the page that the user will be redirected to if there's no user logged in.

Flesh it out:
- Container > Head (next/head) + LoginContainer
- LoginContainer > Logo + LoginButton
- LoginButton is a material ui component. Set a variant equal to "outlined"

Style the rest using styled components.

Next, you'll want to add click functionality to the `<LoginButton>`.
- On click call a function that sign ins the user.
- Create the function.
- Imports:
    - `signInWithPopup` from firebase/auth.
    - `auth` and `googleProvider` from firebase
- Invoke the sig in with pop function and pass is the auth and provider.
- Catch the error and alert. `.catch(alert)`.

### The Loading Component

Create a component named `Loading.js` under components.

Flesh it out:
- center > div > img + div
- div > CircularProgress
- CircularProgress comes from material ui. It's a spinning loader. It also accepts a color and a size.

Style it as you wish.

## Steps.... 


## Rendering all the chats on the sidebar

You'll want to map through each of the `docs` and for each of them render our a new component that we'll create called `<Chat>`.

- Give the component a key equal to the `chat.id`.
- Pass in some props:
    - `id={chat.id}`
    - `user={chat.data().users}`

Create the component.

- Receive the props passed in.
- Create a styled component named "Container" which is just a div.
- Import `UserAvatar` from material UI and place it in the container.

At this point you should see an avatar pop up for every chat created.

- Style the `<Container>` and the `<UserAvatar>`.

Now we'll need to create a utility class.

- Create a folder called utils.
- Create a file in that folder called `getRecipientEmail.js`.
    - This utility function is super important because it'll get us the email of the recipient.
- In the file create a function that takes in two arguments:
    1. The users.
    2. The user that is logged in.
- Find the user that does not equal the email of the user who is logged in.

Go back to the `<Chat />` component and create a variable that holds the recipient's email using our utility function.

You'll need to import `useAuthState` and `auth` to get the current user who is logged in.

### Time to get the recipient's photo.

