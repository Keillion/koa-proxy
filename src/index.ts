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
    let resTxt = '';
    try{
      console.log(`${ctx.method} ${ctx.url} ${JSON.stringify(ctx.request.body)}`);
      const fetchParams = { method: ctx.method } as any;
      if(!['GET','OPTION'].includes(ctx.method)){
        fetchParams.body = JSON.stringify(ctx.request.body);
      } 
      const res = await fetch(`${proxyUrl}${ctx.url}`, fetchParams);
      const txt = await res.text();
      ctx.status = res.status;
      ctx.body = txt;
    }catch(ex){
      console.error(ex);
    }
    console.log(`${ctx.method} ${ctx.url} \nReqBody: ${JSON.stringify(ctx.request.body)} \nResBody: ${resTxt}`);
    //ctx.status = 200;
    //ctx.body = 'ok';
  })
;

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(18080);

