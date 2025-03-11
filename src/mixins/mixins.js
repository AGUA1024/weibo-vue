import {mapState} from "vuex";

let mixin =  {
  data: ()=>({
    appName : '微博',
    appIcon : 'mdi-weibo',
    icp: '',
    icp_link: ''
  }),
  created() {
  },
  mounted() {},
  methods: {
    serverImg(url){
      return "http://localhost:8080/file/download/" + url
    }
  },
  //直接把mapState mixin进去
  computed: {
    ...mapState(['uid','avatar','phone','roles',"realname"]),
  },
};
export default mixin;
