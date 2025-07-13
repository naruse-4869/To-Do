let timer; // setIntervalのIDを保持
let timeLeft = 25 * 60; // 初期時間（25分）

function startTimer() {
    if (timer) return; // タイマーが既に動いていたら何もしない

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft); // 画面に残り時間を表示する関数

        if (timeLeft <= 0) {
            clearInterval(timer); // タイマー停止
            timer = null;
            // タイマー終了時の処理（休憩開始、通知など）
        }
    }, 1000); // 1秒ごとに実行
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    timeLeft = 25 * 60;
    updateDisplay(timeLeft);
}

// 画面表示更新のヘルパー関数 (例)
function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function toggleTaskCompletion(checkboxElement, taskId) {
    const listItem = checkboxElement.closest('li');
    if (checkboxElement.checked) {
        listItem.classList.add('completed');
        // データベースに完了状態を保存する処理を呼び出す
        saveTaskStatus(taskId, true);
    } else {
        listItem.classList.remove('completed');
        // データベースに未完了状態を保存する処理を呼び出す
        saveTaskStatus(taskId, false);
    }
}
async function saveTaskStatus(taskId, isCompleted) {
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_completed: isCompleted })
        });
        if (!response.ok) {
            console.error('Failed to update task status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadTasks() {
    try {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        // 取得したタスクを画面に表示し、完了状態を反映するロジック
        // 例: tasks.forEach(task => { if (task.is_completed) { /* 打ち消し線を追加 */ } });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// ページロード時にタスクを読み込む
document.addEventListener('DOMContentLoaded', loadTasks);