<template>
  <div class="circlePie" id="circlePie">
    <canvas id="main" width="500" height="500"></canvas>
    <canvas id="dot"></canvas>
  </div>
</template>

<script>
import {getChartMain} from "@/api/weibo";

export default {
  name: '',
  props: {
    selectRangeDate: Array,
    _width: Number
  },
  data() {
    return {
      mainTitle: "微博评论数",
      title: ['微博主题', '微博文章', '消极微博', '评论用户', '点赞总数', '评论总数'],
      value: [1,1,1,1,1,1],
      mainPoint: 2.50,
      maxPoint: 3000,
      measure: '条',
      everyPer: 0,
      dots: [],
      xOffset: 0,
      resizeFn: null,
      warea: {x: 250, y: 250, max: 700},
      centerBox: {
        width: 0,
        height: 0
      },
      circle: {
        x: 250,
        y: 250,
        radius: 218
      },
    }
  },
  async mounted() {
    await getChartMain().then(res => {
      // console.log(res.data.data)
      this.mainPoint = res.data.data.avg
      this.value = res.data.data.scores
    })

    this.centerBox = {
      width: document.querySelector('#circlePie').offsetWidth,
      height: document.querySelector('#circlePie').offsetHeight
    }
    for (let i = 0; i < 200; i++) {
      // 随机200个运动的圆点
      let x = Math.random() * this.centerBox.width; // 随机的x偏移量
      let y = Math.random() * this.centerBox.height; // 随机y轴偏移量
      let xa = Math.random() * 2 - 1; // x轴运动速度
      let ya = Math.random() * 2 - 1; // y轴运动速度
      this.dots.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        // 两个圆点之间需要连线的距离
        max: 40
      })
    }
    this.act();
    this.drawDot();
    this.resizeFn = this.$debounce(() => {
      // 通过捕获系统的onresize事件触发我们需要执行的事件
      this.centerBox = {
        width: document.querySelector('#circlePie').offsetWidth,
        height: document.querySelector('#circlePie').offsetHeight
      }
      // for (let i = 1; i < 13; i++) {
      //   this.$refs['chart' + i].setChart();
      // }
    }, 500)
    window.addEventListener('resize', this.resizeFn)
  },

  methods: {
    drawDot() {
      let canvas = document.getElementById('dot');
      canvas.width = document.querySelector('#circlePie').offsetWidth;
      canvas.height = document.querySelector('#circlePie').offsetHeight;
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 将鼠标坐标添加进去，产生一个用于比对距离的点数组
      let ndots = [this.warea].concat(this.dots);
      this.dots.forEach((dot)=> {
        // 粒子位移
        dot.x += dot.xa;
        dot.y += dot.ya;
        // 遇到边界将加速度反向
        dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1;
        dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1;
        // 绘制点
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dot.x - 0.5, dot.y - 0.5, 2, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
        // 循环比对粒子间的距离
        for (let i = 0; i < ndots.length; i++) {
          let d2 = ndots[i];
          if (dot === d2 || d2.x === null || d2.y === null) continue;
          let xc = dot.x - d2.x;
          let yc = dot.y - d2.y;
          // 两个粒子之间的距离
          let dis =Math.sqrt(xc * xc + yc * yc);
          // 距离比
          let ratio;
          // 如果两个粒子之间的距离小于粒子对象的max值，则在两个粒子间画线
          if (dis < d2.max) {
            // 计算距离比
            ratio = (d2.max - dis) / d2.max;
            // 画线
            ctx.beginPath();
            ctx.lineWidth = ratio / 2;
            if (d2 === this.warea) {
              ctx.strokeStyle = 'rgba(255,255,255,0)';
            } else {
              // 距离变大 连线颜色变浅
              ctx.strokeStyle = 'rgba(255,255,255,' + (ratio + 0.2) + ')';
            }
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
        // 将已经计算过的粒子从数组中删除
        ndots.splice(ndots.indexOf(dot), 1);
      });
      this.animationFrame1 = window.requestAnimationFrame(this.drawDot);
    },
    rads(x) { // 弧度转换
      return Math.PI * x / 180;
    },
    act() {
      //清空画布
      const canvas = document.querySelector('#main');
      canvas.style.width = this.centerBox.height + 'px';
      canvas.style.height = this.centerBox.height + 'px';
      const context = canvas.getContext('2d');
      // console.log('context', canvas.width)
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.drawPie(this.everyPer, context);
      this.animationFrame2 = window.requestAnimationFrame(this.act);
      this.everyPer += Math.PI / 180;
      let speed = 0.15; //波浪速度，数越大速度越快
      this.xOffset += speed;
    },
    drawPie(everyPer, context) {
      context.save();
      context.fillStyle = 'rgba(18,55,88,.2)';
      context.beginPath();
      context.arc(this.circle.x, this.circle.y, 245, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
      context.restore();

      //外圆
      context.save();
      context.shadowBlur = 50;
      context.shadowColor = "#9ca5ac";
      context.fillStyle = '#080D27';
      context.beginPath();
      context.arc(this.circle.x, this.circle.y, 235, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
      context.restore();
      for (let i = 0; i < this.title.length; i++) {//绘制文字。
        context.save()
        // 画文字
        this.drawCircularText(this.circle, this.title[i] + ":" + this.value[i], this.rads(i * 60 - 110), this.rads(i * 60 - 65), i, context);
        context.restore();
      }
      // 旋转小球
      let x = 240 * Math.cos(everyPer);
      let y = 240 * Math.sin(everyPer);
      context.save();
      context.fillStyle = 'rgb(56,252,253)';
      context.shadowBlur = 80;
      context.shadowColor = "#39E9EE";
      context.translate(this.circle.x, this.circle.y);
      context.beginPath();
      context.arc(x,y,5,0,2*Math.PI);
      context.arc(-x,-y,5,0,2*Math.PI);
      context.closePath();
      context.fill();
      context.restore();
      //
      context.save();
      context.fillStyle = '#153776';
      context.beginPath();
      context.arc(this.circle.x, this.circle.y, 200, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();

      context.fillStyle = "#121535";
      context.beginPath();
      context.arc(this.circle.x, this.circle.y, 190, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
      //内圆
      let nowRange = this.mainPoint;
      context.save();
      this.drawCircle(context);

      this.drawSin(this.xOffset, context, nowRange);
      this.drawText(context, nowRange);
      context.restore();
      for (let i = 0; i < 6; i++) {//绘制刻度。
        context.save();
        context.translate(this.circle.x, this.circle.y);
        context.rotate((-Math.PI / 2 + Math.PI / 6) + i * Math.PI / 3);  //旋转坐标轴。坐标轴x的正方形从 向上开始算起
        context.beginPath();
        context.moveTo(190, 0);
        context.lineTo(200, 0);
        context.lineWidth = 4;
        context.strokeStyle = '#0A122D';
        context.stroke();
        context.closePath();
        context.restore();
      }
    },
    drawCircle(ctx) { // 画圆 中心圆
      ctx.beginPath();
      ctx.fillStyle = '#209ADF';
      ctx.arc(this.circle.x, this.circle.y, 120, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.circle.x, this.circle.y, 120, 0, 2 * Math.PI);
      ctx.clip();
    },
    drawSin(xOffset, ctx, nowRange) { //画sin 曲线函数
      let mW = 240;
      let mH = 240;
      let sX = 0;
      let axisLength = mW; //轴长
      let waveWidth = 0.04; //波浪宽度,数越小越宽
      let waveHeight = 12; //波浪高度,数越大越高
      ctx.save();
      ctx.translate(130, 130);
      let points = []; //用于存放绘制Sin曲线的点
      ctx.beginPath();
      //在整个轴长上取点
      for (let x = sX; x < sX + axisLength; x += 20 / axisLength) {
        //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
        let y = -Math.sin((sX + x) * waveWidth + xOffset);
        let dY = mH * (1 - nowRange / this.maxPoint);
        points.push([x, dY, dY + y * waveHeight]);
        ctx.lineTo(x, dY + y * waveHeight);
      }
      //封闭路径
      ctx.lineTo(axisLength, mH);
      ctx.lineTo(sX, mH);
      ctx.lineTo(points[0][0], points[0][1]);
      ctx.fillStyle = '#2C50B1';
      ctx.fill();

      ctx.restore();
    },
    // 中心显示文字
    drawText(ctx, nowRange) {
      ctx.save();
      ctx.translate(130, 130);
      let size = 50;
      ctx.font = size + 'px Microsoft Yahei';
      ctx.textAlign = 'center';
      ctx.fillStyle = "#95EFFF";
      ctx.fillText(nowRange + this.measure, 120, 120 - size / 2);
      ctx.restore();
      ctx.save()
      size = 25;
      ctx.translate(130, 130);
      ctx.font = size + 'px Microsoft Yahei';
      ctx.textAlign = 'center';
      ctx.fillStyle = "#95EFFF";
      ctx.fillText(this.mainTitle , 120, 120 + size);
      ctx.restore();
    },
    // 旋转的文字
    drawCircularText(s, string, startAngle, endAngle, n, context) {
      let radius = s.radius, // 文字环绕的中心圆半径
          angleDecrement, // 一个文字所占的角度
          angle = parseFloat(startAngle), // 文字的起始角度
          index = 0, // 文字的索引值
          character; // 当前要画的文字
      let arr = string.split(':')
      context.save();
      context.fillStyle = '#fff';
      context.font = '12px 微软雅黑 ';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      if (n < 2 || n === 5) { // 上三个不需要反转的文字
        while (index < string.length) {
          character = string.charAt(index);
          if (arr[0].indexOf(character) >= 0) {
            if (arr[0].length > 6) {
              angleDecrement = (startAngle - endAngle) / (string.length - 3)
            } else {
              angleDecrement = (startAngle - endAngle) / (string.length - 1)
            }

          } else {
            angleDecrement = (startAngle - endAngle) / (string.length + 6)
          }
          context.save();
          context.beginPath();
          context.translate(s.x + Math.cos(angle) * radius,
              s.y + Math.sin(angle) * radius);
          context.rotate(Math.PI / 2 + angle);
          context.fillText(character, 0, 0);
          angle -= angleDecrement;
          index++;
          context.restore();
        }
      } else { // 下面三个需要反转的文字
        while (index < string.length) {
          character = string.split("").reverse().join("").charAt(index);// 字符串反转
          if (arr[1].indexOf(character) >= 0) {
            angleDecrement = (startAngle - endAngle) / (string.length + 6)
          } else {
            if (arr[0].length > 6) {
              angleDecrement = (startAngle - endAngle) / (string.length - 3)
            } else {
              angleDecrement = (startAngle - endAngle) / (string.length - 1)
            }
          }
          context.save();
          context.beginPath();
          context.translate(s.x + Math.cos(angle) * radius,
              s.y + Math.sin(angle) * radius);
          context.rotate(-Math.PI / 2 + angle);// 旋转文字
          context.fillText(character, 0, 0);
          angle -= angleDecrement;
          index++;
          context.restore();
        }
      }
      context.restore();
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFn)
    window.cancelAnimationFrame(this.animationFrame1)
    window.cancelAnimationFrame(this.animationFrame2)
  },
}
</script>


<style lang="less" scoped>
.circlePie {
  //height: 100%;
  height: 400px;
  padding: 0 0 40px;
  text-align: center;
  position: relative;

  canvas {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0);
  }

  #dot {
    background: rgba(0, 0, 0, 0);
  }
}
</style>
