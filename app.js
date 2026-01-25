// 定义全局变量
let currentWord = null; // 当前显示的单词
let totalCount = 0;     // 总答题数
let correctCount = 0;   // 正确数
let hintStep = 0;       // 提示步骤：0=无提示，1=首字母提示，2=完整单词

// 获取页面元素
const wordMeaningEl = document.getElementById('word-meaning');
const wordLevelEl = document.getElementById('word-level');
const userInputEl = document.getElementById('user-input');
const checkBtnEl = document.getElementById('check-btn');
const nextBtnEl = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const totalEl = document.getElementById('total');
const correctEl = document.getElementById('correct');
const rateEl = document.getElementById('rate');
// 新增：提示相关元素
const hintBtnEl = document.getElementById('hint-btn');
const hintTextEl = document.getElementById('hint-text');
// 新增：全部单词相关元素
const allWordsListEl = document.getElementById('all-words-list');

// 初始化：从本地存储加载答题记录（刷新页面不丢失）
function init() {
    const savedTotal = localStorage.getItem('totalCount');
    const savedCorrect = localStorage.getItem('correctCount');
    if (savedTotal) totalCount = parseInt(savedTotal);
    if (savedCorrect) correctCount = parseInt(savedCorrect);
    updateStats(); // 更新统计显示
    renderAllWordsList(); // 初始化渲染全部单词列表
}

// 随机获取一个单词
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    currentWord = wordList[randomIndex];
    // 重置提示步骤
    hintStep = 0;
    // 显示单词释义和难度，隐藏拼写
    wordMeaningEl.textContent = currentWord.meaning;
    wordLevelEl.textContent = currentWord.level;
    // 清空输入框
    userInputEl.value = '';
    // 清空反馈和提示
    feedbackEl.textContent = '';
    feedbackEl.style.color = '';
    hintTextEl.textContent = '暂无';
    // 输入框获得焦点
    userInputEl.focus();
}

// 新增：显示提示（分步骤）
function showHint() {
    if (!currentWord) {
        feedbackEl.textContent = '请先点击“下一个单词”获取单词！';
        feedbackEl.style.color = 'orange';
        return;
    }

    switch (hintStep) {
        case 0:
            // 第一步：显示首字母
            hintTextEl.textContent = `首字母：${currentWord.word[0]}`;
            hintStep = 1;
            hintBtnEl.textContent = '显示完整单词';
            break;
        case 1:
            // 第二步：显示完整单词
            hintTextEl.textContent = `完整单词：${currentWord.word}`;
            hintStep = 2;
            hintBtnEl.textContent = '重置提示';
            break;
        case 2:
            // 重置提示
            hintTextEl.textContent = '暂无';
            hintStep = 0;
            hintBtnEl.textContent = '显示提示';
            break;
    }
}

// 新增：渲染全部单词列表
function renderAllWordsList() {
    allWordsListEl.innerHTML = ''; // 清空原有内容
    wordList.forEach((item, index) => {
        const wordCard = document.createElement('div');
        wordCard.className = 'col-md-6 mb-2';
        wordCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">${item.word}</h6>
                    <p class="card-text">释义：${item.meaning} | 难度：${item.level}</p>
                </div>
            </div>
        `;
        allWordsListEl.appendChild(wordCard);
    });
}

// 验证用户输入的拼写
function checkSpelling() {
    if (!currentWord) {
        feedbackEl.textContent = '请先点击“下一个单词”获取单词！';
        feedbackEl.style.color = 'orange';
        return;
    }
    const userAnswer = userInputEl.value.trim().toLowerCase(); // 转小写，避免大小写问题
    const correctAnswer = currentWord.word.toLowerCase();
    
    totalCount++; // 总答题数+1
    if (userAnswer === correctAnswer) {
        correctCount++; // 正确数+1
        feedbackEl.textContent = '✅ 拼写正确！';
        feedbackEl.style.color = 'green';
    } else {
        feedbackEl.textContent = `❌ 拼写错误，正确答案：${correctAnswer}`;
        feedbackEl.style.color = 'red';
    }
    // 保存记录到本地存储
    localStorage.setItem('totalCount', totalCount);
    localStorage.setItem('correctCount', correctCount);
    // 更新统计
    updateStats();

    // 👇 核心修改：验证完成后，延迟片刻自动切换下一个单词（提升体验）
    setTimeout(() => {
        getRandomWord();
    }, 800); // 800毫秒延迟，让用户看清验证结果后再切换
}

// 更新统计数据显示
function updateStats() {
    totalEl.textContent = totalCount;
    correctEl.textContent = correctCount;
    const rate = totalCount === 0 ? 0 : (correctCount / totalCount * 100).toFixed(1);
    rateEl.textContent = `${rate}%`;
}

// 绑定按钮点击事件
checkBtnEl.addEventListener('click', checkSpelling);
nextBtnEl.addEventListener('click', getRandomWord);
hintBtnEl.addEventListener('click', showHint); // 新增：提示按钮事件

// 监听输入框的回车键事件
userInputEl.addEventListener('keydown', function(event) {
    // 判断是否按下的是回车键
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // 阻止默认行为
        checkSpelling(); // 触发验证逻辑
    }
});

// 页面加载完成后初始化
window.onload = function() {
    init();
};