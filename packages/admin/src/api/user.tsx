export type PostType = {
  id: string
  title: string
  body: string
}

import { httpClient } from '../core/http/axios/httpClient';

export class PostNotFoundError extends Error {}

type MenuType = {
  id: string;
  name: string;
  parentId: string;
}
export const fetchMenus = () => {
  return httpClient.get<MenuType[]>("/api/v1/menus");
}

export const fetchMenu = (id: string) => {
  return httpClient.get<MenuType[]>(`/api/v1/menu/${id}`);
}

export const updateMenu = (menu: MenuType) => {
  return httpClient.post<MenuType>(`/api/v1/menu/${menu.id}`, menu);
}

export const createMenu = (menu: MenuType) => {
  return httpClient.post<MenuType>(`/api/v1/menu`, menu);
}
