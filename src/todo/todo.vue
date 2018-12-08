<template>
    <section class="real-app">

        <input
                type="text"
                class="add-input"
                autofocus='autofocus'
                placeholder="接下来要去做什么"
                @keyup.enter='addTodo'
        >
        <item
                v-for='todo in filterTodos'
                :todo="todo"
                :key="todo.id"
                @del="deleteTodo"
        ></item>
        <tabs
                @toggle='toggleFilter'
                :filter="filter"
                :todos='todos'
                @clearAll='clearAllcompleted'
        ></tabs>
    </section>
</template>

<script>
    let id = 0;
    import item from "./item.vue";
    import tabs from "./tabs.vue";

    export default {
        data() {
            return {
                todos: [],
                filter: "all"
            };
        },
        components: {
            item,
            tabs
        },
        computed: {
            filterTodos() {
                if (this.filter === "all") {
                    return this.todos;
                }
                const completed = this.filter === "completed";
                return this.todos.filter(t => completed === t.completed);
            }
        },
        methods: {
            addTodo(e) {
                if (e.target.value === "") {
                    console.log("shit");
                } else {
                    this.todos.unshift({
                        id: id++,
                        content: e.target.value.trim(),
                        completed: false
                    });
                }
                e.target.value = "";
            },
            toggleFilter(state) {
                this.filter = state;
            },
            deleteTodo(id) {
                this.todos.splice(this.todos.findIndex(t => t.id === id), 1);
            },
            clearAllcompleted() {
                this.todos = this.todos.filter(t => !t.completed);
            }
        }
    };
</script>

<style scoped>
    .real-app {
        width: 600px;

        margin: 0 auto;

        box-shadow: 0 0 5px #dddddd;
    }

    .add-input {
        position: relative;

        margin: 0;

        width: 100%;

        font-size: 24px;

        font-family: inherit;

        font-weight: inherit;

        line-height: 1.4em;

        outline: none;

        color: initial;

        padding: 13px;

        box-sizing: border-box;

        border: 0;

        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
</style>
