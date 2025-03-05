module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'wip']],
  },
};
// build: 构建相关
// chore: 对构建过程或辅助工具和文档进行更改
// ci: 持续集成修改
// docs: 文档修改
// feat: 新功能
// fix: 修复
// perf: 性能优化
// refactor: 重构
// revert: 回退
// style: 样式修改
// test: 测试
// wip: 工作进行中
