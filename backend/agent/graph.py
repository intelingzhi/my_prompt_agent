from langgraph.graph import StateGraph, END
from .nodes import AgentState, optimize_prompt_node

def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("optimize", optimize_prompt_node)

    graph.set_entry_point("optimize")
    graph.add_edge("optimize", END)

    return graph.compile()

# 单例，避免重复编译
optimizer_graph = build_graph()
