# 部署说明

## 后端启动
```
cd backend
pip install -r requirements.txt
# 编辑 config.yaml，填入你的 URL / model_name / api_key
uvicorn main:app --host 192.168.0.126 --port 8000
```

## 前端启动
```
cd frontend
npm install
# 编辑 .env.local，填入后端地址
npm run build
npm start
```
