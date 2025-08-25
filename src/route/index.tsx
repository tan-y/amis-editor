import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
/**
 * BrowserRouter: history 路由模式
 * HashRouter: hash 路由模式
 */
import {Route, Switch, Redirect, HashRouter as Router} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store/index';
// import Preview from './Preview';
// import Editor from './Editor';
import '../renderer/MyRenderer';
const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));
const PagePreview = React.lazy(() => import('./PagePreview'));

export default observer(function ({store}: {store: IMainStore}) {
  // 动态重定向到第一个可用页面，如果没有页面则显示默认消息
  const getDefaultRedirect = () => {
    if (store.pages.length > 0) {
      return `/${store.pages[0].path}`;
    }
    return '/welcome'; // 当没有页面时的默认路径
  };

  return (
    <Router>
      <div className="routes-wrapper">
        <ToastComponent key="toast" position={'top-right'} />
        <AlertComponent key="alert" />
        <React.Suspense
          fallback={<Spinner overlay className="m-t-lg" size="lg" />}
        >
          <Switch>
            <Redirect to={getDefaultRedirect()} from={`/`} exact />
            <Route path="/edit/:id" component={Editor} />
            <Route path="/preview/:id" component={PagePreview} />
            <Route component={Preview} />
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
});
