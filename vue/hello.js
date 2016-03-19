new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!',
    message2: 'aa',
    test: 1
  }
})

new Vue({
  el: '#app-list',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue.js' },
      { text: 'Build Something Awesome' }
    ]
  }
})

new Vue({
  el: '#app-user-input',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})


new Vue({
  el: '#app-full',
  data: {
    newTodo: '',
    todos: [
      { text: 'Add some todos' }
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
})



// this is our Model
var exampleData = {
  name: 'Vuellll'
}
// create a Vue instance, or, a "ViewModel"
// which links the View and the Model
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData,
  created: function () {
    // `this` points to the vm instance
    console.log('a is: ' + this.name)
  }
})