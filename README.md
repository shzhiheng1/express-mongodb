##  一.创建express项目
```
  npm install -g express     /**全局安装express**/
  express  express-mongodb   /**创建express项目**/
  cd express-mongodb         /**进入express-mongodb项目**/
  npm install                /**安装依赖**/
  npm run start              /**启动项目，浏览器访问http://localhost:3000/ **/
```

## 二. 使用mongoDB数据库 
1. mongoose安装和引入。  
    - npm i mongoose 。
    - 创建bin文件和mongoose.js文件。
    - 在mongoose.js文件中引入mongoose并链接。
2. 将mongoose.js引入到app.js中，使项目启动时链接mongodb。
3. 创建models文件夹，创建相应表的model。
4. 在routes文件夹下的user.js，操作数据库的表。
5. 在app.js 中引入并使用路由。

## 三. 开发环境的热更新
1. 安装nodemon
```
  npm i nodemon --save
```
2. 在package.json中的"node ./bin/www"改为"nodemon ./bin/www"

## 四. 配置环境
1. 安装dotenv
```
  npm i dotenv --save 
```
2. 在package.json 中set NODE_ENV=production 设置环境，在app中判断环境配置环境所有信息。

## 五. 使用bcrypt进行对密码的加密和解码。
## 六. 使用jwt生成token，进行登录认证。




