const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken'); // 用于生成 JWT
const app = express();

// 从环境变量中读取微信小程序的 appid 和 secret
const { APPID, SECRET, JWT_SECRET } = process.env;

// 允许跨域和 JSON 请求
app.use(express.json());

// 微信登录接口
app.post('/login', async (req, res) => {
  const { principal: code } = req.body; // 小程序传来的 code
  
  if (!code) {
    return res.status(400).json({ error: '缺少 code 参数' });
  }

  try {
    // 调用微信的 code2Session 接口
    const wechatRes = await getWechatSession(code);

    const { openid, session_key } = wechatRes.data;

    if (!openid) {
      return res.status(400).json({ error: '微信登录失败' });
    }

    // 使用 openid 和 session_key 生成 JWT
    const token = generateJwt({ openid, session_key });

    // 返回 token 给小程序
    res.json({
      access_token: token,
      expires_in: 7200, // 2小时
      openid, // 可选返回
    });
  } catch (error) {
    console.error("微信登录失败:", error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取微信 session 的封装函数
async function getWechatSession(code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;
  return axios.get(url);
}

// 生成 JWT token
function generateJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' }); // 2小时有效期
}

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
