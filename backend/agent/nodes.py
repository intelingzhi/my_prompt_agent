from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import TypedDict
import yaml
import os

def load_config():
    config_path = os.path.join(os.path.dirname(__file__), "..", "config.yaml")
    with open(config_path, "r") as f:
        return yaml.safe_load(f)

class AgentState(TypedDict):
    original_prompt: str
    concise_version: str
    detailed_version: str
    structured_version: str
    error: str

def optimize_prompt_node(state: AgentState) -> AgentState:
    config = load_config()
    llm_config = config["llm"]

    llm = ChatOpenAI(
        base_url=llm_config["base_url"],
        model=llm_config["model_name"],
        api_key=llm_config["api_key"],
        temperature=0.7,
    )

    original = state["original_prompt"]

    system_prompt = """你是一个专业的 Prompt 优化专家。
用户会给你一段原始 prompt，你需要将其优化为三个不同风格的版本。

重要规则：
- 检测输入语言，输出必须与输入语言一致（中文输入→中文输出，英文输入→英文输出）
- 每个版本只输出优化后的 prompt 内容本身，不要加任何解释、前缀或标签

请严格按照以下 JSON 格式输出，不要输出任何其他内容：
{
  "concise": "简洁版内容",
  "detailed": "详细版内容",
  "structured": "结构化版内容"
}

三个版本的定义：
- 简洁版：去除冗余，保留核心意图，言简意赅
- 详细版：补充背景、目标、约束条件，让 AI 更好理解需求
- 结构化版：使用分点、角色设定、格式要求等结构化手段，最大化输出质量
"""

    user_message = f"请优化以下 prompt：\n\n{original}"

    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_message),
        ])

        import json
        content = response.content.strip()
        # 去除可能的 markdown 代码块包裹
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()

        result = json.loads(content)

        return {
            **state,
            "concise_version": result.get("concise", ""),
            "detailed_version": result.get("detailed", ""),
            "structured_version": result.get("structured", ""),
            "error": "",
        }
    except Exception as e:
        return {
            **state,
            "error": str(e),
        }
