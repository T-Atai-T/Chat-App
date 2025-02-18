"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const contentData = document.getElementById('content');
const form = document.querySelector('form');
const input = document.querySelector('input[name="author"]');
const textarea = document.querySelector('textarea[name="message"]');
const url = 'http://146.185.154.90:8000/messages';
let lastFetchTime = '';
form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const author = input.value;
    const message = textarea.value;
    const body = new URLSearchParams();
    body.append('author', author);
    body.append('message', message);
    try {
        const response = yield fetch(url, { method: 'POST', body });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        input.value = '';
        textarea.value = '';
    }
    catch (error) {
        console.log(error);
    }
}));
const request = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let requestUrl = url;
        if (lastFetchTime) {
            requestUrl = `${url}?datetime=${encodeURIComponent(lastFetchTime)}`;
        }
        const response = yield fetch(requestUrl);
        const data = yield response.json();
        if (data && data.length > 0) {
            allUserData(data);
            lastFetchTime = data[data.length - 1].datetime;
        }
    }
    catch (error) {
        console.log(error);
    }
});
setInterval(request, 3000);
const allUserData = (users) => {
    if (!contentData) {
        console.error("Element with id 'content' not found.");
        return;
    }
    users.forEach((user) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const author = document.createElement('p');
        author.textContent = `Author: ${user.author}`;
        author.classList.add('textInfo');
        const message = document.createElement('p');
        message.textContent = `Message: ${user.message}`;
        message.classList.add('textInfo');
        wrapper.appendChild(author);
        wrapper.appendChild(message);
        contentData.appendChild(wrapper);
    });
};
request();
