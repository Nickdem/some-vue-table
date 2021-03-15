<template>
  <b-container fluid class="w-75">
    <!-- Формочка для создания коммента -->
    <b-form
      inline
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
      class="mt-3"
    >
      <b-input-group prepend="Post Id" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input v-model="form.postId" placeholder="1"></b-form-input>
      </b-input-group>

      <b-input-group prepend="Name" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input v-model="form.name" placeholder="..."></b-form-input>
      </b-input-group>

      <b-input-group prepend="Email" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input v-model="form.email" placeholder="..."></b-form-input>
      </b-input-group>

      <b-input-group prepend="Body" class="mb-2 mr-sm-2 mb-sm-0">
        <b-form-input v-model="form.body" placeholder="..."></b-form-input>
      </b-input-group>

      <b-button-group>
        <b-button type="submit" variant="primary">Add</b-button>
        <b-button type="reset" variant="warning">Reset</b-button>
      </b-button-group>
    </b-form>

    <hr />
    <!-- Лоадер -->
    <div v-if="!comments.length" class="text-center mt-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>

    <template v-else>
      <!-- Фильтер -->
      <b-input-group class="mt-3 mb-3" size="lg" prepend="Filter:">
        <b-form-input v-model="filter"></b-form-input>
      </b-input-group>
      <!-- Подсказка -->
      <p>Всего совпадений: {{ filteredComments.length }}</p>
      <hr />
      <!-- Таблица -->
      <b-table
        :bordered="true"
        :fixed="true"
        :fields="fields"
        :items="paginatedComments"
        :head-variant="'light'"
        class="text-center"
      >
        <template #cell(postId)="data">
          <i>{{ data.value }}</i>
        </template>
        <template #cell(id)="data">
          <b>{{ data.value }}</b>
        </template>
        <!-- Изменяемые ячейки -->
        <template #cell()="data">
          <p contenteditable="true" @blur="changeCell($event, data)">
            {{ data.value }}
          </p>
        </template>
        <!-- Ячейка для кнопок -->
        <template #cell(buttons)="data">
          <b-button-group>
            <b-button variant="success" @click="updateComment(data.item.id)"
              >Update</b-button
            >
            <b-button variant="danger" @click="deleteComment(data.item.id)"
              >Delete</b-button
            >
          </b-button-group>
        </template>
      </b-table>
      <!-- Пагинация -->
      <b-button-group>
        <b-button v-if="page > 1" variant="info" @click="page--"
          >Назад</b-button
        >
        <b-button v-if="page > 1" variant="warning" @click="page--">{{
          page - 1
        }}</b-button>
        <b-button v-if="filteredComments.length" variant="primary">{{
          page
        }}</b-button>
        <b-button
          v-if="filteredComments.length > endIndex"
          variant="warning"
          @click="page++"
          >{{ page + 1 }}</b-button
        >
        <b-button
          v-if="filteredComments.length > endIndex"
          variant="info"
          @click="page++"
          >Вперед</b-button
        >
      </b-button-group>
      <!-- Подсказка -->
      <p v-if="!filteredComments.length" class="text-center">ПУСТОТА</p>
    </template>
  </b-container>
</template>

<script>
import {
  getAllComments,
  updateCommentById,
  deleteCommentById,
  addComment,
} from "../api";
// разнести на компоненты
export default {
  name: "Table",

  data: function () {
    return {
      comments: [],
      filter: "",
      page: 1,
      form: {
        body: "",
        email: "",
        name: "",
        postId: "",
      },
    };
  },

  async created() {
    const windowQuery = this.$route.query;

    if (windowQuery.filter) {
      this.filter = windowQuery.filter;
    }

    if (windowQuery.page) {
      this.page = +windowQuery.page;
    }

    this.comments =
      JSON.parse(localStorage.getItem("table-comments")) ||
      (await getAllComments());
  },

  methods: {
    changeCell(event, data) {
      const current = this.comments.findIndex(
        (comment) => comment.id === data.item.id
      );

      const key = data.field.key;

      if (this.comments[current][key] === event.target.innerText) return;

      this.comments[current][key] = event.target.innerText.trim();
    },

    async updateComment(id) {
      const current = this.comments.findIndex((comment) => comment.id === id);

      await updateCommentById(id, this.comments[current]);

      this.comments = [
        ...this.comments.slice(0, current),
        this.comments[current],
        ...this.comments.slice(current + 1),
      ];
    },

    async deleteComment(id) {
      const current = this.comments.findIndex((comment) => comment.id === id);

      await deleteCommentById(id);

      this.comments.splice(current, 1);
    },

    async onSubmit() {
      const newComment = await addComment(this.form);

      if (newComment.id === this.comments[this.comments.length - 1].id) {
        newComment.id = this.comments[this.comments.length - 1].id + 1;
      }

      await this.comments.push(newComment);

      this.onReset();
    },

    onReset() {
      this.form.email = "";
      this.form.name = "";
      this.form.body = "";
      this.form.postId = "";
    },
  },

  computed: {
    filteredComments() {
      // Обдумать, ошибка с фильтром - ???
      return this.comments.filter((comment) => {
        let some = JSON.stringify(comment).includes(this.filter);

        //let some2 = Object.values(comment).join('').includes(this.filter)
        //return some2
        return JSON.parse(some);
      });
    },

    startIndex() {
      return (this.page - 1) * 20;
    },

    endIndex() {
      return this.page * 20;
    },

    paginatedComments() {
      return this.filteredComments.slice(this.startIndex, this.endIndex);
    },

    pageQueryOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },

    fields() {
      return [...Object.keys(this.comments[0]), "buttons"];
    },
  },

  watch: {
    filter(newValue, prevValue) {
      // почему сбрасывает при первом заходе на page 1
      if (prevValue) {
        this.page = 1;
      }
    },

    comments() {
      localStorage.setItem("table-comments", JSON.stringify(this.comments));
    },

    paginatedComments() {
      if (this.paginatedComments.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    pageQueryOptions(value) {
      // можно ли сделать через $route
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
  },
};
</script>

<style>
</style>