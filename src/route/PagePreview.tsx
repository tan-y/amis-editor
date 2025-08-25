import React from 'react';
import {observer, inject} from 'mobx-react';
import {IMainStore} from '../store';
import {RouteComponentProps} from 'react-router-dom';
import {Button} from 'amis';
import AMISRenderer from '../component/AMISRenderer';

export default inject('store')(
  observer(function ({
    store,
    location,
    history,
    match
  }: {store: IMainStore} & RouteComponentProps<{id: string}>) {
    const pageId: string = match.params.id;
    const page = store.pages.find(p => p.id === pageId);

    // 如果页面不存在，跳转到首页
    if (!page) {
      history.replace('/');
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