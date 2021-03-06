import React, { Component } from "react";
import "./index.less";
import logo from "../../assets/imgs/logo.png"; //注意jsx中引入图片的方式
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig";
const { SubMenu } = Menu;
/* 左侧导航组件 */

class LeftNav extends Component {
  /* 判断当前登录用户的菜单项权限 */
  hasAuth = (item) => {
    const { key, isPublic } = item;
    const { menus } = this.props.user.role;
    const { username } = this.props.user;
    /* 四种情况有权限
    1.当前用户是admin
    2.当前菜单项item是公开的
    3.当前用户有此菜单项item的权限：key在menus数组中
    4.当前用户有此菜单项item的某个子菜单的权限,当前菜单项也需要显示 */
    if (
      username === "admin" ||
      isPublic === true ||
      menus.indexOf(key) !== -1
    ) {
      return true;
    } else if (item.children) {
      return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };
  /* 根据menuList数据动态生成leftNav菜单内容,
  方便后续权限管理(不同用户的权限操作不同,不能写死菜单项)
  实现方法：map()函数【也可用reduce()函数】 + 递归调用 */
  getMenuNodes = (menuList) => {
    //得到当前请求的路由路径
    const path = this.props.location.pathname;

    return menuList.map((item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          );
        } else {
          //查找一个与当前请求路径匹配的子路径
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.key) === 0
          );
          if (cItem) {
            this.openKey = item.key;
          }
        }

        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {/* 递归调用,显示subMenu的菜单项 */}
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };
  /* 在第一次render()之前执行一次
  为第一个render()准备数据(必须同步的) */
  constructor(props) {
    super(props);
    this.menuNodes = this.getMenuNodes(menuList);
  }

  render() {
    // debugger
    //得到当前请求的路由路径,实现刷新时依然自动选中当前菜单项
    let path = this.props.location.pathname;
    /* 当前请求的是商品或其子路由界面(详情/修改),保证左导航栏商品管理的选中 */
    if (path.indexOf("/products/product") === 0) {
      path = "/products/product";
    }

    const openKey = this.openKey;

    return (
      <div>
        <div className="left-nav">
          <Link to="/" className="left-nav-header">
            <img src={logo} alt="logo" />
            <h1>硅谷后台</h1>
          </Link>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
          >
            {this.menuNodes}
          </Menu>
        </div>
      </div>
    );
  }
}
/* withRouter是高阶组件,用于包装非路由组件,返回一个新组件,
新组件具有路由组件的3大属性：history，location，match */
export default withRouter(LeftNav);
