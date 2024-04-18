async function fetchFortune() {
    try {
        const response = await fetch('http://localhost:3000/fortuneTell', {
            method: 'POST',
            // You can add headers or body as needed
            // For example:
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                myDateTime: myDateTime,
                userMessages: userMessages,
                assistantMessages: assistantMessages,
            })
        });

        // Check if response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.status);
        }

        const data = await response.json();
        displayMessage('운세 : ' + data.assistant);
        console.log('Response :', data.assistant);

        // 로딩 스피너 아이콘 숨기기
        document.getElementById('loader').style.display = "none";

        // assistantMessages에 챗GPT의 메시지 저장
        assistantMessages.push(data.assistant);

    } catch (error) {
        console.error('Error :', error);
        alert('운세를 불러오는 중에 오류가 발생했습니다.');
    }
}

function displayMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message'); // 메시지에 message 클래스 추가
    if (message.startsWith('나 :')) {
        messageElement.classList.add('user-message'); // 사용자 메시지에 user-message 클래스 추가
    } else {
        messageElement.classList.add('assistant-message'); // 챗봇 메시지에 assistant-message 클래스 추가
    }
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 변수 생성
let userMessages = [];
let assistantMessages = [];
let myDateTime = '';

function start() {
    const date = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    if (date === '') {
        alert('생년월일을 입력해 주세요.');
        return;
    }
    myDateTime = date + hour;
    document.getElementById("intro").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    console.log(myDateTime);
}

function sendMessage() {
    // 로딩 스피너 아이콘
    document.getElementById('loader').style.display = "block";

    // 사용자 메시지 가져오기
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    // userMessages에 사용자의 메시지 저장
    userMessages.push(messageInput.value);

    if (message !== '') {
        displayMessage('나: ' + message);
        fetchFortune(); // 메시지가 입력될때 요청
    }

    // 입력 필드 초기화
    messageInput.value = '';
}