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
      console.log("IP jsonp():", err, data);
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
      console.log("Weather jsonp():", err, data);
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
