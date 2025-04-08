// 初始化游戏状态
let scoreA = 0;
let scoreB = 0;
let isGameOver = false;
let serverIsA = true; // 默认A先发球
let totalPoints = 0; // 用于计算发球权
let playerAName = "球員 A"; // 默认球员A名称
let playerBName = "球員 B"; // 默认球员B名称

// 3局2勝制相關變量
let currentSet = 1; // 當前局數
let maxSets = 3; // 最大局數
let setsToWin = 2; // 獲勝需要的局數
let setsWonA = 0; // A獲勝局數
let setsWonB = 0; // B獲勝局數
let setScores = []; // 記錄每局比分 [{setNumber: 1, scoreA: 21, scoreB: 19}, ...]
let matchOver = false; // 整場比賽是否結束

// 获取DOM元素
const scoreAElement = document.getElementById('score-a');
const scoreBElement = document.getElementById('score-b');
const serveAElement = document.getElementById('serve-a');
const serveBElement = document.getElementById('serve-b');
const gameStatusElement = document.getElementById('game-status');
const playerANameElement = document.getElementById('player-a-name');
const playerBNameElement = document.getElementById('player-b-name');
const playerAInputElement = document.getElementById('player-a-input');
const playerBInputElement = document.getElementById('player-b-input');

// 初始化游戏
function initGame() {
    // 显示初始分数
    updateScoreDisplay();
    // 设置初始发球方
    updateServeDisplay();
    // 显示初始球员名称
    updatePlayerNameDisplay();
}

// 更新分数显示
function updateScoreDisplay() {
    scoreAElement.textContent = scoreA;
    scoreBElement.textContent = scoreB;
}

// 更新发球方显示
function updateServeDisplay() {
    // 清除两边的发球标识
    serveAElement.classList.remove('active');
    serveBElement.classList.remove('active');
    
    // 根据当前发球方显示发球标识
    if (serverIsA) {
        serveAElement.classList.add('active');
    } else {
        serveBElement.classList.add('active');
    }
}

// 切换发球方
function switchServer(team) {
    // 根据新规则：谁得分谁发球
    if (team === 'a') {
        serverIsA = true;
    } else if (team === 'b') {
        serverIsA = false;
    }
    
    updateServeDisplay();
}

// 检查单局游戏是否结束
function checkGameOver() {
    // 21分制规则：
    // 1. 一方先得21分且领先对方至少2分，则获胜
    // 2. 若双方比分为20-20，则先取得2分领先的一方获胜
    // 3. 若比分至29-29，则先得30分的一方获胜
    
    if (scoreA >= 21 && scoreA - scoreB >= 2) {
        if (!isGameOver) {
            // 記錄本局比分
            setScores.push({setNumber: currentSet, scoreA: scoreA, scoreB: scoreB});
            // A獲勝本局
            setsWonA++;
            isGameOver = true;
            // 檢查整場比賽是否結束
            checkMatchOver();
        }
        return true;
    } else if (scoreB >= 21 && scoreB - scoreA >= 2) {
        if (!isGameOver) {
            // 記錄本局比分
            setScores.push({setNumber: currentSet, scoreA: scoreA, scoreB: scoreB});
            // B獲勝本局
            setsWonB++;
            isGameOver = true;
            // 檢查整場比賽是否結束
            checkMatchOver();
        }
        return true;
    } else if (scoreA === 30) {
        if (!isGameOver) {
            // 記錄本局比分
            setScores.push({setNumber: currentSet, scoreA: scoreA, scoreB: scoreB});
            // A獲勝本局
            setsWonA++;
            isGameOver = true;
            // 檢查整場比賽是否結束
            checkMatchOver();
        }
        return true;
    } else if (scoreB === 30) {
        if (!isGameOver) {
            // 記錄本局比分
            setScores.push({setNumber: currentSet, scoreA: scoreA, scoreB: scoreB});
            // B獲勝本局
            setsWonB++;
            isGameOver = true;
            // 檢查整場比賽是否結束
            checkMatchOver();
        }
        return true;
    }
    
    return false;
}

