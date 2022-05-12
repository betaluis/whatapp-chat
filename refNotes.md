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
    - Create the firesstore database
    - Create the authentication which for this app we'll be signing in using Google.
    - Initialize the backend.

2. Copy and paste the config code provided in the firebase console.

3. Check to see if an app has already been initialized, if not, initialize the app using the config.

        const app = !getApps().length ? initializeApp(config)
            : getApp();

4. 