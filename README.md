# amis-editor-demo

amis 可视化编辑器, 在线体验：https://aisuda.github.io/amis-editor-demo

要使用编辑器必须熟悉 React，如果不了解建议使用[速搭](https://aisuda.baidu.com/)。

## 本地运行这个项目

1. `npm i` 安装依赖
3. `npm run dev` 等编译完成后本地打开页面看效果。

## 历史版本预览地址
1. [6.11.0(2025.03.12)](https://aisuda.github.io/amis-editor-demo/demo-6.11.0/index.html)
1. [6.7.0(2024.08.06)](https://aisuda.github.io/amis-editor-demo/demo-6.7.0/index.html)
2. [6.0.0(2023.12.29)](https://aisuda.github.io/amis-editor-demo/demo-6.0.0/index.html)
3. [5.6.2(2023.10.31)](https://aisuda.github.io/amis-editor-demo/demo-5.6.2/index.html)
4. [5.6.1(2023.09.28) history模式](https://aisuda.github.io/amis-editor-demo/demo-5.6.1-v2/index.html)
5. [5.6.1(2023.09.28)](https://aisuda.github.io/amis-editor-demo/demo-5.6.1/index.html)
6. [5.4.1(2023.06.09)](https://aisuda.github.io/amis-editor-demo/demo-5.4.1/index.html)
7. [4.1.0-beta.28(2022.05.27)](https://aisuda.github.io/amis-editor-demo/demo-4.1.0-beta.28/index.html)
8. [4.0.2-beta.10(2022.02.23)](https://aisuda.github.io/amis-editor-demo/demo-4.0.2-beta.10/index.html)
9. [3.3.5(2021-08-12)](https://aisuda.github.io/amis-editor-demo/demo-3.3.5/index.html)


## 在其他项目中使用 amis-editor

```
npm i amis-editor
```

使用 方法

```jsx
import {Editor} from 'amis-editor';


render() {
  return (
    <Editor
      {...props}
    />
  )
}
```

属性说明：

-   `value: any` 值，amis 的 json 配置。
-   `onChange: (value: any) => void`。 当编辑器修改的时候会触发。
-   `preview?: boolean` 是否为预览状态。
-   `autoFocus?: boolean` 是否自动聚焦第一个可编辑的组件。
-   `plugins` 插件类集合

## 扩充自定义编辑器（旧版）

如何扩充 amis 渲染器，请前往[如何注册自定义类型](https://baidu.github.io/amis/docs/start/custom#%E6%B3%A8%E5%86%8C%E8%87%AA%E5%AE%9A%E4%B9%89%E7%B1%BB%E5%9E%8B)，这里主要介绍如何把自定义的组件加入到编辑器里面来。

示例：

-   ./renderer/MyRenderer.tsx
-   ./editor/MyRenderer.tsx

首先，注册自定义组件的时候需要设置一个 `name` 属性，这个属性值应该是唯一的。后续注册编辑器是靠这个关联。

如本仓库中示例，name 值为 `my-renderer`。

```tsx
@Renderer({
    test: /\bmy-renderer$/,
    name: 'my-renderer'
})
export default class MyRenderer extends React.Component<MyRendererProps> {
    static defaultProps = {
        target: 'world'
    };

    render() {
        const {target} = this.props;

        return <p>Hello {target}!</p>;
    }
}
```

然后开始注册编辑器。

```tsx
import {RendererEditor, BasicEditor} from 'amis-editor';

@RendererEditor('my-renderer', {
    name: '自定义渲染器',
    description: '这只是个示例',
    // docLink: '/docs/renderers/Nav',
    type: 'my-renderer', // 这个在 scaffold 没设置的时候有用。
    previewSchema: {
        // 用来生成预览图的
        type: 'my-renderer',
        target: 'demo'
    },
    scaffold: {
        // 拖入组件里面时的初始数据
        type: 'my-renderer',
        target: '233'
    }
})
export default class MyRendererEditor extends BasicEditor {
    tipName = '自定义组件';
    settingsSchema = {
        title: '自定义组件配置',
        body: [
            {
                type: 'tabs',
                tabsMode: 'line',
                className: 'm-t-n-xs',
                contentClassName: 'no-border p-l-none p-r-none',
                tabs: [
                    {
                        title: '常规',
                        controls: [
                            {
                                name: 'target',
                                label: 'Target',
                                type: 'text'
                            }
                        ]
                    },

                    {
                        title: '外观',
                        controls: []
                    }
                ]
            }
        ]
    };
}
```

然后直接看效果吧 https://github.com/fex-team/amis-editor 这里面插入的时候选择输入 my-renderer 然后就可以插入自定义的组件了。

## 扩充自定义编辑器（新版）

amis-editor 重构了一版，之前定义注册自定义组件的方式也能用，但是已经标记了 `deprecated`，新的添加自定义编辑器的方式有两种。

1. registerEditorPlugin 注册全局插件。
2. 不注册，但是调用 `<Editor>` 的时候时候通过 `plugins` 属性传入。

效果都一样，重点还是怎么写个 Plugin，示例：

```tsx
import {BasePlugin} from 'amis-editor';

export class MyRendererPlugin extends BasePlugin {
    rendererName = 'my-renderer';

    // 暂时只支持这个，配置后会开启代码编辑器
    $schema = '/schemas/UnkownSchema.json';

    // 用来配置名称和描述
    name = '自定义渲染器';
    description = '这只是个示例';

    // tag，决定会在哪个 tab 下面显示的
    tags = ['自定义', '表单项'];

    // 图标
    icon = 'fa fa-user';

    // 用来生成预览图的
    previewSchema = {
        type: 'my-renderer',
        target: 'demo'
    };

    // 拖入组件里面时的初始数据
    scaffold = {
        type: 'my-renderer',
        target: '233'
    };

    // 右侧面板相关
    panelTitle = '自定义组件';
    panelControls = [
        {
            type: 'tabs',
            tabsMode: 'line',
            className: 'm-t-n-xs',
            contentClassName: 'no-border p-l-none p-r-none',
            tabs: [
                {
                    title: '常规',
                    controls: [
                        {
                            name: 'target',
                            label: 'Target',
                            type: 'text'
                        }
                    ]
                },

                {
                    title: '外观',
                    controls: []
                }
            ]
        }
    ];
}
```

定义好 plugin 后，可以有两种方式启用。

```tsx
// 方式 1，注册默认插件，所有编辑器实例都会自动实例话。
import {registerEditorPlugin} from 'amis-editor';

registerEditorPlugin(MyRendererPlugin);

// 方式2，只让某些编辑器启用
() => <Editor plugins={[MyRendererPlugin]} />;
```

前面的示例只做了简单的说明，可用属性还有, 具体还是先看 npm 包里面的 .d.ts 文件吧，后面再补充更详细的文档。

```tsx
export interface PluginEventListener {
    onActive?: (event: PluginEvent<ActiveEventContext>) => void;

    /**
     * 事件，当有配置项插入前调用。通过 event.preventDefault() 可以干预。
     */
    beforeInsert?: (event: PluginEvent<InsertEventContext>) => false | void;
    afterInsert?: (event: PluginEvent<InsertEventContext>) => void;

    /**
     * 面板里面编辑修改的事件。
     */
    beforeUpdate?: (event: PluginEvent<ChangeEventContext>) => false | void;
    afterUpdate?: (event: PluginEvent<ChangeEventContext>) => void;

    /**
     * 更新渲染器，或者右键粘贴配置。
     */
    beforeReplace?: (event: PluginEvent<ReplaceEventContext>) => false | void;
    afterReplace?: (event: PluginEvent<ReplaceEventContext>) => void;

    /**
     * 移动节点的时候触发，包括上移，下移
     */
    beforeMove?: (event: PluginEvent<MoveEventContext>) => false | void;
    aftterMove?: (event: PluginEvent<MoveEventContext>) => void;

    /**
     * 删除的时候触发
     */
    beforeDelete?: (event: PluginEvent<BaseEventContext>) => false | void;
    afterDelete?: (event: PluginEvent<BaseEventContext>) => void;

    beforeResolveEditorInfo?: (event: PluginEvent<RendererInfoResolveEventContext>) => false | void;
    afterResolveEditorInfo?: (event: PluginEvent<RendererInfoResolveEventContext>) => void;

    beforeResolveJsonSchema?: (event: PluginEvent<RendererJSONSchemaResolveEventContext>) => false | void;
    afterResolveJsonSchema?: (event: PluginEvent<RendererJSONSchemaResolveEventContext>) => void;

    onDndAccept?: (event: PluginEvent<DragEventContext>) => false | void;

    onBuildPanels?: (event: PluginEvent<BuildPanelEventContext>) => void;

    onBuildContextMenus?: (event: PluginEvent<ContextMenuEventContext>) => void;

    onPreventClick?: (event: PluginEvent<PreventClickEventContext>) => false | void;
}

/**
 * 插件的 interface 定义
 */
export interface PluginInterface extends Partial<BasicRendererInfo>, Partial<BasicSubRenderInfo>, PluginEventListener {
    readonly manager: EditorManager;

    order?: number;

    /**
     * 渲染器的名字，关联后不用自己实现 getRendererInfo 了。
     */
    rendererName?: string;

    /**
     * 默认的配置面板信息
     */
    panelIcon?: string;
    panelTitle?: string;
    panelControls?: Array<any>;
    panelDefinitions?: any;
    panelApi?: any;
    panelSubmitOnChange?: boolean;
    panelControlsCreator?: (context: BaseEventContext) => Array<any>;

    /**
     * 返回渲染器信息。不是每个插件都需要。
     */
    getRendererInfo?: (context: RendererInfoResolveEventContext) => BasicRendererInfo | void;

    /**
     * 生成节点的 JSON Schema 的 uri 地址。
     */
    buildJSONSchema?: (context: RendererJSONSchemaResolveEventContext) => void | string;

    /**
     * 构建右上角功能按钮集合
     */
    buildEditorToolbar?: (context: BaseEventContext, toolbars: Array<BasicToolbarItem>) => void;

    /**
     * 构建右键菜单项
     */
    buildEditorContextMenu?: (context: ContextMenuEventContext, menus: Array<ContextMenuItem>) => void;

    /**
     * 构建编辑器面板。
     */
    buildEditorPanel?: (context: BaseEventContext, panels: Array<BasicPanelItem>) => void;

    /**
     * 构建子渲染器信息集合。
     */
    buildSubRenderers?: (
        context: RendererEventContext,
        subRenderers: Array<SubRendererInfo>,
        renderers: Array<RendererConfig>
    ) => BasicSubRenderInfo | Array<BasicSubRenderInfo> | void;
}
```


## 线上环境部署指南（使用 npmmirror）

适用：将本项目构建为纯静态文件并部署到 Nginx、静态资源服务器或对象存储。

### 1. 环境准备
- 建议使用 Node.js LTS（≥16），npm（≥8）。

### 2. 使用淘宝 npmmirror 安装依赖
- 项目内局部设置（推荐，可保证只影响当前项目）：
```bash
echo "registry=https://registry.npmmirror.com" > .npmrc
```

- 一次性临时使用（CI 或本地临时安装）：
```bash
npm ci --registry=https://registry.npmmirror.com
# 或
npm i --registry=https://registry.npmmirror.com
```

- 全局设置（影响当前用户的所有项目，可选）：
```bash
npm config set registry https://registry.npmmirror.com
```

安装依赖（推荐使用 npm ci，基于 package-lock.json 固定版本）：
```bash
npm ci
# 若首次安装遇到 lock 不匹配，可退而求其次：npm i
```

### 3. 生产构建
```bash
npm run build
```
构建完成后，产物默认输出到 `demo-6.11.0/` 目录（见 `amis.config.js -> build.assetsRoot`）。

重要：请根据实际部署域名/路径，调整静态资源的公共路径 `assetsPublicPath`（见 `amis.config.js -> build.assetsPublicPath`）。例如：
```js
// amis.config.js（节选）
build: {
  // ...
  assetsPublicPath: '/editor/' // 当前默认值：部署在 http://hostname/editor
  // 若部署在根域名：
  // assetsPublicPath: '/'
  // 或部署在其他子路径：
  // assetsPublicPath: '/your-sub-path/'
}
```
提示：当前仓库默认将 `assetsPublicPath` 设为 `/editor/` 以匹配生产部署路径 `http://hostname/editor`；如你的路径不同，请相应调整。

### 4. 部署到 Nginx（挂载在 /editor 子路径示例）
假设将构建产物上传到服务器目录 `/var/www/amis-editor/demo-6.11.0`，并且站点最终访问路径为 `http://hostname/editor`，Nginx 配置示例如下：
```nginx
server {
  listen 80;
  server_name your-domain.com;

  # 可选：将 /editor 重定向到带尾斜杠的 /editor/
  location = /editor {
    return 301 /editor/;
  }

  # 静态资源与 SPA 路由（assetsPublicPath: /editor/）
  location /editor/ {
    alias /var/www/amis-editor/demo-6.11.0/;
    index index.html;
    try_files $uri $uri/ /editor/index.html;
  }

  # 可选：静态资源缓存
  location ~* ^/editor/.*\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|map)$ {
    expires 7d;
    access_log off;
  }
}
```

若站点部署在子路径（例如 `https://your-domain.com/ae/`）：
- 设置 `assetsPublicPath: '/ae/'` 或 `https://your-domain.com/ae/`；
- Nginx 中 `location /ae/ { try_files ... }` 并将 `root` 指向构建目录；
- 确保以斜杠结尾的公共路径，避免相对路径解析错误。

### 5. 快速自检
- 页面空白或 404：多为 `assetsPublicPath` 与实际访问路径不一致；
- 静态资源 404：确认构建产物已完整上传且 Nginx `root` 指向正确目录；
- 缓存导致样式/脚本未更新：尝试强刷或调整 Nginx 缓存策略；
- 使用 GitHub Pages 子目录部署：将 `assetsPublicPath` 设置为对应子目录（以 `/子目录/` 结尾）。

### 6. 后端 API 地址配置

- 代码位置：`src/config/api.ts`（新增）。导出 `getApiBaseUrl()`，按以下优先级确定 API 基址：
  1) 运行时配置：`window.__APP_CONFIG__.API_BASE_URL`
  2) 自动推断：若当前路径以 `/editor` 开头，默认使用根路径 `'/'`；否则使用 `'/api_mocker'`（用于开发代理）。

- 开发环境：通过 `amis.config.js -> dev.proxyTable` 代理 `'/api_mocker'` 到后端，例如：
```js
// amis.config.js（节选）
dev: {
  proxyTable: {
    '/api_mocker': {
      target: 'http://你的后端域名或IP:端口',
      ws: true,
      changeOrigin: true
    }
  }
}
```

- 生产环境（与你的部署一致）：前端位于 `http://hostname/editor`，后端为同域根路径 `http://hostname`。
  - 在此情况下，无需改代码或注入配置，默认会将 API 请求发往根路径 `/`。
  - 如需自定义前缀或不同域名，可在最终 `index.html` 注入运行时配置覆盖：
```html
<script>
  window.__APP_CONFIG__ = { API_BASE_URL: '/api' };
</script>
```
或：
```html
<script>
  window.__APP_CONFIG__ = { API_BASE_URL: 'https://api.yourdomain.com' };
</script>
```

- 可选 Nginx 反代（如使用前缀 `/api`）：
```nginx
location /api/ {
  proxy_pass http://hostname/;  # 转发到你的后端
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

- 跨域 & 凭证：代码默认 `withCredentials=true`。若跨域，后端需设置 `Access-Control-Allow-Credentials: true`，且 `Access-Control-Allow-Origin` 需为前端实际域名（不能为 `*`）。
