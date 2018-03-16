# infinite scroll 无限滚动加载

## 前言
无限滚动加载在商品列表，微博消息，图片瀑布流等场景下使用广泛，但是无限滚动加载将在同一个页面里保存所有浏览记录，那么这些浏览记录对网页性能，机器内存等造成的影响有多大呢？如果有影响，该如何解决这些问题呢？

本文目标是通过调研和实地测试PC端、H5端、安卓、iOS、RN、小程序等平台无限滚动加载的性能消耗以及处理方式。找寻各个平台比较好的解决方案。

比如快速滚动过去的元素不渲染，图片不请求等等。

## PC web
### a 
[https://stackoverflow.com/questions/12613113/performance-with-infinite-scroll-or-a-lot-of-dom-elements](https://stackoverflow.com/questions/12613113/performance-with-infinite-scroll-or-a-lot-of-dom-elements)

scrolling triggers repaints; 

setting display of none triggers reflow, setting visibility to hidden will not trigger reflow;

所有带有滚动特性的窗口如浏览器，不会渲染视窗以外的东西，所以不用考虑绘制性能。（但是内存性能呢？）

无限刷新时有限制的，当超过某个条数的时候采用翻页形式重置DOM节点

### b
[https://dannysu.com/2012/07/07/infinite-scroll-memory-optimization/](https://dannysu.com/2012/07/07/infinite-scroll-memory-optimization/)

利用可观测数组
思路：保持渲染元素的个数可控，不在视图内的不渲染or删除

### c
[https://engineering.linkedin.com/linkedin-ipad-5-techniques-smooth-infinite-scrolling-html5](https://engineering.linkedin.com/linkedin-ipad-5-techniques-smooth-infinite-scrolling-html5)

图片不在视窗内，将img src替换为一个非常小的图片的src，这样减少内存占用。为什么不用空src，因为有bug，IE火狐对于空src会调用当前请求路径的dir或者请求当前页面。很老的文章，也许现代浏览器都修复了这个bug。[https://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/](https://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/)

> The src attribute must be present, and must contain a valid non-empty URL potentially surrounded by spaces referencing a non-interactive, optionally animated, image resource that is neither paged nor scripted. --- HTML5 specification

> When an empty string is encountered as a URI, it’s considered a relative URI and is resolved according to the algorithm defined in section 5.2  --- RFC3986 Uniform Resource Identifiers

也即：所有涉及到uri资源定位的情况，都可能存在为空时请求当前路径资源的问题。

visible hidden能有效提高渲染事件

用空DOM节点替换视窗之外的节点，（那么这里需要解决的问题是，当重新滚动回来的时候，需要将内容重新填进来，如果遇到的内容是可变的，那么scroll位置会发生变化）

box-shadow在webkit中渲染很慢，长列表需避免

保持DOM节点尽量少（从京东视界经验中深有体会，在做通用component的时候，dom节点个数越少越好，通常减少一倍的DOM节点个数是很容易的，在创建component结构的时候留心一下）

tab切换用三个tab满足动画效果。但是如果需要缓存已浏览的tab呢？


有很多人不推荐用无限滚动加载:

[https://medium.com/simple-human/7-reasons-why-infinite-scrolling-is-probably-a-bad-idea-a0139e13c96b](https://medium.com/simple-human/7-reasons-why-infinite-scrolling-is-probably-a-bad-idea-a0139e13c96b)

[https://www.webdesignerdepot.com/2015/11/how-infinite-scrolling-breaks-ux/](https://www.webdesignerdepot.com/2015/11/how-infinite-scrolling-breaks-ux/)

web端无限滚动主要是利用减少DOM节点，清空或替换非视窗内元素的思路


UITableViewController
UIScrollView 

AdapterViews and RecyclerView




