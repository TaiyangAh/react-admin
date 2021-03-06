/* 要求：能根据接口文档定义接口请求函数
包含应用所有接口请求函数的模块
每个函数返回值都是promise */
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

//登录
export const reqLogin = (username, password) =>
  ajax("/base/login", { username, password }, "POST");

//添加用户
export const reqAddUser = (user) => ajax("/base/manage/user/add", user, "POST");

//ip定位
export const reqIP = () => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/ip?output=json&key=4739c89722d5f12caf2ce96d8d022978`;
    jsonp(url, {}, (err, data) => {
      // console.log("IP jsonp():", err, data);测试用代码
      if (!err && data.status === "1") {
        const { adcode } = data;
        resolve({ adcode });
      } else {
        message.error("获取天气信息失败");
      }
    });
  });
};

//根据IP地址获取天气信息
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=4739c89722d5f12caf2ce96d8d022978&output=json&city=${city}&extentions=base`;
    //发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // console.log("Weather jsonp():", err, data);测试用代码
      if (!err && data.status === "1") {
        //取出数据
        const { province, city, weather, temperature } = data.lives[0];
        resolve({ province, city, weather, temperature });
      } else {
        message.error("获取天气信息失败");
      }
    });
  });
};

//获取category组件的分类列表
export const reqCategories = (parentId) =>
  ajax("/base/manage/category/list", { parentId });
//添加分类
export const reqAddCategory = (categoryName, parentId) =>
  ajax("/base/manage/category/add", { categoryName, parentId }, "POST");
//更新分类名称
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax("/base/manage/category/update", { categoryId, categoryName }, "POST");
//根据分类ID获取分类
export const reqCategory = (categoryId) =>
  ajax("/base//manage/category/info", { categoryId });

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax("/base/manage/product/list", { pageNum, pageSize });
//搜索商品分页列表,searchType搜索的类型--productName/productDesc
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) =>
  ajax("/base/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName, //参数名作为属性名加[]号
  });
//更新商品状态(对商品做上架/下架处理)
export const reqUpdateStatus = (productId, status) =>
  ajax("/base/manage/product/updateStatus", { productId, status }, "POST");
//添加或修改商品
export const reqAddOrUpdateProduct = (product) =>
  ajax(
    "/base/manage/product/" + (product._id ? "update" : "add"),
    product,
    "POST"
  );
//删除图片
export const reqDeleteImg = (name) =>
  ajax("/base/manage/img/delete", { name }, "POST");

//获取所有角色列表
export const reqRoles = () => ajax("/base/manage/role/list");
//添加角色
export const reqAddRole = (roleName) =>
  ajax("/base/manage/role/add", { roleName }, "POST");
//更新角色(给角色设置权限)
export const reqUpdateRole = (role) =>
  ajax("/base/manage/role/update", role, "POST");

//获取所有用户列表
export const reqUsers = () => ajax("/base/manage/user/list");
//添加/修改用户
export const reqAddOrUpdateUser = (user) =>
  ajax("/base/manage/user/" + (user._id ? "update" : "add"), user, "POST");
//删除用户
export const reqDeleteUser = (userId) =>
  ajax("/base/manage/user/delete", { userId }, "POST");
