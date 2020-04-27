<template>
  <div>
    <section class="todoapp">
      <header class="header">
        <h1>{{title}}</h1>
        <input class="new-todo" placeholder="有哪些事情需要做呢 ?" autofocus @keydown.enter="handleAdd" v-focus>
      </header>
      <!-- todos中有内容就显示 否则隐藏-->
      <template v-if="todos.length">
        <section class="main">
          <input id="toggle-all" class="toggle-all" type="checkbox" v-model="toggleALl">
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
            <!-- 遍历列表,渲染数据  
                 根据条件切换样式
            -->
            <li :class="{completed:item.completed, editing:item === currentEditing}" v-for="(item,index) in filterTodos"
              :key="item.id">
              <div class="view">
                <!-- 双向绑定 item.completed  确定选中状态  选中为 true 未选中为 false-->
                <input class="toggle" type="checkbox" v-model="item.completed">
                <!-- 添加双击事件  传值 item-->
                <label @dblclick="getEditing(item)">{{item.title}}</label>
                <button class="destroy" @click="handelDel(index)"></button>
              </div>
              <input class="edit" v-model="item.title" @keydown.enter="cancelEdit" @blur="cancelEdit"
                @keydown.esc="cancelEdit" v-todo-focus>
            </li>
          </ul>
        </section>
        <!-- This footer should hidden by default and shown when there are todos -->
        <footer class="footer">
          <!-- This should be `0 items left` by default -->
          <span class="todo-count"><strong>{{unCompleted}}</strong> 件事</span>
          <!-- Remove this if you don't implement routing -->
          <ul class="filters">
            <li>
              <a :class="{selected: filterText === ''}" href="#/">全部</a>
            </li>
            <li>
              <a :class="{selected: filterText === 'active'}" href="#/active">未完成</a>
            </li>
            <li>
              <a :class="{selected: filterText === 'completed'}" href="#/completed">已完成</a>
            </li>
          </ul>
          <!-- Hidden if no completed items are left ↓ -->
          <button class="clear-completed" v-show="hadCompleted" @click="handeldelAll">清空已完成</button>
        </footer>
      </template>
    </section>
  </div>
</template>

<script>
  // 引入样式
  import 'todomvc-common/base.css';
  import 'todomvc-app-css/index.css';

  export default {
    name: 'todoMVC',
    watch: {
      //监视todos的成员 当数据发生改变时 会自动调用handler方法 将数据存入localStorage
      todos: {
        handler() {
          const data = JSON.stringify(this.todos)
          window.localStorage.setItem('todos', data)
        },
        // 因为监听的是数组 , 需要开启深度监听模式
        deep: true
      }
    },
    computed: {
      toggleALl: {
        get() {
          // 遍历 当所有的completed为true时 返回true
          return this.todos.every(t => {
            t.completed === true
          })
        },
        set(value) {
          // 遍历 让所有的completed 与 toggleAll 同步
          this.todos.forEach(t => {
            t.completed = value
          })
        }
      },
      // 通过计算属性得出未完成的任务数
      unCompleted() {
        // 找出所有completed === false 的项   返回数量
        return this.todos.filter(t => t.completed === false).length
      },
      hadCompleted() {
        // 遍历todos 只要有一项满足 t.completed ===true 则停止遍历  返回true 
        // 如果没有满足条件的 返回false
        return this.todos.some(t => t.completed === true)
      },
      // 根据hash值计算属性
      filterTodos: {
        get() {
          switch (this.filterText) {
            case 'active':
              // 如果hash值是active 过滤出所有未完成的数据 并返回
              return this.todos.filter(t => !t.completed)
              break
            case 'completed':
              // 如果hash值是 completed 过滤出所有已完成的数据 并返回
              return this.todos.filter(t => t.completed)
              break
            default:
              return this.todos
              break
          }
        }
      }
    },
    data() {
      return {
        title: 'todos-vue',
        todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
        // todos: [{
        //     id: 1,
        //     title: '吃饭',
        //     completed: true
        //   },
        //   {
        //     id: 2,
        //     title: '看书',
        //     completed: false
        //   },
        //   {
        //     id: 3,
        //     title: '敲代码',
        //     completed: false
        //   }
        // ],
        currentEditing: null, // 存储当前被双击的对象
        filterText: ''
      }
    },
    methods: {
      // 添加功能
      handleAdd(e) {
        // 获取文本框中的值
        const title = e.target.value
        // 如果为空 弹窗提示  
        if (!title.length) {
          alert("内容不能为空!")
          return
        }
        // 添加数据
        this.todos.push({
          id: this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1,
          title: title,
          completed: false
        })
        // 清空文本框
        e.target.value = ''
      },
      // 删除功能
      handelDel(index) {
        // 根据获取到的index删除对应数据
        this.todos.splice(index, 1);
      },
      // 编辑功能
      getEditing(itme) {
        //将传过来的 item 赋值给 this.currentEditing 可以此为条件更改对应 li 标签的样式  文本框已双向数据绑定 可以直接修改数据
        this.currentEditing = itme
      },
      // 结束编辑状态
      cancelEdit() {
        this.currentEditing = null
      },
      // 删除所有已完成的任务
      handeldelAll() {
        // 将未完成的任务过滤出来 赋值给todos
        this.todos = this.todos.filter(t => t.completed === false)
      }
    },
    beforeCreate() {
      // window.onhashchange = function () {
      //   const hash = window.location.hash
      //   this.filterText = hash.substr(2)
      // }
      // window.onhashchange()
    },
    created() {
    },
    mounted() {
      // 获取hash值
      window.addEventListener('hashchange', () => {
        this.filterText = window.location.hash.substr(2);
      })
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
