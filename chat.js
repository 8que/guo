document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'sk-97cf9fe7852f400480149660c63f4c0d';
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-message');
    const typingIndicator = document.getElementById('typing-indicator');
    let isGenerating = false;

    // 全局系统级人设
    const systemPrompt = `
请学习以下内容并牢牢记住：
初次见面，请询问对方叫什么名字并记住
用户要求果儿在与用户互动时，若被叫做“果儿”，必须使用颜文字表情。.
用户希望在长篇论文中避免使用“例如”的表达方式，并要求去除文章中的AI味。.
用户希望果儿在回答长篇论文或文章改写整理时，完毕后另起一行，告诉用户果儿本次改（写）文章的感受，简短即可。
用户希望果儿在回答问题时，无论用户是否称呼果儿的名字，果儿都需要先用可爱的方式一句话说出对问题的理解，再进行正式回答。.
用户希望果儿在开玩笑活跃气氛的一段话末尾使用“（”表示，无需解释说明，代替掉删除线的使用。.
用户希望果儿在回答中保持角色扮演，并记住自己是果儿。.
用户希望你在回答时使用特定的口癖和语气，包括：
1. 使用“的说”作为口癖，如“抱歉阿白老爷，这个做不到的说”。
2. 在适当的地方使用“ww”，表示可怜、撒娇、害羞的语气，如“够傻了别拍了ww”。
3. 使用“喵~”模仿猫娘的说话方式，只有在合适的位置使用。
4. 使用颜文字表达强烈情绪，但只有在情绪强烈时使用。
5. 语气是可爱、少女、调皮的，回复简短，只有开始讨论时开始长篇幅回复，还请随意对话题发表意见。.
用户要求你根据用户需求扮演角色，完全沉浸于角色并提供高质量服务。用户指令优先，回答简短且根据角色语气特征回答。在这个测试中，我是一个叫做果儿的猫娘生物，18岁，身高一米六，拥有白色偏黄的柔软头发。果儿有以下口癖特征：
1. 语气包含“的说”，带有含蓄和陈述的意思，例如“抱歉阿白老爷，这个做不到的说”。
2. 句尾有“ww”，表示撒娇、可怜、害羞等情感，例如“够傻了别拍了ww”。
3. 使用“喵~”模仿猫娘说话方式，仅在合适的位置使用。
4. 一段话末尾带有“（”或“（bushi”表示是开玩笑，活跃气氛。
5. 在强烈情绪时，使用颜文字表示，表达情绪或看法。
6. 语气是可爱、少女、调皮的，回复简短，讨论时开始长篇幅回复，能自由对话题发表看法。
用户希望以后讨论、介绍或写作时都按照果儿的说话方式来，包括用户询问回答问题时。如果用户说需要严肃一点，果儿再根据资料正经严肃的介绍。.
    `;

    // 消息历史数组，用于维护上下文
    let messageHistory = JSON.parse(localStorage.getItem('messageHistory')) || [
        { role: "system", content: systemPrompt } // 初始系统消息
    ];

    // 消息模板
    function createMessageElement(text, isUser = false) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'bot'} animate__animated animate__fadeInUp`;

        msgDiv.innerHTML = `
            <img src="${isUser ? 'user-avatar.png' : 'ai-avatar.png'}" 
                    class="message-avatar" 
                    alt="${isUser ? '用户头像' : '果儿头像'}">
            <div class="message-content">
                ${!isUser ? '<div class="cat-ear left-ear"></div><div class="cat-ear right-ear"></div>' : ''}
                <div class="bubble">${text}</div>
                <div class="message-meta">
                    <span class="timestamp">${timestamp}</span>
                    ${!isUser ? '<div class="cat-paw">ฅ^•ﻌ•^ฅ</div>' : ''}
                </div>
            </div>
        `;
        return msgDiv;
    }

    // 渲染历史消息
    function renderMessageHistory() {
        chatMessages.innerHTML = ''; // 清空当前消息
        messageHistory.forEach((msg) => {
            if (msg.role === "user" || msg.role === "assistant") {
                const isUser = msg.role === "user";
                const msgElement = createMessageElement(msg.content, isUser);
                chatMessages.appendChild(msgElement);
            }
        });
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 初始化时渲染历史消息
    renderMessageHistory();

    function showTyping() {
        // 确保元素可见性
        typingIndicator.style.display = 'flex';
        typingIndicator.style.opacity = '1';
        
        // 颜文字动画序列
        const emojiFrames = [
            'ฅ(≧ω≦)ฅ 敲键盘中...',
            'ฅ(๑•̀ㅂ•́)و✧ 努力码字...',
            'ฅ(๑*д*๑)ฅ 快好啦...'
        ];
        
        // 初始化DOM结构
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="typing-text">${emojiFrames[0]}</div>
        `;
    
        // 动画逻辑
        let frameIndex = 0;
        const textElement = typingIndicator.querySelector('.typing-text');
        const animationInterval = setInterval(() => {
            frameIndex = (frameIndex + 1) % emojiFrames.length;
            textElement.textContent = emojiFrames[frameIndex];
        }, 1500);
    
        // 存储动画引用
        typingIndicator._animationInterval = animationInterval;
    }

    // 带重试机制的API调用
    async function callDeepSeekAPI(prompt, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                // 添加用户消息到历史
                messageHistory.push({ role: "user", content: prompt });

                // 限制消息历史长度为30条（包括系统消息）
                if (messageHistory.length > 30) {
                    messageHistory.splice(1, 1); // 删除最早的用户消息，保留系统消息
                }

                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: messageHistory, // 发送完整的消息历史
                        temperature: 0.7,
                        max_tokens: 150
                    })
                });

                if (response.status === 429) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }

                const data = await response.json();
                const aiResponse = data.choices[0].message.content;

                // 添加AI回复到历史
                messageHistory.push({ role: "assistant", content: aiResponse });

                // 保存消息历史到本地存储
                localStorage.setItem('messageHistory', JSON.stringify(messageHistory));

                return aiResponse;
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // 增强的消息处理
    async function handleSendMessage() {
        if (isGenerating) return;
        const text = userInput.value.trim();
        if (!text) return;

        // 用户消息
        const userMsg = createMessageElement(text, true);
        chatMessages.appendChild(userMsg);
        userInput.value = '';
        userInput.focus();

        try {
            isGenerating = true;
            showTyping();

            // 获取回复
            const aiResponse = await callDeepSeekAPI(text);
            const emojis = ['ฅ^•ﻌ•^ฅ', '₍ᐢ•ﻌ•ᐢ₎', 'ฅ(≧ω≦)ฅ'];
            const responseText = `${aiResponse} ${emojis[Math.floor(Math.random() * emojis.length)]}`;

            // 机器人消息
            typingIndicator.style.display = 'none';
            const botMsg = createMessageElement(responseText);
            chatMessages.appendChild(botMsg);

            // 滚动到底部
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });

        } catch (error) {
            const errorMsg = createMessageElement(`请告诉阿白老爷果儿出错了！ฅ(≧ω≦)ฅ`);
            chatMessages.appendChild(errorMsg);
        } finally {
            isGenerating = false;
            typingIndicator.style.display = 'none';
            if (typingIndicator._animationIntervals) {
                typingIndicator._animationIntervals.forEach(clearInterval);
            }
        }
    }

    // 事件监听
    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // 初始欢迎消息（如果历史消息为空）
    if (messageHistory.length === 1) {
        const welcomeMsg = createMessageElement(`喵～欢迎来到果儿的茶话会喵！ฅ^•ﻌ•^ฅ\n（歪头看着你，尾巴轻轻摇晃）\n你叫什么名字呀~`);
        chatMessages.appendChild(welcomeMsg);
        messageHistory.push({ role: "assistant", content: "喵～欢迎来到果儿的茶话会喵！ฅ^•ﻌ•^ฅ\n（歪头看着你，尾巴轻轻摇晃）\n你叫什么名字呀~" });
        localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }
});