<template>
  <div class="home">
    <v-row>
      <v-col md="3" cols="12">
        <search-box @search-movie="handleSearchResult" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" sm="6"
             v-for="(item, index) in items" :key="index">
        <house-card :item="item"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import HouseCard from "../components/DataCard";
import {get} from "@/api/weibo";
import SearchBox from "@/components/SearchBox.vue";
import mixin from "../mixins/mixins";

export default {
  components: {HouseCard, SearchBox},
  mixins: [mixin],
  name: "Home",
  data: () => ({
    items: []
  }),
  async mounted() {
    await get({"keyword": '',  "uid": this.uid}).then(res => {
      // console.log(res.data)
      this.items = res.data.data
    })
  },
  methods: {
    handleSearchResult(result){
      // console.log(result)
      this.items = result
    }
  }
}
</script>

<style scoped>

</style>
