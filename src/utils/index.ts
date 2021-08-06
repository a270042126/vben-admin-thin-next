import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';

import { unref } from 'vue';
import { isObject } from '/@/utils/is';

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 * 根据子级类型查找所有匹配的父级类型
 * id: 子级ID
 * data: 匹配数据
 * prop: 匹配的类型,默认用ID匹配
 */
export function getFathersById(id: any, data: Array<any>, prop = 'id') {
  const arrRes: Array<any> = [];
  const rev = (data: any, nodeId: any) => {
    for (let i = 0, length = data.length; i < length; i++) {
      const node = data[i];
      if (node[prop] === nodeId) {
        arrRes.unshift(node[prop]);
        return true;
      } else {
        if (node.children && node.children.length) {
          if (rev(node.children, nodeId)) {
            arrRes.unshift(node[prop]);
            return true;
          }
        }
      }
    }
    return false;
  };
  rev(data, id);
  return arrRes;
}

// 添加日期范围
export function addDateRange(params: Recordable, dateRange: Date[], propName: String) {
  const search = params;
  search.params = {};
  if (null != dateRange && dateRange.length > 0) {
    if (typeof propName === 'undefined') {
      search.params['beginTime'] = dateRange[0];
      search.params['endTime'] = dateRange[1];
    } else {
      search.params['begin' + propName] = dateRange[0];
      search.params['end' + propName] = dateRange[1];
    }
  }
  return search;
}

export function setRouterMeta(routers: Recordable[]) {
  routers.map((item) => {
    if (item.meta) {
      item.meta.hideMenu = item.hidden;
      item.meta.ignoreKeepAlive = item.meta.noCache;
      item.meta.frameSrc = item.meta.link;
    } else {
      item.meta = {
        hideMenu: item.hidden,
      };
    }
    if (item.children) {
      setRouterMeta(item.children);
    }
  });
}
