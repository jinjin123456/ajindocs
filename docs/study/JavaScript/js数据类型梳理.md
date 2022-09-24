## 概述
## Number
## BigInt
## String
## Boolean
## null
## undefined
## Symbol
## Object
### Function
### Array
## 类型判断
## 类型转换
### 显示转换
### 隐式转换
## 包装类
## JSON
### JSON.stringfy(value[, replacer, spaces])
* 对象 -> JSON
* 参数说明
  * value - 指定要编码的对象
  * replacer - 指定要编码的属性数组或映射函数(key, value) => {}
    * 借助replacer参数过滤掉循环引用的属性
    * 注意
      * replacer 函数会获取每个键/值对，包括嵌套对象和数组项。它被递归地应用。
      * 第一个 (key, value) 对的键是空的，并且该值是整个目标对象，有需要的情况下可分析并替换/跳过整个对象。
  * spaces - 指定用于格式化的空格数量，该参数也可以指定为字符串
* 注意事项
  * JSON与对象字面量的区别
    * 双引号：JSON中是没有单引号和反引号的，只有双引号；除了字符串必须双引号，属性名称也必须双引号
  * 支持转换的数据类型
    * Objects { ... }
    * Arrays [ ... ]
    * strings
    * numbers
    * boolean values true/false
    * null
  * 会被跳过的特定属性
    * 函数属性(方法)
    * Symbol类型的键和值
    * 存储undefined的属性
  * 重要限制：不得有循环引用
* toJSON
  * 类似toString，对象可提供toJSON方法来进行JSON转换。如果可用，JSON.stringify 会自动调用它。
### JSON.parse(str, [reviver])
* JSON -> 对象
* 参数说明
  * str - 要解析的JSON字符串
  * reviver - 可选的函数(key,value) => {}，该函数将为每个 (key, value) 对调用，并可以对值进行转换。
    * 例如在对日期的转换上，可将一个date的字符串转换为日期对象