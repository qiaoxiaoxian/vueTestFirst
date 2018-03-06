import Vue from 'vue'
import Router from 'vue-router'
import PeopleCar from '../components/peopleCar'
import CarPeople from '../components/carPeople'
import Product from '../components/product'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/peopleCar'
    }, {
      path: '/peopleCar',
      name: 'peopleCar',
      component: PeopleCar
    }, {
      path: '/carPeople',
      name: 'carPeople',
      component: CarPeople
    }, {
      path: '/product/:id',
      name: 'product',
      component: Product
    }
  ]
})
