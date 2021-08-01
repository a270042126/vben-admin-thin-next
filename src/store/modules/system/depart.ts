import { defineStore } from 'pinia';
import { DepartTreeModel } from '/@/api/sys/model/departModel';
import { getDepartTree } from '/@/api/sys/dept';

interface DepartState {
  departTree: DepartTreeModel[];
}
export const useDepartStore = defineStore({
  id: 'app-depart',
  state: (): DepartState => ({
    // user info
    departTree: [],
  }),
  getters: {
    getDepartTree(): DepartTreeModel[] {
      return this.departTree || [];
    },
  },
  actions: {
    async setDepartTree() {
      const tree = await getDepartTree();
      this.departTree = tree;
    },
  },
});
