
//定义格式1的数据类型
type Format1 = {
    name: string,
    values: string
}

//定义格式2的数据类型
type Format2 = {
    name: string,
    value: {
        specName: string
    }[],
    child: {
        value: string,
        label: string
    }[]
}[]

//定义格式3的数据类型
type Format3 = {
    [key: string]: string | number
}[]

//树节点类型.
type TreeNode = {
    //唯一标识,在递归时按照处理顺序递增.
    id: number,
    //当前节点的名字,不包含父节点的名字,比如: 自选小料
    name: string,
    //full name,表示元素的所在路径,使用空格分割 比如:自选小料 温度 甜度
    fullName: string,
    //当前节点的值,比如: 椰果
    value: string,
    //full value,表示节点的实际完整值,使用空格分割 比如: 椰果 常温 三分糖
    fullValue:string,
    //当前节点的层级,比如: 1,root节点的层级为0
    level: number,
    //当前节点下的子节点集合.
    children: TreeNode[]
}
//加载数据
const data: Format1[] = require('./format1.json')

//定义一个全局变量,用于记录当前处理的节点的id,在递归时递增.
let id = 0
//定义root节点
const root: TreeNode = {
    id: id++,
    name: 'root',
    fullName: 'root',
    value: 'root',
    fullValue: 'root',
    level: 0,
    children: []
}

//每个层级的节点集合,key是数字,value是tree node的集合
let levelMap: { [key: number]: TreeNode[] } = {}
levelMap[0] = [root]
/*
data:
{
  name:"自选小料,温度,甜度",
  values:"椰果,红豆,奥利奥碎;热,常温,多冰;正常糖,七分糖,三分糖"
}

* */

//从data中提取name的list,组装成name:[value1,value2,value3]的形式
//第一步先把values提取出来变成一个数组
let values:string = data.values.split(';')
//第二步把name和values组装成一个对象
let obj = {}
data.name.split(',').forEach((name,index)=>{
    obj[name] = values[index].split(',')
})

//对于如上数据,节点数量应该为3*3*3=27个
let keys = Object.keys(obj)
for (let i = 0; i <keys.length ; i++) {
    let currentKey = keys[i]
    let currentValues = obj[currentKey]
    let currentLevel = i + 1
    let parentLevel = currentLevel - 1
    let parentNodes = levelMap[parentLevel]
    let currentNodes: TreeNode[] = []
    parentNodes.forEach((parentNode) => {
            currentValues.forEach((value) => {
                let currentNode: TreeNode = {
                    id: id++,
                    name: currentKey,
                    fullName: parentNode.fullName + ' ' + currentKey,
                    value: value,
                    fullValue: parentNode.fullValue + ' ' + value,
                    level: currentLevel,
                    children: []
                }
                parentNode.children.push(currentNode)
                currentNodes.push(currentNode)
            })
        }
    )
    levelMap[currentLevel] = currentNodes
}

//打印结果
console.log('树:', JSON.stringify(root, null, 2))
console.log('节点数量:', id)