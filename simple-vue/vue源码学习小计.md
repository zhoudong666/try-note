# vue源码学习小计

前端开发小马哥掘金文章 https://juejin.cn/post/6844904183938678798

## 1 几种实现刷个念想绑定的做法

单向: 数据 => 视图  数据驱动视图

双向: 数据 <=> 视图 数据驱动视图, 视图更改数据(input / textarea 等添加了change/input事件,来该值)

### 1-1实现数据绑定的做法大致有以下三种

1. 发布者-订阅者模式(backbone.js) 一般通过 sub, pub 的方式实现数据和视图的绑定监听,更新数据方式通常做法是vm.set('property', value)
2. 脏值检查 angular.js 是通过脏值检查的方式对比数据是否有变更,来决定是否更新视图,最简单的方式就是通过setInterval()定时轮询监测数据变动 angular 只有在指定的事件触发时进入脏值检查;大致如下:
   1. DOM 事件 输入文本 按钮点击等
   2. XHR 响应事件 ($location)
   3. 浏览器 Location 变更事件 ($location)
   4. timer事件 ($timeout $interval)
3. 数据劫持: vue.js 则是采用数据劫持集合发布者-订阅者模式的方式,通过Object.defineProperty() 来劫持各个属性的setter getter 在数据变动时发布消息给订阅者, 出发相应的监听回调![](.\img\vue源码学习小计-1.png)

## 2 实现一个指令解析器 Compile

### 2-1 **DocumentFragment对象是什么？**

documentFragment 表示一个没有父级文件的最小文档对象.他被当作一个轻量级的document使用. 最大的区别是因为documentFragment不是真是DOM树的一部分,他的变化不会引起DOM树的重新渲染的操作(reflow),且不会导致性能问题

## 3 实现一个数据监听器 Observer

## 4 实现一个 Watcher 去更新视图

## 5 实现一个代理 proxy



# 面试题

阐述一下你所理解的MVVM响应式原理

vue 是采用数据劫持配合发布者-订阅者模式的方式, 通过Object.defineProperty() 来劫持各个属性的setter 和 getter , 在数据变动时, 发布消息给依赖收集器, 去通知观察者, 做出对应的回调函数, 去更新视图

详述:  MVVM作为绑定的入口, 整合 Observer, Compile 和 Watcher 三者, 通过 Observer 来监听 model数据变化, 通过 Compile 来解析编译模板指令, 最终利用 Watcher 搭起 Observer , Compile之间的通信桥梁, 达到数据变化 => 视图更新; 视图交互变化 => 数据 model 变更的双向绑定效果

