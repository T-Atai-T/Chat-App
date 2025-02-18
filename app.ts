interface UserData {
    id: number;
    message: string;
    author: string;
    datetime: string;
}

const contentData: HTMLElement = document.getElementById('content')!;
const form: HTMLFormElement = document.querySelector('form')!;
const input: HTMLInputElement = document.querySelector('input[name="author"]')!;
const textarea: HTMLTextAreaElement = document.querySelector('textarea[name="message"]')!;

const url = 'http://146.185.154.90:8000/messages';
let lastFetchTime: string = '';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const author = input.value;
    const message = textarea.value;

    const body = new URLSearchParams();
    body.append('author', author);
    body.append('message', message);

    try {
        const response = await fetch(url, {method: 'POST', body});

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        input.value = '';
        textarea.value = '';

    } catch (error) {
        console.log(error);
    }
});

const request = async () => {
    try {
        let requestUrl = url;

        if (lastFetchTime) {
            requestUrl = `${url}?datetime=${encodeURIComponent(lastFetchTime)}`;
        }

        const response = await fetch(requestUrl);
        const data: UserData[] = await response.json();

        if (data && data.length > 0) {
            allUserData(data);

            lastFetchTime = data[data.length - 1].datetime;
        }
    } catch (error) {
        console.log(error);
    }
};

setInterval(request, 3000);

const allUserData = (users: UserData[]) => {

    if (!contentData) {
        console.error("Element with id 'content' not found.");
        return;
    }

    users.forEach((user: UserData) => {
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.classList.add('wrapper');

        const author: HTMLParagraphElement = document.createElement('p');
        author.textContent = `Author: ${user.author}`;
        author.classList.add('textInfo');

        const message: HTMLParagraphElement = document.createElement('p');
        message.textContent = `Message: ${user.message}`;
        message.classList.add('textInfo');

        wrapper.appendChild(author);
        wrapper.appendChild(message);
        contentData.appendChild(wrapper);
    });
};

request();