## 节点

- 输入
- llm 模型
- prompt 提示词
- 文本输出
- 图片输出

## 工作流框架

- LangChain更适合工作流
- ai sdk适合对话相关

在前端页面中绘制工作流，然后调用Next api动态构建一个对应的StateGraph，接着使用LangChain执行
