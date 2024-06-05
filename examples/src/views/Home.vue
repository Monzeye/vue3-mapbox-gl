<template>
  <div class="example-list">
    <div
      v-for="(example, index) in exampleList"
      :key="index"
      class="example-item"
      @click="handleTo(example)">
      <img class="img" :src="example.img" />
      <div class="label">{{ example.name }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

interface ExampleItem {
  name: string
  img: string
  path: string
}

const router = useRouter()
const exampleList: ExampleItem[] = [
  {
    name: 'base map',
    img: './imgs/img1.png',
    path: '/baseMap'
  },
  {
    name: 'Create and style clusters',
    img: './imgs/img2.png',
    path: '/circleClusters'
  },
  {
    name: 'Show and hide layers',
    img: './imgs/img3.png',
    path: '/showHideLayer'
  },
  {
    name: 'animate ant path',
    img: './imgs/img4.png',
    path: '/animateAntPath'
  },
  {
    name: 'Add 3D terrain to a map',
    img: './imgs/img5.png',
    path: '/terrain3d'
  },
  {
    name: 'switching map style',
    img: './imgs/img6.png',
    path: '/switchStyle'
  },
  {
    name: 'data-driven property',
    img: './imgs/img7.png',
    path: '/styleCircles'
  },
  {
    name: 'Animate the camera',
    img: './imgs/img8.png',
    path: '/animateCamera'
  }
]

function handleTo(item: ExampleItem) {
  router.push(item.path)
}
</script>
<style lang="scss" scoped>
.example-list {
  display: flex;
  flex-flow: row wrap;
  padding: 50px;

  .example-item {
    width: 300px;
    height: 200px;
    box-shadow: 0 0 10px #ccc;
    margin: 20px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 1s;
    &:hover {
      box-shadow: 0 0 20px #999;
    }
    .label {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
