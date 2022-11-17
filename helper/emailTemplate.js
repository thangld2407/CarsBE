function template(obj, content) {
	return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <style>
      body {
        background-color: #f5f5f5;
        box-sizing: border-box;
        font-size: 18px;
        font-weight: 400;
        line-height: 1.5;
        margin: 0;
        padding: 0;
        text-align: left;
        text-size-adjust: 100%;
        width: 100%;
      }
      .container {
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        max-width: 600px;
        padding: 20px;
      }
      .action button {
        padding: 10px 20px;
        background-color: #30c42b;
        border: 1px solid #ccc;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
      }
    </style>
    <body>
      <div class="container">
        <div>
          <span> Hi there, </span>
        </div>
        <div class="content">
          <div class="content-name">
            <b>Họ và tên: </b>
            <span> ${obj.name} </span>
          </div>
          <div class="content-phone">
            <b> Số điện thoại: </b>
            <span> ${obj.phone} </span>
          </div>
          <div class="content-text">
            <b>Nội dung</b>
            <div>${obj.content}</div>
          </div>
        </div>
      </div>
    </body>
  </html>
  
  `;
}

module.exports = template;