// 檢查整場比賽是否結束
// 添加倒數計時器變數
let countdownSeconds = 10; // 設定倒數時間為10秒
let countdownInterval; // 用於存儲倒數計時器的ID

function checkMatchOver() {
    // 更新當前局數狀態顯示
    updateSetDisplay();
    
    // 檢查是否有一方已經贏得足夠的局數
    if (setsWonA >= setsToWin) {
        gameStatusElement.textContent = playerAName + ' 贏得比賽！(' + setsWonA + '-' + setsWonB + ')';
        matchOver = true;
        displayMatchResult();
        // 禁用「進入下一局」按鈕
        document.getElementById('next-set-btn').disabled = true;
    } else if (setsWonB >= setsToWin) {
        gameStatusElement.textContent = playerBName + ' 贏得比賽！(' + setsWonB + '-' + setsWonA + ')';
        matchOver = true;
        displayMatchResult();
        // 禁用「進入下一局」按鈕
        document.getElementById('next-set-btn').disabled = true;
    } else if (currentSet < maxSets) {
        // 如果比賽還沒結束，準備下一局並開始倒數計時
        countdownSeconds = 10; // 重置倒數時間
        
        // 清除可能存在的舊計時器
        if (window.nextSetTimer) {
            clearTimeout(window.nextSetTimer);
        }
        
        // 清除可能存在的舊倒數計時器
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // 更新顯示倒數時間
        gameStatusElement.textContent = '第 ' + currentSet + ' 局結束，準備第 ' + (currentSet + 1) + ' 局 (倒數: ' + countdownSeconds + ' 秒)';
        
        // 啟用「進入下一局」按鈕
        document.getElementById('next-set-btn').disabled = false;
        
        // 設置倒數計時器
        countdownInterval = setInterval(function() {
            countdownSeconds--;
            
            if (countdownSeconds <= 0) {
                // 倒數結束，清除計時器
                clearInterval(countdownInterval);
                // 開始下一局
                startNextSet();
            } else {
                // 更新顯示倒數時間
                gameStatusElement.textContent = '第 ' + currentSet + ' 局結束，準備第 ' + (currentSet + 1) + ' 局 (倒數: ' + countdownSeconds + ' 秒)';
            }
        }, 1000); // 每秒更新一次
    }
}

// 添加分数
function addScore(team) {
    if (isGameOver || matchOver) {
        return; // 如果当前局或整场比赛已结束，不再计分
    }
    
    if (team === 'a') {
        scoreA++;
    } else {
        scoreB++;
    }
    
    totalPoints++;
    updateScoreDisplay();
    
    // 检查游戏是否结束
    if (!checkGameOver()) {
        // 如果游戏未结束，更新发球方
        // 根据新规则：谁得分谁发球
        switchServer(team);
    }
}

// 調整分數（用於+/-按鈕）
function adjustScore(team, value) {
    // 如果整場比賽已結束，不允許調整分數
    if (matchOver) {
        return;
    }
    
    // 檢查是否是減分操作且當前局已結束
    let wasGameOver = isGameOver;
    let previousScoreA = scoreA;
    let previousScoreB = scoreB;
    
    // 調整分數
    if (team === 'a') {
        // 確保分數不會小於0
        if (scoreA + value >= 0) {
            scoreA += value;
        }
    } else {
        // 確保分數不會小於0
        if (scoreB + value >= 0) {
            scoreB += value;
        }
    }
    
    // 更新分數顯示
    updateScoreDisplay();
    
    // 如果是減分操作且之前局已結束，檢查是否需要撤銷局結果
    if (value < 0 && wasGameOver) {
        // 檢查調整後的分數是否仍然滿足勝利條件
        let stillWin = false;
        
        if (team === 'a' && previousScoreA >= 21 && previousScoreA - previousScoreB >= 2) {
            stillWin = (scoreA >= 21 && scoreA - scoreB >= 2) || (scoreA === 30);
        } else if (team === 'b' && previousScoreB >= 21 && previousScoreB - previousScoreA >= 2) {
            stillWin = (scoreB >= 21 && scoreB - scoreA >= 2) || (scoreB === 30);
        } else if (team === 'a' && previousScoreA === 30) {
            stillWin = (scoreA === 30);
        } else if (team === 'b' && previousScoreB === 30) {
            stillWin = (scoreB === 30);
        }
        
        if (!stillWin) {
            // 撤銷局結果
            isGameOver = false;
            
            // 移除最後一個記錄的比分
            if (setScores.length > 0 && setScores[setScores.length - 1].setNumber === currentSet) {
                setScores.pop();
            }
            
            // 減少獲勝局數
            if (team === 'a' && setsWonA > 0) {
                setsWonA--;
            } else if (team === 'b' && setsWonB > 0) {
                setsWonB--;
            }
            
            // 更新顯示
            updateSetDisplay();
            gameStatusElement.textContent = '比分已調整，比賽繼續';
            
            // 清除可能存在的下一局計時器
            clearTimeout(window.nextSetTimer);
            
            // 清除可能存在的倒數計時器
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        } else {
            // 分數調整後仍然滿足勝利條件，重新檢查遊戲狀態
            checkGameOver();
        }
    } else {
        // 正常情況下重新檢查遊戲狀態
        isGameOver = false; // 重置遊戲狀態以便重新檢查
        checkGameOver();
    }
}

