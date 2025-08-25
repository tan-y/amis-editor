import React from 'react';
import {observer, inject} from 'mobx-react';
import {IMainStore} from '../store';
import {Button, AsideNav, Layout, confirm, Spinner} from 'amis';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';
import {Link} from 'react-router-dom';
import NotFound from './NotFound';
import AMISRenderer from '../component/AMISRenderer';
import AddPageModal from '../component/AddPageModal';

// 创建一个观察者组件来渲染页面内容
const PageRenderer = observer(
  ({store, path}: {store: IMainStore; path: string}) => {
    // 从路径中去掉开头的斜杠进行匹配
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const page = store.pages.find(p => p.path === cleanPath);
    if (!page) return null;

    return <AMISRenderer schema={page.schema} />;
  }
);

function isActive(link: any, location: any) {
  const ret = matchPath(location?.pathname, {
    path: link ? link.replace(/\?.*$/, '') : '',
    exact: true,
    strict: true
  });

  return !!ret;
}

export default inject('store')(
  observer(function ({
    store,
    location,
    history
  }: {store: IMainStore} & RouteComponentProps) {
    function renderHeader() {
      return (
        <>
          <div className={`cxd-Layout-brandBar`}>
            <div className="cxd-Layout-brand text-ellipsis">
              <i className="fa fa-paw"></i>
              <span className="hidden-folded m-l-sm">AMIS 示例</span>
            </div>
          </div>
          <div className={`cxd-Layout-headerBar`}>
            <div className="hidden-xs p-t-sm ml-auto px-2">
              <Button size="sm" className="m-r-xs" level="success" disabled>
                全部导出
              </Button>
              <Button
                size="sm"
                level="info"
                disabled={store.loading}
                onClick={() => store.setAddPageIsOpen(true)}
              >
                新增页面
              </Button>
            </div>
          </div>
        </>
      );
    }

    function renderAside() {
      const navigations = store.pages.map(item => ({
        label: item.label,
        path: `/${item.path}`,
        icon: item.icon
      }));
      const paths = navigations.map(item => item.path);

      return (
        <AsideNav
          key={store.asideFolded ? 'folded-aside' : 'aside'}
          navigations={[
            {
              label: '导航',
              children: navigations
            }
          ]}
          renderLink={({link, toggleExpand, classnames: cx, depth}: any) => {
            if (link.hidden) {
              return null;
            }

            let children = [];

            if (link.children) {
              children.push(
                <span
                  key="expand-toggle"
                  className={cx('AsideNav-itemArrow')}
                  onClick={e => toggleExpand(link, e)}
                ></span>
              );
            }

            link.badge &&
              children.push(
                <b
                  key="badge"
                  className={cx(
                    `AsideNav-itemBadge`,
                    link.badgeClassName || 'bg-info'
                  )}
                >
                  {link.badge}
                </b>
              );

            if (link.icon) {
              children.push(
                <i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />
              );
            } else if (store.asideFolded && depth === 1) {
              children.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    link.children ? 'fa fa-folder' : 'fa fa-info'
                  )}
                />
              );
            }

            link.active ||
              children.push(
                <i
                  key="delete"
                  data-tooltip="删除"
                  data-position="bottom"
                  className={'navbtn fa fa-times'}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    confirm('确认要删除').then(confirmed => {
                      confirmed && store.removePageAt(paths.indexOf(link.path));
                    });
                  }}
                />
              );

            children.push(
              <i
                key="edit"
                data-tooltip="编辑"
                data-position="bottom"
                className={'navbtn fa fa-pencil'}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  const page = store.pages.find(p => `/${p.path}` === link.path);
                  if (page) {
                    history.push(`/edit/${page.id}`);
                  }
                }}
              />
            );

            children.push(
              <span key="label" className={cx('AsideNav-itemLabel')}>
                {link.label}
              </span>
            );

            return link.path ? (
              link.active ? (
                <a>{children}</a>
              ) : (
                <Link to={link.path[0] === '/' ? link.path : `${link.path}`}>
                  {children}
                </Link>
              )
            ) : (
              <a
                onClick={
                  link.onClick
                    ? link.onClick
                    : link.children
                    ? () => toggleExpand(link)
                    : undefined
                }
              >
                {children}
              </a>
            );
          }}
          isActive={(link: any) =>
            isActive(
              link.path && link.path[0] === '/' ? link.path : `${link.path}`,
              location
            )
          }
        />
      );
    }

    async function handleConfirm(value: {
      label: string;
      icon: string;
      path: string;
    }) {
      try {
        await store.addPage({
          ...value,
          schema: {
            type: 'page',
            title: value.label,
            body: '这是你刚刚新增的页面。'
          }
        });
        store.setAddPageIsOpen(false);
      } catch (error) {
        // Error is already handled in store with notification
      }
    }

    if (store.loading && store.pages.length === 0) {
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
          <div style={{marginTop: '16px', color: '#666'}}>
            加载页面数据中...
          </div>
        </div>
      );
    }

    return (
      <Layout
        aside={renderAside()}
        header={renderHeader()}
        folded={store.asideFolded}
        offScreen={store.offScreen}
      >
        <Switch>
          {store.pages.map((item: any) => (
            <Route
              key={item.id}
              path={`/${item.path}`}
              render={routeProps => (
                <PageRenderer
                  store={store}
                  path={routeProps.location.pathname}
                />
              )}
            />
          ))}
          <Route
            path="/welcome"
            render={() => (
              <AMISRenderer
                schema={{
                  type: 'page',
                  title: '欢迎使用 AMIS 编辑器',
                  body: [
                    {
                      type: 'panel',
                      title: '开始使用',
                      body: [
                        {
                          type: 'html',
                          html: `
                            <div style="text-align: center; padding: 40px;">
                              <h2>欢迎使用 AMIS 可视化编辑器</h2>
                              <p style="color: #666; margin: 20px 0;">您还没有创建任何页面</p>
                              <p style="color: #999;">点击右上角的"新增页面"按钮开始创建您的第一个页面</p>
                            </div>
                          `
                        }
                      ]
                    }
                  ]
                }}
              />
            )}
          />
          <Route component={NotFound} />
        </Switch>
        <AddPageModal
          show={store.addPageIsOpen}
          onClose={() => store.setAddPageIsOpen(false)}
          onConfirm={handleConfirm}
          pages={store.pages.concat()}
        />
      </Layout>
    );
  })
);
