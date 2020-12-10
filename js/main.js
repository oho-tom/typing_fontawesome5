$(function() {
  'use strict';

  let icons = [];

  $.getJSON('./data/icons.json')
  // 2. doneは、通信に成功した時に実行される
  //  引数のdataは、通信で取得したデータ
  .done(function(data,textStatus,jqXHR) {
    data["data"].forEach((icon) => {
      icons.push(icon);
    });
    draw();
  })
  // 5. failは、通信に失敗した時に実行される
  .fail(function(jqXHR, textStatus, errorThrown ) {
    console.log('failed to get json.');
  });
  
  function draw() {
    icons.forEach((icon) => {
      const i = document.createElement("i");
      i.classList.add("fas");
      i.classList.add(icon);
      document.body.appendChild(i);
    });
  }
});