// 重置游戏
function resetGame() {
    scoreA = 0;
    scoreB = 0;
    isGameOver = false;
    serverIsA = true;
    totalPoints = 0;
    
    updateScoreDisplay();
    updateServeDisplay();
    gameStatusElement.textContent = '';
}

// 更新球员名称显示
function updatePlayerNameDisplay() {
    playerANameElement.textContent = playerAName;
    playerBNameElement.textContent = playerBName;
}

// 更新球员名称
function updatePlayerName(team) {
    if (team === 'a') {
        const newName = playerAInputElement.value.trim();
        if (newName) {
            playerAName = newName;
            playerAInputElement.value = '';
        }
    } else if (team === 'b') {
        const newName = playerBInputElement.value.trim();
        if (newName) {
            playerBName = newName;
            playerBInputElement.value = '';
        }
    }
    
    updatePlayerNameDisplay();
    
    // 如果比賽已有結果，更新獲勝信息
    if (matchOver) {
        if (setsWonA > setsWonB) {
            gameStatusElement.textContent = playerAName + ' 贏得比賽！(' + setsWonA + '-' + setsWonB + ')';
        } else if (setsWonB > setsWonA) {
            gameStatusElement.textContent = playerBName + ' 贏得比賽！(' + setsWonB + '-' + setsWonA + ')';
        }
        displayMatchResult();
    } else if (isGameOver) {
        // 更新當前局結果
        updateSetDisplay();
    }
}

// 開始下一局
function startNextSet() {
    // 保存當前局的比分
    if (isGameOver && setScores.length < currentSet) {
        setScores.push({setNumber: currentSet, scoreA: scoreA, scoreB: scoreB});
    } else if (!isGameOver && currentSet === 1) {
        // 如果是第一局且還沒結束，先記錄當前比分
        setScores.push({setNumber: currentSet, scoreA: scoreA, scoreB: scoreB});
    }
    
    // 清除可能存在的倒數計時器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 重置當前局的分數
    scoreA = 0;
    scoreB = 0;
    isGameOver = false;
    serverIsA = true; // 每局開始時重置發球方
    totalPoints = 0;
    
    // 更新到下一局
    currentSet++;
    
    // 更新顯示
    updateScoreDisplay();
    updateServeDisplay();
    updateSetDisplay();
    gameStatusElement.textContent = '第 ' + currentSet + ' 局開始';
    
    // 啟用「回到上一局」按鈕
    document.getElementById('prev-set-btn').disabled = false;
    // 禁用「進入下一局」按鈕，直到當前局結束
    document.getElementById('next-set-btn').disabled = true;
    
    // 更新比賽記錄顯示
    displayMatchResult();
}

