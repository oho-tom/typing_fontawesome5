$(function() {
  'use strict';

  let currentWord;
  let currentLocation;
  let prevWord;
  let score;
  let miss;
  let isPlaing;
  let playTime;
  let timerMax;
  let timerId;
  let message = document.getElementById('message');
  let icon = document.getElementById('icon');
  let letterFront = document.getElementById('letterFront');
  let letterCurrent = document.getElementById('letterCurrent');
  let letterBack = document.getElementById('letterBack');
  let good = document.getElementById('good');
  let goodCnt = document.getElementById('goodCnt');
  let bad = document.getElementById('bad');
  let badCnt = document.getElementById('badCnt');
  let accuracyCnt = document.getElementById('accuracyCnt');
  let speedCnt = document.getElementById('speedCnt');
  let playTimeLabel = document.getElementById('playTime');
  let timeBarInner = document.getElementById('timeBarInner');
  let countDownStart;
  let icons = {};
  let currentCategory = '';
  let currentIcons = [];

  $.getJSON('./data/icons.json')
  // 2. doneは、通信に成功した時に実行される
  //  引数のdataは、通信で取得したデータ
  .done(function(data,textStatus,jqXHR) {
    icons = data;

    // 初期化
    init();
    resetPrevPlay();
  })
  // 5. failは、通信に失敗した時に実行される
  .fail(function(jqXHR, textStatus, errorThrown ) {
    console.log('failed to get json.');
  });
  
  // 初期化
  function init(){
    message.innerHTML = 'Press Enter Key To Start';
    message.className = 'blinking';
    currentWord = '';
    currentLocation = 0;
    prevWord = '';
    score = 0;
    miss = 0;
    playTime = 20;
    timerMax = playTime;
    isPlaing = false;
    good.className = "";
    bad.className = "";
  }

  // 前回プレイ結果のリセット
  function resetPrevPlay(){
    playTimeLabel.innerHTML = playTime + ' sec';
    $('#timeBarInner').css('width', '100%');
    timeBarInner.className = 'progress-bar progress-bar-success';
    goodCnt.innerHTML = 0;
    badCnt.innerHTML = 0;
    accuracyCnt.innerHTML = 0;
    speedCnt.innerHTML = 0;
  }

  // 残り時間表示
  function updatePlayTime(){
    timerId = setTimeout(function() {
      playTime--;
      playTimeLabel.innerHTML = playTime + ' sec';
      let timeBarRate = playTime / timerMax * 100;
      $('#timeBarInner').css('width', timeBarRate + '%');
      speedCnt.innerHTML = ((score + miss) / (timerMax - playTime)).toFixed(2);

      if(timeBarRate > 75) {
        timeBarInner.className = 'progress-bar progress-bar-success';
      } else if(timeBarRate > 50) {
        timeBarInner.className = 'progress-bar progress-bar-info';
      } else if(timeBarRate > 25) {
        timeBarInner.className = 'progress-bar progress-bar-warning';
      } else {
        timeBarInner.className = 'progress-bar progress-bar-danger';
      }

      if(playTime <= 0){
        isPlaing = false;
        icon.className = '';
        letterFront.innerHTML = ''
        letterCurrent.innerHTML = "Game Over!";
        letterBack.innerHTML = '';
        clearTimeout(timerId);
        init();
        return;
      }
      updatePlayTime();
    }, 1000);
  }

  // ターゲット設定
  function setTarget(){
    while (currentIcons.length === 0) {
      currentCategory = Object.keys(icons)[Math.floor(Math.random() * Object.keys(icons).length)];
      currentIcons = icons[currentCategory];
    }
    currentWord = currentIcons.splice(Math.floor(Math.random() * currentIcons.length), 1)[0];
    icon.className = '';
    icon.classList.add('fas');
    icon.classList.add(currentWord);

    currentWord = currentWord.replace('fa-', '').replace('-alt', '').replace(/-/gi, ' ');
    prevWord = currentWord;

    letterFront.innerHTML = '';
    letterCurrent.innerHTML = currentWord[0];
    letterBack.innerHTML = currentWord.substr(1);
  }

  // キー押下時
  window.addEventListener('keydown', function(e){
    // ゲーム開始していないときは何もしない
    if(isPlaing === false){
      return;
    }

    // 入力キーが一致している場合
    if(String.fromCharCode(e.keyCode) === currentWord[currentLocation].toUpperCase()){
      good.className = "goodOn";
    }
    // 入力キーが一致していない場合
    else{
      bad.className = "badOn";
    }
  });

  // キーアップ時
  window.addEventListener('keyup', function(e){
    // プレイしていない時にenterキーを押した場合
    if(isPlaing === false && e.key === 'Enter'){
      // カウントダウン開始
      startCountDown();
    }

    // プレイしていないときは何もしない
    if(isPlaing === false){
      return;
    }

    // 入力キーが一致しているかチェック
    if(String.fromCharCode(e.keyCode) === currentWord[currentLocation].toUpperCase()){
      // スコア加算
      goodCnt.innerHTML = ++score;

      // 文字移動。半角スペースとハイフンは飛ばす。
      do {
        currentLocation++;
      } while (currentWord[currentLocation] === ' ' || currentWord[currentLocation] === '-');

      // 最後の文字まで到達した場合
      if(currentLocation === currentWord.length){
        setTarget();
        currentLocation = 0;
      } else {
        let str;
        str = currentWord.substr(0, currentLocation)
        // 切り出し文字列の末尾の空白を特殊文字に置き換える
        if(str[str.length - 1] === ' ') {
          str = str.replace(/\s+$/g, '');
          str += '&nbsp;';
        }
        letterFront.innerHTML = str;
        letterCurrent.innerHTML = currentWord[currentLocation];
        if(currentLocation < currentWord.length - 1) {
          str = currentWord.substr(currentLocation+1);
          // 切り出し文字列の先頭の空白を特殊文字に置き換える
          if(str[0] === ' ') {
            str = str.replace(/^\s+/g, '');
            str = '&nbsp;' + str;
          }
          letterBack.innerHTML = str;
        } else {
          letterBack.innerHTML = '';
        }
      }
    }
    else{
      badCnt.innerHTML = ++miss;
    }
    accuracyCnt.innerHTML = (score / (score + miss) * 100).toFixed(0);
    good.className = "";
    bad.className = "";
  });

  // カウントダウン開始
  function startCountDown() {
    resetPrevPlay();
    message.innerHTML = 'Ready?';
    message.className = '';
    countDownStart = new Date();
    updateCountDown();
  }

  // カウントダウン更新
  function updateCountDown() {
    let countDownTimerId = setTimeout(function() {
      let now = new Date();
      let timePassed = now.getTime() - countDownStart.getTime();
      let count = ((5000 - timePassed) / 1000).toFixed(0);
      letterFront.innerHTML = (count > 0) ? count : 'Start!';
      letterCurrent.innerHTML = '';
      letterBack.innerHTML = '';
      if(timePassed > 6000) {
        clearTimeout(countDownTimerId);
        letterFront.innerHTML = '';
        startTyping();
        return;
      }
      updateCountDown();
    }, 10);
  }

  // タイピング開始
  function startTyping() {
    setTarget();
    updatePlayTime();
    message.innerHTML = 'Type Following Word!';
    isPlaing = true;
  }
});
