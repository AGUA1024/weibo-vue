<template>
  <v-container fluid
      grid-list-lg
      pa-0
  >
    <v-layout wrap>
      <v-flex
          xs12
      >
        <v-basic-card
            title="微博词云"
            toolbar-height="56"
        >
          <template slot="card-content">
            <word-cloud/>
          </template>
        </v-basic-card>
      </v-flex>

      <v-flex
          xs12
      >
        <v-basic-card
            title="主题词云"
            toolbar-height="56"
        >
          <template slot="card-content">
            <word-cloud2/>
          </template>
        </v-basic-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import 'echarts-wordcloud';
import WordCloud from "./WordCloud";
import WordCloud2 from "./WordCloud2";

export default {
  name: 'VBarIndex',
  components: {
    WordCloud,
    WordCloud2
  },
};
</script>