// 回到上一局功能
function goToPreviousSet() {
    // 檢查是否有上一局
    if (currentSet <= 1 || setScores.length === 0) {
        gameStatusElement.textContent = '沒有上一局可回到';
        return;
    }
    
    // 清除可能存在的倒數計時器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 如果當前局已結束，需要移除當前局的記錄
    if (isGameOver) {
        // 移除最後一個記錄的比分
        if (setScores.length > 0 && setScores[setScores.length - 1].setNumber === currentSet) {
            setScores.pop();
        }
        
        // 減少獲勝局數
        if (scoreA > scoreB && setsWonA > 0) {
            setsWonA--;
        } else if (scoreB > scoreA && setsWonB > 0) {
            setsWonB--;
        }
    }
    
    // 回到上一局
    currentSet--;
    
    // 獲取上一局的比分
    const previousSet = setScores.find(set => set.setNumber === currentSet);
    if (previousSet) {
        // 恢復上一局的比分
        scoreA = previousSet.scoreA;
        scoreB = previousSet.scoreB;
        
        // 設置發球方
        if (scoreA > scoreB) {
            serverIsA = true;
        } else {
            serverIsA = false;
        }
        
        // 設置遊戲狀態
        isGameOver = true;
        matchOver = false;
        
        // 更新顯示
        updateScoreDisplay();
        updateServeDisplay();
        updateSetDisplay();
        displayMatchResult();
        
        gameStatusElement.textContent = '已回到第 ' + currentSet + ' 局的最後比分';
        
        // 啟用「進入下一局」按鈕
        document.getElementById('next-set-btn').disabled = false;
    }
}

// 顯示比賽結果
function displayMatchResult() {
    // 創建或更新比賽記錄顯示區域
    let matchRecordElement = document.getElementById('match-record');
    if (!matchRecordElement) {
        matchRecordElement = document.createElement('div');
        matchRecordElement.id = 'match-record';
        matchRecordElement.className = 'match-record';
        document.querySelector('.controls').appendChild(matchRecordElement);
    }
    
    // 清空現有內容
    matchRecordElement.innerHTML = '';
    
    // 創建標題
    const recordTitle = document.createElement('h3');
    recordTitle.textContent = '比賽記錄';
    matchRecordElement.appendChild(recordTitle);
    
    // 創建表格顯示每局比分
    const table = document.createElement('table');
    table.className = 'score-table';
    
    // 創建表頭
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const thSet = document.createElement('th');
    thSet.textContent = '局數';
    headerRow.appendChild(thSet);
    
    const thPlayerA = document.createElement('th');
    thPlayerA.textContent = playerAName;
    headerRow.appendChild(thPlayerA);
    
    const thPlayerB = document.createElement('th');
    thPlayerB.textContent = playerBName;
    headerRow.appendChild(thPlayerB);
    
    const thResult = document.createElement('th');
    thResult.textContent = '結果';
    headerRow.appendChild(thResult);
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 創建表格內容
    const tbody = document.createElement('tbody');
    
    // 如果還沒有任何局的記錄，但是第一局已經開始，顯示當前進行中的第一局
    if (setScores.length === 0 && currentSet === 1 && !matchOver) {
        const row = document.createElement('tr');
        
        const tdSet = document.createElement('td');
        tdSet.textContent = '第 1 局';
        row.appendChild(tdSet);
        
        const tdScoreA = document.createElement('td');
        tdScoreA.textContent = scoreA;
        row.appendChild(tdScoreA);
        
        const tdScoreB = document.createElement('td');
        tdScoreB.textContent = scoreB;
        row.appendChild(tdScoreB);
        
        const tdResult = document.createElement('td');
        tdResult.textContent = '進行中';
        row.appendChild(tdResult);
        
        tbody.appendChild(row);
    } else {
        // 顯示已記錄的每局比分
        setScores.forEach(set => {
            const row = document.createElement('tr');
            
            const tdSet = document.createElement('td');
            tdSet.textContent = '第 ' + set.setNumber + ' 局';
            row.appendChild(tdSet);
            
            const tdScoreA = document.createElement('td');
            tdScoreA.textContent = set.scoreA;
            row.appendChild(tdScoreA);
            
            const tdScoreB = document.createElement('td');
            tdScoreB.textContent = set.scoreB;
            row.appendChild(tdScoreB);
            
            const tdResult = document.createElement('td');
            if (set.scoreA > set.scoreB) {
                tdResult.textContent = playerAName + ' 勝';
            } else if (set.scoreB > set.scoreA) {
                tdResult.textContent = playerBName + ' 勝';
            } else {
                tdResult.textContent = '平局';
            }
            row.appendChild(tdResult);
            
            tbody.appendChild(row);
        });
        
        // 如果當前局還在進行中且不是第一局，顯示當前進行中的局
        if (!isGameOver && currentSet > 1 && !matchOver) {
            const row = document.createElement('tr');
            
            const tdSet = document.createElement('td');
            tdSet.textContent = '第 ' + currentSet + ' 局';
            row.appendChild(tdSet);
            
            const tdScoreA = document.createElement('td');
            tdScoreA.textContent = scoreA;
            row.appendChild(tdScoreA);
            
            const tdScoreB = document.createElement('td');
            tdScoreB.textContent = scoreB;
            row.appendChild(tdScoreB);
            
            const tdResult = document.createElement('td');
            tdResult.textContent = '進行中';
            row.appendChild(tdResult);
            
            tbody.appendChild(row);
        }
    }
    
    table.appendChild(tbody);
    matchRecordElement.appendChild(table);
    
    // 只有在比賽結束時才顯示最終結果
    if (matchOver) {
        const finalResult = document.createElement('div');
        finalResult.className = 'final-result';
        if (setsWonA > setsWonB) {
            finalResult.textContent = playerAName + ' 以 ' + setsWonA + '-' + setsWonB + ' 贏得比賽！';
        } else {
            finalResult.textContent = playerBName + ' 以 ' + setsWonB + '-' + setsWonA + ' 贏得比賽！';
        }
        matchRecordElement.appendChild(finalResult);
    }
    
    // 根據當前狀態設置「回到上一局」按鈕的禁用狀態
    const prevSetBtn = document.getElementById('prev-set-btn');
    if (prevSetBtn) {
        prevSetBtn.disabled = (currentSet <= 1 || setScores.length === 0);
    }
}

