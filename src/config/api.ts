/**
 * 提供运行时可配置的 API 基址。
 * - 生产环境可在最终部署的 index.html 中注入 window.__APP_CONFIG__.API_BASE_URL，例如 '/'
 * - 开发环境默认使用 '/api_mocker'，以配合 devServer 代理
 */
export function getApiBaseUrl(): string {
  const globalConfig: any = (window as any).__APP_CONFIG__;
  if (globalConfig && typeof globalConfig.API_BASE_URL === 'string' && globalConfig.API_BASE_URL) {
    let configured = globalConfig.API_BASE_URL as string;
    if (configured.length > 1 && configured.endsWith('/')) {
      configured = configured.slice(0, -1);
    }
    return configured;
  }

  // 根据部署路径自动推断：生产部署在 /editor 下时，API 与站点同域根路径
  const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
  let baseUrl: string = pathname.startsWith('/editor') ? '/' : '/api_mocker';

  // 规范化：去掉多余的结尾斜杠（但保留根路径'/'）
  if (baseUrl.length > 1 && baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  return baseUrl;
}


