const express = require('express');
const axios = require('axios');
const app = express();

// 允许跨域和 JSON 请求
app.use(express.json());

// 微信登录接口(未用到数据库，模拟登陆)
app.post('/login', async (req, res) => {
  const { principal: code } = req.body; // 小程序传来的 code
  
  if (!code) {
    return res.status(400).json({ error: '缺少 code 参数' });
  }

  try {
    // 调用微信 code2Session 接口获取 openid 和 session_key
    const wechatRes = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=wx8af9d74e92d073be&secret=e8ccd79ffd4b0de60035dd8f4371c18c&js_code=${code}&grant_type=authorization_code`
    );

    const { openid, session_key } = wechatRes.data;

    if (!openid) {
      return res.status(400).json({ error: '微信登录失败' });
    }

    // 模拟生成 token（实际开发中可以用 JWT）
    const mockToken = `mock-token-${openid}-${Date.now()}`;

    // 返回 token 给小程序
    res.json({
      access_token: mockToken,
      expires_in: 7200,
      openid, // 可选返回
    });
  } catch (error) {
    console.error("微信登录失败:", error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 其他接口...
app.get('/mall4j/indexImgs', (req, res) => {
  res.json([
    { id: 1, img: 'https://dummyimage.com/750x300/aaa/fff&text=Banner1' },
    { id: 2, img: 'https://dummyimage.com/750x300/ccc/000&text=Banner2' }
  ]);
});

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;