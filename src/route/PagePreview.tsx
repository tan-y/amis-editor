import { Button, Spinner } from 'amis';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import AMISRenderer from '../component/AMISRenderer';
import { IMainStore } from '../store';

export default inject('store')(
  observer(function ({
    store,
    location,
    history,
    match
  }: {store: IMainStore} & RouteComponentProps<{id: string}>) {
    const pageId: string = match.params.id;
    const page = store.pages.find(p => p.id === pageId);

    // 首次进入时 pages 可能尚未通过 API 加载完成，避免过早重定向
    if (!page) {
      if (store.loading || store.pages.length === 0) {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column'
            }}
          >
            <Spinner size="lg" />
            <div style={{ marginTop: '16px', color: '#666' }}>加载页面数据中...</div>
          </div>
        );
      }
      // 加载完成仍未找到对应页面，统一跳转到欢迎页
      history.replace('/welcome');
      return null;
    }

    function goBack() {
      history.goBack();
    }

    function editPage() {
      history.push(`/edit/${pageId}`);
    }

    return (
      <div className="PagePreview">
        <div className="PagePreview-header" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: '#fff',
          borderBottom: '1px solid #e8e9ea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button size="sm" onClick={goBack} style={{ marginRight: '12px' }}>
              返回
            </Button>
            <h3 style={{ margin: 0, color: '#333' }}>{page.name} - 预览</h3>
          </div>
          <Button size="sm" level="primary" onClick={editPage}>
            编辑页面
          </Button>
        </div>
        <div className="PagePreview-content" style={{
          paddingTop: '50px',
          minHeight: '100vh'
        }}>
          <AMISRenderer schema={page.schema} />
        </div>
      </div>
    );
  })
);