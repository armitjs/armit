# e2e-tests

- Note: 因为 e2e 测试里面 testcases 属于 test 代码, 不要直接 import `@kzfoo/core` 模块, 因里面包含了.tsx 的组件,
- 而这些代码在 playwright 的启动代码是不能直接运行的.

## 如需要必须要导入`isIsoDateString` 应避免`import { isIsoDateString } from '@kzfoo/core/'`改用如下导入

e.g `import { isIsoDateString } from '@kzfoo/core/utils/type-guards';`
