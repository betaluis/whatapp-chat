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

- When the user clicks the `SidebarButton` that says "Start a new chat", the `createChat` function should be invoked. Create the function, but it's a placeholder for now until we get the authentication and database working.

- `createChat()` function should prompt a message asking the user to type in the email that they want to send a message to. This value will be stored in a variable called `input`. **If there is no input, return null.**
    - Two objectives with this function:
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

### Creating "Users" collection

Go back to the `_app.js` file and import `useEffect()`.  

We're going to use `useEffect()` to create a new user if this is the first time the user has signed in.

We're going to need some functions from `firebase/firestore` to help us accomplish this, and also a react firebase hook that will make our lives easier.

- `auth` and `db` from `firebase.js`
- `doc`, `setDoc`, and `serverTimestamp` from `firebase/firestore`
- `useAuthState` from `react-firebase-hooks/auth`

This is how we're going to create the collection using firebase V9:

        useEffect(() => {
            setDoc(doc(db, "users", user.uid),{
                email: user.email,
                photoURL: user.photoURL,
                timestamp: serverTimestamp(),
            }, { merge: true })
        }, [user])

- Now every time that a user logs in for the first time it will be added to the "users" collection. If the user already exists in the collection it will just overwrite (merge) the document.

## Back to the Sidebar Component

Remember the `signOut()` above? We can now import it from "firebase/auth" and call it when the `<UserAvatar>` is clicked. Remember to pass in `auth`.

Now, we'll work on the objectives that needed to be done by our function called `createChat()`.

- We are already keeping track of the input, and if there's no input, it returns null, but now we need to validate this input. To do this we'll import a package called `EmailValidator` from `email-validator`. Import everything.

- Check if the emails is valid like this:
         
         if (EmailValidator.validate(input)) {};

- Also, check that the input, which is the recipient who the user wants to chat with, is not the same as the user's email who is currently logged in. Do so like this...

        if (EmailValidator.validate(input) && input !== user.email) {};

- There is one more condition that we will add in a bit that will check if the chat is already created.

- For now, we'll want to create a document based on these conditions and add them to our database.

### Adding a document to our database (firebase v9):

First we need to get a reference to the `chats` collection.

        const chatsCollection = collection(db, "chats")

* The `db` comes from our firebase config file.

Next, we need a query in the `chatsCollection` that will get us every chat where the array inside of `users` contains the `user.email`. This is what that looks like:

        const chatsQuery = query(chatsCollection, where("users", "array-contains", user.email));

- You'll need to import `query()` and `where()` from `firebase/firestore`.

Now our third variable will be a snapshot of that query. This is how you get that.

        const chatsSnapshot = useCollection(chatsQuery);

- Import `useCollection()` from `firebase/firestore`

Within the if statement that we just created to validate the input we will create the new document.

First I'll give you what you need and you can try to do it yourself before looking at the solution.

What you'll need is:
- `setDoc()` to create a new document. Takes in a doc reference, the document you want to create, and if the new document will merge with the old or overwrite it.
- `doc()` as a doc reference.
- `chatsCollection` as the collection you'll place the documents in.
- Next, an object containing our new document with the following:
    - A key of `users` with the value being an array.
    - Inside the array you'll have two values.
        1. `user.email`
        2. `input`
- Lastly, an object with a key of `merge` and a value of `true`

This is what it would look like. TRY IT BY YOURSELF FIRST!

    await setDoc(doc(chatsCollection), {
        users: [
            user.email,
            input
        ]
    }, { merge: true })

### Checking if the chat already exists

Now we're going to check if the chat that was created already exists, if so, it will not create a new chat with the same recipient.

Create a function and call it `chatAlreadyExists()` and receive an parameter named `recipientEmail`.

Inside of this function we're going to use the `chatsSnapshot` and go into the `docs` and `find()` a chat. Within that chat, you'll want to find the `user` that matches the `recipientEmail` and check if the length is greater than 0. If it's greater than zero then that means there's a user that matches the `recipientEmail` so that chat has already been created. We want to make sure that this check returns `false` for sure, even if it's `falsy`. We can do this by adding two 'bangs' in front of our check. This can all be done in one line. TRY IT YOURSELF BEFORE LOOKING AT THE CODE BELOW.

        const chatAlreadyExists = (recipientEmail) => !!chatsSnapshot?.docs?
            .find(chat => chat.data().users
                .find(user => user === recipientEmail)?.length > 0
            )

This function that we just created will be our third condition in order to created a new document. We don't want to create a new document, which in this case a document equals a new chat, if the chat already exists. So the final condition will look like this...

        if ( EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email ) {}

Notice that there's a bang in front of the `chatAlreadyExists(input)`. This is because if it that doesn't exist it will return false and we want to negate that so that it's true and the condition will be met.

There's is one more thing that we want to accomplish within the `createChat()` function and that's to route the sender to the chat that they just created, but to do this we will need to create the chat page and component, so we'll do this later on.

Besides that, this function is complete, and we can move on to the next step.


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

## What happens when you click on the chat? We'll use Next.js router now.

### Building out the Chat Screen

#### Show Messages

#### Adding Messages

#### End of Messages

#### Adding last seen
- Create time_ago
- Create the TimeAgo component

## Styling the messages

### Determine the type of message

#### Add Timestamp to see the time the message was sent
- `npm install moment`
- `{message.timestamp ? moment(message.timestamp).format('LT) : "..."}`
- `<Timestamp>` ---- you want to add this styled component along with its styles.

#### Scroll to the bottom

- Create helper function

