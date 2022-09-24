## 问题背景
* 工作中遇到有一个需求就是让前端实现计划任务的功能模块，用户输入起始时间和间隔时间，根据开始时间每隔一定时间间隔循环执行任务一直到截止时间；需求就是这么个需求，团队项目的技术栈是Electron+Vue，当时我刚从学校毕业，小组长想让我锻炼锻炼，就把这个开发任务给我了。我看了看，这个核心不就是调用setInterval循环执行任务么。等开发完成，交付给公司内部测试使用，出现了bug，就是用户指定了起始时间和时间间隔，开启程序之后，发现本来应当每隔一段时间执行一次的任务，是根本没有停顿的在疯狂循环执行，我的那个用来在任务执行中显示执行日志的窗口疯狂弹出闪烁，场面非常鬼畜。
## 原因排查
* 我当时一整个愣住了，毫无头绪，我自己机子自测的时候都正常啊。幸好这个现象在用户机子那儿是必现的，小组长就教我，面对这种毫无头绪的情况，可以先尝试在自己代码中所有关键节点和自己怀疑的地方打上日志，再打包到客户机子上运行看看，试了几次发现是setInterval中的回调函数在疯狂循环执行，我又把传入回调函数中的参数值都打印出来，发现也没问题啊，与客户输入的参数值是一致的。感觉进入死局了。
* 小组长这个时候让我试试把setInterval以及回调函数中传入的参数值都写死，写成常见的值看看，结果！！！！正常了！！！没有疯狂闪烁，而且首次执行也成功了！这个时候我发现，是setInterval中延时值参数如果用的是用户的一个月的时间间隔就会疯狂闪烁，用我自己写死的2分钟是正常的。我突然意识到，setInterval的延时值参数是不是有限制？？？
* 我赶紧百度发现，setInterval真的有最大延时值的。事情的真相是：setTimeout/setInterval是使用Int32来存储延时参数值的，也就是说最大的延时值是2^31-1。一旦超过了最大值，其效果就跟延时值为0的情况一样，也就是马上执行。我没有发现是因为自测时我总是用短的时间间隔，而用户根据真实的需求场景需要每个月执行一次，这才发现了这个bug。
## 解决方案
* 原因排查到了，接下来就是想想该怎么可解决了。我上百度查了查，没有搜到相关问题的解决方案，我觉得这会不会是一个很难解决的问题，然后就去跟负责人那边沟通，要不就暂时不要用计划任务来启动任务，暂时先使用手动启动执行任务，但用户那边表示很为难，最好还是要用计划任务，正好团队里研发经理过来了问怎么了，我就把事情一说，研发经理说这个问题很好解决啊，他上网一搜，立马甩给了我一个链接:[What is the maximum delay for setInterval?](https://stackoverflow.com/questions/12633405/what-is-the-maximum-delay-for-setinterval)
* 如何破除setInterval最大延时值的限制，一种解决方案就是分段setInterval，把超过最大延时值的时间分成n个时间段, 前面n-1个不调用真正的方法，等到了最后一个快到结束时间了再真正执行。
  ```js
  const setLongInterval = (callback, timeout, ...args) {
    let count = 0
    const MAX_BIT_32_SIGEND = 2147483647
    const maxiterations = timeout / MAX_BIT_32_SIGEND

    const onInterval = () => {
        ++count
        if (count > maxiterations) {
            count = 0
            callback(args)
        }
    }

    return setInterval(onInterval, Math.min(timeout, MAX_BIT_32_SIGEND))
  }

  const setLongTimeout = (callback, timeout, ...args) {
    let count = 0
    let handle
    const MAX_BIT_32_SIGEND = 2147483647
    const maxiterations = timeout / MAX_BIT_32_SIGEND

    const onInterval = () => {
        ++count
        if (count > maxiterations) {
            count = 0
            clearInterval(handle)
            callback(args)
        }
    }

    handle = setInterval(onInterval, Math.min(timeout, MAX_BIT_32_SIGEND))
    return handle
  }
  ```
## 总结反思
* 通过这一次有收获也有反思，还挺感谢小组长的，一步一步引导我排查bug，以后如果再遇到这种毫无头绪的情况不至于那么慌里慌张的，了解该如何下手。但是透过这件事还是反映我很多问题，最明显的就是对困难畏惧，就算排查出了原因，还是没有解决好，自己没有好好思考，就百度搜搜简单下了结论解决不了，其实就是心里觉得自己解决不了，不去动脑子，其实等我看到那个链接的解答之后就会发现，其实根本也没有多复杂，自己都能看懂。这种畏难情绪要不得！！！！也要学会“钻牛角尖”！！！