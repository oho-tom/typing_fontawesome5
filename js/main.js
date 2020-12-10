$(function() {
  'use strict';

  let icons = {};

  $.getJSON('./data/icons.json')
  // 2. doneは、通信に成功した時に実行される
  //  引数のdataは、通信で取得したデータ
  .done(function(data,textStatus,jqXHR) {
    // data["data"].forEach((icon) => {
    //   icons.push(icon);
    // });
    icons = data;
    draw();
  })
  // 5. failは、通信に失敗した時に実行される
  .fail(function(jqXHR, textStatus, errorThrown ) {
    console.log('failed to get json.');
  });
  
  function draw() {
    // console.log(icons);
    let obj;
    for(let category in icons) {
      const container = document.createElement("div");
      container.classList.add('container');
      document.body.appendChild(container);

      const categoryName = document.createElement("div");
      categoryName.innerText = category;
      container.appendChild(categoryName);

      const iconContainer = document.createElement("div");
      iconContainer.classList.add('icon-container');
      container.appendChild(iconContainer);

      const iconNames = icons[category];
      iconNames.forEach(iconName => {
        const i = document.createElement("i");
        i.classList.add("fas");
        i.classList.add(iconName);
        iconContainer.appendChild(i);
      });
    }
  }
});
