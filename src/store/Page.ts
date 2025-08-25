import {types, getEnv} from 'mobx-state-tree';
export const PageStore = types
  .model('Page', {
    id: types.identifier,
    icon: '',
    path: '',
    label: '',
    name: '', // API field
    schema: types.frozen({}),
    created_at: types.maybe(types.string),
    updated_at: types.maybe(types.string)
  })
  .views(self => ({}))
  .actions(self => {
    function updateSchema(schema: any) {
      self.schema = schema;
    }

    function updateName(name: string) {
      self.name = name;
      self.label = name; // keep label in sync for UI compatibility
    }

    function updatePath(path: string) {
      self.path = path;
    }

    return {
      updateSchema,
      updateName,
      updatePath
    };
  });

export type IPageStore = typeof PageStore.Type;
