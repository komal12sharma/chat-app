// const socket = io('http://localhost:8000');
const socket = io('http://localhost:8000', { transports: ['websocket'] });

// get DOM elements in a respective js variables
const form = document.getElementById('send-container');
const messageinput = document.getElementById('messageinp');
const messagecontainer = document.querySelector(".container");

// a audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// function which will append event info to the container
const append = (message, position) => {
    const messageelement = document.createElement('div');
    messageelement.innerText = message;
    messageelement.classList.add('message');
    messageelement.classList.add(position);
    messagecontainer.append(messageelement);
    if (position == 'left') {
        audio.play();
    }
}

// ask new user for his/her name and let the server know
const NAME = prompt("Enter your name to join");
socket.emit('new-user-joined', NAME);

// if a new user joins, receive his/her name from the server 
socket.on('user-joined', NAME => {
    append(`${NAME} joined the chat`, 'right')
})

// if server sends a message, receive it
socket.on('receive', data => {
    append(`${data.NAME}:${data.message}`, 'left')
});

// if a user leaves the chat, append the info to the container
socket.on('left', NAME => {
    append(`${NAME} left the chat`, 'right')
});

// if the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageinput.value;
    append(`you: ${message}`, 'right');
    socket.emit('send', message);
    messageinput.value = ''
});