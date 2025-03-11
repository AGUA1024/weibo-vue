<template>
  <body/>
</template>
<script>
import * as d3 from 'd3';

export default {
  name: 'vue-line-chart',
  data() {
    return {
      links: [{source: '新型冠状病毒肺炎', target: 'Novelcoronaviruspneumonia', type: 'resolved', 'rela': '外文名'},
        {source: '新型冠状病毒肺炎', target: '新冠肺炎', type: 'resolved', 'rela': '中文简称'},
        {source: '新型冠状病毒肺炎', target: 'NCP', type: 'resolved', 'rela': '英文简称'},
        {source: '新型冠状病毒肺炎', target: '《新型冠状病毒感染的肺炎诊疗方案（试行第五版）》', type: 'resolved', 'rela': '诊疗方案'},
        {source: '新型冠状病毒肺炎', target: 'COVID-19', type: 'resolved', 'rela': '国际命名'},
        {source: '新型冠状病毒肺炎', target: '《新型冠状病毒肺炎诊疗方案（试行第六版）》', type: 'resolved', 'rela': '诊疗方案'},
        {source: '新型冠状病毒肺炎', target: 'COVID-19', type: 'resolved', 'rela': '外文名'},
        {source: '新型冠状病毒肺炎', target: '《新型冠状病毒肺炎诊疗方案（试行第七版）》', type: 'resolved', 'rela': '诊疗方案'},
        {source: '新型冠状病毒肺炎', target: '2019冠状病毒病', type: 'resolved', 'rela': '世卫组织命名'},
        {source: '新型冠状病毒肺炎', target: '发热、干咳、乏力', type: 'resolved', 'rela': '常见症状'},
        {source: '新型冠状病毒肺炎', target: '直接传播、气溶胶传播和接触传播', type: 'resolved', 'rela': '传播途径'},
        {source: '新型冠状病毒肺炎', target: '《新型冠状病毒肺炎诊疗方案（试行第八版）》', type: 'resolved', 'rela': '诊疗方案'},
        {source: '新型冠状病毒肺炎', target: '“冠”读guān', type: 'resolved', 'rela': '读音'},],
      nodes: {},
      width: 500,
      height: 500,
      force: null,
      svg: null,
      marker: null,
      edges_line: null,
      edges_text: null,
      circle: null,
      text: null,
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var tmpNodes = {}
      this.links.forEach(function (link) {
        link.source = tmpNodes[link.source] || (tmpNodes[link.source] = {name: link.source});
        link.target = tmpNodes[link.target] || (tmpNodes[link.target] = {name: link.target});
      });

      this.nodes = tmpNodes
      var links = this.links

      this.force = d3.layout.force()
          .nodes(d3.values(this.nodes))
          .links(this.links)
          .size([this.width, this.height])
          .linkDistance(180)
          .charge(-1500)


      var svg = d3.select("body").append("svg")
          .attr("width", this.width)
          .attr("height", this.height);

      this.marker = svg.append("marker")
          .attr("id", "resolved")
          .attr("markerUnits", "userSpaceOnUse")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 32)
          .attr("refY", -1)
          .attr("markerWidth", 12)
          .attr("markerHeight", 12)
          .attr("orient", "auto")
          .attr("stroke-width", 2)
          .append("path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr('fill', '#000000');

      this.edges_line = svg.selectAll(".edgepath")
          .data(this.force.links())
          .enter()
          .append("path")
          .attr({
            'd': function (d) {
              return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
            },
            'class': 'edgepath',
            'id': function (d, i) {
              return 'edgepath' + i;
            }
          })
          .style("stroke", function (d) {
            var lineColor;
            lineColor = "#B43232";
            return lineColor;
          })
          .style("pointer-events", "none")
          .style("stroke-width", 0.5)
          .attr("marker-end", "url(#resolved)");

      var edges_text = svg.append("g").selectAll(".edgelabel")
          .data(this.force.links())
          .enter()
          .append("text")
          .style("pointer-events", "none")
          .attr({
            'class': 'edgelabel',
            'id': function (d, i) {
              return 'edgepath' + i;
            },
            'dx': 80,
            'dy': 0
          });

      edges_text.append('textPath')
          .attr('xlink:href', function (d, i) {
            return '#edgepath' + i
          })
          .style("pointer-events", "none")
          .text(function (d) {
            return d.rela;
          });
      this.edges_text = edges_text
      this.circle = svg.append("g").selectAll("circle")
          .data(this.force.nodes())
          .enter().append("circle")
          .style("fill", function (node) {
            var color;
            var link = links[node.index];
            color = "#F9EBF9";
            return color;
          })
          .style('stroke', function (node) {
            var color;
            var link = links[node.index];
            color = "#A254A2";
            return color;
          })
          .attr("r", 28)
          .on("click", function (node) {
            this.edges_line.style("stroke-width", function (line) {
              // console.log(line);
              if (line.source.name == node.name || line.target.name == node.name) {
                return 4;
              } else {
                return 0.5;
              }
            });
          })
          .call(this.force.drag);

      this.text = svg.append("g").selectAll("text")
          .data(this.force.nodes())
          .enter()
          .append("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style('fill', function (node) {
            var color;
            var link = links[node.index];
            color = "#A254A2";
            return color;
          }).attr('x', function (d) {
            var re_en = /[a-zA-Z]+/g;
            if (d.name.match(re_en)) {
              d3.select(this).append('tspan')
                  .attr('x', 0)
                  .attr('y', 2)
                  .text(function () {
                    return d.name;
                  });
            } else if (d.name.length <= 4) {
              d3.select(this).append('tspan')
                  .attr('x', 0)
                  .attr('y', 2)
                  .text(function () {
                    return d.name;
                  });
            } else {
              var top = d.name.substring(0, 4);
              var bot = d.name.substring(4, d.name.length);

              d3.select(this).text(function () {
                return '';
              });

              d3.select(this).append('tspan')
                  .attr('x', 0)
                  .attr('y', -7)
                  .text(function () {
                    return top;
                  });

              d3.select(this).append('tspan')
                  .attr('x', 0)
                  .attr('y', 10)
                  .text(function () {
                    return bot;
                  });
            }
          });

      d3.layout.force().on("tick", this.tick).start();
    },
    tick() {
      var svg = d3.select("svg")
      svg.selectAll("circle").attr("transform", this.transform1);
      // this.circle.attr("transform", this.transform1);
      // this.text.attr("transform", this.transform2);
      svg.selectAll("text").attr("transform", this.transform2);
      svg.selectAll(".edgepath").attr('d', function(d) {
        var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
        return path;
      });
      // this.edges_line.attr('d', function(d) {
      //   var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
      //   return path;
      // });
      svg.selectAll("textPath").attr('transform',function(d,i){
        if (d.target.x<d.source.x){
          bbox = this.getBBox();
          rx = bbox.x+bbox.width/2;
          ry = bbox.y+bbox.height/2;
          return 'rotate(180 '+rx+' '+ry+')';
        }
        else {
          return 'rotate(0)';
        }
      });


      // this.edges_text.attr('transform',function(d,i){
      //   if (d.target.x<d.source.x){
      //     bbox = this.getBBox();
      //     rx = bbox.x+bbox.width/2;
      //     ry = bbox.y+bbox.height/2;
      //     return 'rotate(180 '+rx+' '+ry+')';
      //   }
      //   else {
      //     return 'rotate(0)';
      //   }
      // });
    },
    linkArc(d) {
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
    },
    transform1(d) {
      return "translate(" + d.x + "," + d.y + ")";
    },
    transform2(d) {
      return "translate(" + (d.x) + "," + d.y + ")";
    },
  }
}

</script>
<style scoped>
.link {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}

#licensing {
  fill: green;
}

.link.licensing {
  stroke: green;
}

.link.resolved {
  stroke-dasharray: 0, 2 1;
}

circle {
  fill: #ccc;
  stroke: #333;
  stroke-width: 1.5px;
}

text {
  font: 12px Microsoft YaHei;
  pointer-events: none;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
}

.linetext {
  font-size: 12px Microsoft YaHei;
}
</style>
