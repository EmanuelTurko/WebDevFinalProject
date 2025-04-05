module.exports = {
  apps : [{
    name   : "recipegram",
    script : "./dist/app.js",
    env_production:{
      NODE_ENV: "production"
    }
  }]
}
