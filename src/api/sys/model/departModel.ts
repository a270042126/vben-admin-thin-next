export interface DepartTreeModel {
  id: number;
  label: string;
  children: DepartTreeModel[];
}

export interface RoleDeptTreeModel {
  checkedKeys: number[];
  depts: DepartTreeModel[];
}
