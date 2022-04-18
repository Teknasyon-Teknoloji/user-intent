# User Intent (Exit Intent) 🚀

Detect user intent and trigger a callback.

## Usage 👨‍💻

### Idleness

```js
const options = {
    mode: 'idle',
    events: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'],
    delay: 10000,
    multiple: false,
};

const cb = (mode, opts) => {
    console.log(`Callback -> mode is "${mode}" with options of "${JSON.stringify(opts)}"`);
};

new UserIntent(cb, options);
```

### Scroll

```js
const options = {
    mode: 'scroll',
    percentDown: 50,
    percentUp: 0,
    offsetTop: 0,
    offsetBottom: 0,
};

const cb = (mode, opts) => {
    console.log(`Callback -> mode is "${mode}" with options of "${JSON.stringify(opts)}"`);
};

new UserIntent(cb, options);
```

### Target Element

```js
const options = {
    mode: 'target',
    target: '',
    offsetTop: 0,
    offsetBottom: 0,
    multiple: false,
};

const cb = (mode, opts) => {
    console.log(`Callback -> mode is "${mode}" with options of "${JSON.stringify(opts)}"`);
};

new UserIntent(cb, options);
```

### Window Focus

```js
const options = {
    mode: 'focus',
    multiple: false,
};

const cb = (mode, opts) => {
    console.log(`Callback -> mode is "${mode}" with options of "${JSON.stringify(opts)}"`);
};

new UserIntent(cb, options);
```

### Window Out

```js
const options = {
    mode: 'out',
    multiple: false,
};

const cb = (mode, opts) => {
    console.log(`Callback -> mode is "${mode}" with options of "${JSON.stringify(opts)}"`);
};

new UserIntent(cb, options);
```

## How to launch the project 🏁

Install [Node.js](https://nodejs.org/) and then open the Terminal/CMD and navigate to the project's folder.
Run the following command:

```bash
npm install
```

### Development evnironment

```bash
npm start
```

### Production build

```bash
npm run build
```

Builds the app for production to the `build` folder.\

## `Stay safe 😷`
