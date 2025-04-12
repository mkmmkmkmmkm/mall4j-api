// index.js
const express = require('express');
const app = express();

// 允许 POST 请求提交 JSON
app.use(express.json());

// 示例接口：轮播图
app.get('/mall4j/indexImgs', (req, res) => {
  res.json([
    { id: 1, img: 'https://dummyimage.com/750x300/aaa/fff&text=Banner1' },
    { id: 2, img: 'https://dummyimage.com/750x300/ccc/000&text=Banner2' }
  ]);
});

// 本地测试端口（可部署平台也能识别）
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器运行中：http://localhost:${port}`);
});
