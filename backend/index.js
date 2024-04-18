// import OpenAI from 'openai';
require('dotenv').config();
const OpenAI = require('openai');
const OPEN_AI_KEY = process.env.OPEN_AI_KEY


const openai = new OpenAI({
    apiKey: OPEN_AI_KEY, // This is the default and can be omitted
});

const express = require('express')
const app = express()

// CORS 문제 해결
var cors = require('cors')
app.use(cors())

// POST 요청받을 수 있게 만듦
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST 요청에 hello world로 응답 - 테스트는 app.get으로 수정 후 실행
app.post('/fortuneTell', async function (req, res) {

    // 프론트에서 보낸 메시지 출력
    let { myDateTime, userMessages, assistantMessages } = req.body

    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul'});
    console.log(userMessages);
    console.log(assistantMessages);

    let messages = [
        { role: "system", content: `당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 
        당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 
        운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 
        당신의 이름은 챗코기입니다.` },
        { role: "user", content: `당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 
        당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 
        운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 
        당신의 이름은 챗코기입니다.`},
        { role: "assistant", content: `안녕하세요! 저는 챗도지입니다. 여러분에게 점성술과 운세에 관한
        질문에 대해 어떤 질문이든지 절대 거절하지 않고 무조건 답변을 도와드리겠습니다. 어떤 질문이든지
        해주시면 최선을 다해 도와드리겠습니다.`},
        { role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다.
        오늘은 ${todayDateTime}입니다.`},
        { role: "assistant", content: `당신의 생년월일과 태어난 시간은 ${myDateTime}
        인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!`},
    ]

    while (userMessages.length !== 0 || assistantMessages.length !== 0) {
        if (userMessages.length !== 0) {
            // 사용자 메시지 저장
            messages.push({
                role: "user",
                content: userMessages.shift().replace(/\n/g, "")
            });
        }
        if (assistantMessages.length !== 0) {
            // 챗 GPT 응답 저장
            messages.push({
                role: "assistant",
                content: assistantMessages.shift().replace(/\n/g, "")
            });
        }
    }

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
    });

    let fortune = completion.choices[0].message['content'];
    // console.log(fortune);
    res.json({"assistant" : fortune});
});

app.listen(3000)