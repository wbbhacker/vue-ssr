import { createApp } from './app'


export default async context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    // context 接收 渲染函数 renderer 的 renderToString 方法传进来的对象
    const { app, router, store } = createApp()
    const meta = app.$meta()

    context.meta = meta
    // 设置服务器端 router 的位置
    router.push(context.url)

    

    // bind 绑定router里面的this
    await new Promise(router.onReady.bind(router)) 

    context.rendered = () => {
        // Renderer 会把context.state 数据对象内联到页面模板中
        // 最终发送给客户端的页面中包含一段监本：window._INITIAL_STATE_ = context.state
        // 客户端就要吧页面中的winodw.__INITIAL_STATE_ 拿出来填充到客户端 store 容器中
        context.state = store.state
    }



    return app
}

// export default context => {
//   // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
//   // 以便服务器能够等待所有的内容在渲染前，
//   // 就已经准备就绪。
//   return new Promise((resolve, reject) => {
//     const { app, router } = createApp()

//     // 设置服务器端 router 的位置
//     router.push(context.url)

//     // 等到 router 将可能的异步组件和钩子函数解析完
//     router.onReady(() => {
//       const matchedComponents = router.getMatchedComponents()
//       // 匹配不到的路由，执行 reject 函数，并返回 404
//       //  在路由中已经匹配了，所以这块判断可以不要
//       if (!matchedComponents.length) {
//         return reject({ code: 404 })
//       }

//       // Promise 应该 resolve 应用程序实例，以便它可以渲染
//       resolve(app)
//     }, reject)
//   })
// }