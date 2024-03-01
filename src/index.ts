import Koa from "koa";
import koaBody from 'koa-body';
import cors from '@koa/cors';
import fetch from 'node-fetch'

const proxyUrl = 'https://mlts.dynamsoft.com';


const app = new Koa();

app.use(cors());

app
  .use(koaBody())
  .use(async(ctx, next)=>{
    console.log(`${ctx.method} ${ctx.url} ${JSON.stringify(ctx.request.body)}`);
    const fetchParams = { method: ctx.method } as any;
    if(!['GET','OPTION'].includes(ctx.method)){
      fetchParams.body = JSON.stringify(ctx.request.body);
    } 
    const res = await fetch(`${proxyUrl}${ctx.url}`, fetchParams);
    ctx.status = res.status;
    ctx.body = await res.text();
    //ctx.status = 200;
    //ctx.body = 'ok';
  })
;

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(18080);

