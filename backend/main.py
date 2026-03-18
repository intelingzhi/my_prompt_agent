from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.graph import optimizer_graph

app = FastAPI(title="Prompt Optimizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境可改为你的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizeRequest(BaseModel):
    prompt: str

class OptimizeResponse(BaseModel):
    original: str
    concise: str
    detailed: str
    structured: str

@app.post("/api/optimize", response_model=OptimizeResponse)
async def optimize_prompt(request: OptimizeRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt 不能为空")

    result = optimizer_graph.invoke({
        "original_prompt": request.prompt,
        "concise_version": "",
        "detailed_version": "",
        "structured_version": "",
        "error": "",
    })

    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])

    return OptimizeResponse(
        original=request.prompt,
        concise=result["concise_version"],
        detailed=result["detailed_version"],
        structured=result["structured_version"],
    )

@app.get("/health")
async def health():
    return {"status": "ok"}
