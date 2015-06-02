# gulp-gather-mainjs
收集模板上 `entry:js`内的js文件，该文件为当前页面的入口文件 。目的为  `webpack`的生成一个完成的入口清单，方便程序自动对项目内每个view上的js文件进行模块化处理。

##use
    
**模板文件**

    ```
    @include("./include/header.html")
    <img src="asset/images/default.jpg" alt=""/>
    <div id="flashContent">
        <p>
            您的flash版本太低，升级后才能有更测试  344343434
        </p>
    </div>
    
    <!-- entry:js -->
    <script src="asset/js/index.js" type="text/javascript"></script>
    <!-- endentry -->
    
    
    @include("./include/footer.html")
    ```

**gulp任务**

    ````javascript
        var gather = require("gulp-gather-mainjs");
        gulp.task("gatherJs", function () {
            return gulp.src("page/**/*.html")
                .pipe(gather())
                .pipe(gulp.dest("maps.json"));
        });
    ````
    
**最后的output**

    ```
    {
        "index_b6d35287": "asset/js/index.js"
    }
    ```
  
##other

输出的规则是：原文件名+ 当前文件的hash值。目的是为了保证输出的`key`是唯一的。原因如下：

    ```
    //多目录情况    js/home/index
    <!-- entry:js -->
    <script src="asset/js/home/index.js" type="text/javascript"></script>
    <!-- endentry -->
    
    <!-- entry:js -->
    <script src="asset/js/sub/index.js" type="text/javascript"></script>
    <!-- endentry -->
    ```
    
##TODO
- 各种边界处理
- 各种自定义配置处理
- 加入自动化测试
    
    
    
    
    
    

    
    