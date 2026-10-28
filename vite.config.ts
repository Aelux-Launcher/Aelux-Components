import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const root = import.meta.dirname

/**
 * 两套构建目标：
 * - 默认（pnpm build）：库模式，输出 dist/aelux-components.js（ESM）+ dist/aelux-components.css + dist/index.d.ts
 * - showcase（pnpm build:showcase）：组件展示站，输出 showcase-dist/
 * 开发（pnpm dev）：直接以 index.html 启动组件展示站。
 */
export default defineConfig(({ command, mode }) => {
  const isShowcase = mode === 'showcase'

  return {
    publicDir: command === 'serve' || isShowcase ? 'public' : false,
    plugins: [
      react(),
      ...(isShowcase
        ? []
        : [
            dts({
              tsconfigPath: './tsconfig.build.json',
              entryRoot: 'src',
              include: ['src'],
              insertTypesEntry: true,
              copyDtsFiles: false,
              strictOutput: true,
            }),
          ]),
    ],
    resolve: {
      alias: [
        { find: /^aelux-components\/style\.css$/, replacement: resolve(root, 'src/styles/index.css') },
        { find: /^aelux-components$/, replacement: resolve(root, 'src/index.ts') },
      ],
    },
    build: isShowcase
      ? {
          outDir: 'showcase-dist',
          emptyOutDir: true,
          target: 'es2022',
          sourcemap: false,
        }
      : {
          outDir: 'dist',
          emptyOutDir: true,
          target: 'es2022',
          sourcemap: true,
          lib: {
            entry: resolve(root, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'aelux-components.js',
            cssFileName: 'aelux-components',
          },
          rollupOptions: {
            external: [/^react($|\/)/, /^react-dom($|\/)/],
          },
        },
    server: {
      port: 5173,
      strictPort: false,
      open: false,
    },
  }
})
