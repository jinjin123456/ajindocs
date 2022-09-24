# 排序算法分类
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200825174514853.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjkyNTE2OQ==,size_16,color_FFFFFF,t_70#pic_center)
# 直接插入
* 原理
当插入第i个记录时，前i-1个记录都已经排序，因此将第i个记录与前i-1个进行比较，找到的合适的位置就插入。简单明了但速度很慢。
* 代码实现

```javascript
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j,temp = arr[i];
    for (j = i; j > 0 && arr[j - 1] > temp; j--) {
      arr[j] = arr[j - 1];
    }
    arr[j] = temp;
  }
  return arr
}
const arr = [1,8,4,5,6,2]
insertSort(arr)
console.log(arr)
```

# 希尔排序
* 原理
在分组的基础上进行直接插入排序。如果有n个数排序先取一个小于n的整数d1作为第一个增量。所有距离为d1的倍数记录放在同一个组中。先在各组内进行直接插入排序；然后，取第二个增量d2<d1重复上述的分组和排序直至所取的增量dt=1,也就是所有记录放在同一组中进行直接插入排序为止。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200825181714381.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjkyNTE2OQ==,size_16,color_FFFFFF,t_70#pic_center)
* 代码实现

```javascript
function shellSort(arr){
    let len = arr.length,gap=1;
    while(gap < len/3){  //动态定义间隔序列
        gap = gap*3+1
    }
    for(gap;gap>0;gap=Math.floor(gap/3)){ //比插入排序多了一层分组
        for(let i=gap;i<len;i++){
            let j,temp = arr[i]
            for(j=i-gap;j>0&&arr[j]>temp;j-=gap){
                arr[j+gap] = arr[j]
            }
            arr[j+gap] = temp
        }
    }
    return arr
}
const arr = [1,8,4,5,6,2]
shellSort(arr)
console.log(arr)
```

# 直接选择
* 原理
首先在所有记录中选出排序码最小的记录，把它与第1个记录交换，然后在其余的记录内选出排序码最小的记录，与第2个记录交换，以此类推，直至所有记录排完为止。
* 代码实现

```javascript
function selectSort(arr){
    const len = arr.length
    for(let i=0;i<len-1;i++){
        minIndex = i
        for(let j=i+1;j<len;j++){
            if(arr[j]<arr[minIndex]){
                minIndex = j
            }
        }
        let temp = arr[i]
        arr[i] = arr[minIndex]
        arr[minIndex] = temp
    }
    return arr
}
const arr = [1,8,4,5,6,2]
selectSort(arr)
console.log(arr)
```

#  堆排序
* 原理
* 先将序列建立堆，然后输出堆顶元素，再将剩下的序列建立堆，然后再输出堆顶元素，以此类推，直到所有元素均输出为止，此时元素输出的序列就是一个有序序列。
* 这个堆排序中的堆调整我之前一直想不通，但是看有一人博客解析写的特别好~[图解堆排序](https://www.cnblogs.com/chengxiao/p/6129630.html)
	　　 a.将无需序列构建成一个堆，根据升序降序需求选择大顶堆或小顶堆;
　　		b.将堆顶元素与末尾元素交换，将最大元素"沉"到数组末端;
　　		c.重新调整结构，使其满足堆定义，然后继续交换堆顶元素与当前末尾元素，反复执行调整+交换步骤，直到整个序列有序。
* 代码实现

```javascript
let len;  //因为声明的多个函数都需要数据长度，所以把len设置为全局变量
function buildMaxMap(arr){  //建立大顶堆
    len = arr.length
    for(let i=Math.floor(len/2);i>=0;i--){
        heapify(arr,i)
    }
}
function heapify(arr,i){   //堆调整
    let left = 2*i+1,
    right = 2*i+2,
    largest = i;
    if(left < len&&arr[left]>arr[largest]){
        largest = left
    }
    if(right < len&&arr[right]>arr[largest]){
        largest = right
    }
    if(largest!=i){
        swap(arr,i,largest)
        heapify(arr,largest)
    }
}

function swap(arr,i,j){
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

function heapSort(arr){
    buildMaxMap(arr)
    for(let i=arr.length-1;i>0;i--){
        swap(arr,0,i)
        len--
        heapify(arr,0)
    }
    return arr
}
const arr = [1,8,4,5,6,2]
heapSort(arr)
console.log(arr)
```
# 冒泡排序
* 原理
通过相邻元素之间的比较和交换，将排序码较小的元素逐渐从底部移向顶部。整过程就像水底下的气泡一样逐渐往上冒，所以称为冒泡算法。
* 代码实现

```javascript
function bubbleSort(arr){
    const len = arr.length
    // 外层，需要遍历的次数
    for(let i=0;i<len;i++){
        // 内层，每次比较
        for(let j=0;j<len-i;j++){
            if(arr[j]>arr[j+1]){
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr
}
const arr = [1,8,4,5,6,2]
bubbleSort(arr)
console.log(arr)


//优化改进：加个标识，如果已经排好序了就直接跳出循环
function bubbleSort(arr){
    let i = arr.length-1
    while(i>0){
        let pos = 0
        for(let j=0;j<i;j++){
            if(arr[j]>arr[j+1]){
                pos = j
                const temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
        i = pos
    }
    return arr
}
const arr = [1,8,4,5,6,2]
bubbleSort(arr)
console.log(arr)
```

# 快速排序
* 原理
采用分治法。在待排序的n个记录中任取一个记录，以该记录的排序码为准将所有记录分成两组，第一组都小于该数，第二组都大于该数。然后再采用相同方法对左右两个组分别进行排序，直到所有记录都排到相应的位置为止。
* 代码实现

```javascript
function quickSort(arr){
    if(arr.length <= 1){
        return arr
    }
    //获取中间索引值
    const num = Math.floor(arr.length/2)
    //获取中间数值
    const val = arr.splice(num,1)
    const left = []  //小于中间数的数组
    const right = [] //大于中间数的数组
    for(let i=0;i<arr.length;i++){
        if(arr[i]<val){
            //小于中间数，放在左容器
            left.push(arr[i])
        }else{
            //大于中间数，放在右容器
            right.push(arr[i])
        }
    }
    return quickSort(left).concat(val,quickSort(right))
}
const arr = [1,8,4,5,6,2]
console.log(quickSort(arr))
```

# 归并排序
* 原理
也称合并，是将两个或两个以上的有序子表合并成一个新的有序表。若将两个有序表合并成一个有序表则称为二路合并。
* 代码实现

```javascript
function merge(left,right){   //采用自上而下的递归方法
    const result = []
    while(left.length>0 && right.length>0){
        if(left[0] <= right[0]){
            result.push(left.shift())
        }else{
            result.push(right.shift())
        }
    }
    while(left.length){
        result.push(left.shift())
    }
    while(right.length){
        result.push(right.shift())
    }
    return result
}
function mergeSort(arr){
    let len = arr.length
    if(len<2){
        return arr
    }
    let middle = Math.floor(len/2),
    left = arr.slice(0,middle),
    right = arr.slice(middle)
    return merge(mergeSort(left),mergeSort(right))
}
const arr = [1,8,4,5,6,2]
console.log(mergeSort(arr))
```

# 基数排序
* 原理
是一种借助多关键字排序思想对单逻辑关键字进行排序的方法。一般考察的比较少。以后有机会再来补充~
