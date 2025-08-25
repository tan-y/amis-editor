import {types, getEnv, applySnapshot, getSnapshot, flow} from 'mobx-state-tree';
import {PageStore} from './Page';
import {when, reaction} from 'mobx';
import {pageApi, PageData} from '../services/pageApi';
let pagIndex = 1;
export const MainStore = types
  .model('MainStore', {
    pages: types.optional(types.array(PageStore), []),
    theme: 'cxd',
    asideFixed: true,
    asideFolded: false,
    offScreen: false,
    addPageIsOpen: false,
    preview: false,
    isMobile: false,
    schema: types.frozen(),
    loading: types.optional(types.boolean, false),
    error: types.maybe(types.string)
  })
  .views(self => ({
    get fetcher() {
      return getEnv(self).fetcher;
    },
    get notify() {
      return getEnv(self).notify;
    },
    get alert() {
      return getEnv(self).alert;
    },
    get copy() {
      return getEnv(self).copy;
    }
  }))
  .actions(self => {
    function toggleAsideFolded() {
      self.asideFolded = !self.asideFolded;
    }

    function toggleAsideFixed() {
      self.asideFixed = !self.asideFixed;
    }

    function toggleOffScreen() {
      self.offScreen = !self.offScreen;
    }

    function setAddPageIsOpen(isOpened: boolean) {
      self.addPageIsOpen = isOpened;
    }

    function setLoading(loading: boolean) {
      self.loading = loading;
    }

    function setError(error: string | undefined) {
      self.error = error;
    }

    const loadPages = flow(function* () {
      try {
        self.loading = true;
        self.error = undefined;
        const pagesData: PageData[] = yield pageApi.getPages();

        self.pages.clear();
        pagesData.forEach(pageData => {
          self.pages.push(
            PageStore.create({
              id: String(pageData.id),
              name: pageData.name,
              label: pageData.name,
              path: pageData.path, // 使用API返回的path
              icon: 'fa fa-file',
              schema: pageData.config || {},
              created_at: pageData.created_at,
              updated_at: pageData.updated_at
            })
          );
        });
      } catch (error: any) {
        self.error = error.message || '加载页面失败';
        self.notify('error', self.error);
      } finally {
        self.loading = false;
      }
    });

    const addPage = flow(function* (data: {
      label: string;
      path: string;
      icon?: string;
      schema?: any;
    }) {
      try {
        self.loading = true;
        self.error = undefined;
        const newPage: PageData = yield pageApi.createPage({
          name: data.label,
          path: data.path,
          config: data.schema || {
            type: 'page',
            title: data.label,
            body: []
          }
        });

        self.pages.push(
          PageStore.create({
            id: String(newPage.id),
            name: newPage.name,
            label: newPage.name,
            path: newPage.path, // 使用API返回的path
            icon: data.icon || 'fa fa-file',
            schema: newPage.config,
            created_at: newPage.created_at,
            updated_at: newPage.updated_at
          })
        );

        self.notify('success', '页面创建成功');
        return newPage;
      } catch (error: any) {
        self.error = error.message || '创建页面失败';
        self.notify('error', self.error);
        throw error;
      } finally {
        self.loading = false;
      }
    });

    const removePageAt = flow(function* (index: number) {
      try {
        const page = self.pages[index];
        if (!page) return;

        self.loading = true;
        self.error = undefined;

        yield pageApi.deletePage(parseInt(page.id, 10));
        self.pages.splice(index, 1);

        self.notify('success', '页面删除成功');
      } catch (error: any) {
        self.error = error.message || '删除页面失败';
        self.notify('error', self.error);
        throw error;
      } finally {
        self.loading = false;
      }
    });

    const updatePageSchemaAt = flow(function* (index: number) {
      try {
        const page = self.pages[index];
        if (!page || !self.schema) return;

        self.loading = true;
        self.error = undefined;

        yield pageApi.updatePageConfig(parseInt(page.id, 10), self.schema);
        page.updateSchema(self.schema);
      } catch (error: any) {
        self.error = error.message || '保存页面配置失败';
        self.notify('error', self.error);
        throw error;
      } finally {
        self.loading = false;
      }
    });

    function updateSchema(value: any) {
      self.schema = value;
    }

    function setPreview(value: boolean) {
      self.preview = value;
    }

    function setIsMobile(value: boolean) {
      self.isMobile = value;
    }

    const updatePageInfoAt = flow(function* (
      index: number,
      data: {name?: string; path?: string}
    ) {
      try {
        const page = self.pages[index];
        if (!page) return;

        self.loading = true;
        self.error = undefined;

        const updatedPage: PageData = yield pageApi.updatePage(
          parseInt(page.id, 10),
          data
        );

        if (data.name) {
          page.updateName(updatedPage.name);
        }
        if (data.path) {
          page.updatePath(updatedPage.path);
        }

        self.notify('success', '页面信息更新成功');
        return updatedPage;
      } catch (error: any) {
        self.error = error.message || '更新页面信息失败';
        self.notify('error', self.error);
        throw error;
      } finally {
        self.loading = false;
      }
    });

    return {
      toggleAsideFolded,
      toggleAsideFixed,
      toggleOffScreen,
      setAddPageIsOpen,
      setLoading,
      setError,
      loadPages,
      addPage,
      removePageAt,
      updatePageSchemaAt,
      updatePageInfoAt,
      updateSchema,
      setPreview,
      setIsMobile,
      afterCreate() {
        // Load pages from API instead of localStorage
        loadPages();
      }
    };
  });

export type IMainStore = typeof MainStore.Type;
