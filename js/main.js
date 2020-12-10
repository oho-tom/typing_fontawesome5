$(function() {
  'use strict';

  $.getJSON('./data/icons.json')
  // 2. doneは、通信に成功した時に実行される
  //  引数のdata1は、通信で取得したデータ
  .done(function(data1,textStatus,jqXHR) {
    console.log(data1); //コンソールにJSONが表示される
  })
  // 5. failは、通信に失敗した時に実行される
  .fail(function(jqXHR, textStatus, errorThrown ) {
    console.log('failed to get json.');
  });
});
