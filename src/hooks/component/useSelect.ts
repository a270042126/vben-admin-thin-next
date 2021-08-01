export function useSelect() {
  const filterOption = (input: string, option: any) => {
    return option.children[0].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  return {
    filterOption,
  };
}
