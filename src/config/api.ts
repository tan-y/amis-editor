/**
 * 提供运行时可配置的 API 基址。
 * - 生产环境可在最终部署的 index.html 中注入 window.__APP_CONFIG__.API_BASE_URL，例如 '/'
 * - 开发环境默认使用 '/api_mocker'，以配合 devServer 代理
 */
export function getApiBaseUrl(): string {
  const globalConfig: any = (window as any).__APP_CONFIG__;

  // 规范化并校验运行时注入值
  const normalizeConfiguredBaseUrl = (input: string): string | undefined => {
    if (!input) return undefined;
    const trimmed = input.trim();

    // 明确拒绝只有协议、或协议+单斜杠的非法配置，防止拼接成 https://pages/
    // 如: 'https:', 'https:/', 'https://', 'http:', 'http:/', 'http://'
    if (/^https?:\/?$/.test(trimmed) || /^https?:\/\/$/.test(trimmed)) {
      return undefined;
    }

    // 完整绝对地址（含域名），保留协议与主机，仅去除末尾多余斜杠
    if (/^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(trimmed)) {
      return trimmed.replace(/\/+$/, '');
    }

    // 以斜杠开头的相对根路径前缀，如 '/api' 或 '/'
    if (trimmed.startsWith('/')) {
      return trimmed === '/' ? '/' : trimmed.replace(/\/+$/, '');
    }

    // 其他非期望格式一律忽略（走自动推断）
    return undefined;
  };

  if (globalConfig && typeof globalConfig.API_BASE_URL === 'string') {
    const normalized = normalizeConfiguredBaseUrl(globalConfig.API_BASE_URL);
    if (normalized) {
      return normalized;
    }
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