// 更新局數和比分記錄顯示
function updateSetDisplay() {
    // 更新當前局數顯示
    let setDisplayElement = document.getElementById('current-set');
    if (!setDisplayElement) {
        setDisplayElement = document.createElement('div');
        setDisplayElement.id = 'current-set';
        setDisplayElement.className = 'current-set';
        document.querySelector('.scoreboard').insertAdjacentElement('beforebegin', setDisplayElement);
    }
    
    // 更新當前局數和比分狀態
    setDisplayElement.textContent = '當前: 第 ' + currentSet + ' 局 | ' + 
                                   playerAName + ' ' + setsWonA + '-' + setsWonB + ' ' + playerBName;
}

// 重置游戏
function resetGame() {
    // 清除可能存在的倒數計時器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // 重置所有變量
    scoreA = 0;
    scoreB = 0;
    isGameOver = false;
    serverIsA = true;
    totalPoints = 0;
    
    // 重置3局2勝制相關變量
    currentSet = 1;
    setsWonA = 0;
    setsWonB = 0;
    setScores = [];
    matchOver = false;
    
    // 更新顯示
    updateScoreDisplay();
    updateServeDisplay();
    updateSetDisplay();
    
    // 更新比賽記錄顯示
    displayMatchResult();
    
    // 設置按鈕狀態
    document.getElementById('prev-set-btn').disabled = true; // 禁用「回到上一局」按鈕
    document.getElementById('next-set-btn').disabled = true; // 禁用「進入下一局」按鈕
    
    gameStatusElement.textContent = '新的比賽開始';
}

// 初始化游戏
function initGame() {
    // 显示初始分数
    updateScoreDisplay();
    // 设置初始发球方
    updateServeDisplay();
    // 显示初始球员名称
    updatePlayerNameDisplay();
    // 顯示初始局數
    updateSetDisplay();
    // 顯示初始比賽記錄
    displayMatchResult();
    
    // 初始時禁用「回到上一局」按鈕，因為還沒有上一局
    document.getElementById('prev-set-btn').disabled = true;
    // 初始時禁用「進入下一局」按鈕，因為第一局還沒結束
    document.getElementById('next-set-btn').disabled = true;
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', initGame);