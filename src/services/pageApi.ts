import axios from 'axios';
import { getApiBaseUrl } from '../config/api';

export interface PageData {
  id: number;
  name: string;
  path: string;
  config: any;
  created_at: string;
  updated_at: string;
}

export interface CreatePageRequest {
  name: string;
  path: string;
  config?: any;
}

export interface UpdatePageRequest {
  name?: string;
  path?: string;
  config?: any;
}

export interface ApiResponse<T = any> {
  status: number;
  msg: string;
  data: T;
  code?: any;
}

const API_BASE_URL = getApiBaseUrl();

class PageApiService {
  /**
   * 获取页面列表
   */
  async getPages(): Promise<PageData[]> {
    const response = await axios.get<ApiResponse<PageData[]>>(
      `${API_BASE_URL}/pages`
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '获取页面列表失败');
    }
    return response.data.data;
  }

  /**
   * 创建页面
   */
  async createPage(pageData: CreatePageRequest): Promise<PageData> {
    const response = await axios.post<ApiResponse<PageData>>(
      `${API_BASE_URL}/pages`,
      pageData
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '创建页面失败');
    }
    return response.data.data;
  }

  /**
   * 读取页面配置
   */
  async getPageConfig(pageId: number): Promise<any> {
    const response = await axios.get<ApiResponse<any>>(
      `${API_BASE_URL}/pages/${pageId}/config`
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '读取页面配置失败');
    }
    return response.data.data;
  }

  /**
   * 更新页面配置
   */
  async updatePageConfig(pageId: number, config: any): Promise<string> {
    const response = await axios.post<ApiResponse<string>>(
      `${API_BASE_URL}/pages/${pageId}/config`,
      config
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '更新页面配置失败');
    }
    return response.data.data;
  }

  /**
   * 更新页面信息
   */
  async updatePage(
    pageId: number,
    pageData: UpdatePageRequest
  ): Promise<PageData> {
    const response = await axios.put<ApiResponse<PageData>>(
      `${API_BASE_URL}/pages/${pageId}`,
      pageData
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '更新页面失败');
    }
    return response.data.data;
  }

  /**
   * 删除页面
   */
  async deletePage(pageId: number): Promise<string> {
    const response = await axios.delete<ApiResponse<string>>(
      `${API_BASE_URL}/pages/${pageId}`
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '删除页面失败');
    }
    return response.data.data;
  }

  /**
   * 通过路径获取页面
   */
  async getPageByPath(pagePath: string): Promise<PageData> {
    const response = await axios.get<ApiResponse<PageData>>(
      `${API_BASE_URL}/pages/by-path/${encodeURIComponent(pagePath)}`
    );
    if (response.data.status !== 0) {
      throw new Error(response.data.msg || '获取页面失败');
    }
    return response.data.data;
  }
}

export const pageApi = new PageApiService();
